"use client";

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Eye, Trash2, Filter, Mail, Bell, Copy, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NEXT_URL } from '../../constants';

// Types definition
interface DemoRequest {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

const DemoRequestsPage = () => {
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search

  const fetchDemoRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${NEXT_URL}/api/demo-requests`);
      const data = await response.json();
      setDemoRequests(data.data);
    } catch (error) {
      console.error('Failed to fetch demo requests:', error);
      toast.error('Failed to load demo requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socketInstance = io(`${NEXT_URL}`, {
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server:", socketInstance.id);
      socketInstance.emit("joinAdminRoom");
    });

    socketInstance.on("newDemoRequest", (request: DemoRequest) => {
      setDemoRequests(prev => [request, ...prev]);
      toast.info(
        <div className="flex items-start">
          <Bell className="h-6 w-6 text-primary mr-3" />
          <div>
            <p className="font-medium">New Demo Request</p>
            <p className="text-sm text-base-content/70">
              {request.name} from {request.company || 'unknown company'} has submitted a demo request.
            </p>
          </div>
        </div>,
        { position: "top-right", autoClose: 5000 }
      );
    });

    socketInstance.on("demoRequestUpdated", (updatedRequest: DemoRequest) => {
      setDemoRequests(prev =>
        prev.map(r => (r.id === updatedRequest.id ? updatedRequest : r))
      );
    });

    socketInstance.on("connect_error", (err) => {
      console.error(`Connection failed: ${err.message}`);
    });

    fetchDemoRequests();

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleViewRequest = async (request: DemoRequest) => {
    try {
      const response = await fetch(`${NEXT_URL}/api/demo-requests/${request.id}`);
      const data = await response.json();
      setSelectedRequest(data.data);
      setIsModalOpen(true);
      if (!request.read) {
        setDemoRequests(prev =>
          prev.map(r => (r.id === request.id ? { ...r, read: true } : r))
        );
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to load request details');
    }
  };

  const handleStatusChange = async (requestId: number, newStatus: 'new' | 'contacted' | 'completed') => {
    try {
      await fetch(`${NEXT_URL}/api/demo-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setDemoRequests(prev =>
        prev.map(r => (r.id === requestId ? { ...r, status: newStatus } : r))
      );
      toast.success('Status updated successfully');

      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }

      // Close the dropdown by removing focus
      setTimeout(() => {
        const activeEl = document.activeElement;
        if (activeEl instanceof HTMLElement) {
          activeEl.blur();
        }
      }, 0);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    try {
      await fetch(`${NEXT_URL}/api/demo-requests/${requestId}`, { method: 'DELETE' });
      setDemoRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success('Demo request deleted successfully');
      if (selectedRequest && selectedRequest.id === requestId) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
      toast.error('Failed to delete request');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="badge badge-primary badge-md">New</span>;
      case 'contacted': return <span className="badge badge-warning badge-md">Contacted</span>;
      case 'completed': return <span className="badge badge-success badge-md">Completed</span>;
      default: return <span className="badge badge-neutral badge-md">{status}</span>;
    }
  };

  const filteredRequests = demoRequests
    .filter(request => {
      const searchLower = searchQuery.toLowerCase();
      return (
        request.name.toLowerCase().includes(searchLower) ||
        request.email.toLowerCase().includes(searchLower) ||
        (request.company && request.company.toLowerCase().includes(searchLower))
      );
    })
    .filter(request => {
      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return !request.read;
      return request.status === activeTab;
    });

  const unreadCount = demoRequests.filter(r => !r.read).length;
  const newCount = demoRequests.filter(r => r.status === 'new').length;
  const contactedCount = demoRequests.filter(r => r.status === 'contacted').length;
  const completedCount = demoRequests.filter(r => r.status === 'completed').length;

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} theme="light" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Demo Requests</h1>
        <p className="text-base-content/70 mt-1">Manage demo requests submitted by potential clients</p>
      </div>

      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="tabs tabs-boxed">
              <a className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`} onClick={() => setActiveTab('all')}>
                All ({demoRequests.length})
              </a>
              <a className={`tab ${activeTab === 'unread' ? 'tab-active' : ''}`} onClick={() => setActiveTab('unread')}>
                Unread {unreadCount > 0 && <span className="badge badge-sm badge-error ml-2">{unreadCount}</span>}
              </a>
              <a className={`tab ${activeTab === 'new' ? 'tab-active' : ''}`} onClick={() => setActiveTab('new')}>
                New {newCount > 0 && <span className="badge badge-sm badge-primary ml-2">{newCount}</span>}
              </a>
              <a className={`tab ${activeTab === 'contacted' ? 'tab-active' : ''}`} onClick={() => setActiveTab('contacted')}>
                Contacted ({contactedCount})
              </a>
              <a className={`tab ${activeTab === 'completed' ? 'tab-active' : ''}`} onClick={() => setActiveTab('completed')}>
                Completed ({completedCount})
              </a>
            </div>
            <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto max-w-xs">
              <Search size={16} className="text-base-content/70" />
              <input
                type="text"
                placeholder="Search by name, email, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </label>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="text-base-content/80">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-base-content/70">No demo requests found</td>
                    </tr>
                  ) : (
                    filteredRequests.map(request => (
                      <tr key={request.id} className={!request.read ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-base-200"}>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {!request.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                            {request.name}
                          </div>
                        </td>
                        <td className="p-4">
                          <a href={`mailto:${request.email}`} className="flex items-center gap-2 text-primary hover:underline">
                            <Mail size={16} />
                            {request.email}
                          </a>
                        </td>
                        <td className="p-4">{request.company || '-'}</td>
                        <td className="p-4">
                          <div className="dropdown dropdown-top ">
                            <label tabIndex={0} className="cursor-pointer flex items-center gap-2">
                              {getStatusBadge(request.status)}
                              <Filter size={14} className="text-base-content/70" />
                            </label>
                            <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow bg-base-100 rounded-box w-52">
                              <li><a onClick={() => handleStatusChange(request.id, 'new')}>New</a></li>
                              <li><a onClick={() => handleStatusChange(request.id, 'contacted')}>Contacted</a></li>
                              <li><a onClick={() => handleStatusChange(request.id, 'completed')}>Completed</a></li>
                            </ul>
                          </div>
                        </td>
                        <td className="p-4">{formatDate(request.createdAt)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="btn btn-sm btn-primary" onClick={() => handleViewRequest(request)}>
                              <Eye size={14} />
                            </button>
                            <button className="btn btn-sm btn-error" onClick={() => handleDeleteRequest(request.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      <dialog id="demo_request_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-3xl bg-base-100 shadow-xl">
          {selectedRequest ? (
            <>
              <h3 className="font-bold text-xl mb-6 flex justify-between items-center">
                <span>Demo Request Details</span>
                {getStatusBadge(selectedRequest.status)}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-base-content/70 mb-2">Contact Information</h4>
                  <p className="text-lg font-semibold">{selectedRequest.name}</p>
                  <a href={`mailto:${selectedRequest.email}`} className="text-primary flex items-center gap-2 hover:underline">
                    <Mail size={16} /> {selectedRequest.email}
                  </a>
                  {selectedRequest.company && <p className="text-base-content/80 mt-1">{selectedRequest.company}</p>}
                </div>
                <div>
                  <h4 className="font-medium text-base-content/70 mb-2">Request Information</h4>
                  <p>Submitted: {formatDate(selectedRequest.createdAt)}</p>
                  <p>Last Updated: {formatDate(selectedRequest.updatedAt)}</p>
                </div>
              </div>

              <div className="divider my-6"></div>

              <div className="mb-6">
                <h4 className="font-medium text-base-content/80 mb-2">Message</h4>
                <div className="p-4 bg-base-100 border border-base-300 rounded-lg whitespace-pre-wrap">
                  {selectedRequest.message}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-base-content/80 mb-2">Update Status</h4>
                <div className="btn-group">
                  <button
                    className={`btn ${selectedRequest.status === 'new' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleStatusChange(selectedRequest.id, 'new')}
                  >
                    New
                  </button>
                  <button
                    className={`btn ${selectedRequest.status === 'contacted' ? 'btn-warning' : 'btn-outline'}`}
                    onClick={() => handleStatusChange(selectedRequest.id, 'contacted')}
                  >
                    Contacted
                  </button>
                  <button
                    className={`btn ${selectedRequest.status === 'completed' ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => handleStatusChange(selectedRequest.id, 'completed')}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-base-content/80 mb-2">Actions</h4>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedRequest.email}?subject=Regarding your demo request&body=Hello ${selectedRequest.name},%0D%0A%0D%0AThank you for your interest in our services.`}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail size={16} className="mr-2" />
                    Send Email
                  </a>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedRequest.message);
                      toast.success('Message copied to clipboard');
                    }}
                  >
                    <Copy size={16} className="mr-2" />
                    Copy Message
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}

          <div className="modal-action">
            <button className="btn btn-neutral" onClick={() => setIsModalOpen(false)}>Close</button>
            {selectedRequest && (
              <button
                className="btn btn-error"
                onClick={() => {
                  handleDeleteRequest(selectedRequest.id);
                  setIsModalOpen(false);
                }}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Request
              </button>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default DemoRequestsPage;
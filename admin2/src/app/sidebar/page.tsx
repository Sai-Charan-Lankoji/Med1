// frontend/components/sidebar/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { Settings, LogOut, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { cn } from '@/app/lib/utils';
import MenuItems from '@/app/utils/menuItems';
import { NEXT_URL } from '@/constants';

export default function Sidebar() {
  const { email, firstName, lastName, role, setAuthEmail, setFirstName, setLastName, setRole, setAdminId } =
    useAuth() ?? {
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      setAuthEmail: () => {},
      setFirstName: () => {},
      setLastName: () => {},
      setRole: () => {},
      setAdminId: () => {},
    };
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCollapsed(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(`${NEXT_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      // Clear AuthContext
      setAuthEmail('');
      setFirstName('');
      setLastName('');
      setRole('');
      setAdminId('');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={cn(
        'relative h-screen bg-background transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64',
        'flex flex-col',
        'border-r shadow-sm'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-12 top-4 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="p-4 flex items-center justify-between border-b bg-card">
        <div className="flex items-center space-x-3">
          {!isCollapsed && <span className="text-xl font-bold">Dashboard</span>}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex text-muted-foreground hover:text-foreground"
            onClick={toggleSidebar}
          >
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', isCollapsed ? 'rotate-90' : '-rotate-90')}
            />
            <span className="sr-only">Collapse Sidebar</span>
          </Button>
        )}
      </div>
      <div className="p-4 border-b bg-card">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full relative flex items-center space-x-3 hover:bg-accent transition-colors rounded-lg',
                isCollapsed ? 'justify-center p-0' : 'justify-start p-2'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="h-9 w-9 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center ring-2 ring-background">
                    <span className="text-sm font-semibold text-primary-foreground">
                      {firstName?.slice(0, 1).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{firstName || 'Admin'}</span>
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                        {role || 'N/A'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {email || 'No email'}
                    </span>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
              disabled={loading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{loading ? 'Logging out...' : 'Logout'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <MenuItems collapsed={isCollapsed} currentPath={pathname} />
      </nav>
      <div
        className={cn(
          'p-4 text-xs text-muted-foreground border-t bg-card',
          isCollapsed ? 'text-center' : 'text-left'
        )}
      >
        {!isCollapsed && <p>© 2024 Vendor Hub</p>}
      </div>
    </aside>
  );
}
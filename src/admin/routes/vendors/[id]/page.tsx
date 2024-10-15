import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useNotification from "../../../components/cust-hooks/use-notification";
import { getErrorMessage } from "../../../components/cust-utils/error-messages";
import { Label, Button, Heading, Container, Textarea } from "@medusajs/ui";
import InputField from "../../../components/form-components/molecules/input";

const VendorEditForm = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    password: "",
    contact_name: "",
    contact_email: "",
    contact_phone_number: "",
    registered_number: "",
    tax_number: "",
    vendorAddressData: {
      address_1: "",
      address_2: "",
      city: "",
      postal_code: "",
      first_name: "",
      last_name: "",
      phone: "",
      province: "",
      // country_code: "",
    },
    registrationAddressData: {
      address_1: "",
      address_2: "",
      city: "",
      postal_code: "",
      province: "",
      // country_code: "",
      phone: "",
    },
    userData: {
      first_name: "",
      last_name: "",
      password: "",
      role: "",
    },
  });
  const { id } = useParams();
  const [vendor, setVendor] = useState<{
    company_name: string;
    contact_name: string;
    registered_number: string;
    contact_email: string;
    contact_phone_number: string;
    tax_number: string;
    business_nature: string;
    vendorAddressData: {
      address_1: "";
      city: "";
      postal_code: "";
      first_name: "";
      last_name: "";
      phone: "";
      province: "";
      // country_code: "",
    };
    registrationAddressData: {
      address_1: "";
      city: "";
      postal_code: "";
      province: "";
      // country_code: "",
      phone: "";
    };
    userData: {
      first_name: "";
      last_name: "";
      password: "";
      role: "";
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const notification = useNotification();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/admin/vendors/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch vendor: ${response.status}`);
        }

        const data = await response.json();
        setVendor(data.vendor);
        const [vendorAddress1, registrationVendorAddress1] = data.vendorAddress.address_1.split(" - ");
        const [vendorAddress2, registrationVendorAddress2] = data.vendorAddress.address_2.split("-");
        const [vendorCity, registrationCity] = data.vendorAddress.city.split(" - ");
        const [vendorProvince, registrationProvince] = data.vendorAddress.province.split("-");
        const [vendorPostalCode, registrationPostalCode] = data.vendorAddress.postal_code.split(" - ");
        const [vendorPhone, registrationPhone] = data.vendorAddress.phone.split(" - ");
        
      
        setFormData({
          ...data.vendor,
          vendorAddressData: {
            address_1: vendorAddress1,
            address_2: vendorAddress2,
            city: vendorCity,
            province: vendorProvince,
            postal_code: vendorPostalCode,
            phone: vendorPhone,
            first_name: data.vendorAddress.first_name,
            last_name: data.vendorAddress.last_name,
          },
          registrationAddressData: {
            address_1: registrationVendorAddress1,
            address_2: registrationVendorAddress2,
            city: registrationCity,
            province: registrationProvince,
            postal_code: registrationPostalCode,
            phone: registrationPhone,
            // first_name: data.vendorAddressData.first_name,
            // last_name: data.vendorAddressData.last_name,
          },
          userData: {
            ...data.user,
          },
        });
      } catch (error) {
        console.error("Error fetching vendor:", error);
        notification("An error occurred", getErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      vendorAddressData: {
        ...prevData.vendorAddressData,
        [name]: value,
      },
    }));
  };

  const handleRegistrationAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      registrationAddressData: {
        ...prevData.registrationAddressData,
        [name]: value,
      },
    }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      userData: {
        ...prevData.userData,
        [name]: value,
      },
    }));
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/a/vendors");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:9000/admin/vendors/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            vendorAddressData: formData.vendorAddressData,
            registrationAddressData: formData.registrationAddressData,
            userData: formData.userData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update vendor: ${response.status}`);
      }

      notification(
        "Vendor updated",
        "Vendor information has been updated successfully",
        "success"
      );
      navigate("/a/vendors");
      navigate(0);
    } catch (error) {
      notification("An error occurred", getErrorMessage(error), "error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vendor) {
    return <div>Error: Vendor not found</div>;
  }
  return (
    <Container className="w-full flex flex-col justify-center items-center">
      <Heading className="text-2xl font-bold mb-6 text-left">Vendor</Heading>
      <form onSubmit={handleSubmit} className="space-y-6 py-10">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Vendor Details</h3>
          <Container className="grid grid-cols-2 gap-4 w-[900px]">
            <div>
              <Label htmlFor="company_name">
                Company Name<span className="text-red-700">*</span>
              </Label>
              <InputField
                type="text"
                id="company_name"
                placeholder="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_name">
                Contact Name<span className="text-red-700">*</span>
              </Label>
              <InputField
                type="text"
                id="contact_name"
                placeholder="Contact Name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_email">
                Contact Email<span className="text-red-700">*</span>
              </Label>
              <InputField
                type="email"
                id="contact_email"
                placeholder="Email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_phone_number">
                Contact Number<span className="text-red-700">*</span>
              </Label>
              <InputField
                type="text"
                id="contact_phone_number"
                placeholder="Contact Number"
                name="contact_phone_number"
                value={formData.contact_phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="registered_number">Registered Number</Label>
              <InputField
                type="text"
                id="registered_number"
                placeholder="Registered Number"
                name="registered_number"
                value={formData.registered_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="tax_number">Tax Number</Label>
              <InputField
                type="text"
                id="tax_number"
                placeholder="Tax Number"
                name="tax_number"
                value={formData.tax_number}
                onChange={handleChange}
              />
            </div>
          </Container>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Addresses</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Container className="space-y-4">
                <h4 className="text-md font-semibold mb-2">Vendor Address</h4>
                <div>
                  <Label htmlFor="vendor_address_1">
                    Address 1<span className="text-red-700">*</span>
                  </Label>
                  <Textarea
                    id="vendor_address_1"
                    name="address_1"
                    placeholder="Addresss"
                    value={formData.vendorAddressData.address_1}
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <Label>Address 2</Label>
                  <Textarea
                    id="vendor_address_2"
                    name="address_2"
                    placeholder="Address"
                    value={formData.vendorAddressData.address_2}
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vendor_city">
                    City<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="vendor_city"
                    name="city"
                    placeholder="City"
                    value={formData.vendorAddressData.city}
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vendor_province">
                    Province<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="vendor_province"
                    name="province"
                    placeholder="Province"
                    value={formData.vendorAddressData.province}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">
                    Postal Code<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="postal_code"
                    placeholder="Postal Code"
                    name="postal_code"
                    value={formData.vendorAddressData.postal_code}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="first_name">
                    First Name<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="first_name"
                    placeholder="First Name"
                    name="first_name"
                    value={formData.vendorAddressData.first_name}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <InputField
                    type="text"
                    id="last_name"
                    placeholder="Last Name"
                    name="last_name"
                    value={formData.vendorAddressData.last_name}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">
                    Phone<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="phone"
                    placeholder="Phone"
                    name="phone"
                    value={formData.vendorAddressData.phone}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </Container>
            </div>
            <div>
              <Container className="space-y-4">
                <h4 className="text-md font-semibold mb-4">
                  Registration Address
                </h4>
                <div>
                  <Label htmlFor="registration_address_1">
                    Address 1<span className="text-red-700">*</span>
                  </Label>
                  <Textarea
                    id="registration_address_1"
                    name="address_1"
                    placeholder="Address"
                    value={formData.registrationAddressData.address_1}
                    onChange={handleRegistrationAddressChange}
                  />
                </div>
                <div>
                  <Label>Address 2</Label>
                  <Textarea
                    id="registration_address_2"
                    name="address_2"
                    placeholder="Address"
                    value={formData.registrationAddressData.address_2}
                    onChange={handleRegistrationAddressChange}
                  />
                </div>
                <div>
                  <Label htmlFor="registration_city">
                    City<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="registration_city"
                    name="city"
                    placeholder="City"
                    value={formData.registrationAddressData.city}
                    onChange={handleRegistrationAddressChange}
                  />
                </div>
                <div>
                  <Label htmlFor="registration_province">
                    Province<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="registration_province"
                    name="province"
                    placeholder="Province"
                    value={formData.registrationAddressData.province}
                    onChange={handleRegistrationAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="registration_postal_code">
                    Postal Code<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="registration_postal_code"
                    name="postal_code"
                    placeholder="Postal Code"
                    value={formData.registrationAddressData.postal_code}
                    onChange={handleRegistrationAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="registration_phone">
                    Phone<span className="text-red-700">*</span>
                  </Label>
                  <InputField
                    type="text"
                    id="registration_phone"
                    name="phone"
                    placeholder="Phone"
                    value={formData.registrationAddressData.phone}
                    onChange={handleRegistrationAddressChange}
                    required
                  />
                </div>
              </Container>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">User Details</h3>
          <Container className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user_first_name">
                First Name<span className="text-red-700">*</span>
              </Label>
              <InputField
                type="text"
                id="user_first_name"
                placeholder="First Name"
                name="first_name"
                value={formData.userData.first_name}
                onChange={handleUserChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="user_last_name">Last Name</Label>
              <InputField
                type="text"
                id="user_last_name"
                placeholder="Last Name"
                name="last_name"
                value={formData.userData.last_name}
                onChange={handleUserChange}
              />
            </div>
            <div>
              <Label htmlFor="user_password">
                Password<span className="text-red-700">*</span>
              </Label>
              <InputField
                disabled
                type="password"
                id="user_password"
                placeholder="Password"
                name="password"
                value={formData.userData.password}
                onChange={handleUserChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={formData.userData.role}
                onChange={handleUserChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Select Role</option>
                <option value="member">Member</option>
                <option value="developer">Developer</option>
              </select>
            </div>
          </Container>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={handleNavigate}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Edit Vendor
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default VendorEditForm;

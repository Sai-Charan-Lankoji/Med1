import React, { useState } from "react";
import {
  Button,
  Container,
  FocusModal,
  Heading,
  Label,
  Select,
  Textarea,
  Toaster,
  toast,
} from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import InputField from "../../../components/form-components/molecules/input"; 
import { BusinessTypes } from "../../../components/cust-utils/business-types";
// import { BusinessModel } from "../../../../models/vendor";

interface VendorNewProps {
  openModal: boolean;
  showModal: () => void;
  closeModal: () => void;
}

const VendorNew: React.FC<VendorNewProps> = ({
  openModal,
  showModal,
  closeModal,
}) => {
  const [formData, setFormData] = useState({
    company_name: "",
    password: "",
    contact_name: "",
    contact_email: "",
    contact_phone_number: "",
    registered_number: "",
    tax_number: "",
    business_type: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      userData: {
        ...prevState.userData,
        [name]: value,
      },
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9000/admin/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create vendor: ${response.status}`);
      }
      toast.success("Success", {
        description: "Vendor Created Successfully",
        duration: 1000,
      });
      setTimeout(() => {
        closeModal();
        navigate(0);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error", {
        description: " Error while creating vendor: " + error.message,
        duration: 1000,
      });
    }
  }; 


  return (
    <>
      <FocusModal
        open={openModal}
        onOpenChange={(modalOpened) => {
          if (!modalOpened) {
            closeModal();
          }
        }}
      >
        <FocusModal.Content>
          <FocusModal.Header></FocusModal.Header>
          <FocusModal.Body className="overflow-y-scroll">
            <Container className="w-full flex flex-col justify-center items-center">
              <Heading className="text-3xl mb-3">Create Vendor</Heading>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">Vendor Details</h3>
                  <Container className="space-y-4 w-[900px]">
                    <div className="grid grid-cols-2 gap-4">
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
                        <Label htmlFor="user_password">
                          Password<span className="text-red-700">*</span>
                        </Label>
                        <InputField
                          type="password"
                          id="vendor_password"
                          placeholder="Password"
                          name="password"
                          value={formData.password}
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
                          placeholder="Contact Name"
                          id="contact_name"
                          name="contact_name"
                          value={formData.contact_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_email">
                          Email<span className="text-red-700">*</span>
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
                        <Label htmlFor="registered_number">
                          Registered Number
                        </Label>
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
                      <div className="">
                        <label
                          htmlFor="business_type"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Business Type<span className="text-red-700">*</span>
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 bg-gray-50 sm:text-sm"
                          id="business_type"
                          name="business_type"
                          onChange={handleChange}
                          value={formData.business_type}
                          required
                        >
                          <option value="" disabled>
                            Select Business Type
                          </option>
                          {BusinessTypes?.map((item, index) => (
                            <option key={index} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Container>
                </div>

                <div className="border-b pb-4">
                  <Heading>Address</Heading>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <Container className="space-y-4">
                          <h4 className="text-md font-semibold mb-4">
                            Vendor Address
                          </h4>

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
                            <Label htmlFor="vendor_postal_code">
                              Postal Code<span className="text-red-700">*</span>
                            </Label>
                            <InputField
                              type="text"
                              id="vendor_postal_code"
                              name="postal_code"
                              placeholder="Postal Code"
                              value={formData.vendorAddressData.postal_code}
                              onChange={handleAddressChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="vendor_first_name">
                              First Name<span className="text-red-700">*</span>
                            </Label>
                            <InputField
                              type="text"
                              id="vendor_first_name"
                              name="first_name"
                              placeholder="First Name"
                              value={formData.vendorAddressData.first_name}
                              onChange={handleAddressChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="vendor_last_name">Last Name</Label>
                            <InputField
                              type="text"
                              id="vendor_last_name"
                              name="last_name"
                              placeholder="Last Name"
                              value={formData.vendorAddressData.last_name}
                              onChange={handleAddressChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vendor_phone">
                              Phone<span className="text-red-700">*</span>
                            </Label>
                            <InputField
                              type="text"
                              id="vendor_phone"
                              name="phone"
                              placeholder="Phone"
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
                              value={
                                formData.registrationAddressData.postal_code
                              }
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
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-2">User Details</h3>
                  <Container className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user_first_name">
                        First Name<span className="text-red-700">*</span>{" "}
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
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Role<span className="text-red-700">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.userData.role}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="developer">Developer</option>
                      </select>
                    </div>
                  </Container>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Vendor
                  </Button>
                </div>
              </form>
            </Container>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
      <Toaster />
    </>
  );
};

export default VendorNew;

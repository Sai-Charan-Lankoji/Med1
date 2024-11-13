import React, { useState } from "react";
import {
  Button,
  Container,
  Text,
  Heading,
  Label,
  Textarea,
  Toaster,
  toast,
} from "@medusajs/ui";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
 import { Card, CardHeader, CardContent } from '@/components/ui/card';
 import { Building2, MapPin, BadgeCheck } from 'lucide-react';
const BusinessTypes = [
    {
        value: "Apparel Design",
        label: "Apparel Design",
      },
      {
        value: "Grocery Store",
        label: "Grocery Store",
      },
      {
        value: "Paper Design Printing",
        label: "Paper Design Printing",
      },
] 


const VendorForm = ({ plan }: { plan: string }) => {
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
    },
    registrationAddressData: {
      address_1: "",
      address_2: "",
      city: "",
      postal_code: "",
      province: "",
      phone: "",
    },
  });

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

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9000/vendor/signup", {
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
      router.push('/login')
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Error", {
        description: " Error while creating vendor: " + error.message,
        duration: 1000,
      });
    }
  }; 


  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <Heading className="text-3xl font-bold tracking-tight">Create Vendor</Heading>
            <Text className="text-muted-foreground max-w-2xl mx-auto">
              You selected the <span className="font-medium text-primary">{plan}</span> plan. Please fill in your business details below.
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vendor Details Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Vendor Details</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">
                      Company Name<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="company_name"
                      placeholder="Enter company name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor_password">
                      Password<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="password"
                      id="vendor_password"
                      placeholder="Enter password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_name">
                      Contact Name<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter contact name"
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      required
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">
                      Email<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="contact_email"
                      placeholder="Enter email address"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      required
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone_number">
                      Contact Number<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="tel"
                      id="contact_phone_number"
                      placeholder="Enter contact number"
                      name="contact_phone_number"
                      value={formData.contact_phone_number}
                      onChange={handleChange}
                      required
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_type">
                      Business Type<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      id="business_type"
                      name="business_type"
                      onChange={handleChange}
                      value={formData.business_type}
                      required
                    >
                      <option value="" disabled>Select Business Type</option>
                      {BusinessTypes?.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registered_number">Registered Number</Label>
                    <Input
                      type="text"
                      id="registered_number"
                      placeholder="Enter registered number"
                      name="registered_number"
                      value={formData.registered_number}
                      onChange={handleChange}
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_number">Tax Number</Label>
                    <Input
                      type="text"
                      id="tax_number"
                      placeholder="Enter tax number"
                      name="tax_number"
                      value={formData.tax_number}
                      onChange={handleChange}
                      className="transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Vendor Address */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Vendor Address</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendor_address_1">
                          Address 1<span className="text-red-500 ml-0.5">*</span>
                        </Label>
                        <Textarea
                          id="vendor_address_1"
                          name="address_1"
                          placeholder="Enter address line 1"
                          value={formData.vendorAddressData.address_1}
                          onChange={handleAddressChange}
                          className="min-h-[100px] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor_address_2">
                          Address 2 
                        </Label>
                        <Textarea
                          id="vendor_address_2"
                          name="address_2"
                          placeholder="Enter address line 2"
                          value={formData.vendorAddressData.address_2}
                          onChange={handleAddressChange}
                          className="min-h-[100px] transition-all"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vendor_city">
                            City<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="vendor_city"
                            name="city"
                            placeholder="Enter city"
                            value={formData.vendorAddressData.city}
                            onChange={handleAddressChange}
                            className="transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_province">
                            Province<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="vendor_province"
                            name="province"
                            placeholder="Enter province"
                            value={formData.vendorAddressData.province}
                            onChange={handleAddressChange}
                            required
                            className="transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_first_name">
                            FirstName<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="vendor_first_name"
                            name="first_name"
                            placeholder="Enter firstName"
                            value={formData.vendorAddressData.first_name}
                            onChange={handleAddressChange}
                            required
                            className="transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_last_name">
                            LastName 
                          </Label>
                          <Input
                            type="text"
                            id="vendor_last_name"
                            name="last_name"
                            placeholder="Enter lastName"
                            value={formData.vendorAddressData.last_name}
                            onChange={handleAddressChange}
                            className="transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vendor_postal_code">
                            Postal Code<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="vendor_postal_code"
                            name="postal_code"
                            placeholder="Enter postal code"
                            value={formData.vendorAddressData.postal_code}
                            onChange={handleAddressChange}
                            required
                            className="transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_phone">
                            Phone<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="tel"
                            id="vendor_phone"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.vendorAddressData.phone}
                            onChange={handleAddressChange}
                            required
                            className="transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Address */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Registration Address</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="registration_address_1">
                          Address 1<span className="text-red-500 ml-0.5">*</span>
                        </Label>
                        <Textarea
                          id="registration_address_1"
                          name="address_1"
                          placeholder="Enter address line 1"
                          value={formData.registrationAddressData.address_1}
                          onChange={handleRegistrationAddressChange}
                          className="min-h-[100px] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registration_address_2">
                          Address 2
                        </Label>
                        <Textarea
                          id="registration_address_2"
                          name="address_2"
                          placeholder="Enter address line 2"
                          value={formData.registrationAddressData.address_2}
                          onChange={handleAddressChange}
                          className="min-h-[100px] transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="registration_city">
                            City<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="registration_city"
                            name="city"
                            placeholder="Enter city"
                            value={formData.registrationAddressData.city}
                            onChange={handleRegistrationAddressChange}
                            className="transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registration_province">
                            Province<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="registration_province"
                            name="province"
                            placeholder="Enter province"
                            value={formData.registrationAddressData.province}
                            onChange={handleRegistrationAddressChange}
                            required
                            className="transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="registration_postal_code">
                            Postal Code<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="registration_postal_code"
                            name="postal_code"
                            placeholder="Enter postal code"
                            value={formData.registrationAddressData.postal_code}
                            onChange={handleRegistrationAddressChange}
                            required
                            className="transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registration_phone">
                            Phone<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="tel"
                            id="registration_phone"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.registrationAddressData.phone}
                            onChange={handleRegistrationAddressChange}
                            required
                            className="transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="submit" 
                className="px-8 py-2.5"
              >
                Create Vendor
              </Button>
            </div>
          </form>
        </div>
      </Container>
      <Toaster />
    </div>
  );
};

export default VendorForm;

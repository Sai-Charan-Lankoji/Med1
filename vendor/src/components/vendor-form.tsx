import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Building2, MapPin, BadgeCheck } from "lucide-react";

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
];

const VendorFormSchema = z.object({
  company_name: z.string().nonempty("Company name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  contact_name: z.string().nonempty("Contact name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone_number: z.string().nonempty("Contact number is required"),
  registered_number: z.string().optional(),
  tax_number: z.string().optional(),
  business_type: z.string().nonempty("Business type is required"),
  vendorAddressData: z.object({
    address_1: z.string().nonempty("Address 1 is required"),
    address_2: z.string().optional(),
    city: z.string().nonempty("City is required"),
    postal_code: z.string().nonempty("Postal code is required"),
    first_name: z.string().nonempty("First name is required"),
    last_name: z.string().optional(),
    phone: z.string().nonempty("Phone is required"),
    province: z.string().nonempty("Province is required"),
  }),
  registrationAddressData: z.object({
    address_1: z.string().nonempty("Address 1 is required"),
    address_2: z.string().optional(),
    city: z.string().nonempty("City is required"),
    postal_code: z.string().nonempty("Postal code is required"),
    province: z.string().nonempty("Province is required"),
    phone: z.string().nonempty("Phone is required"),
  }),
});

type VendorFormData = z.infer<typeof VendorFormSchema>;

const VendorForm = ({ plan }: { plan: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(VendorFormSchema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<VendorFormData> = async (data) => {
    try {
      const response = await fetch("http://localhost:9000/vendor/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to create vendor: ${response.status}`);
      }
      toast.success("Success", {
        description: "Vendor Created Successfully",
        duration: 1000,
      });
      router.push("/login");
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
            <Heading className="text-3xl font-bold tracking-tight">
              Create Vendor
            </Heading>
            <Text className="text-muted-foreground max-w-2xl mx-auto">
              You selected the{" "}
              <span className="font-medium text-primary">{plan}</span> plan.
              Please fill in your business details below.
            </Text>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                      {...register("company_name")}
                      className="transition-all"
                     />
                    <Text className="text-red-500">{errors.company_name?.message}</Text>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor_password">
                      Password<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="password"
                      id="vendor_password"
                      placeholder="Enter password"
                      {...register("password")}
                       className="transition-all"
                    />
                    <Text className="text-red-500">{errors.password?.message}</Text>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_name">
                      Contact Name<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter contact name"
                      id="contact_name"
                      {...register("contact_name")}
                      className="transition-all"
                    />
                    <Text className="text-red-500">{errors.contact_name?.message}</Text>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">
                      Email<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="contact_email"
                      placeholder="Enter email address"
                      {...register("contact_email")}
                      className="transition-all"
                    />
                    <Text className="text-red-500">{errors.contact_email?.message}</Text>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone_number">
                      Contact Number<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <Input
                      type="tel"
                      id="contact_phone_number"
                      placeholder="Enter contact number"
                      {...register("contact_phone_number")}
                      className="transition-all"
                    />
                    <Text className="text-red-500">{errors.contact_phone_number?.message}</Text>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_type">
                      Business Type<span className="text-red-500 ml-0.5">*</span>
                    </Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      id="business_type"
                      {...register("business_type")}
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
                    <Text className="text-red-500">{errors.business_type?.message}</Text>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registered_number">Registered Number</Label>
                    <Input
                      type="text"
                      id="registered_number"
                      placeholder="Enter registered number"
                      {...register("registered_number")}
                      className="transition-all"
                    />
                    <Text className="text-red-500">{errors.registered_number?.message}</Text>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_number">Tax Number</Label>
                    <Input
                      type="text"
                      id="tax_number"
                      placeholder="Enter tax number"
                      {...register("tax_number")}
                      className="transition-all"
                    />
                    <Text className="text-red-500">{errors.tax_number?.message}</Text>
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
                          {...register("vendorAddressData.address_1")}
                           placeholder="Enter address line 1"
                          className="min-h-[100px] transition-all"
                        />
                        <Text className="text-red-500">{errors.vendorAddressData?.address_1?.message}</Text>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor_address_2">Address 2</Label>
                        <Textarea
                          id="vendor_address_2"
                          {...register("vendorAddressData.address_2")}
                          placeholder="Enter address line 2"
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
                            {...register("vendorAddressData.city")}
                            placeholder="Enter city"
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.vendorAddressData?.city?.message}</Text>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_province">
                            Province<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="vendor_province"
                            {...register("vendorAddressData.province")}
                            placeholder="Enter province"
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.vendorAddressData?.province?.message}</Text>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_first_name">
                            FirstName<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="vendor_first_name"
                            {...register("vendorAddressData.first_name")}
                            placeholder="Enter firstName"
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.vendorAddressData?.first_name?.message}</Text>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_last_name">LastName</Label>
                          <Input
                            type="text"
                            id="vendor_last_name"
                            {...register("vendorAddressData.last_name")}
                            placeholder="Enter lastName"
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
                            {...register("vendorAddressData.postal_code")}
                            placeholder="Enter postal code"
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.vendorAddressData?.postal_code?.message}</Text>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendor_phone">
                            Phone<span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="tel"
                            id="vendor_phone"
                            {...register("vendorAddressData.phone")}
                            placeholder="Enter phone number"
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.vendorAddressData?.phone?.message}</Text>
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
                          Address 1
                          <span className="text-red-500 ml-0.5">*</span>
                        </Label>
                        <Textarea
                          id="registration_address_1"
                          name="address_1"
                          placeholder="Enter address line 1"
                          {...register('registrationAddressData.address_1')}
                          className="min-h-[100px] transition-all"
                        />
                        <Text className="text-red-500">{errors.registrationAddressData?.address_1?.message}</Text>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registration_address_2">
                          Address 2
                        </Label>
                        <Textarea
                          id="registration_address_2"
                          name="address_2"
                          placeholder="Enter address line 2"
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
                            {...register('registrationAddressData.city')}
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.registrationAddressData?.city?.message}</Text>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registration_province">
                            Province
                            <span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="registration_province"
                            name="province"
                            placeholder="Enter province"
                            {...register('registrationAddressData.province')}
                            
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.registrationAddressData?.province?.message}</Text>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="registration_postal_code">
                            Postal Code
                            <span className="text-red-500 ml-0.5">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="registration_postal_code"
                            name="postal_code"
                            placeholder="Enter postal code"
                            {...register('registrationAddressData.postal_code')}
                            
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.registrationAddressData?.postal_code?.message}</Text>
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
                            {...register('registrationAddressData.phone')}
                            
                            className="transition-all"
                          />
                          <Text className="text-red-500">{errors.registrationAddressData?.phone?.message}</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="submit" className="px-8 py-2.5">
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

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Heading, Toaster, toast } from "@medusajs/ui";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";
import { VendorFormSchema, VendorFormData, BusinessTypes } from "./types";
import { FormField } from "./FormField";
import { AddressSection } from "./AddressSection";
import { PasswordField } from "./passwordfield";
import { PhoneInput } from "./phoneinput";
import { CountryCode } from "@/app/@types/phonevalidation";
import { Label } from "../ui/label";
import { Form } from "../ui/form";
import { Input } from "../ui/input"; 


interface VendorFormProps {
  plan: {
    name: string;
    id: string;
  };
}

const VendorForm =({ plan }: VendorFormProps) => {
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const router = useRouter();
  const [sameAsVendorAddress, setSameAsVendorAddress] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<VendorFormData>({
    resolver: zodResolver(VendorFormSchema),
    defaultValues: {
      plan: plan.name,
      plan_id: plan.id, // Added this
      country_code: undefined,
      contact_phone_number: "",
    },
    mode: "onChange"  
  })
  const password = watch("password")

  const handlePhoneChange = async (value: string, isValid: boolean) => {
    setPhoneNumber(value);

    // Split the value to get phone number without country code
    const phoneNumberOnly = value.split(" ").slice(1).join(" ");

    setValue("contact_phone_number", phoneNumberOnly, {
      shouldValidate: true,
    });

    // Trigger validation
    await trigger(["contact_phone_number"]);
  };

  const handleCountryChange = async (value: string) => {
    setCountryCode(value);
    setPhoneNumber(""); // Reset phone number when country changes

    setValue("country_code", value as CountryCode, {
      shouldValidate: true,
    });
    setValue("contact_phone_number", "", {
      shouldValidate: true,
    });

    // Trigger validation
    await trigger(["country_code", "contact_phone_number"]);
  };

  const onSubmit = async (data: VendorFormData) => {
    const requiredFields = [
      "company_name",
      "password",
      "confirmPassword",
      "contact_name",
      "contact_email",
      "contact_phone_number",
      "business_type",
      "country_code",
      "vendorAddressData.address_1",
      "vendorAddressData.city",
      "vendorAddressData.postal_code",
      "vendorAddressData.province",
      "vendorAddressData.phone",
      "registrationAddressData.address_1",
      "registrationAddressData.city",
      "registrationAddressData.postal_code",
      "registrationAddressData.province",
      "registrationAddressData.phone",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = field.split(".").reduce((obj, key) => obj?.[key], data);
      return !value;
    });

    if (missingFields.length > 0) {
      toast.error("Error", {
        description: "Please fill in all required fields",
        duration: 3000,
      });
      return;
    }

    try {
      const submissionData = {
        ...data,
        plan_id: plan.id
      };

      const response = await fetch("https://med1-wyou.onrender.com/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
         throw new Error( errorData.error ||`Failed to create vendor: ${response.status}`);
      }

      toast.success("Success", {
        description: "Vendor Created Successfully",
        duration: 1000,
      });
      router.push("/login");
    } catch (error: any) {
      
      toast.error("Error", {
        description: "Error while creating vendor: " + error.message,
        duration: 1000,
      });
    }
  };

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsVendorAddress(e.target.checked);
    if (e.target.checked) {
      const vendorAddress = watch("vendorAddressData");
      setValue("registrationAddressData", vendorAddress);
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-8 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-3 animate-fadeIn">
            <Heading className="text-3xl font-bold tracking-tight gradient-text">
              Create Vendor
            </Heading>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              You selected the{" "}
              <span className="font-medium text-primary ">{plan.name}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card className="card">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Vendor Details</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    label="Company Name"
                    id="company_name"
                    type="text"
                    placeholder="Enter company name"
                    required
                    register={register}
                    name="company_name"
                    error={errors.company_name?.message}
                  />
                  <PasswordField
                    label="Password"
                    id="password"
                    placeholder="Enter password"
                    required
                    register={register}
                    name="password"
                    error={errors.password?.message}
                  />
                  <PasswordField
                    label="Confirm Password"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    required
                    register={register}
                    name="confirmPassword"
                    error={errors.confirmPassword?.message}
                    isConfirm={true}
                    mainPassword={password}
                  />
                  <FormField
                    label="Contact Name"
                    id="contact_name"
                    type="text"
                    placeholder="Enter contact name"
                    required
                    register={register}
                    name="contact_name"
                    error={errors.contact_name?.message}
                  />
                  <FormField
                    label="Contact Email"
                    id="contact_email"
                    type="email"
                    placeholder="Enter contact email"
                    required
                    register={register}
                    name="contact_email"
                    error={errors.contact_email?.message}
                  />
                  <PhoneInput
                    value={phoneNumber.split(" ").slice(1).join(" ")} // Remove country code from display
                    countryCode={countryCode}
                    onChange={handlePhoneChange}
                    onCountryChange={handleCountryChange}
                    error={errors.contact_phone_number?.message}
                  />
                  <FormField
                    label="Registered Number"
                    id="registered_number"
                    type="text"
                    placeholder="Enter registered number (optional)"
                    register={register}
                    name="registered_number"
                    error={errors.registered_number?.message}
                  />
                  <FormField
                    label="Tax Number"
                    id="tax_number"
                    type="text"
                    placeholder="Enter tax number (optional)"
                    register={register}
                    name="tax_number"
                    error={errors.tax_number?.message}
                  />
                  <FormField
                    label="Plan"
                    id="plan"
                    type="text"
                    placeholder={plan.name}
                    register={register}
                    name="plan"
                    error={errors.plan?.message}
                    disabled // Make this field read-only
                  />
                  <FormField
                    label="Business Type"
                    id="business_type"
                    type="select"
                    placeholder="Select business type"
                    required
                    register={register}
                    name="business_type"
                    options={[
                      { value: "Apparel Design", label: "Apparel Design" },
                      { value: "Grocery Store", label: "Grocery Store" },
                      {
                        value: "Paper Design Printing",
                        label: "Paper Design Printing",
                      },
                    ]}
                    error={errors.business_type?.message}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Vendor Address */}
                  <div className="pr-4 lg:border-r lg:border-gray-200">
                    <AddressSection
                      title="Vendor Address"
                      prefix="vendor_address"
                      addressType="vendorAddressData"
                      register={register}
                      errors={errors}
                    />
                  </div>

                  {/* Registration Address */}
                  <div className="pl-4">
                    <div className="mb-4">
                      <Label className="flex items-center space-x-2">
                        <Input
                          type="checkbox"
                          checked={sameAsVendorAddress}
                          onChange={handleSameAddressChange}
                          className="form-checkbox h-5 w-5 text-primary"
                        />
                        <span className="text-md font-medium">Same as Vendor Address</span>
                      </Label>
                    </div>
                    <AddressSection
                      title="Registration Address"
                      prefix="registration_address"
                      addressType="registrationAddressData"
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white button-animated disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Vendor"
                )}
              </Button>
            </div>
            
          </form>
          <input 
            type="hidden" 
            {...register("plan_id")} 
            value={plan.id} 
          />
        </div>
      </Container>
      <Toaster />
    </div>
  );
};

export default VendorForm;

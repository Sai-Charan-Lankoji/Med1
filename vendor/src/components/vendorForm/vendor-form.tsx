import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Heading, Toaster, toast } from "@medusajs/ui";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";
import { VendorFormSchema, VendorFormData, BusinessTypes } from "./types";
import { FormField } from "./FormField";
import { AddressSection } from "./AddressSection";

const VendorForm = ({ plan }: { plan: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorFormData>({
    resolver: zodResolver(VendorFormSchema),
    defaultValues: {
      plan: plan, // Set the default value for the plan
    },
  });
  console.log("VENDOR SELECTED PLAN: ", plan);
  const router = useRouter();

  const onSubmit = async (data: VendorFormData) => {
    try {
      const response = await fetch("http://localhost:9000/vendor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data), // The plan is now included in the data object
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
      toast.error("Error", {
        description: "Error while creating vendor: " + error.message,
        duration: 1000,
      });
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
              <span className="font-medium text-primary animate-pulse">
                {plan}
              </span>{" "}
              plan.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card className="card-animated">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-primary animate-bounce" />
                  <h3 className="text-lg font-semibold">Vendor Details</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    label="Company Name"
                    id="company_name"
                    placeholder="Enter company name"
                    required
                    register={register}
                    name="company_name"
                    error={errors.company_name?.message}
                  />
                  <FormField
                    label="Password"
                    id="password"
                    placeholder="Enter password"
                    required
                    register={register}
                    name="password"
                    error={errors.password?.message}
                  />
                  <FormField
                    label="Contact Name"
                    id="contact_name"
                    placeholder="Enter contact name"
                    required
                    register={register}
                    name="contact_name"
                    error={errors.contact_name?.message}
                  />
                  <FormField
                    label="Contact Email"
                    id="contact_email"
                    placeholder="Enter contact email"
                    required
                    register={register}
                    name="contact_email"
                    error={errors.contact_email?.message}
                  />
                  <FormField
                    label="Contact Phone Number"
                    id="contact_phone_number"
                    placeholder="Enter phone number"
                    required
                    register={register}
                    name="contact_phone_number"
                    error={errors.contact_phone_number?.message}
                  />
                  <FormField
                    label="Registered Number"
                    id="registered_number"
                    placeholder="Enter registered number (optional)"
                    register={register}
                    name="registered_number"
                    error={errors.registered_number?.message}
                  />
                  <FormField
                    label="Tax Number"
                    id="tax_number"
                    placeholder="Enter tax number (optional)"
                    register={register}
                    name="tax_number"
                    error={errors.tax_number?.message}
                  />
                  <FormField
                    label="Plan"
                    id="plan"
                    placeholder={plan}
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

            <Card className="card-animated">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary animate-bounce" />
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
        </div>
      </Container>
      <Toaster />
    </div>
  );
};

export default VendorForm;

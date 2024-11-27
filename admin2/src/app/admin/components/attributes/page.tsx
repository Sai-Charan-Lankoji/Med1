"use client";
import { useGetProduct } from "@/app/hooks/products/useGetProduct";
import { useUpdateProduct } from "@/app/hooks/products/useUpdateProduct";
import { countries } from "@/app/utils/countries";
import { EllipsisHorizontal, PencilSquare, XMarkMini } from "@medusajs/icons";
import {
  Heading,
  DropdownMenu,
  IconButton,
  Button,
  toast,
  Text,
} from "@medusajs/ui";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Attributes = () => {
  const router = useRouter();
  const { id } = useParams();

  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const openAttributeModal = () => setIsAttributeModalOpen(true);
  const closeAttributeModal = () => setIsAttributeModalOpen(false);

  const { data: product, refetch: refetchProduct } = useGetProduct(
    id as string
  );
  const { mutate: updateProduct } = useUpdateProduct(id as string);
  const [productFormData, setProductFormData] = useState<any>({});

  useEffect(() => {
    if (product) {
      setProductFormData({
        weight: product.weight || 0,
        length: product.length || 0,
        height: product.height || 0,
        width: product.width || 0,
        hs_code: product.hs_code || "",
        origin_country: product.origin_country || "",
        mid_code: product.mid_code || "",
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(productFormData, {
      onSuccess: () => {
        toast.success("Success", {
          description: "Product updated successfully",
          duration: 1000,
        })
        setTimeout(() => {
          router.push("/vendor/products");
        }, 3000);
      },
      onError: () => {
        toast.error("Error", {
          description: "Failed to update product",
          duration: 1000,
        })
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

   
  const renderInputField = (
    id: string,
    label: string,
    placeholder: string,
    type: "text" | "number" = "text",
    required = false,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div>
      <label htmlFor={id} className="block sm:text-[10px] md:text-[16px] text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
        required={required}
      />
    </div>
  );

   

   
  return (
    <>
      <div className="p-6 mt-4 bg-white shadow-md rounded-lg sm:w-[398px] md:w-[532px] lg:w-[800px]">
        <div className="flex flex-row justify-between">
          <Heading className="text-[24px] mb-2">Attributes</Heading>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton
                variant="transparent"
                className="w-8 h-8 flex justify-center items-center hover:bg-gray-100 active:bg-gray-200"
              >
                <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white ">
              <DropdownMenu.Item className="bg-white text-gray-900  hover:text-gray-950 hover:bg-gray-200">
                <Button variant="transparent" onClick={openAttributeModal}>
                  <PencilSquare className="mr-2 text-[14px] font-normal text-[rgb(17, 24, 39)] font-semibold" />
                  Edit Attributes
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
        {isAttributeModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 sm:w-[372px] sm:h-[476px] md:w-[572px] md:h-[516px]">
              <div className="flex flex-row justify-between">
                <Heading level="h2" className="sm:text-[18px] md:text-[24px] font-semibold mb-4">
                  Edit Attributes
                </Heading>
                <IconButton variant="transparent">
                  <XMarkMini onClick={closeAttributeModal} />
                </IconButton>
              </div>
              <hr />
              <Heading level="h2" className="pt-4 font-semibold sm:text-[12px] md:text-[16px]">
                Dimensions
              </Heading>
              <Text className="sm:text-[10px] md:text-[14px] text-gray-500 ">
                Configure to calculate the most accurate shipping rates
              </Text>
              <form onSubmit={handleSubmit}>
                <div className="pb-15">
                  <div className="grid grid-cols-4 gap-4 my-4">
                    {renderInputField(
                      "width",
                      "Width",
                      "0",
                      "number",
                      false,
                      productFormData.width,
                      handleInputChange
                    )}
                    {renderInputField(
                      "length",
                      "Length",
                      "0",
                      "number",
                      false,
                      productFormData.length,
                      handleInputChange
                    )}
                    {renderInputField(
                      "height",
                      "Height",
                      "0",
                      "number",
                      false,
                      productFormData.height,
                      handleInputChange
                    )}
                    {renderInputField(
                      "weight",
                      "Weight",
                      "0",
                      "number",
                      false,
                      productFormData.weight,
                      handleInputChange
                    )}
                  </div>
                </div>
                <Heading level="h2" className="pt-4 font-semibold sm:text-[12px] md:text-[16px]">
                  Customs
                </Heading>
                <Text className="sm:text-[10px] md:text-[14px] text-gray-500 mb-4">
                  Configure to calculate the most accurate shipping rates
                </Text>
                <div className="grid grid-cols-2 gap-2">
                  {renderInputField(
                    "mid_code",
                    "MID Code",
                    "123456",
                    "number",
                    false,
                    productFormData.mid_code,
                    handleInputChange
                  )}
                  {renderInputField(
                    "hs_code",
                    "HS Code",
                    "654321",
                    "number",
                    false,
                    productFormData.hs_code,
                    handleInputChange
                  )}
                </div>
                <div className="w-52 mt-4">
                  <label
                    htmlFor="origin_country"
                    className="block sm:text-[10px] md:text-[16px] text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    id="origin_country"
                    name="origin_country"
                    className="mt-1 p-2 outline-none sm:text-[10px] md:text-[16px] block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end sm:pt-2">
                  <Button variant="secondary" onClick={closeAttributeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="transparent"
                    className="ml-2 px-12 py-2 border-none rounded-md outline-none text-white sm:text-[10px] md:text-[16px] font-bold font-cabin bg-violet-600 hover:bg-violet-500"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        <Heading level="h2">Dimensions</Heading>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-[rgb(107, 114, 128)]">
              Height:
            </p>
            <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
              {productFormData.height || "-"}
            </p>
          </div>

          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-[rgb(107, 114, 128)]">
              Width:
            </p>
            <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
              {productFormData.width || "-"}
            </p>
          </div>

          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-[rgb(107, 114, 128)]">
              Length:
            </p>
            <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
              {productFormData.length || "-"}
            </p>
          </div>

          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-[rgb(107, 114, 128)]">
              Weight:
            </p>
            <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
              {productFormData.weight || "-"}
            </p>
          </div>
        </div>
        <Heading level="h2">Customs</Heading>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-[rgb(107, 114, 128)]">
              MID Code:
            </p>
            <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
              {productFormData.mid_code || "-"}
            </p>
          </div>

          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-[rgb(107, 114, 128)]">
              HS Code:
            </p>
            <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
              {productFormData.hs_code || "-"}
            </p>
          </div>

          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-[rgb(107, 114, 128)]">
              Country of origin:
            </p>
            <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
              {productFormData.origin_country || "-"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attributes;

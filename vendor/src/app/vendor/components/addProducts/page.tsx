"use client";
import {
  FocusModal,
  Button,
  ProgressAccordion,
  Text,
  Toaster,
  toast,
  Switch,
} from "@medusajs/ui";
import { useState } from "react";
import { countries } from "@/app/utils/countries";
import { useRouter } from "next/navigation";
import { useUploadImage } from "@/app/hooks/products/useUploadImage";
import { useCreateProduct } from "@/app/hooks/products/useCreateProduct";
import Image from "next/image";
import { XMarkMini } from "@medusajs/icons";
import { vendor_id } from "@/app/utils/constant";

const AddProductForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/vendor/products");
  }
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [originalFileName, setOriginalFileName] = useState("");
  const router = useRouter();
  const { mutate: uploadImage } = useUploadImage();
  const { mutate: createProduct } = useCreateProduct();

  const handleImageUpload = async (files: FileList) => {
    const uploadedFilePaths: string[] = [];
    for (const file of Array.from(files)) {
      setOriginalFileName(file.name);
      uploadImage(file, {
        onSuccess: (fileUrl) => {
          uploadedFilePaths.push(fileUrl);
          if (uploadedFilePaths.length === files.length) {
            setUploadedImages((prev) => [...prev, ...uploadedFilePaths]);
          }
        },
        onError: (error) => {
          console.error("Error uploading image:", error);
        },
      });
    }
  };

  const handlePublishClick = () => {

    if (!vendor_id) {
      toast.error("Vendor ID is missing");
      return;
    }

    const formData: ProductFormData = {
      title:
        (document.getElementById("title") as HTMLInputElement)?.value || "",
      subtitle:
        (document.getElementById("subtitle") as HTMLInputElement)?.value || "",
      handle:
        (document.getElementById("handle") as HTMLInputElement)?.value || "",
      material:
        (document.getElementById("material") as HTMLInputElement)?.value || "",
      description:
        (document.getElementById("description") as HTMLTextAreaElement)
          ?.value || "",
      discountable:
        (document.querySelector('input[type="checkbox"]') as HTMLInputElement)
          ?.checked || false,
      type:
        (document.querySelector('[name="type"]') as HTMLInputElement)?.value ||
        "",
      tags: (document.getElementById("tags") as HTMLInputElement)?.value || "",
      width:
        parseInt(
          (document.getElementById("width") as HTMLInputElement)?.value
        ) || 0,
      length:
        parseInt(
          (document.getElementById("length") as HTMLInputElement)?.value
        ) || 0,
      height:
        parseInt(
          (document.getElementById("height") as HTMLInputElement)?.value
        ) || 0,
      weight:
        parseInt(
          (document.getElementById("weight") as HTMLInputElement)?.value
        ) || 0,
      mid_code:
        (document.getElementById("midcode") as HTMLInputElement)?.value || "",
      hs_code:
        (document.getElementById("hscode") as HTMLInputElement)?.value || "",
      origin_country:
        (document.getElementById("origin_country") as HTMLSelectElement)
          ?.value || "",
      thumbnail: uploadedImages.join(","),
      vendor_id: vendor_id,
    };

    console.log("Form Data:", formData);

    createProduct(formData, {
      onSuccess: () => {
        toast.success("Success", {
          description: "Product Created Successfully",
          duration: 1000,
        });

        setTimeout(() => {
          closeModal();
          router.refresh();
        }, 2000);
      },
      onError: (error) => {
        console.error("Error while creating product:", error);
        toast.error("Error", {
          description: "Error while creating product",
          duration: 1000,
        });
      },
    });
  };

  const renderInputField = (
    id: string,
    label: string,
    placeholder: string,
    type: "text" | "number",
    required = false
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
        required={required}
      />
    </div>
  );

  const renderTextArea = (
    id: string,
    label: string,
    placeholder: string,
    rows = 5
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
      ></textarea>
    </div>
  );

  const renderSwitchWithLabel = (label: string, description: string) => (
    <div className="col-span-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-black">{label}</h1>
        <Switch />
      </div>
      <p className="pt-4 text-sm font-semibold text-gray-500">{description}</p>
    </div>
  );

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-screen w-screen overflow-auto">
            <div className="flex items-center justify-between p-2 border-ui-border-strong border-b">
              <Button variant="secondary" onClick={closeModal}>
                <XMarkMini />
              </Button>
              <div className="flex items-center space-x-4">
                <Button variant="secondary" className="px-2 py-2">
                  Save as draft
                </Button>
                <Button
                  className="px-2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  onClick={handlePublishClick}
                >
                  Publish product
                </Button>
              </div>
            </div>
            <div className="mx-80 mt-32">
              <ProgressAccordion type="multiple">
                <ProgressAccordion.Item value="general">
                  <ProgressAccordion.Header className="text-black text-lg">
                    General Information{" "}
                    <span className="text-red-500 text-2xl">*</span>
                  </ProgressAccordion.Header>
                  <ProgressAccordion.Content>
                    <Text className="text-gray-500 text-[14px] pb-6">
                      To start selling Product
                    </Text>
                    <div className="grid grid-cols-2 gap-8 mb-4">
                      {renderInputField(
                        "title",
                        "Title",
                        "Winter Jackets",
                        "text",
                        true
                      )}
                      {renderInputField(
                        "subtitle",
                        "Subtitle",
                        "Warm and Cozy",
                        "text"
                      )}
                      {renderInputField(
                        "handle",
                        "Handle",
                        "winter-jacket-001",
                        "text",
                        true
                      )}
                      {renderInputField(
                        "material",
                        "Material",
                        "Polyester",
                        "text"
                      )}
                      {renderTextArea(
                        "description",
                        "Description",
                        "Enter a detailed description"
                      )}
                      {renderSwitchWithLabel(
                        "This product can be discounted.",
                        "Toggle if this product is eligible for discounts."
                      )}
                    </div>
                  </ProgressAccordion.Content>
                </ProgressAccordion.Item>

                <ProgressAccordion.Item value="Organize">
                  <ProgressAccordion.Header className="text-black text-lg">
                    Organize
                  </ProgressAccordion.Header>
                  <ProgressAccordion.Content>
                    <div className="pb-15">
                      <div className="grid grid-cols-4 gap-4 my-4">
                        {renderInputField("width", "Width", "10", "number")}
                        {renderInputField("length", "Length", "20", "number")}
                        {renderInputField("height", "Height", "30", "number")}
                        {renderInputField("weight", "Weight", "5", "number")}
                      </div>
                      <Text className="text-gray-500 text-[14px]">
                        Add tags to help categorize your product.
                      </Text>
                    </div>

                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="Enter tags"
                      className="mt-1 p-2 outline-none border  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </ProgressAccordion.Content>
                </ProgressAccordion.Item>

                <ProgressAccordion.Item value="customs">
                  <ProgressAccordion.Header className="text-black text-lg">
                    Customs Information
                  </ProgressAccordion.Header>
                  <ProgressAccordion.Content>
                    <div className="grid grid-cols-2 gap-8">
                      {renderInputField(
                        "midcode",
                        "MID Code",
                        "123456",
                        "number"
                      )}
                      {renderInputField(
                        "hscode",
                        "HS Code",
                        "654321",
                        "number"
                      )}
                      <div>
                        <label
                          htmlFor="origin_country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Country of Origin
                        </label>
                        <select
                          id="origin_country"
                          name="origin_country"
                          autoComplete="country-name"
                          className="mt-1 p-2 block w-full outline-none border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {countries.map((country, index) => (
                            <option key={index} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </ProgressAccordion.Content>
                </ProgressAccordion.Item>

                <ProgressAccordion.Item value="media">
                  <ProgressAccordion.Header className="text-black text-lg">
                    Media
                  </ProgressAccordion.Header>
                  <ProgressAccordion.Content>
                    <div className="pb-6">
                      <Text className="text-gray-500 text-[15px] font-semibold">
                        Used to represent your product during checkout, social
                        sharing, and more.
                      </Text>
                    </div>

                    <div
                      className="border-dashed hover:border-violet-500 border-2 border-gray-300 p-10 rounded-md"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = e.dataTransfer.files;
                        handleImageUpload(files);
                      }}
                    >
                      <input
                        type="file"
                        id="thumbnailUpload"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            handleImageUpload(e.target.files);
                          }
                        }}
                      />
                      <label
                        htmlFor="thumbnailUpload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <p className="text-gray-500">
                          Drag and drop an image here or{" "}
                          <span className="text-violet-500">
                            Click to upload
                          </span>
                          <br />
                          12 X 1600 (3:4) recommended, Up to 10MB each
                        </p>
                      </label>
                    </div>

                    <h1 className="text-gray-500 font-bold mt-4">Upload</h1>

                    <div className="mx-8">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
                        >
                          <div className="flex items-center">
                            <Image
                              src={image}
                              alt="Product-Image"
                              className="w-16 h-16 object-cover rounded"
                              width={40}
                              height={40}
                              style={{ width: "auto", height: "auto" }}
                            />
                            <div className="ml-4">
                              <p className="text-sm font-semibold">
                                {originalFileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(10 / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            className="text-white-600"
                            variant="transparent"
                            onClick={() =>
                              setUploadedImages((prevImages) =>
                                prevImages.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ProgressAccordion.Content>
                </ProgressAccordion.Item>
              </ProgressAccordion>
            </div>
            <Toaster />
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductForm;

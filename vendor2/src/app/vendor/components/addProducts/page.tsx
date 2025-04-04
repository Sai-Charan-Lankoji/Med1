"use client";

import { useState } from "react";
import { countries } from "@/app/utils/countries";
import { useRouter } from "next/navigation";
import { useUploadImage } from "@/app/hooks/products/useUploadImage";
import { useCreateProduct } from "@/app/hooks/products/useCreateProduct";
import Image from "next/image";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { vendor_id } from "@/app/utils/constant";

interface ProductFormData {
  title: string;
  subtitle: string;
  handle: string;
  material: string;
  description: string;
  discountable: boolean;
  type: string;
  tags: string;
  width: number;
  length: number;
  height: number;
  weight: number;
  mid_code: string;
  hs_code: string;
  origin_country: string;
  thumbnail: string;
  vendor_id: string;
}

const AddProductForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [originalFileName, setOriginalFileName] = useState("");
  const router = useRouter();
  const { uploadImage, isLoading: isUploading, error: uploadError } = useUploadImage();
  const { createProduct, isLoading: isCreating, error: createError } = useCreateProduct();

  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/vendor/products");
  };

  const handleImageUpload = async (files: FileList) => {
    const uploadedFilePaths: string[] = [];
    for (const file of Array.from(files)) {
      setOriginalFileName(file.name);
      try {
        const result = await uploadImage(file);
        uploadedFilePaths.push(result.fileUrl);
        if (uploadedFilePaths.length === files.length) {
          setUploadedImages((prev) => [...prev, ...uploadedFilePaths]);
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        toast.error("Error uploading image");
      }
    }
  };

  const handlePublishClick = async () => {
    if (!vendor_id) {
      toast.error("Vendor ID is missing");
      return;
    }

    const formData: ProductFormData = {
      title: (document.getElementById("title") as HTMLInputElement)?.value || "",
      subtitle: (document.getElementById("subtitle") as HTMLInputElement)?.value || "",
      handle: (document.getElementById("handle") as HTMLInputElement)?.value || "",
      material: (document.getElementById("material") as HTMLInputElement)?.value || "",
      description: (document.getElementById("description") as HTMLTextAreaElement)?.value || "",
      discountable: (document.querySelector('input[type="checkbox"]') as HTMLInputElement)?.checked || false,
      type: (document.querySelector('[name="type"]') as HTMLInputElement)?.value || "",
      tags: (document.getElementById("tags") as HTMLInputElement)?.value || "",
      width: parseInt((document.getElementById("width") as HTMLInputElement)?.value) || 0,
      length: parseInt((document.getElementById("length") as HTMLInputElement)?.value) || 0,
      height: parseInt((document.getElementById("height") as HTMLInputElement)?.value) || 0,
      weight: parseInt((document.getElementById("weight") as HTMLInputElement)?.value) || 0,
      mid_code: (document.getElementById("midcode") as HTMLInputElement)?.value || "",
      hs_code: (document.getElementById("hscode") as HTMLInputElement)?.value || "",
      origin_country: (document.getElementById("origin_country") as HTMLSelectElement)?.value || "",
      thumbnail: uploadedImages.join(","),
      vendor_id: vendor_id,
    };

    try {
      await createProduct(formData);
      toast.success("Product Created Successfully", { duration: 1000 });
      setTimeout(() => {
        closeModal();
        router.refresh();
      }, 2000);
    } catch (error) {
      toast.error("Error while creating product", { duration: 1000 });
    }
  };

  const renderInputField = (
    id: string,
    label: string,
    placeholder: string,
    type: "text" | "number",
    required = false
  ) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
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
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        rows={rows}
        className="textarea textarea-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
      ></textarea>
    </div>
  );

  const renderSwitchWithLabel = (label: string, description: string) => (
    <div className="col-span-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-base-content">{label}</h1>
        <input type="checkbox" className="toggle toggle-primary" />
      </div>
      <p className="pt-4 text-sm font-semibold text-base-content/70">{description}</p>
    </div>
  );

  return (
    <>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl h-[90vh] overflow-y-auto bg-base-100">
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <button onClick={closeModal} className="btn btn-ghost btn-circle">
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-4">
                {isUploading && <span className="loading loading-spinner text-primary"></span>}
                {uploadError && (
                  <div className="alert alert-error shadow-lg">
                    <span>Error uploading image</span>
                  </div>
                )}
                {isCreating && <span className="loading loading-spinner text-primary"></span>}
                {createError && (
                  <div className="alert alert-error shadow-lg">
                    <span>Error creating product</span>
                  </div>
                )}
                <button className="btn btn-secondary">Save as draft</button>
                <button
                  className="btn btn-primary"
                  onClick={handlePublishClick}
                  disabled={isCreating || isUploading}
                >
                  Publish product
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* General Information */}
                <div className="collapse collapse-arrow bg-base-100 shadow-sm">
                  <input type="checkbox" className="peer" defaultChecked />
                  <div className="collapse-title text-lg font-semibold text-base-content">
                    General Information <span className="text-error text-2xl">*</span>
                  </div>
                  <div className="collapse-content">
                    <p className="text-base-content/70 text-sm pb-6">To start selling Product</p>
                    <div className="grid grid-cols-2 gap-8 mb-4">
                      {renderInputField("title", "Title", "Winter Jackets", "text", true)}
                      {renderInputField("subtitle", "Subtitle", "Warm and Cozy", "text")}
                      {renderInputField("handle", "Handle", "winter-jacket-001", "text", true)}
                      {renderInputField("material", "Material", "Polyester", "text")}
                      {renderTextArea("description", "Description", "Enter a detailed description")}
                      {renderSwitchWithLabel(
                        "This product can be discounted.",
                        "Toggle if this product is eligible for discounts."
                      )}
                    </div>
                  </div>
                </div>

                {/* Organize */}
                <div className="collapse collapse-arrow bg-base-100 shadow-sm">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-lg font-semibold text-base-content">Organize</div>
                  <div className="collapse-content">
                    <div className="pb-15">
                      <div className="grid grid-cols-4 gap-4 my-4">
                        {renderInputField("width", "Width", "10", "number")}
                        {renderInputField("length", "Length", "20", "number")}
                        {renderInputField("height", "Height", "30", "number")}
                        {renderInputField("weight", "Weight", "5", "number")}
                      </div>
                      <p className="text-base-content/70 text-sm">Add tags to help categorize your product.</p>
                    </div>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="Enter tags"
                      className="input input-bordered w-full mt-2 bg-base-100 text-base-content placeholder-base-content/70"
                    />
                  </div>
                </div>

                {/* Customs Information */}
                <div className="collapse collapse-arrow bg-base-100 shadow-sm">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-lg font-semibold text-base-content">Customs Information</div>
                  <div className="collapse-content">
                    <div className="grid grid-cols-2 gap-8">
                      {renderInputField("midcode", "MID Code", "123456", "number")}
                      {renderInputField("hscode", "HS Code", "654321", "number")}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Country of Origin</span>
                        </label>
                        <select
                          id="origin_country"
                          name="origin_country"
                          className="select select-bordered w-full bg-base-100 text-base-content"
                        >
                          {countries.map((country, index) => (
                            <option key={index} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="collapse collapse-arrow bg-base-100 shadow-sm">
                  <input type="checkbox" className="peer" defaultChecked />
                  <div className="collapse-title text-lg font-semibold text-base-content">Media</div>
                  <div className="collapse-content">
                    <p className="text-base-content/70 text-sm pb-6">
                      Used to represent your product during checkout, social sharing, and more.
                    </p>
                    <div
                      className="border-dashed border-2 border-base-300 p-10 rounded-md hover:border-primary"
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
                        <p className="text-base-content/70">
                          Drag and drop an image here or{" "}
                          <span className="text-primary">Click to upload</span>
                          <br />
                          12 x 1600 (3:4) recommended, Up to 10MB each
                        </p>
                      </label>
                    </div>
                    <h1 className="text-base-content font-bold mt-4">Uploaded Images</h1>
                    <div className="mt-4 space-y-2">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-base-200 p-2 rounded-md"
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
                              <p className="text-sm font-semibold text-base-content">{originalFileName}</p>
                              <p className="text-xs text-base-content/70">{(10 / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() =>
                              setUploadedImages((prevImages) =>
                                prevImages.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Toaster />
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductForm;
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

const AddProductForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/vendor/products");
  };
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

    createProduct(formData, {
      onSuccess: () => {
        toast.success("Product Created Successfully", { duration: 1000 });
        setTimeout(() => {
          closeModal();
          router.refresh();
        }, 2000);
      },
      onError: (error) => {
        console.error("Error while creating product:", error);
        toast.error("Error while creating product", { duration: 1000 });
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
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="input input-bordered w-full"
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
        className="textarea textarea-bordered w-full"
      ></textarea>
    </div>
  );

  const renderSwitchWithLabel = (label: string, description: string) => (
    <div className="col-span-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-black">{label}</h1>
        <input type="checkbox" className="toggle" />
      </div>
      <p className="pt-4 text-sm font-semibold text-gray-500">{description}</p>
    </div>
  );

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 h-screen w-screen overflow-auto">
            <div className="flex items-center justify-between p-2 border-b border-gray-300">
              <button onClick={closeModal} className="btn btn-ghost btn-circle">
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-4">
                <button className="btn btn-secondary px-2 py-2">Save as draft</button>
                <button
                  className="btn btn-primary px-2 py-2"
                  onClick={handlePublishClick}
                >
                  Publish product
                </button>
              </div>
            </div>
            <div className="mx-80 mt-32">
              <div className="space-y-4">
                {/* General Information */}
                <div className="collapse collapse-arrow bg-base-100 shadow-sm">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-lg font-semibold">
                    General Information <span className="text-red-500 text-2xl">*</span>
                  </div>
                  <div className="collapse-content">
                    <p className="text-gray-500 text-sm pb-6">To start selling Product</p>
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
                  <div className="collapse-title text-lg font-semibold">Organize</div>
                  <div className="collapse-content">
                    <div className="pb-15">
                      <div className="grid grid-cols-4 gap-4 my-4">
                        {renderInputField("width", "Width", "10", "number")}
                        {renderInputField("length", "Length", "20", "number")}
                        {renderInputField("height", "Height", "30", "number")}
                        {renderInputField("weight", "Weight", "5", "number")}
                      </div>
                      <p className="text-gray-500 text-sm">Add tags to help categorize your product.</p>
                    </div>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="Enter tags"
                      className="input input-bordered w-full mt-2"
                    />
                  </div>
                </div>

                {/* Customs Information */}
                <div className="collapse collapse-arrow bg-base-100 shadow-sm">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-lg font-semibold">Customs Information</div>
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
                          className="select select-bordered w-full"
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
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-lg font-semibold">Media</div>
                  <div className="collapse-content">
                    <p className="text-gray-500 text-sm pb-6">
                      Used to represent your product during checkout, social sharing, and more.
                    </p>
                    <div
                      className="border-dashed border-2 border-gray-300 p-10 rounded-md hover:border-violet-500"
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
                          <span className="text-violet-500">Click to upload</span>
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
                              <p className="text-sm font-semibold">{originalFileName}</p>
                              <p className="text-xs text-gray-500">{(10 / 1024).toFixed(2)} KB</p>
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
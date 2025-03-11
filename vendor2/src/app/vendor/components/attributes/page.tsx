"use client";
import { useGetProduct } from "@/app/hooks/products/useGetProduct";
import { useUpdateProduct } from "@/app/hooks/products/useUpdateProduct";
import { countries } from "@/app/utils/countries";
import { MoreHorizontal, Pencil, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const Attributes = () => {
  const router = useRouter();
  const { id } = useParams();

  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const openAttributeModal = () => setIsAttributeModalOpen(true);
  const closeAttributeModal = () => setIsAttributeModalOpen(false);

  const { data: product, refetch: refetchProduct } = useGetProduct(id as string);
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
        toast.success("Product updated successfully", { duration: 1000 });
        setTimeout(() => {
          router.push("/vendor/products");
        }, 3000);
      },
      onError: () => {
        toast.error("Failed to update product", { duration: 1000 });
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="form-control">
      <label htmlFor={id} className="label">
        <span className="label-text">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full"
        required={required}
      />
    </div>
  );

  return (
    <>
      <Toaster />
      <div className="p-6 mt-4 bg-white shadow-md rounded-lg sm:w-[398px] md:w-[532px] lg:w-[800px]">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">Attributes</h2>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <MoreHorizontal className="w-6 h-6 text-gray-500" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button onClick={openAttributeModal} className="flex items-center">
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit Attributes</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        {isAttributeModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 sm:w-[372px] sm:h-[476px] md:w-[572px] md:h-[516px]">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">Edit Attributes</h2>
                <button onClick={closeAttributeModal} className="btn btn-ghost btn-circle">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <hr className="my-4" />
              <h3 className="font-semibold text-lg pt-4">Dimensions</h3>
              <p className="text-sm text-gray-500">Configure to calculate the most accurate shipping rates</p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-4 my-4">
                  {renderInputField("width", "Width", "0", "number", false, productFormData.width, handleInputChange)}
                  {renderInputField("length", "Length", "0", "number", false, productFormData.length, handleInputChange)}
                  {renderInputField("height", "Height", "0", "number", false, productFormData.height, handleInputChange)}
                  {renderInputField("weight", "Weight", "0", "number", false, productFormData.weight, handleInputChange)}
                </div>
                <h3 className="font-semibold text-lg pt-4">Customs</h3>
                <p className="text-sm text-gray-500 mb-4">Configure to calculate the most accurate shipping rates</p>
                <div className="grid grid-cols-2 gap-2">
                  {renderInputField("mid_code", "MID Code", "123456", "number", false, productFormData.mid_code, handleInputChange)}
                  {renderInputField("hs_code", "HS Code", "654321", "number", false, productFormData.hs_code, handleInputChange)}
                </div>
                <div className="form-control w-52 mt-4">
                  <label htmlFor="origin_country" className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <select
                    id="origin_country"
                    name="origin_country"
                    className="select select-bordered w-full"
                    value={productFormData.origin_country}
                    onChange={handleInputChange}
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="button" className="btn btn-ghost" onClick={closeAttributeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary ml-2">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold mt-4">Dimensions</h3>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-gray-500">Height:</p>
            <p className="mt-1 text-gray-500 text-[14px] pr-6">{productFormData.height || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-gray-500">Width:</p>
            <p className="mt-1 text-gray-500 text-[14px] pr-6">{productFormData.width || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-gray-500">Length:</p>
            <p className="mt-1 text-gray-500 text-[14px] pr-6">{productFormData.length || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-gray-500">Weight:</p>
            <p className="mt-1 text-gray-500 text-[14px] pr-6">{productFormData.weight || "-"}</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-4">Customs</h3>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-gray-500">MID Code:</p>
            <p className="mt-1 text-gray-500 text-[14px] pr-6">{productFormData.mid_code || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-gray-500">HS Code:</p>
            <p className="mt-1 text-gray-500 text-[14px] pr-6">{productFormData.hs_code || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-gray-500">Country of origin:</p>
            <p className="mt-1 text-gray-500 text-[14px] pr-6">{productFormData.origin_country || "-"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attributes;
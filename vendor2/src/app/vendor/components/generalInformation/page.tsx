"use client";

import { useGetProduct } from "@/app/hooks/products/useGetProduct";
import { useUpdateProduct } from "@/app/hooks/products/useUpdateProduct";
import { MoreHorizontal, Pencil, Layers, Trash2, X, Circle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface ProductUpdateData {
  title?: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  is_giftcard?: boolean;
  status?: string;
  thumbnail?: string;
  material?: string;
  collection_id?: string | null;
  type_id?: string | null;
  discountable?: boolean;
  external_id?: string | null;
  metadata?: Record<string, string>;
  tags?: string; // Added tags property
}

const GeneralInformation = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const { data: product, isLoading: isProductLoading, error: productError } = useGetProduct(id as string);
  const { updateProduct, isLoading: isUpdating, error: updateError } = useUpdateProduct(id as string);
  const [productFormData, setProductFormData] = useState<ProductUpdateData>({});

  useEffect(() => {
    if (product) {
      setProductFormData({
        title: product.title || "",
        subtitle: product.subtitle || "",
        description: product.description || "",
        handle: product.handle || "",
        is_giftcard: product.is_giftcard || false,
        status: product.status || "active",
        thumbnail: product.thumbnail || "",
        material: product.material || "",
        collection_id: product.collection_id || null,
        type_id: product.type_id || null,
        discountable: product.discountable || false,
        external_id: product.external_id || null,
        metadata: product.metadata || {},
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || "",
      });
      // Populate metadata fields if they exist
      const metadata = product.metadata || {};
      const metadataFields = Object.entries(metadata).map(([key, value]) => ({ key, value: String(value) }));
      setFields(metadataFields.length > 0 ? metadataFields : [{ key: "", value: "" }]);
    }
  }, [product]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFieldChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const updatedFields = [...fields];
    updatedFields[index][event.target.name as keyof (typeof updatedFields)[number]] = event.target.value;
    setFields(updatedFields);
  };

  const handleAddField = (index: number, position: string) => {
    const values = [...fields];
    const newField = { key: "", value: "" };
    if (position === "above") {
      values.splice(index, 0, newField);
    } else {
      values.splice(index + 1, 0, newField);
    }
    setFields(values);
  };

  const handleDuplicateField = (index: number) => {
    const values = [...fields];
    values.splice(index, 0, { ...fields[index] });
    setFields(values);
  };

  const handleClearField = (index: number) => {
    const values = [...fields];
    values[index] = { key: "", value: "" };
    setFields(values);
  };

  const handleDeleteField = (index: number) => {
    const values = [...fields];
    if (values.length === 1) {
      setFields([{ key: "", value: "" }]);
    } else {
      values.splice(index, 1);
      setFields(values);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert fields array to metadata object
      const metadata = fields.reduce((acc, field) => {
        if (field.key && field.value) {
          acc[field.key] = field.value;
        }
        return acc;
      }, {} as Record<string, string>);

      // Convert tags string to array if the backend expects an array
      const tagsArray = productFormData.tags
        ? productFormData.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : [];

      // Include metadata and tags in productFormData
      const updatedProductData = {
        ...productFormData,
        metadata,
        tags: tagsArray, // Send tags as an array
      };

      await updateProduct(updatedProductData);
      toast.success("Product updated successfully", { duration: 1000 });
      setTimeout(() => {
        router.push("/vendor/products");
      }, 2000);
    } catch (error) {
      toast.error("Failed to update product", { duration: 1000 });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
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
        value={value}
        onChange={onChange}
        className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
        required={required}
      />
    </div>
  );

  const renderTextArea = (
    id: string,
    label: string,
    placeholder: string,
    rows = 5,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
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
        value={value}
        onChange={onChange}
        className="textarea textarea-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
      ></textarea>
    </div>
  );

  const renderSwitchWithLabel = (label: string, description: string) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-lg font-semibold text-base-content">{label}</h1>
        <p className="pt-2 text-sm text-base-content/70">{description}</p>
      </div>
      <input
        type="checkbox"
        className="toggle toggle-primary mt-2 sm:mt-0"
        checked={productFormData.discountable}
        onChange={(e) =>
          setProductFormData((prev: any) => ({ ...prev, discountable: e.target.checked }))
        }
      />
    </div>
  );

  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error shadow-lg">
          <span>Error loading product data</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-warning shadow-lg">
          <span>Product not found</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 rounded-lg bg-base-100 shadow-md">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-base-content">{productFormData.title || "Product Title"}</h1>
              <p className="mt-2 text-sm text-base-content/70">{productFormData.description || "Description of the product..."}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
              {isUpdating && (
                <span className="loading loading-spinner text-primary"></span>
              )}
              {updateError && (
                <div className="alert alert-error shadow-lg">
                  <span>Failed to update product</span>
                </div>
              )}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <MoreHorizontal className="h-6 w-6 text-base-content/70" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={openModal} className="flex items-center">
                      <Pencil className="mr-2 h-5 w-5" /> Edit General Information
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center">
                      <Layers className="mr-2 h-5 w-5" /> Edit Sales Channels
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center text-error">
                      <Trash2 className="mr-2 h-5 w-5" /> Delete
                    </button>
                  </li>
                </ul>
              </div>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost text-sm md:text-base text-base-content/70 flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      productFormData.status === "published" ? "bg-success" : "bg-error"
                    }`}
                  ></span>
                  {productFormData.status || "Status"}
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button
                      onClick={() =>
                        setProductFormData((prev: any) => ({
                          ...prev,
                          status: productFormData.status === "published" ? "draft" : "published",
                        }))
                      }
                      className="flex items-center"
                    >
                      <Circle
                        className={`mr-2 h-5 w-5 ${
                          productFormData.status === "published" ? "text-error" : "text-success"
                        }`}
                      />
                      {productFormData.status === "published" ? "Draft" : "Published"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-base-content">Details</h3>
          <div className="grid grid-cols-1 gap-1">
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-base-content/70">Subtitle:</p>
              <p className="text-sm text-base-content">{productFormData.subtitle || "-"}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-base-content/70">Handle:</p>
              <p className="text-sm text-base-content">{productFormData.handle || "-"}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-base-content/70">Type:</p>
              <p className="text-sm text-base-content">{productFormData.type_id || "-"}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-base-content/70">Collection:</p>
              <p className="text-sm text-base-content">{productFormData.collection_id || "-"}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-base-content/70">Discountable:</p>
              <p className="text-sm text-base-content">{productFormData.discountable ? "Yes" : "No"}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-base-content/70">Metadata:</p>
              <p className="text-sm text-base-content">
                {Object.keys(productFormData.metadata || {}).length > 0
                  ? Object.entries(productFormData.metadata)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")
                  : "-"}
              </p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-4 mb-2 text-base-content">Sales Channels</h3>
          <div className="space-x-2">
            <button className="btn btn-outline mb-2">Default Sales Channel</button>
            <button className="btn btn-outline mb-2">Part Two</button>
          </div>
          <p className="text-sm text-base-content/70">Available in 2 out of 3 Sales Channels</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl h-[90vh] overflow-y-auto bg-base-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-base-content">Edit General Information</h2>
              <button onClick={closeModal} className="btn btn-ghost btn-circle">
                <X className="h-6 w-6" />
              </button>
            </div>
            <hr className="mb-4 border-base-300" />
            {isUpdating && (
              <div className="flex justify-center mb-4">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {updateError && (
              <div className="alert alert-error shadow-lg mb-4">
                <span>Failed to update product</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {renderInputField(
                  "title",
                  "Title",
                  "title",
                  "text",
                  true,
                  productFormData.title || "",
                  handleInputChange
                )}
                {renderInputField(
                  "subtitle",
                  "Subtitle",
                  "subtitle",
                  "text",
                  false,
                  productFormData.subtitle || "",
                  handleInputChange
                )}
              </div>
              <p className="text-sm text-base-content/70 mb-4">
                Give your product a short and clear title. <br />
                50-60 characters is the recommended length for search engines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {renderInputField(
                  "handle",
                  "Handle",
                  "handle",
                  "text",
                  true,
                  productFormData.handle || "",
                  handleInputChange
                )}
                {renderInputField(
                  "material",
                  "Material",
                  "material",
                  "text",
                  false,
                  productFormData.material || "",
                  handleInputChange
                )}
              </div>
              <div className="mb-4">
                {renderTextArea(
                  "description",
                  "Description",
                  "Enter a detailed description",
                  5,
                  productFormData.description || "",
                  handleTextAreaChange
                )}
              </div>
              <p className="text-sm text-base-content/70 mb-4">
                Give your product a short and clear description. <br />
                120-160 characters is the recommended length for search engines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Type</span></label>
                  <select
                    className="select select-bordered w-full bg-base-100 text-base-content"
                    value={productFormData.type_id || ""}
                    onChange={(e) =>
                      setProductFormData((prev: any) => ({ ...prev, type_id: e.target.value }))
                    }
                  >
                    <option value="">No options</option>
                    {/* Add actual type options if available */}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Collection</span></label>
                  <select
                    className="select select-bordered w-full bg-base-100 text-base-content"
                    value={productFormData.collection_id || ""}
                    onChange={(e) =>
                      setProductFormData((prev: any) => ({ ...prev, collection_id: e.target.value }))
                    }
                  >
                    <option value="">Select a collection</option>
                    <option value="merch">Merch</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="label"><span className="label-text">Tags (comma separated)</span></label>
                <input
                  type="text"
                  id="tags"
                  className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
                  placeholder="Add tags"
                  value={productFormData.tags || ""}
                  onChange={(e) =>
                    setProductFormData((prev: any) => ({ ...prev, tags: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                {renderSwitchWithLabel(
                  "Discountable",
                  "When unchecked discounts will not be applied to this product."
                )}
              </div>
              <h2 className="text-sm font-semibold mt-4 mb-2 text-base-content">Metadata</h2>
              <div className="space-y-4 border border-base-300 rounded-md">
                <table className="min-w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-base-content">Key</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-base-content">Value</th>
                      <th className="px-2 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-base-100 divide-y divide-base-300">
                    {fields.map((field, index) => (
                      <tr key={index}>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            name="key"
                            placeholder="Key"
                            value={field.key}
                            onChange={(event) => handleFieldChange(index, event)}
                            className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            name="value"
                            placeholder="Value"
                            value={field.value}
                            onChange={(event) => handleFieldChange(index, event)}
                            className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle">
                              <MoreHorizontal className="h-5 w-5" />
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                              <li>
                                <button onClick={() => handleAddField(index, "above")}>Insert above</button>
                              </li>
                              <li>
                                <button onClick={() => handleAddField(index, "below")}>Insert below</button>
                              </li>
                              <li>
                                <button onClick={() => handleDuplicateField(index)}>Duplicate</button>
                              </li>
                              <li>
                                <button onClick={() => handleClearField(index)}>Clear contents</button>
                              </li>
                              <li>
                                <button onClick={() => handleDeleteField(index)}>Delete</button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default GeneralInformation;
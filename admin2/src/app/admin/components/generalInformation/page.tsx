"use client";
import { useGetProduct } from "@/app/hooks/products/useGetProduct";
import { useUpdateProduct } from "@/app/hooks/products/useUpdateProduct";
import {
  EllipsisHorizontal,
  PencilSquare,
  Channels,
  Trash,
  XMarkMini,
  EllipseRedSolid,
  EllipseGreenSolid,
} from "@medusajs/icons";
import {
  DropdownMenu,
  IconButton,
  Button,
  Heading,
  Input,
  Label,
  Switch,
  toast,
  StatusBadge,
} from "@medusajs/ui";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const GeneralInformation = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const { data: product, refetch: refetchProduct } = useGetProduct(
    id as string
  );
  const { mutate: updateProduct } = useUpdateProduct(
    id as string
    // product as any
  );
  const [productFormData, setProductFormData] = useState<any>({});

  const handleFieldChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedFields = [...fields];
    updatedFields[index][
      event.target.name as keyof (typeof updatedFields)[number]
    ] = event.target.value;
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
    values.splice(index, 1);
    setFields(values);
  };

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

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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

  const renderTextArea = (
    id: string,
    label: string,
    placeholder: string,
    rows = 5,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
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
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
      ></textarea>
    </div>
  );

  const renderSwitchWithLabel = (label: string, description: string) => (
    <>
      <div className="flex flex-row justify-between">
        <div className="">
          <h1 className="text-lg font-semibold text-black">{label}</h1>
          <p className="pt-4 text-sm font-semibold text-gray-500">
            {description}
          </p>
        </div>
        <div>
          <Switch />
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="p-4 rounded-lg">
        <div>
          <div className="flex flex-row justify-between items-start mb-4">
            <div className="flex flex-col">
              <h1 className="text-[24px] font-bold">
                {productFormData.title || "Product Title"}
              </h1>
              <p className="mt-2 text-[14px] text-[rgb(107, 114, 128)] font-normal">
                {productFormData.description || "Description of the product..."}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              
              <div className="pt-6 px-2"> 
              
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <IconButton
                      variant="transparent"
                      className="rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-300 active:bg-gray-200"
                    >
                      <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className=" bg-white ">
                    <DropdownMenu.Item className="bg-white text-[13px] font-semibold text-gray-900  hover:bg-gray-100">
                      <Button variant="transparent" onClick={openModal}>
                        <PencilSquare className="mr-2" />
                        Edit General Information
                      </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="bg-white text-[13px] font-semibold text-gray-900  hover:bg-gray-100">
                      <Button variant="transparent">
                        <Channels className="mr-2" />
                        Edit Sales Channels
                      </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="bg-white text-[13px] font-semibold text-red-500  hover:bg-gray-100">
                      <Button variant="transparent">
                        <Trash className="mr-2" />
                        Delete
                      </Button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
             


              <DropdownMenu>
                <DropdownMenu.Trigger asChild className="hover:cursor-pointer">
                  <p className="text-gray-500 sm:text-[14px] md:text-[16px]">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 mt-8 inline-block ${
                        productFormData.status === "published"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {productFormData.status || "Status"}
                  </p>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item className="gap-x-2">
                    <span>
                       {productFormData.status === "published" ? (
                        <EllipseRedSolid />
                      ) : (
                        <EllipseGreenSolid />
                      )}
                    </span>
                    {productFormData.status === "published" ? ("Draft") : ("Published")}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
              </div>
            </div>
          </div>
          <Heading level="h3" className="mb-2">
            Details
          </Heading>
          <div className="grid grid-cols-1 gap-1">
            <div className="mb-2 flex flex-row justify-between">
              <p className="text-sm font-normal ext-[rgb(107, 114, 128)]">
                Subtitle:
              </p>
              <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px]">
                {productFormData.subtitle || "-"}
              </p>
            </div>

            <div className="mb-2 flex flex-row justify-between">
              <p className="text-sm font-normal ext-[rgb(107, 114, 128)]">
                Handle:
              </p>
              <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px]">
                {productFormData.handle || "-"}
              </p>
            </div>
            <div className="mb-2 flex flex-row justify-between">
              <p className="text-sm font-normal ext-[rgb(107, 114, 128)]">
                Type:
              </p>
              <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
                {"-"}
              </p>
            </div>
            <div className="mb-2 flex flex-row justify-between">
              <p className="text-sm font-normal ext-[rgb(107, 114, 128)]">
                Collection:
              </p>
              <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
                {productFormData.collection_id || "-"}
              </p>
            </div>
            <div className="mb-2 flex flex-row justify-between">
              <p className="text-sm font-normal ext-[rgb(107, 114, 128)]">
                Discountable:
              </p>
              <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
                {productFormData.discountable || "-"}
              </p>
            </div>

            <div className="mb-2 flex flex-row justify-between">
              <p className="text-sm font-normal ext-[rgb(107, 114, 128)]">
                Metadata:
              </p>
              <p className="mt-1 text-[rgb(107, 114, 128)] text-[14px] pr-6">
                {"-"}
              </p>
            </div>
          </div>
        </div>
        <Heading level="h3" className="mb-2">
          Sales channels
        </Heading>
        <Button variant="transparent" className="border mr-2 mb-2">
          Default Sales Channel
        </Button>
        <Button variant="transparent" className="border">
          Part Two
        </Button>
        <p className="text-[14px] text-[rgb(107, 114, 128)] mb-4">
          Available in 2 out of 3 Sales Channels
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 sm:w-[372px] sm:h-[476px] md:w-[572px] md:h-[586px] overflow-y-auto">
            <div className="flex flex-row justify-between items-center mb-4">
              <Heading level="h2" className="text-lg sm:text-xl font-semibold">
                Edit General Information
              </Heading>
              <IconButton variant="transparent">
                <XMarkMini onClick={closeModal} />
              </IconButton>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
                <div>
                  {renderInputField(
                    "title",
                    "Title",
                    "title",
                    "text",
                    true,
                    productFormData.title,
                    handleInputChange
                  )}
                </div>
                <div>
                  {renderInputField(
                    "subtitle",
                    "Subtitle",
                    "subtitle",
                    "text",
                    false,
                    productFormData.subtitle,
                    handleInputChange
                  )}
                </div>
              </div>
              <div className="w-full text-sm text-gray-500 mb-4">
                Give your product a short and clear title. <br />
                50-60 characters is the recommended length for search engines.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  {renderInputField(
                    "handle",
                    "Handle",
                    "handle",
                    "text",
                    true,
                    productFormData.handle,
                    handleInputChange
                  )}
                </div>
                <div>
                  {renderInputField(
                    "material",
                    "Material",
                    "material",
                    "text",
                    false,
                    productFormData.material,
                    handleInputChange
                  )}
                </div>
              </div>
              <div className="mb-4">
                {renderTextArea(
                  "description",
                  "Description",
                  "Enter a detailed description",
                  5,
                  productFormData.description,
                  handleTextAreaChange
                )}
              </div>
              <div className="w-full text-sm text-gray-500 mb-4">
                Give your product a short and clear description. <br />
                120-160 characters is the recommended length for search engines.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label
                    htmlFor="product-type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type
                  </Label>
                  <select
                    id="product-type"
                    className="mt-1 text-sm p-2 w-full border focus:border-violet-500 rounded-md shadow-sm"
                  >
                    <option value="no-options">No options</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="collection"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Collection
                  </Label>
                  <select
                    id="collection"
                    className="mt-1 text-sm p-2 w-full border focus:border-violet-500 rounded-md shadow-sm"
                  >
                    <option value="merch">Merch</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma separated)
                </Label>
                <Input
                  type="text"
                  id="tags"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Add tags"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between mt-4">
                {renderSwitchWithLabel(
                  "Discountable",
                  "When unchecked discounts will not be applied to this product."
                )}
              </div>
              <Heading level="h2" className="text-sm pt-4 font-semibold">
                Metadata
              </Heading>
              <div className="space-y-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-900">
                        Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fields.map((field, index) => (
                      <tr key={index}>
                        <td className="px-2 py-3 whitespace-nowrap">
                          <Input
                            type="text"
                            name="key"
                            placeholder="Key"
                            value={field.key}
                            onChange={(event) =>
                              handleFieldChange(index, event)
                            }
                            className="border p-2 rounded w-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="text"
                            name="value"
                            placeholder="Value"
                            value={field.value}
                            onChange={(event) =>
                              handleFieldChange(index, event)
                            }
                            className="border p-2 rounded w-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenu.Trigger asChild>
                                <IconButton variant="transparent">
                                  <EllipsisHorizontal />
                                </IconButton>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Content>
                                <DropdownMenu.Item>
                                  <Button
                                    variant="transparent"
                                    onClick={() =>
                                      handleAddField(index, "above")
                                    }
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    Insert above
                                  </Button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                  <Button
                                    variant="transparent"
                                    onClick={() =>
                                      handleAddField(index, "below")
                                    }
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    Insert below
                                  </Button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                  <Button
                                    variant="transparent"
                                    onClick={() => handleDuplicateField(index)}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    Duplicate
                                  </Button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                  <Button
                                    variant="transparent"
                                    onClick={() => handleClearField(index)}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    Clear contents
                                  </Button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                  <Button
                                    variant="transparent"
                                    onClick={() => handleDeleteField(index)}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    Delete
                                  </Button>
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="transparent"
                  className="ml-2 px-6 py-2 border-none rounded-md outline-none text-white font-bold bg-violet-600 hover:bg-violet-500"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GeneralInformation;

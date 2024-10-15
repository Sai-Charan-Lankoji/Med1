"use client"
import { useDeleteImage } from "@/app/hooks/products/useDeleteImage";
import { useGetProduct } from "@/app/hooks/products/useGetProduct";
import { useUpdateProduct } from "@/app/hooks/products/useUpdateProduct";
import { useUploadImage } from "@/app/hooks/products/useUploadImage";
import { Trash, XMarkMini, EllipsisHorizontal } from "@medusajs/icons";
import { Button, DropdownMenu, Heading, IconButton, toast, Tooltip, Text } from "@medusajs/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const Thumbnail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isProductImageDelete, setIsProductDeleteImage] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [originalFileName, setOriginalFileName] = useState("");
  const { data: product, refetch: refetchProduct } = useGetProduct(id as string);
  const { mutate: uploadImage } = useUploadImage();
  const { mutate: deleteImage } = useDeleteImage();
  const { mutate: updateProduct } = useUpdateProduct(id as string);
  const [productFormData, setProductFormData] = useState<any>({});

  useEffect(() => {
    const isDeleted = sessionStorage.getItem(`isProductImageDelete_${id}`);
    if (isDeleted) {
      setIsProductDeleteImage(JSON.parse(isDeleted));
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      setProductFormData({
        title: product.title || "",
        thumbnail: product.thumbnail || "",
      });
    }
  }, [product]);

  const handleImageUpload = async (files: FileList) => {
    setIsProductDeleteImage(false);
    sessionStorage.setItem(`isProductImageDelete_${id}`, "false"); 
    const uploadedFilePaths: string[] = [];
    for (const file of Array.from(files)) {
      setOriginalFileName(file.name);
      uploadImage(file, {
        onSuccess: (fileUrl) => {
          uploadedFilePaths.push(fileUrl);
          if (uploadedFilePaths.length === files.length) {
            setUploadedImages((prev) => [...prev, ...uploadedFilePaths]);
            setProductFormData((prev: any) => ({
              ...prev,
              thumbnail: uploadedFilePaths[0],
            }));
          }
        },
        onError: (error) => {
          console.error("Error uploading image:", error);
        },
      });
    }
  };

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
  const handleDeleteThumbnail = () => {
    deleteImage(id, {
      onSuccess: () => {
        toast.success("Success", {
          description: "Image deleted successfully",
          duration: 1000,
        })
        setIsProductDeleteImage(true);
        sessionStorage.setItem(`isProductImageDelete_${id}`, "true");
      },
      onError: () => {
        toast.error("Error", {
          description: "Failed to delete image",
          duration: 1000,
        })
      },
    });
  };

  const restoreImageState = () => {
    setIsProductDeleteImage(false);
    sessionStorage.removeItem(`isProductImageDelete_${id}`);
  };

  return (
    <>
      <div className="p-4 bg-white shadow-md rounded-lg sm:w-[398px] md:w-[532px] sm:h-[200px] lg:w-[322px]">
        <div className="flex flex-row justify-between mt-2">
          <Heading className="text-[24px] mb-2">Thumbnail</Heading>
          <div className="flex flex-row justify-center">
            {isProductImageDelete ? (
              <Button
                onClick={openImageModal}
                size="base"
                variant="transparent"
                className="border"
              >
                Upload
              </Button>
            ) : (
              <>
                <Button
                  onClick={openImageModal}
                  size="base"
                  variant="transparent"
                  className="border"
                >
                  Edit
                </Button>
                <Tooltip content="Are you sure?">
                  <Button
                    variant="transparent"
                    size="base"
                    className="border ml-2 mt-0.5"
                    onClick={handleDeleteThumbnail}
                  >
                    <Trash className="text-[rgb(107, 114, 128)]" />
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        </div>

        <div>
          {isProductImageDelete ? (
            ""
          ) : (
            <Image
              src={productFormData?.thumbnail}
              alt={productFormData.title || "image"}
              width={80}
              height={80}
              className="rounded-md"
            />
          )}
        </div>
      </div>

      {/* Modal for uploading image */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 sm:w-[332px] sm:h-[576px] md:w-[512px] md:h-[532px] lg:w-[672px] lg:h-auto">
            <div className="flex flex-row justify-between">
              <Heading className="text-[24px] font-semibold mb-4">Upload Thumbnail</Heading>
              <IconButton variant="transparent">
                <XMarkMini onClick={closeImageModal} />
              </IconButton>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
              {/* Upload Form */}
              <div className="grid grid-cols-1 gap-1 mb-4 mt-6">
                <div className="pb-6">
                  <Heading className="text-[18px] font-bold text-slate-700">Thumbnail</Heading>
                  <Text className="text-gray-400 text-[15px] font-normal">
                    Used to represent your product during checkout, social sharing, and more.
                  </Text>
                </div>

                <div
                  className="border-dashed hover:border-violet-500 border-2 border-gray-300 p-10 rounded-md"
                  onDragOver={(e) => e.preventDefault()}
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
                      Drag and drop an image here or <span className="text-violet-500">Click to upload</span>
                      <br />
                      12 X 1600 (3:4) recommended, Up to 10MB each
                    </p>
                  </label>
                </div>

                {isProductImageDelete ? (
                  ""
                ) : (
                  <>
                    <h1 className="text-gray-900 font-bold mt-4">Upload</h1>
                    <div className="mx-8">
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2 sm:h-[76px]">
                        <div className="flex items-center">
                            <Image
                              src={
                                productFormData.thumbnail ||
                                uploadedImages[uploadedImages.length - 1]
                              }
                              alt={productFormData.title}
                              className="object-cover rounded"
                              width={50}
                              height={50}
                            />
                            <div className="ml-4">
                              <p className="text-sm font-semibold">
                                {`${originalFileName}` || `${productFormData.title}`}
                              </p>
                              <p className="text-xs text-gray-500">{(10 / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenu.Trigger>
                            <EllipsisHorizontal />
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item>
                              <Button
                                onClick={handleDeleteThumbnail}
                                variant="transparent"
                                className="text-red-600"
                              >
                                <Trash className="mr-2 tex-red-500" /> Delete
                              </Button>
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-4">
                  <Button variant="secondary" onClick={restoreImageState}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="ml-2">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Thumbnail;

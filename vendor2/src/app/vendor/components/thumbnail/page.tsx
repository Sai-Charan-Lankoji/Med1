"use client";

import { useDeleteImage } from "@/app/hooks/products/useDeleteImage";
import { useGetProduct } from "@/app/hooks/products/useGetProduct";
import { useUpdateProduct } from "@/app/hooks/products/useUpdateProduct";
import { useUploadImage } from "@/app/hooks/products/useUploadImage";
import { Trash2, X, MoreHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

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

  const handleDeleteThumbnail = () => {
    deleteImage(id, {
      onSuccess: () => {
        toast.success("Image deleted successfully", { duration: 1000 });
        setIsProductDeleteImage(true);
        sessionStorage.setItem(`isProductImageDelete_${id}`, "true");
      },
      onError: () => {
        toast.error("Failed to delete image", { duration: 1000 });
      },
    });
  };

  const restoreImageState = () => {
    setIsProductDeleteImage(false);
    sessionStorage.removeItem(`isProductImageDelete_${id}`);
  };

  return (
    <>
      <div className="p-4 bg-white shadow-md rounded-lg w-full sm:w-[398px] md:w-[532px] lg:w-[322px] h-[200px]">
        <div className="flex flex-row justify-between mt-2">
          <h2 className="text-2xl font-semibold mb-2">Thumbnail</h2>
          <div className="flex flex-row justify-center gap-2">
            {isProductImageDelete ? (
              <button
                onClick={openImageModal}
                className="btn btn-outline btn-sm"
              >
                Upload
              </button>
            ) : (
              <>
                <button
                  onClick={openImageModal}
                  className="btn btn-outline btn-sm"
                >
                  Edit
                </button>
                <div className="tooltip" data-tip="Are you sure?">
                  <button
                    onClick={handleDeleteThumbnail}
                    className="btn btn-ghost btn-sm"
                  >
                    <Trash2 className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          {!isProductImageDelete && productFormData.thumbnail && (
            <Image
              src={productFormData.thumbnail}
              alt={productFormData.title || "image"}
              width={80}
              height={80}
              className="rounded-md"
            />
          )}
        </div>
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-[672px] max-h-[90vh] overflow-y-auto">
            <div className="flex flex-row justify-between mb-4">
              <h2 className="text-2xl font-semibold">Upload Thumbnail</h2>
              <button onClick={closeImageModal} className="btn btn-ghost btn-circle">
                <X className="h-5 w-5" />
              </button>
            </div>
            <hr className="mb-6" />
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="pb-6">
                  <h3 className="text-lg font-bold text-slate-700">Thumbnail</h3>
                  <p className="text-gray-400 text-sm font-normal">
                    Used to represent your product during checkout, social sharing, and more.
                  </p>
                </div>

                <div
                  className="border-dashed border-2 border-gray-300 hover:border-violet-500 p-10 rounded-md flex justify-center items-center"
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
                    className="cursor-pointer flex flex-col items-center justify-center text-center"
                  >
                    <p className="text-gray-500">
                      Drag and drop an image here or{" "}
                      <span className="text-violet-500">Click to upload</span>
                      <br />
                      12 x 1600 (3:4) recommended, Up to 10MB each
                    </p>
                  </label>
                </div>

                {!isProductImageDelete && (productFormData.thumbnail || uploadedImages.length > 0) && (
                  <>
                    <h3 className="text-gray-900 font-bold mt-4">Upload</h3>
                    <div className="mx-8">
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2">
                        <div className="flex items-center">
                          <Image
                            src={
                              productFormData.thumbnail ||
                              uploadedImages[uploadedImages.length - 1]
                            }
                            alt={productFormData.title || "thumbnail"}
                            className="object-cover rounded"
                            width={50}
                            height={50}
                          />
                          <div className="ml-4">
                            <p className="text-sm font-semibold">
                              {originalFileName || productFormData.title || "Thumbnail"}
                            </p>
                            <p className="text-xs text-gray-500">{(10 / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <MoreHorizontal className="h-5 w-5" />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <button
                                onClick={handleDeleteThumbnail}
                                className="flex items-center text-red-500"
                              >
                                <Trash2 className="mr-2 h-5 w-5" />
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-4 space-x-2">
                  <button onClick={restoreImageState} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
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
"use client";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { DropdownMenu, IconButton, toast } from "@medusajs/ui";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "../../products/page";
import { useDeleteProduct } from "@/app/hooks/products/useDeleteProduct";

const ProductTableView = ({
  currentProducts,
}: {
  currentProducts: Product[];
}) => {
  const { mutate: deleteProduct } = useDeleteProduct();
  const router = useRouter();

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteProduct(id, {
      onSuccess: () => {
        toast.success("Success", {
          description: "Product Deleted Successfully",
          duration: 1000,
        })
        setTimeout(() => {
          router.refresh();
        }, 2000);
      },
      onError: (err) => {
        console.error("An error occurred:", err);
      },
    });
  };

  return (
    <table className="min-w-full bg-transparent border-collapse">
      <thead className="border-b border-gray-300">
        <tr>
          <th className="px-2 py-2 text-start text-xs font-medium text-gray-700">
            Name
          </th>
          <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">
            Collection
          </th>
          <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">
            Status
          </th>
          <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">
            Material
          </th>
          <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">
            Country Code
          </th>
          <th className="px-2 py-2 text-center text-xs font-medium text-gray-700">
          </th>
        </tr>
      </thead>
      <tbody>
        {currentProducts.map((product) => (
          <tr
            onClick={() => {
              router.push(`/vendor/products/productsPage/${product.id}`);
            }}
            key={product.id}
            className="hover:bg-gray-100 cursor-pointer"
          >
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300 flex justify-start items-center">
              <div className="w-12 h-12 mr-4">
                <Image
                  src={product.thumbnail  || ""}
                  alt={product.title}
                  className="rounded-md object-cover"
                  width={48}
                  height={48}
                  style={{ objectFit: "cover", width: "48px", height: "48px" }}
                  priority

                />
              
              </div>
              {product.title}
            </td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b text-center border-gray-300">
              {product?.collection_id}
            </td>
            <td className="px-4 py-[13px] text-[12px] border-b border-gray-300 text-center">
              <span
                className={`w-2.5 h-2.5 rounded-full mr-2 inline-block ${
                  product.status === "published" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {product.status}
            </td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300 text-center">
              {product.material}
            </td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300 text-center">
              {product.origin_country}
            </td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b text-end border-gray-300 ">
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <IconButton
                    variant="transparent"
                    className="rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-300 active:bg-gray-200"
                  >
                    <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-white">
                  <DropdownMenu.Label>Actions</DropdownMenu.Label>
                  <DropdownMenu.Item
                    className="bg-white text-slate-900 hover:bg-gray-200"
                    onClick={() => {
                      router.push(
                        `/vendor/products/productsPage/${product.id}`
                      );
                    }}
                  >
                    <PencilSquare className="mr-2" />
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={(event) => handleDelete(product.id, event)}
                    className="bg-white text-slate-900 hover:bg-gray-200"
                  >
                    <Trash className="mr-2" />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTableView;

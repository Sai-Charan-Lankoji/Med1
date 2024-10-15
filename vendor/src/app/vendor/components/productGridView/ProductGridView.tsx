"use client";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { DropdownMenu, IconButton } from "@medusajs/ui";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "../../products/productsPage/page";
import { useDeleteProduct } from "@/app/hooks/products/useDeleteProduct";
// import { useState } from "react";

interface ProductGridViewProps {
  currentProducts: Product[];
}

const ProductGridView: React.FC<ProductGridViewProps> = ({
  currentProducts,
}) => {
  // const [products, setProducts] = useState<Product[]>([]);
  const { mutate: deleteProduct } = useDeleteProduct();
  const router = useRouter();

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    deleteProduct(id, {
      onSuccess: () => {
        console.log("Product deleted successfully");
        router.refresh(); // Refresh the page after deleting
      },
      onError: (err) => {
        console.error("An error occurred:", err);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {currentProducts.map((product) => (
        <div
          key={product.id}
          onClick={() =>
            router.push(`/vendor/products/productsPage/${product.id}`)
          }
          className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col cursor-pointer transition hover:shadow-lg relative"
        >
          <div className="flex justify-between items-start relative">
            <div className="relative w-full h-40">
              <Image
                src={product.thumbnail || ""}
                alt={product.title}
                fill
                className="rounded-md object-cover"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
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
                        router.push(`/vendor/products/productsPage/${product.id}`);
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
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 truncate">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {product.description}
            </p>
          </div>
          <div className="mt-auto flex justify-between items-center">
            <span
              className={`w-2.5 h-2.5 rounded-full mr-2 inline-block ${
                product.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm text-gray-500">{product.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridView;

"use client"; // Ensure the component is client-side

import { Container, Table } from "@medusajs/ui";
import React, { useState } from "react";
import { useGetProducts } from "@/app/hooks/products/useGetProducts"; 
import Image from "next/image";

const SalesTable = () => {
  const { data: productsData, error, isLoading } = useGetProducts();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Handle the "Select All" checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allProductIds = productsData?.map((product: any) => product.id) || [];
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle individual checkbox selection
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const isAllSelected = productsData?.length > 0 && selectedProducts.length === productsData.length;

  return (
    <>
      <Container>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <input
                  type="checkbox"
                  id="select-all"
                  className="border border-gray-200 text-violet-700"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </Table.HeaderCell>
              <Table.HeaderCell className="text-gray-500 text-sm">Name</Table.HeaderCell>
              <Table.HeaderCell className="text-gray-500 text-sm">Collection</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productsData?.map((product: any) => (
              <Table.Row key={product.id}>
                <Table.Cell>
                  <input
                    type="checkbox"
                    id={`select-${product.id}`}
                    className="border border-gray-300 text-violet-700 text-center"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </Table.Cell>
                <Table.Cell className="text-center text-sm text-gray-500 flex justify-start items-center">
                  <div className="w-12 h-12 mr-4">
                    <Image
                      src={product.thumbnail || ""}
                      alt={product.title}
                      className="rounded-md object-cover w-auto h-auto"
                      width={30}
                      height={20}
                      priority
                    />
                  </div>
                  {product.title}
                </Table.Cell>
                <Table.Cell className="text-center">{product.collection || "-"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </>
  );
};

export default SalesTable;

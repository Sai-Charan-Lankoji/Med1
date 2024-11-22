"use client";
import React, { useState } from "react";
import {
  Button,
  Container,
  Heading,
  Table,
} from "@medusajs/ui";
import { BackButton } from "@/app/utils/backButton";
import withAuth from "@/lib/withAuth";
import { useGetStores } from "../../../hooks/store/useGetStores";

const PublishableApiKeysTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);
  const pageSize = 6;
  const { data: stores } = useGetStores();

  return (
    <div className="p-4">
      <Container className="py-4 rounded-xl">
        <BackButton name="Settings" />
        <div className="rounded-lg p-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Heading className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Publishable API Keys</Heading>
              <p className="text-gray-600 mt-2 text-sm bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Manage your publishable keys to authenticate API requests.
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-violet-600 text-white hover:bg-violet-700 rounded-lg px-6 py-2 hidden"
            >
              Create API Key
            </Button>
          </div>

          {stores?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No API Keys created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full border border-gray-200 rounded-xl">
                <Table.Header className="bg-gray-100">
                  <Table.Row>
                    <Table.HeaderCell className="px-4 py-3 text-left text-indigo-600 font-semibold">
                      S/No
                    </Table.HeaderCell>
                    <Table.HeaderCell className="px-4 py-3 text-left text-indigo-600 font-semibold">
                      Name
                    </Table.HeaderCell>
                    <Table.HeaderCell className="px-4 py-3 text-left text-indigo-600 font-semibold">
                      Token
                    </Table.HeaderCell>
                    <Table.HeaderCell className="px-4 py-3 text-left text-indigo-600 font-semibold">
                      Created
                    </Table.HeaderCell>
                    <Table.HeaderCell className="px-4 py-3 text-left text-indigo-600 font-semibold">
                      Status
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {stores?.map((apiKey, index) => (
                    <Table.Row
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <Table.Cell className="px-4 py-3 text-violet-800">{index + 1}</Table.Cell>
                      <Table.Cell className="px-4 py-3 text-violet-800">{apiKey.name}</Table.Cell>
                      <Table.Cell className="px-4 py-3 text-violet-800">{apiKey.publishableapikey}</Table.Cell>
                      <Table.Cell className="px-4 py-3 text-violet-800">
                        {new Date(apiKey.created_at).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            apiKey.revoked_at ? "bg-red-500" : "bg-green-500"
                          }`}
                        ></span>
                        {apiKey.revoked_at ? "Revoked" : "Live"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      </Container>      
    </div>
  );
};

export default withAuth(PublishableApiKeysTable);

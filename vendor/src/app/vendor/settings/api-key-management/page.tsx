"use client";
import React, { useMemo, useState } from "react";
import {
  Button,
  Container,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Input,
  Label,
  Table,
  Text,
} from "@medusajs/ui";
import { EllipsisHorizontal } from "@medusajs/icons";
import Pagination from "../../../utils/pagination";
import { BackButton } from "@/app/utils/backButton";
import withAuth from "@/lib/withAuth";
import { useGetPublishableApiKeys } from "@/app/hooks/publishableapikey/useGetpublishableapikeys";

const PublishableApiKeysTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);
  const [apiKeyTitle, setApiKeyTitle] = useState("");
  const companyName = sessionStorage.getItem('company_name')
  const pageSize = 6;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    data: publishableapikeyData,
    error,
    isLoading,
  } = useGetPublishableApiKeys();
  console.log("PublishableApiKeys:", publishableapikeyData);
  const records = publishableapikeyData;
  console.log("Records ", records)
// Find the record with a matching title
  const matchingRecord = records?.map(record => record.title === companyName);

console.log("Hi ",matchingRecord);
  const toggleCustomDrawer = () => {
    setIsCustomDrawerOpen(!isCustomDrawerOpen);
  };

  // Paginate API key data
   
  // return (
  //   <div>
  //     <BackButton name="Settings" />
  //     <div className="flex flex-col gap-y-2">
  //       <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg overflow-hidden p-0">
  //         <Container className="overflow-hidden p-0">
  //           <div className="flex items-center justify-between px-8 pt-6 pb-4">
  //             <div>
  //               <Heading className="text-2xl">Publishable API Keys</Heading>
  //               <p className="text-gray-500 text-sm mt-2">
  //                 These publishable keys will allow you to authenticate API
  //                 requests.
  //               </p>
  //             </div>

  //             <div className="flex items-center gap-x-2">
  //               <FocusModal>
  //                 <FocusModal.Trigger asChild>
  //                   <Button variant="secondary" className="border">
  //                     Create API key
  //                   </Button>
  //                 </FocusModal.Trigger>
  //                 <FocusModal.Content>
  //                   <FocusModal.Header className="bg-white">
  //                     <Button
  //                       variant="secondary"
  //                       className="bg-violet-500 text-white"
  //                     >
  //                       Publish API key
  //                     </Button>
  //                   </FocusModal.Header>
  //                   <FocusModal.Body className="flex flex-col items-center py-16 bg-white">
  //                     <div className="flex w-full max-w-lg flex-col gap-y-8">
  //                       <div className="flex flex-col gap-y-1">
  //                         <Heading className="text-[24px] font-semibold">
  //                           Create API key
  //                         </Heading>
  //                         <Text className="text-[16px] text-gray-900 font-semibold pt-4">
  //                           General Information
  //                         </Text>
  //                         <Text className="text-ui-fg-subtle">
  //                           Create and manage API keys. Right now this is only
  //                           related to sales channels.
  //                         </Text>
  //                       </div>
  //                       <div className="flex flex-col gap-y-2">
  //                         <Label
  //                           htmlFor="key_name"
  //                           className="text-ui-fg-subtle"
  //                         >
  //                           Title
  //                         </Label>
  //                         <Input
  //                           id="key_name"
  //                           placeholder="Name your key"
  //                           className="py-5  hover:border-violet-600 focus:border-violet-600 border"
  //                           value={apiKeyTitle}
  //                           onChange={(e) => setApiKeyTitle(e.target.value)}
  //                         />
  //                       </div>
  //                       <hr />
  //                     </div>
  //                     <div className="flex flex-row justify-between space-x-2 m-4">
  //                       <div className="flex-col">
  //                         <Heading>Sales channels</Heading>
  //                         <Text>
  //                           Connect as many sales channels to your API key as
  //                           you need.
  //                         </Text>
  //                       </div>
  //                       <div>
  //                         <Button
  //                           variant="secondary"
  //                           className="mt-4 text-sm border border-gray-200 hover:bg-gray-100"
  //                           onClick={toggleCustomDrawer}
  //                         >
  //                           Add sales channels
  //                         </Button>
  //                       </div>
  //                     </div>
  //                   </FocusModal.Body>
  //                 </FocusModal.Content>
  //               </FocusModal>
  //             </div>
  //           </div>

  //           {/* Table for API keys */}
  //           <div className="flex flex-col gap-4 p-8">
  //             {filteredPublishableApiKey?.length === 0 ? (
  //               <div className="text-center text-gray-500 py-8">
  //                 <p>No API Keys created yet</p>
  //               </div>
  //             ) : (
  //               <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
  //                 <Table className="min-w-full bg-transparent">
  //                   <Table.Header className="bg-gray-100 border-b border-gray-300">
  //                     <Table.Row>
  //                       <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 Table.Rowacking-wider">
  //                         S/No
  //                       </Table.HeaderCell>
  //                       <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
  //                         Name
  //                       </Table.HeaderCell>
  //                       <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
  //                         Token
  //                       </Table.HeaderCell>
  //                       <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
  //                         Created
  //                       </Table.HeaderCell>
  //                       <Table.HeaderCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
  //                         Status
  //                       </Table.HeaderCell>
  //                     </Table.Row>
  //                   </Table.Header>
  //                   <Table.Body>
  //                     {filteredPublishableApiKey?.map((apiKey, index) => (
  //                       <Table.Row key={index} className="hover:bg-gray-100">
  //                         <Table.Cell className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
  //                           {index + 1 + currentPage * pageSize}
  //                         </Table.Cell>
  //                         <Table.Cell className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
  //                           {apiKey.title}
  //                         </Table.Cell>
  //                         <Table.Cell className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
  //                           {apiKey.id}
  //                         </Table.Cell>
  //                         <Table.Cell className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-300">
  //                           {new Date(apiKey.created_at).toLocaleDateString()}
  //                         </Table.Cell>
  //                         <Table.Cell className="px-4 py-3 text-[13px] space-x-2 text-gray-500 border-b border-gray-300">
  //                           <span
  //                             className={`w-2.5 h-2.5 rounded-full inline-block ${
  //                               apiKey.revoked_at ?   "bg-red-500"
  //                                 : "bg-green-500"
  //                             }`}
  //                           ></span>
  //                            {apiKey.revoked_at ? "Revoked" : "Live"}
  //                         </Table.Cell>
  //                         <Table.Cell className="px-4 py-3 text-[13px] text-gray-500 border-b text-end border-gray-300">
  //                           <DropdownMenu>
  //                             <DropdownMenu.Trigger asChild>
  //                               <IconButton
  //                                 variant="transparent"
  //                                 className="rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-300 active:bg-gray-200"
  //                               >
  //                                 <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
  //                               </IconButton>
  //                             </DropdownMenu.Trigger>
  //                             <DropdownMenu.Content className="bg-white p-3">
  //                               {/* Add dropdown items here */}
  //                             </DropdownMenu.Content>
  //                           </DropdownMenu>
  //                         </Table.Cell>
  //                       </Table.Row>
  //                     ))}
  //                   </Table.Body>
  //                 </Table>
  //               </div>
  //             )}
               
  //           </div>
  //         </Container>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default withAuth(PublishableApiKeysTable);

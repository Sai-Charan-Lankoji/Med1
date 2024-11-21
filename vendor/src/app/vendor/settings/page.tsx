'use client'

import {
  ArrowUturnLeft,
  BuildingTax,
  Channels,
  ChevronRight,
  CurrencyDollar,
  FaceSmile,
  Key,
  Lifebuoy,
  MapPin,
  Users,
} from '@medusajs/icons';
import { Container } from '@medusajs/ui';
import React from 'react';
import Link from 'next/link';
import withAuth from '@/lib/withAuth';

const Settings = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">General</h1>
        <p className="text-lg text-gray-600">Manage the general settings for your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Link Card Component */}
        {[
          {
            href: "/vendor/settings/api-key-management",
            icon: <Key />,
            title: "API Key Management",
            description: "Create and manage API Keys",
          },
          {
            href: "/vendor/settings/currencies",
            icon: <CurrencyDollar />,
            title: "Currencies",
            description: "Manage the currencies of your store",
          },
          {
            href: "/vendor/settings/personal-information",
            icon: <FaceSmile />,
            title: "Personal Information",
            description: "Manage your Medusa profile",
          },
          {
            href: "/vendor/settings/regions",
            icon: <MapPin />,
            title: "Regions",
            description: "Manage shipping, payment, and fulfillment across regions",
          },
          {
            href: "/vendor/settings/return-reasons",
            icon: <ArrowUturnLeft />,
            title: "Return Reasons",
            description: "Manage reasons for returned items",
          },
          {
            href: "/vendor/settings/sales-channels",
            icon: <Channels />,
            title: "Sales Channels",
            description: "Control which products are available in which channel",
          },
          {
            href: "/vendor/settings/store-details",
            icon: <Lifebuoy />,
            title: "Store Details",
            description: "Manage your business details",
          },
          {
            href: "/vendor/settings/taxes",
            icon: <BuildingTax />,
            title: "Taxes",
            description: "Manage taxes across regions and products",
          },
          {
            href: "/vendor/settings/team",
            icon: <Users />,
            title: "The Team",
            description: "Manage users of your Medusa Store",
          },
        ].map((item, index) => (
          <Link href={item.href} passHref key={index}>
            <Container className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl text-gray-600">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h1 className="font-semibold text-lg text-gray-800">{item.title}</h1>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <ChevronRight className="ml-auto text-gray-400" />
            </Container>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Settings);

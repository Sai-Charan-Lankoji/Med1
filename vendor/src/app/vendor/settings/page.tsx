'use client'

import { ArrowUturnLeft, BuildingTax, Channels, ChevronRight, CurrencyDollar, FaceSmile, Key, Lifebuoy, MapPin, Users } from '@medusajs/icons'
import { Container } from '@medusajs/ui'
import React from 'react'
import Link from 'next/link'; 
import withAuth from '@/lib/withAuth';

const Settings = () => {
  return (
    <div className='p-4'> 
      <div className="mb-4">
        <h1 className='text-2xl font-semibold'>General</h1> 
        <p className='text-16px text-gray-500 pl-1'>Manage the general settings for your store</p> 
      </div>
   
      <div className="grid grid-cols-2 gap-4 mb-2"> 

        <Link href="/vendor/settings/api-key-management" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><Key/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>API Key Management</h1>
              <p className='text-[14px] text-gray-500 '>Create and manage API Keys</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/currencies" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><CurrencyDollar/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>Currencies</h1>
              <p className='text-[14px] text-gray-500 '>Manage the currencies of your store</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/personal-information" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><FaceSmile/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>Personal Information</h1>
              <p className='text-[14px] text-gray-500 '>Manage your Medusa profile</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/regions" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><MapPin/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>Regions</h1>
              <p className='text-[14px] text-gray-500 '>Manage shipping, payment, and fulfillment across regions</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/return-reasons" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><ArrowUturnLeft/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>Return Reasons</h1>
              <p className='text-[14px] text-gray-500 '>Manage reasons for returned items</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/sales-channels" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><Channels/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>Sales Channels</h1>
              <p className='text-[14px] text-gray-500 '>Control which products are available in which channel</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/store-details" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><Lifebuoy/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>Store Details</h1>
              <p className='text-[14px] text-gray-500 '>Manage your business details</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/taxes" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><BuildingTax/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>Taxes</h1>
              <p className='text-[14px] text-gray-500 '>Manage taxes across regions and products</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>

        <Link href="/vendor/settings/team" passHref>
          <Container className='bg-gray-50 flex items-center p-4 shadow-none border border-gray-300'>
            <div className='p-4 '>
              <h1 className='rounded-md bg-gray-100 p-2'><Users/></h1>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className='font-semibold text-black text-[16px]'>The Team</h1>
              <p className='text-[14px] text-gray-500 '>Manage users of your Medusa Store</p>
            </div>
            <h1 className='ml-auto'><ChevronRight/></h1>
          </Container>
        </Link>
        
      </div>
    </div>
  )
}

export default withAuth(Settings);
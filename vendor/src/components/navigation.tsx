"use client";

import React from 'react'; 
import Link from "next/link"; 
import { usePathname, useRouter } from "next/navigation"; 
import { BuildingStorefront, User } from "@medusajs/icons"; 
import { Button } from "@medusajs/ui"; 
import { DropdownMenu } from "@medusajs/ui"; 
import { LogOut, Settings } from "lucide-react"; 
import { useAuth } from '@/app/context/AuthContext'; 
import { useVendorLogout } from '@/app/hooks/auth/useVendorLogout';  

export function Navigation() {   
  const pathname = usePathname();   
  const router = useRouter();   
  const { email, contactName, companyName } = useAuth() ?? { 
    email: '', 
    contactName: '', 
    companyName: '' 
  };   
  const { logout, loading } = useVendorLogout();    

  const handleLogout = async () => {     
    await logout();     
    router.push('/login');   
  };    

  return (     
    <nav className="bg-slate-50 shadow-lg sticky top-0 z-50">       
      <div className="container mx-auto">         
        <div className="flex h-20 justify-between items-center">           
          <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105">             
            <BuildingStorefront className="text-purple-600" />             
            <span className="font-bold text-2xl tracking-tight text-purple-600">
              {companyName }
            </span>           
          </Link>           
          <div className="flex items-center space-x-6">             
            <Link href="/about" className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">               
              <span className="font-medium">About Us</span>             
            </Link>                          
            {/* Authentication State Rendering */}             
            {!email ? (               
              pathname !== "/login" && (                 
                <Link href="/login">                   
                  <Button                     
                    variant="secondary"                     
                    className="flex items-center space-x-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300 shadow-md hover:shadow-lg rounded-2xl"                   
                  >                     
                    <User className="h-5 w-5" />                     
                    <span className="font-semibold">Vendor Login</span>                   
                  </Button>                 
                </Link>               
              )             
            ) : (               
              <DropdownMenu>   
                <DropdownMenu.Trigger asChild>     
                  <Button       
                    variant="transparent"       
                    className="flex items-center space-x-3 hover:bg-white/50 transition-colors"     
                  >       
                    <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">         
                      <span className="text-white font-medium">           
                        {contactName?.slice(0, 1).toUpperCase()}         
                      </span>       
                    </div>       
                    <div className="flex flex-col items-start  sm:block">         
                      <span className="text-sm font-medium text-gray-900">           
                        {contactName}         
                      </span>       
                    </div>     
                  </Button>   
                </DropdownMenu.Trigger>   
                <DropdownMenu.Content      
                  align="end"      
                  className="w-56 z-[100]"     
                  side="bottom"     
                  sideOffset={10}   
                >     
                  <DropdownMenu.Item asChild className='rounded-xl hover:bg-blue-400'>       
                    <Link href="/vendor/settings" className="flex items-center">         
                      <Settings className="mr-2 h-4 w-4" />         
                      <span>Settings</span>       
                    </Link>     
                  </DropdownMenu.Item>     
                  <DropdownMenu.Separator />     
                  <DropdownMenu.Item       
                    className="text-red-600 focus:text-red-600"       
                    onClick={handleLogout}       
                    disabled={loading}     
                  >       
                    <LogOut className="mr-2 h-4 w-4" />       
                    <span>{loading ? 'Logging out...' : 'Logout'}</span>     
                  </DropdownMenu.Item>   
                </DropdownMenu.Content> 
              </DropdownMenu>             
            )}           
          </div>         
        </div>       
      </div>     
    </nav>   
  ); 
}
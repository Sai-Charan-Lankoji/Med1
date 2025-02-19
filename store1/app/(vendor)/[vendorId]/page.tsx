"use client"

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { SideNavBar } from "@/components/sidenavbar"
import DesignArea from "@/components/designarea"
import { DesignProvider, TextPropsProvider } from "@/context/designcontext"
import { ColorPickerProvider } from "@/context/colorpickercontext"
import { MenuProvider } from "@/context/menucontext"
import { store } from "@/reducer/store"
import { Provider } from "react-redux"
import { Template } from "@/components/templates"
import { useStore } from "@/context/storecontext"

const VendorDesignCanvas = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store: vendorStore } = useStore()
  const vendorId = params.vendorId as string
  const [productData, setProductData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Debug logging
  React.useEffect(() => {
    console.log('Component mounted, vendorId from URL:', vendorId)
    console.log('vendorStore:', vendorStore)
  }, [vendorId, vendorStore])

  // Effect for vendor validation - only run when vendorStore is available
  React.useEffect(() => {
    if (!vendorStore) {
      console.log('Store not loaded yet, waiting...')
      return
    }
    
    console.log('Comparing vendor IDs:', {
      'URL vendorId': vendorId,
      'Store vendorId': vendorStore.vendor_id,
      'Match': vendorId === vendorStore.vendor_id
    })
    
    // Only redirect if IDs don't match and store is loaded
    if (vendorId !== vendorStore.vendor_id) {
      console.log('Vendor ID mismatch - redirecting to homepage')
      router.push("/")
      return
    }

    setIsLoading(false)
  }, [vendorId, router, vendorStore])

  // Separate effect for product data loading - only runs if vendor check passes
  React.useEffect(() => {
    if (isLoading || !vendorStore) {
      return // Skip if still loading or no vendor store
    }
    
    console.log('Loading product data')
    const productDataParam = searchParams.get("productData")
    if (productDataParam) {
      try {
        const parsedProductData = JSON.parse(decodeURIComponent(productDataParam))
        console.log('Product data parsed successfully:', parsedProductData)
        setProductData(parsedProductData)
      } catch (error) {
        console.error("Error parsing product data:", error)
      }
    }
  }, [searchParams, isLoading, vendorStore])

  // Show loading state while waiting for vendorStore
  if (!vendorStore) {
    return <div className="flex justify-center items-center h-screen">Loading store data...</div>
  }

  // If vendor ID doesn't match, render nothing (redirect happens in effect)
  if (vendorId !== vendorStore.vendor_id) {
    return <div className="flex justify-center items-center h-screen">Redirecting...</div>
  }

  console.log("Rendering component with productData:", productData)
  
  return (
    <Provider store={store}>
      <DesignProvider>
        <MenuProvider>
          <TextPropsProvider>
            <ColorPickerProvider>
              <div className="lg:px-10 md:px-10 sm:px-0 mt- pt-28">
                <div className="grid grid-cols-12 gap-3 px-10 mt-3">
                  <div className="lg:col-span-3 md:col-span-12 sm:col-span-12 col-span-12">
                    <SideNavBar></SideNavBar>
                  </div>
                  <div className="lg:col-span-7 md:col-span-12 sm:col-span-12 col-span-12">
                    <main className="designarea">
                      <DesignArea isVendorMode={true} productData={productData} />
                    </main>
                  </div>
                  <div className="col-span-2">
                    <Template></Template>
                  </div>
                </div>
              </div>
            </ColorPickerProvider>
          </TextPropsProvider>
        </MenuProvider>
      </DesignProvider>
    </Provider>
  )
}

export default VendorDesignCanvas
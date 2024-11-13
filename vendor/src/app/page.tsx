"use client"
import { Navigation } from "@/components/navigation";
import Login from "./login/page";
import React from "react"
import { PlanSelection } from "@/components/planselection";


const App = () => {
  return (
  <>
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Create Your Vendor Store</h1>
          <PlanSelection />
        </div>
      </div>
    </main>
  </>
      
  )
}

export default App

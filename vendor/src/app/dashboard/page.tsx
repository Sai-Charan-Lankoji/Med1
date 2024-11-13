"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import StoreCreation  from "@/components/store-creation";
import { StoreDisplay } from "@/components/store-display";

export default function Dashboard() {
  const [hasStore, setHasStore] = useState(false);

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Vendor Dashboard</h1>
          {hasStore ? (
            <StoreDisplay />
          ) : (
            <StoreCreation onStoreCreated={() => setHasStore(true)} />
          )}
        </div>
      </div>
    </main>
  );
}
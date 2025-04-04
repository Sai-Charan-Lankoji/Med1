"use client";

import { vendor_id } from "@/app/utils/constant";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthWrapper = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // const vendorId = typeof window !== "undefined" ? sessionStorage.getItem("vendor_id") : null;
       if (!vendor_id) {
        router.replace("/");
      } 
      else {
        setAuthenticated(true);
      }
      setLoading(false);
    }, [router]);

    if (authenticated) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return AuthWrapper;
};

export default withAuth;

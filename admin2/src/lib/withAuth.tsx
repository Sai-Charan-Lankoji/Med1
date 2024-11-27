"use client";

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
      const vendorId = sessionStorage.getItem("vendor_id");
       if (!vendorId) {
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

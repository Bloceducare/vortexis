"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthErrorPage from "@/components/authError";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.warn(
      "User attempted to access non-existent route or unauthorized path:",
      pathname
    );
  }, [pathname]);

  return <AuthErrorPage />;
};

export default NotFound;

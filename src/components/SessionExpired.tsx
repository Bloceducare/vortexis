"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusModal from "@/components/StatusModal"; // Adjust path as needed

export default function SessionHandler({ children }: { children: React.ReactNode }) {
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Listen for the "auth-session-expired" event from your Axios interceptor
    const handleExpire = () => {
      setIsExpired(true);
    };

    window.addEventListener("auth-session-expired", handleExpire);
    return () => window.removeEventListener("auth-session-expired", handleExpire);
  }, []);

  const handleRedirect = () => {
    setIsExpired(false);
    router.push("/signin");
  };

  return (
    <>
      {children}
      
      <StatusModal
        isOpen={isExpired}
        onClose={handleRedirect}
        type="error"
        title="Session Expired"
        message="Your session has timed out for security reasons. Please sign in again to keep going."
      />
    </>
  );
}
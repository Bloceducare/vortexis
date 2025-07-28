import OtpVerificationForm from "@/components/OtpVerifications";

interface VerifyOtpPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyOtpPage({
  searchParams,
}: VerifyOtpPageProps) {
  const resolvedSearchParams = await searchParams;

  const email =
    (resolvedSearchParams?.email &&
    typeof resolvedSearchParams.email === "string"
      ? resolvedSearchParams.email.trim()
      : "") || "";

  console.log("VerifyOtpPage: Email from searchParams =", email);

  if (!email) {
    console.error("VerifyOtpPage: Email parameter is missing from URL.");
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-600">
        <p>
          Error: Email not provided for OTP verification. Please go back to
          signup.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <OtpVerificationForm email={email} />
    </div>
  );
}

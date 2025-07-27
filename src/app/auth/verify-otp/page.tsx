import OtpVerificationForm from "@/components/OtpVerifications";

export default function VerifyOtpPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email || "user@example.com"; // Replace with actual email retrieval logic

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <OtpVerificationForm email={email} />
    </div>
  );
}

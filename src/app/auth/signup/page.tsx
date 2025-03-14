import LoginForm from "@/components/ui/AuthForm";
import { X } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="sm:max-w-full md:max-w-full">
<Link href="/">
      <button className="absolute cursor-pointer top-0 right-0 h-8 w-8">
        <X className="h-5 w-5 text-gray-500" />
      </button>
</Link>

      <div className="mt-0 px-8 md:mt-8 md:px-12">
        <h1>Get Started Now</h1>
        <p className="text-secondary-50 text-sm">Let’s create your account</p>
        <LoginForm type="signup" />
      </div>
    </div>
  );
}

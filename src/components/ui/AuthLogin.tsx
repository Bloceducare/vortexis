"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { signInGoogleAction } from "@/lib/actions";
import { signInGithubAction } from "@/lib/actions";
import Divider from "./Divider";
import Button from "./AuthButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

type AuthFormType = "organizers" | "participants";

interface AuthLoginProps {
  type: AuthFormType;
}

function AuthLogin({ type }: AuthLoginProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const payload = {
        username: data.username,
        password: data.password,
      };
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      let result;
      try {
        const responseText = await response.text();
        if (
          responseText.trim().startsWith("{") ||
          responseText.trim().startsWith("[")
        ) {
          result = JSON.parse(responseText);
        } else {
          toast.error("Server error. Please try again later");
          return;
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        toast.error("Server error. Please try again later");
        return;
      }

      if (!response.ok) {
        console.log("Error response:", result);
        toast.error(result.message || "Login failed. Please try again");
        return;
      }

      toast.success("Login successful! Redirecting...");
      console.log("Login successful:", result);

      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
        console.log("Local storage init");
      }
      if (result.refresh_token) {
        localStorage.setItem("refresh_token", result.refresh_token);
      }
      if (result.email) {
        localStorage.setItem("user_email", result.email);
      }
      if (result.full_name) {
        localStorage.setItem("user_full_name", result.full_name);
      }
      if (result.username) {
        localStorage.setItem("username", result.username);
      }

      router.push("/dashboard");

      reset();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please check your connection and try again");
    }
  };

  return (
    <div className="shadow-md bg-white w-full md:max-w-[814px] mx-auto rounded-[24px] p-4 md:p-2 md:h-[633px]">
      <div className="w-full max-w-[798px] mx-auto flex flex-col justify-center items-center py-6 md:py-0 md:h-[555px] md:gap-[24px] md:mt-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[690px] flex flex-col pt-5 text-[#2F3036] px-4"
        >
          <div className="mb-6 md:mb-8">
            <label htmlFor="username" className="font-medium block mb-2">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              placeholder="Enter your username"
              className={`w-full border p-3 md:p-2 rounded-sm text-base ${
                errors.username
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              } focus:outline-none focus:ring-1 ${
                errors.username ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="mb-4 md:mb-5">
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Input your password"
              className={`w-full border p-3 md:p-2 rounded-sm text-base ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              } focus:outline-none focus:ring-1 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex flex-row justify-between items-center mb-6 md:mb-5 gap-3">
            <div className="flex items-center">
              <input
                {...register("rememberMe")}
                type="checkbox"
                id="rememberMe"
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm md:text-base">
                Remember me
              </label>
            </div>
            <Link href="/forgot-password">
              <span className="text-[#2E0BF4] text-sm md:text-base cursor-pointer hover:underline">
                Forgotten Password?
              </span>
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full max-w-[690px] h-[45px] md:h-[45px] text-white py-2 rounded-[3px] mx-auto text-sm md:text-base transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2E0BF4] hover:bg-[#2508d4]"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              `Log In to ${
                type === "organizers" ? "Organization" : "Participation"
              } Dashboard`
            )}
          </button>
        </form>
        <div className="w-full max-w-[655px] h-[27px] mx-auto my-6 md:my-0">
          <Divider>Or</Divider>
        </div>
        <div className="w-full max-w-[400px] space-y-4">
          <Button
            onClick={signInGoogleAction}
            type="secondary"
            className="relative flex w-full rounded-[100px] items-center justify-center h-12 md:h-auto hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://authjs.dev/img/providers/google.svg"
              className="absolute left-3 h-5 w-5"
              alt="google logo"
              height="24"
              width="24"
            />
            <span className="text-sm md:text-base">Log in with Google</span>
          </Button>
          <Button
            onClick={signInGithubAction}
            type="secondary"
            className="relative flex w-full rounded-[100px] items-center justify-center h-12 md:h-auto hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://authjs.dev/img/providers/github.svg"
              className="absolute left-3 h-5 w-5"
              alt="github logo"
              height="24"
              width="24"
            />
            <span className="text-sm md:text-base">Log in with GitHub</span>
          </Button>
        </div>
        <p className="text-center font-[600] mt-6 md:mt-3 text-[#2F3036] text-sm md:text-base px-4">
          {type === "organizers"
            ? "Don't have an organizer account?"
            : "Don't have a participant account?"}
          <Link
            className="underline pl-1 text-[#2E0BF4] hover:text-[#2508d4]"
            href="/auth/signin/organizer"
          >
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;

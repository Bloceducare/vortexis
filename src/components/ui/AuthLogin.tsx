"use client";

import { signInGoogleAction } from "@/lib/actions";
import { signInGithubAction } from "@/lib/actions";
import Divider from "./Divider";
import Button from "./AuthButton";
import Link from "next/link";

type AuthFormType = "organizers" | "participants";

interface SignUpFormProps {
  type: AuthFormType;
}

function AuthLogin({ type }: SignUpFormProps) {
  return (
    <div className="shadow-md bg-white w-full md:max-w-[814px] mx-auto rounded-[24px] p-4 md:p-2 md:h-[633px]">
      <div className="w-full max-w-[798px] mx-auto flex flex-col justify-center items-center py-6 md:py-0 md:h-[555px] md:gap-[24px] md:mt-7">
        <form className="w-full max-w-[690px] flex flex-col pt-5 text-[#2F3036] px-4">
          <label htmlFor="email" className="font-medium block mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full border border-gray-300 p-3 md:p-2 rounded-sm mb-6 md:mb-8 text-base"
          />

          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Input your password"
            className="w-full border border-gray-300 p-3 md:p-2 rounded-sm mb-4 md:mb-5 text-base"
          />

          <div className="flex flex-row justify-between items-center mb-6 md:mb-5 gap-3">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm md:text-base">Remember me</label>
            </div>
            <span className="text-[#2E0BF4] text-sm md:text-base cursor-pointer">
              Forgotten Password?
            </span>
          </div>

          <button className="bg-[#2E0BF4] w-full max-w-[690px] h-[45px] md:h-[45px] text-white py-2 rounded-[3px] mx-auto text-sm md:text-base">
            Log In to {type === "organizers" ? "Organization" : "Participation"}{" "}
            Dashboard
          </button>
        </form>

        <div className="w-full max-w-[655px] h-[27px] mx-auto my-6 md:my-0">
          <Divider>Or</Divider>
        </div>

        <div className="w-full max-w-[400px] space-y-4">
          <Button
            onClick={signInGoogleAction}
            type="secondary"
            className="relative flex w-full rounded-[100px] items-center justify-center h-12 md:h-auto"
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
            className="relative flex w-full rounded-[100px] items-center justify-center h-12 md:h-auto"
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
          <Link className="underline pl-1 text-[#2E0BF4]" href="/auth/signin/organizer">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;

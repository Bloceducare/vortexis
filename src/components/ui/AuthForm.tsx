"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { signInGithubAction, signInGoogleAction } from "@/lib/actions";
import Input from "./AuthInput";
import Button from "./AuthButton";
import Divider from "./Divider";

type AuthFormType = "login" | "signup";

interface LoginFormProps {
  type: AuthFormType;
}

export default function LoginForm({ type }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className={`${type === "login" ? "mt-5 space-y-3" : "mt-1 space-y-2.5"}`}
    >
      {type === "signup" && (
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            FullName
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <User className="mt-2 h-4 w-4 text-gray-400" />
            </div>
            <Input id="name" type="name" placeholder="Dominic Matthew" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Mail className="mt-2 h-4 w-4 text-gray-400" />
          </div>
          <Input id="email" type="email" placeholder="donnalee@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Set your password"
            icon="two"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {type === "signup" && (
        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              icon="two"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      )}
      {type === "login" && (
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input title="remember me" type="checkbox" />
            <label
              htmlFor="remember"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Link
            href="forgot-password"
            className="text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            Forgot Password
          </Link>
        </div>
      )}
      <Button type="primary">{type === "login" ? "Sign In" : "sign up"}</Button>
      <Divider>or</Divider>
      {/* Custom Google Button */}
      <Button
        onClick={signInGoogleAction}
        type="secondary"
        className="relative flex w-full items-center justify-center"
      >
        <img
          src="https://authjs.dev/img/providers/google.svg"
          className="absolute left-3 h-5 w-5"
          alt="google logo"
          height="24"
          width="24"
        />
        Sign in with Google
      </Button>
      {/* Your existing GitHub button */}
      <Button
        onClick={signInGithubAction}
        type="secondary"
        className="relative flex w-full items-center justify-center"
      >
        <img
          src="https://authjs.dev/img/providers/github.svg"
          className="absolute left-3 h-5 w-5"
          alt="github logo"
          height="24"
          width="24"
        />
        Sign in with Github
      </Button>
      <div className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        {type === "signup" ? (
          <Link href="/auth" className="font-medium text-[#009AFF]">
            Sign in
          </Link>
        ) : (
          <Link href="/auth/signup" className="font-medium text-[#009AFF]">
            Sign up
          </Link>
        )}
      </div>{" "}
    </form>
  );
}

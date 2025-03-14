"use client";

import { signIn, signOut } from "next-auth/react";

export async function signInGoogleAction() {
  await signIn("google", { callbackUrl: "/auth/login" });
}
export async function signInGithubAction() {
  await signIn("github", { callbackUrl: "/auth/login" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

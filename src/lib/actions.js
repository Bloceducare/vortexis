"use client";

import { signIn, signOut } from "next-auth/react";

export async function signInGoogleAction() {
  await signIn("google", { callbackUrl: "/" });
}
export async function signInGithubAction() {
  await signIn("github", { callbackUrl: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

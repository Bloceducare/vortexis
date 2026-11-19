"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Mail,
  UserCheck,
  LogOut,
  LogIn,
  UserPlus,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useRoleAccessStore } from "@/store/useRoleAccessStore";
import { useOrganizationModerators } from "@/hooks/useOrganizationModerators";
import { permissionLabel } from "@/lib/moderatorAccess";

export default function ModeratorInvitationPage() {
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : "";
  const router = useRouter();

  const userToken = useAuthStore((state) => state.token);
  const currentUser = useUserStore((state) => state.user);
  const clearToken = useAuthStore((state) => state.clearToken);
  const clearUser = useUserStore((state) => state.clearUser);

  const isLoggedIn = !!userToken && !!currentUser;

  const {
    getInvitationByToken,
    acceptInvitationMutation,
    declineInvitationMutation,
  } = useOrganizationModerators();

  const {
    data: invitation,
    isLoading,
    isError,
    error,
    refetch,
  } = getInvitationByToken(token);

  const [actionSuccess, setActionSuccess] = useState<"accepted" | "declined" | null>(null);

  const isExpired =
    invitation?.status === "expired" ||
    (invitation?.expires_at ? new Date() > new Date(invitation.expires_at) : false);

  const isEmailMatching =
    isLoggedIn &&
    currentUser?.email &&
    invitation?.email &&
    currentUser.email.trim().toLowerCase() === invitation.email.trim().toLowerCase();

  const handleSwitchAccount = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectUrl", `/invitations/moderator/${token}`);
    }
    clearToken();
    clearUser();
    router.push(`/auth/login?redirect=/invitations/moderator/${token}`);
  };

  const handleGoToLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectUrl", `/invitations/moderator/${token}`);
    }
    router.push(`/auth/login?redirect=/invitations/moderator/${token}`);
  };

  const handleGoToSignup = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectUrl", `/invitations/moderator/${token}`);
    }
    const prefillEmail = invitation?.email ? encodeURIComponent(invitation.email) : "";
    router.push(
      `/auth/signup?redirect=/invitations/moderator/${token}${
        prefillEmail ? `&email=${prefillEmail}` : ""
      }`
    );
  };

  const handleAccept = async () => {
    if (!token) return;
    try {
      await acceptInvitationMutation.mutateAsync(token);
      setActionSuccess("accepted");
      toast.success(
        `🎉 You are now a moderator of ${invitation?.organization_name || "the organization"}!`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to accept invitation");
    }
  };

  const handleDecline = async () => {
    if (!token) return;
    const confirmed = window.confirm(
      `Are you sure you want to decline this invitation to moderate ${invitation?.organization_name || "this organization"}?`
    );
    if (!confirmed) return;

    try {
      await declineInvitationMutation.mutateAsync(token);
      setActionSuccess("declined");
      toast.info("Invitation declined.");
    } catch (err: any) {
      toast.error(err.message || "Failed to decline invitation");
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-700 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying Invitation...
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please hold on while we retrieve the invitation details.
          </p>
        </div>
      </div>
    );
  }

  // 2. Error State (Invalid Token / Not Found)
  if (isError || !invitation) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={4000} />
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-red-100 dark:border-red-900/30">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Invitation Not Found
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {error?.message ||
              "This invitation link is invalid or may have expired. Please check the URL or ask the organization owner to send a new invitation."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-md flex items-center justify-center gap-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Post-Action Success Views (Local Action state or backend returned status)
  const isAccepted = actionSuccess === "accepted" || invitation.status === "accepted";
  const isDeclined = actionSuccess === "declined" || invitation.status === "declined";

  if (isAccepted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={4000} />
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-emerald-100 dark:border-emerald-900/30">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Moderator Access Granted
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Invitation Accepted!
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            You are now an official moderator of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {invitation.organization_name}
            </span>
            . You can now manage hackathons, review submissions, and coordinate evaluations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/organizer"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              Go to Organizer Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isDeclined) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={4000} />
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 text-gray-500 dark:text-gray-400">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Invitation Declined
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            This invitation to join{" "}
            <span className="font-semibold">{invitation.organization_name}</span> as a moderator
            was declined.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 text-white font-medium transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={4000} />
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-amber-100 dark:border-amber-900/30">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
            <Clock className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 mb-3">
            Invitation Expired
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            This Invitation Has Expired
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            The moderator invitation for{" "}
            <span className="font-semibold">{invitation.organization_name}</span> has expired.
            Please contact the organization owner to request a fresh invitation link.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // 4. Pending Invitation - Organization card and Role invitation details
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="w-full max-w-xl space-y-6">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition-colors">
          {/* Header Banner */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 dark:border-gray-700">
            {invitation.organization_logo ? (
              <img
                src={invitation.organization_logo}
                alt={invitation.organization_name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 dark:border-indigo-800 mb-4 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/20">
                <Building2 className="w-10 h-10" />
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200 dark:border-indigo-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Moderator Invitation
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {invitation.organization_name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Invited you to become an Organization Moderator
            </p>
          </div>

          {/* Invitation Message Section */}
          {invitation.message && (
            <div className="my-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Message from Organizer
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed">
                "{invitation.message}"
              </p>
            </div>
          )}

          {/* Details Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/40">
              <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="truncate">
                Sent to: <b className="text-gray-800 dark:text-gray-200">{invitation.email}</b>
              </span>
            </div>

            {invitation.created_at && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/40">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  Date: {new Date(invitation.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* AUTHENTICATION STATE HANDLING */}

          {/* CASE 1: USER IS NOT LOGGED IN */}
          {!isLoggedIn && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  <p className="font-semibold mb-1">Authentication Required</p>
                  <p>
                    You've been invited as a moderator for{" "}
                    <b>{invitation.organization_name}</b>. Please sign up or log in with{" "}
                    <b>{invitation.email}</b> to accept this invitation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleGoToLogin}
                  className="w-full py-3 px-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Log In
                </button>
                <button
                  onClick={handleGoToSignup}
                  className="w-full py-3 px-4 rounded-xl font-semibold border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Create Account
                </button>
              </div>
            </div>
          )}

          {/* CASE 2: LOGGED IN WITH DIFFERENT EMAIL */}
          {isLoggedIn && !isEmailMatching && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-red-900 dark:text-red-200">
                  <p className="font-semibold mb-1">Email Mismatch</p>
                  <p className="leading-relaxed">
                    This invitation was sent to <b>{invitation.email}</b>. You are currently logged
                    in as <b>{currentUser?.email}</b>. Please switch accounts to accept.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSwitchAccount}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white transition shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Switch Account
                </button>
                <Link
                  href="/dashboard"
                  className="py-3 px-4 rounded-xl font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* CASE 3: LOGGED IN WITH MATCHING EMAIL */}
          {isLoggedIn && isEmailMatching && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Logged in as <b>{currentUser?.email}</b> (Matching recipient)
                </span>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Access you will receive</p>
                <p>
                  {invitation.hackathon_scope === "selected"
                    ? `Selected hackathons${invitation.granted_hackathons?.length ? `: ${invitation.granted_hackathons.map((item) => item.title).join(", ")}` : ""}`
                    : "All hackathons in this organization"}
                </p>
                <p>
                  {(invitation.permissions && invitation.permissions.length > 0
                    ? invitation.permissions.map(permissionLabel)
                    : ["Hackathon management"]
                  ).join(" · ")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAccept}
                  disabled={acceptInvitationMutation.isPending || declineInvitationMutation.isPending}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {acceptInvitationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Accept Invitation
                    </>
                  )}
                </button>

                <button
                  onClick={handleDecline}
                  disabled={acceptInvitationMutation.isPending || declineInvitationMutation.isPending}
                  className="py-3 px-6 rounded-xl font-semibold border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {declineInvitationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Declining...
                    </>
                  ) : (
                    "Decline"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Powered by Vortexis Hackathon Platform
        </p>
      </div>
    </div>
  );
}

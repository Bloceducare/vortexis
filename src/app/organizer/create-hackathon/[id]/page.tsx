"use client";

import React, { useCallback, useMemo, useState } from "react";
import Details from "./component/Details";
import Visibility from "./component/Visibility";
import Submission from "./component/Submission";
import Team from "./component/Team";
import Prizes from "./component/Prizes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertTriangleIcon, XIcon } from "lucide-react";
import { useOrganizationStore } from "@/store/useOrganizationStore";
import { useHackathonStore } from "@/store/useHackathonStore";
import useOrganizer from "@/hooks/useOrganizers";
import SuccessModal from "@/components/SuccessModal";
import { parseApiError } from "@/lib/apiError";
import { WizardErrorsContext } from "./component/FormField";
import {
  FIELD_LABELS,
  FIELD_STEP,
  FieldErrors,
  STEPS,
  firstStepWithError,
  stepsWithErrors,
  validateAll,
  validateStep,
} from "./validation";

const STEP_DESCRIPTIONS = [
  "Enter the basic information about your hackathon.",
  "Configure how participants will submit their projects.",
  "Set up team requirements for participants.",
  "Describe the prizes participants can win.",
  "Control who can see and participate in your hackathon.",
];

function Hackathon() {
  const organization = useOrganizationStore((state) => state.organization);
  const orgId = organization?.id ?? 0;

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { createHackathonMutation } = useOrganizer();
  const getHackathonData = useHackathonStore((state) => state.getHackathonData);
  const clearHackathon = useHackathonStore((state) => state.clearHackathon);

  const getValues = useCallback(() => {
    const s = useHackathonStore.getState();
    return { ...s, organization_id: orgId };
  }, [orgId]);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const errorContext = useMemo(() => ({ errors, clearError }), [errors, clearError]);
  const erroredSteps = useMemo(() => stepsWithErrors(errors), [errors]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
    scrollToTop();
  };

  /** Validates the current step; shows every problem on it at once instead of one toast at a time. */
  const handleNext = () => {
    const stepErrors = validateStep(currentStep, getValues());
    // Replace this step's errors with the fresh result, keep other steps' errors.
    setErrors((prev) => {
      const kept = Object.fromEntries(
        Object.entries(prev).filter(([k]) => (FIELD_STEP[k.split(".")[0]] ?? 4) !== currentStep)
      );
      return { ...kept, ...stepErrors };
    });
    const count = Object.keys(stepErrors).length;
    if (count > 0) {
      toast.error(
        count === 1 ? Object.values(stepErrors)[0] : `Please fix the ${count} highlighted fields.`,
        { position: "top-right", autoClose: 4000, theme: "colored" }
      );
      return;
    }
    goToStep(Math.min(currentStep + 1, STEPS.length - 1));
  };

  const handlePrev = () => goToStep(Math.max(0, currentStep - 1));

  const handleSubmit = async () => {
    setSubmitError("");

    // Validate every step before hitting the API so the user sees everything at once.
    const allErrors = validateAll(getValues());
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const count = Object.keys(allErrors).length;
      setSubmitError(
        count === 1
          ? Object.values(allErrors)[0]
          : `Please fix the ${count} problems listed below before creating the hackathon.`
      );
      goToStep(firstStepWithError(allErrors) ?? currentStep);
      return;
    }

    try {
      await createHackathonMutation.mutateAsync({
        ...getHackathonData(),
        organization_id: orgId,
      } as any);
      setErrors({});
      setShowSuccessModal(true);
      clearHackathon();
    } catch (error) {
      const apiError = parseApiError(error, "Failed to create hackathon. Please try again.");
      console.error("[create-hackathon] submission failed", {
        status: apiError.status,
        message: apiError.message,
        fieldErrors: apiError.fieldErrors,
      });
      setErrors(apiError.fieldErrors);
      setSubmitError(apiError.message);
      const step = firstStepWithError(apiError.fieldErrors);
      goToStep(step ?? currentStep);
      toast.error(apiError.message, { position: "top-right", autoClose: 6000, theme: "colored" });
    }
  };

  const errorList = Object.entries(errors).filter(([k]) => k !== "non_field_errors");

  const renderComponent = () => {
    switch (currentStep) {
      case 0:
        return <Details onNext={handleNext} data={null} />;
      case 1:
        return <Submission onNext={handleNext} onPrev={handlePrev} data={null} />;
      case 2:
        return <Team onNext={handleNext} onPrev={handlePrev} data={null} />;
      case 3:
        return <Prizes onNext={handleNext} onPrev={handlePrev} data={null} />;
      case 4:
        return (
          <Visibility
            onPrev={handlePrev}
            data={null}
            onSubmit={handleSubmit}
            isSubmitting={createHackathonMutation.isPending}
            organizationName={organization?.name}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardErrorsContext.Provider value={errorContext}>
      <section className="bg-white dark:bg-gray-800 px-4 md:px-10 rounded-2xl py-5 transition-colors">
        <ToastContainer position="top-right" autoClose={5000} />

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[#605DEC] dark:text-indigo-400">
            {STEPS[currentStep]}
          </h1>
          <p className="dark:text-gray-300">{STEP_DESCRIPTIONS[currentStep]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>
        </div>

        <section className="w-full overflow-x-auto">
          <div className="flex gap-3 mb-6 flex-wrap mt-4">
            {STEPS.map((btn, index) => (
              <button
                key={btn}
                type="button"
                onClick={() => goToStep(index)}
                className={`relative px-4 md:px-8 py-3 md:py-4 rounded-lg transition cursor-pointer ${
                  currentStep === index
                    ? "bg-[#605DEC] text-white"
                    : "bg-[#F4F3FE] dark:bg-gray-700 text-[#C5C0DB] dark:text-gray-300"
                } ${erroredSteps.has(index) ? "ring-2 ring-red-500" : ""}`}
              >
                {btn}
                {erroredSteps.has(index) && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"
                    aria-label="This step has errors"
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {submitError && (
          <div
            role="alert"
            className="max-w-4xl mx-auto mb-6 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-red-700 dark:text-red-300"
          >
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold">{submitError}</p>
                {errors.non_field_errors && errors.non_field_errors !== submitError && (
                  <p>{errors.non_field_errors}</p>
                )}
                {errorList.length > 1 && (
                  <ul className="space-y-1 text-sm">
                    {errorList.map(([field, msg]) => {
                      const step = FIELD_STEP[field.split(".")[0]] ?? 4;
                      return (
                        <li key={field}>
                          <button
                            type="button"
                            onClick={() => goToStep(step)}
                            className="text-left underline-offset-2 hover:underline"
                          >
                            <span className="font-medium">
                              {FIELD_LABELS[field] ?? field.replace(/_/g, " ")}
                            </span>{" "}
                            ({STEPS[step]}): {msg}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSubmitError("")}
                aria-label="Dismiss error"
                className="shrink-0 opacity-70 hover:opacity-100"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4">{renderComponent()}</div>
      </section>

      {showSuccessModal && (
        <SuccessModal
          title="🎉 Hackathon Created!"
          message="Your hackathon has been successfully submitted."
          onClose={() => {
            window.location.href = "/organizer";
          }}
        />
      )}
    </WizardErrorsContext.Provider>
  );
}

export default Hackathon;

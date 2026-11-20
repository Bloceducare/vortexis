"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  FileDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import {
  exportParticipants,
  ExportFormat,
} from "@/lib/participantExport";

interface ExportParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: {
    id: string | number;
    title: string;
    start_date?: string;
    end_date?: string;
  };
  existingTeams?: any[];
}

interface FormatOption {
  id: ExportFormat;
  title: string;
  extension: string;
  badge: string;
  description: string;
  recommended?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  bgLight: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: "xlsx",
    title: "Excel Spreadsheet",
    extension: ".xlsx",
    badge: "Recommended",
    description:
      "Structured workbook with styled metadata block, bold headers, and auto-filters.",
    recommended: true,
    icon: FileSpreadsheet,
    accentColor: "text-emerald-500 dark:text-emerald-400",
    borderColor: "border-emerald-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    id: "csv",
    title: "CSV (Comma-Separated)",
    extension: ".csv",
    badge: "Universal",
    description:
      "Standard UTF-8 encoded text with BOM. Ideal for spreadsheets, CRM, and data pipelines.",
    icon: FileText,
    accentColor: "text-blue-500 dark:text-blue-400",
    borderColor: "border-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "pdf",
    title: "PDF Document",
    extension: ".pdf",
    badge: "Print-Ready",
    description:
      "Landscape formatted report with hackathon branding, summary metrics, and page numbers.",
    icon: FileDown,
    accentColor: "text-purple-500 dark:text-purple-400",
    borderColor: "border-purple-500",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
  },
];

export default function ExportParticipantsModal({
  isOpen,
  onClose,
  hackathon,
  existingTeams = [],
}: ExportParticipantsModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("xlsx");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<{
    filename: string;
    totalParticipants: number;
    totalTeams: number;
    totalLeaders: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Approximate counts from memory for preview
  const estimatedTeamsCount = existingTeams.length;
  const estimatedParticipantsCount = existingTeams.reduce(
    (sum, t) => sum + (Array.isArray(t?.members) ? t.members.length : 1),
    0
  );

  const handleDownload = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setExportSuccess(null);

    try {
      const result = await exportParticipants(
        selectedFormat,
        hackathon,
        existingTeams
      );

      setExportSuccess(result);
    } catch (err: any) {
      console.error("Export participants error:", err);
      setErrorMessage(
        err?.message ||
          "Failed to export participants. Please check your network connection and try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleModalClose = () => {
    if (isExporting) return;
    setExportSuccess(null);
    setErrorMessage(null);
    onClose();
  };

  const selectedOption =
    FORMAT_OPTIONS.find((f) => f.id === selectedFormat) || FORMAT_OPTIONS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleModalClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Export Participants
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Download registered participants and team assignments
                </p>
              </div>
            </div>
            <button
              onClick={handleModalClose}
              disabled={isExporting}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Hackathon Summary Info Card */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                    Hackathon
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white truncate max-w-sm">
                    {hackathon.title || "Hackathon Participants"}
                  </h4>
                  {(hackathon.start_date || hackathon.end_date) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {hackathon.start_date
                          ? new Date(hackathon.start_date).toLocaleDateString()
                          : "TBD"}{" "}
                        –{" "}
                        {hackathon.end_date
                          ? new Date(hackathon.end_date).toLocaleDateString()
                          : "TBD"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{estimatedParticipantsCount} participants</span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span>{estimatedTeamsCount} teams</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-sm text-red-700 dark:text-red-300"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Export Failed</p>
                  <p className="text-xs mt-0.5 opacity-90">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {exportSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-sm text-emerald-800 dark:text-emerald-200"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Export Downloaded Successfully!</p>
                  <p className="text-xs mt-0.5 opacity-90">
                    Saved as{" "}
                    <span className="font-mono font-medium">
                      {exportSuccess.filename}
                    </span>
                  </p>
                  <div className="mt-2 text-xs flex flex-wrap gap-2 text-emerald-700 dark:text-emerald-300">
                    <span className="bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                      {exportSuccess.totalParticipants} Participants
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                      {exportSuccess.totalTeams} Teams
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                      {exportSuccess.totalLeaders} Team Leaders
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Format Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                Choose Document Format
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {FORMAT_OPTIONS.map((option) => {
                  const isSelected = selectedFormat === option.id;
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedFormat(option.id);
                        setExportSuccess(null);
                        setErrorMessage(null);
                      }}
                      disabled={isExporting}
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? `border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20`
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : `${option.bgLight} ${option.accentColor}`
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {option.title}
                          </span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                            {option.extension}
                          </span>
                          {option.recommended && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      <div className="flex items-center self-center pl-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Included Data Checklist */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-gray-200 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Data included in this export:
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                <li>Full Name & Profile Handle</li>
                <li>Email Address</li>
                <li>Assigned Team Name</li>
                <li>Role (Leader / Member / Solo)</li>
                <li>Hackathon Title & Date Range</li>
                <li>Generation Timestamp & Totals</li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/30">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {exportSuccess ? "Close" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing {selectedOption.extension}...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Again</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {selectedOption.extension}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

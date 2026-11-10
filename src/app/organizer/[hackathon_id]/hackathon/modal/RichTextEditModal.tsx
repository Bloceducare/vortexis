'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Save, Loader2 } from 'lucide-react';
import StatusModal from '@/components/StatusModal';
import useOrganizer from '@/hooks/useOrganizers';
import { useQueryClient } from '@tanstack/react-query';

const TiptapEditor = dynamic(() => import('@/components/ui/TipTapEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-48 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-gray-400 text-sm animate-pulse">
      Loading editor…
    </div>
  ),
});

/** Maps each editable field to a human-readable label shown in the modal header */
const FIELD_LABELS: Record<string, string> = {
  description: 'Description',
  prizes: 'Other Prizes',
  rules: 'Rules & Guidelines',
};

export type EditableRichField = keyof typeof FIELD_LABELS;

interface RichTextEditModalProps {
  /** The backend field being edited — determines the modal title */
  field: EditableRichField;
  /** Current HTML content to pre-fill the editor */
  currentValue: string | null | undefined;
  hackathonId: string;
  onClose: () => void;
}

export default function RichTextEditModal({
  field,
  currentValue,
  hackathonId,
  onClose,
}: RichTextEditModalProps) {
  const [content, setContent] = useState(currentValue ?? '');
  const { updateHackathonMutation } = useOrganizer();
  const queryClient = useQueryClient();

  const [modal, setModal] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
    title?: string;
  }>({ open: false, type: 'success', message: '' });

  const label = FIELD_LABELS[field] ?? field;

  const handleSave = async () => {
    // Strip tags to compare; still send the full HTML
    const stripped = content.replace(/<[^>]*>/g, '').trim();
    const originalStripped = (currentValue ?? '').replace(/<[^>]*>/g, '').trim();

    if (stripped === originalStripped) {
      setModal({
        open: true,
        type: 'error',
        title: 'No Changes',
        message: 'No changes were made.',
      });
      return;
    }

    try {
      await updateHackathonMutation.mutateAsync({
        hackathonId,
        data: { [field]: content } as any,
      });

      queryClient.invalidateQueries({ queryKey: ['organizer_hackathon_byId', hackathonId] });

      setModal({
        open: true,
        type: 'success',
        title: 'Saved!',
        message: `${label} updated successfully.`,
      });

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      setModal({
        open: true,
        type: 'error',
        title: 'Update Failed',
        message: err?.message ?? 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit {label}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Changes are saved directly to your hackathon.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition rounded-lg p-1 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Editor body — scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 overflow-hidden focus-within:ring-2 focus-within:ring-[#0B40EE] transition-all min-h-[220px]">
              <TiptapEditor
                value={content}
                onChange={setContent}
                placeholder={`Write your ${label.toLowerCase()} here…`}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateHackathonMutation.isPending}
              className="flex-1 py-2.5 bg-[#0B40EE] hover:bg-[#0835C4] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateHackathonMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        type={modal.type}
        message={modal.message}
      />
    </>
  );
}

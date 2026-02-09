import React, { useState, useMemo } from 'react'
import EmailInput from '@/components/EmailInput';
import { useHackathonStore } from '@/store/useHackathonStore';
import useOrganizer from '@/hooks/useOrganizers';
import { getHackathonIdProps } from '@/app/api/utils/interface';
import SuccessModal from '@/components/SuccessModal';

const Invitation: React.FC<getHackathonIdProps> = ({ hackathon_id }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inviteLimit = 10;

  const { inviteJudgesMutation } = useOrganizer();
  const getHackathonData = useHackathonStore((state) => state.getHackathonData);
  const hackathon = useMemo(() => getHackathonData(), [getHackathonData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
  
    try {
      await inviteJudgesMutation.mutateAsync({
        emails: emails,
        hackathon_id,
      });
  
      setEmails([]);
      setShowSuccessModal(true);

    } catch (error: any) {
      const apiError = error?.response?.email?.[0] || error?.message || 'Something went wrong.';
      setErrorMessage(apiError);
    }
  };
  


  return (
    <>
    <section className="max-w-2xl">
  {/* Header */}
  <div className="mb-8 space-y-2">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Invite Judges
    </h1>
    <p className="text-gray-600 dark:text-gray-400">
      Invite judges to review submissions for{" "}
      <span className="font-semibold text-[#605DEC]">
        {hackathon?.title || "this hackathon"}
      </span>
    </p>
  </div>

  {/* Error */}
  {inviteJudgesMutation.isError && (
    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {errorMessage}
    </div>
  )}

  {/* Card */}
  <form
    onSubmit={handleSubmit}
    className="rounded-2xl border border-gray-200 dark:border-gray-700 
               bg-white dark:bg-gray-800 p-6 shadow-sm space-y-8"
  >
    {/* Email input */}
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        Invite by email
      </label>

      <EmailInput
        emails={emails}
        setEmails={setEmails}
        limit={inviteLimit}
      />

      <p className="text-xs text-gray-500">
        You can invite up to {inviteLimit} judges at once.
      </p>
    </div>

    {/* Instructions */}
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        Instructions for judges
      </label>

      <textarea
        className="w-full h-28 rounded-xl border border-gray-300 dark:border-gray-600 
                   bg-transparent px-4 py-3 text-sm outline-none 
                   focus:ring-2 focus:ring-[#605DEC]/40 
                   transition resize-none"
        placeholder="Add evaluation criteria, rules, or anything judges should know…"
        name="rules"
      />

      <p className="text-xs text-gray-500">
        This will be included in the invitation email.
      </p>
    </div>

    {/* CTA */}
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400">
        Invites will be sent immediately
      </p>

      <button
        type="submit"
        disabled={inviteJudgesMutation.isPending || emails.length === 0}
        className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 
          text-sm font-semibold text-white transition-all
          ${
            inviteJudgesMutation.isPending || emails.length === 0
              ? "bg-[#605DEC]/50 cursor-not-allowed"
              : "bg-[#605DEC] hover:shadow-lg hover:-translate-y-0.5"
          }`}
      >
        {inviteJudgesMutation.isPending ? "Sending…" : "Send Invites"}
      </button>
    </div>
  </form>


</section>

      {inviteJudgesMutation.isSuccess && showSuccessModal && (
        <SuccessModal
  title="✅ Judges Invited"
  message="The selected emails have been successfully sent invitations."
  onClose={() => setShowSuccessModal(false)}
/>

)}


    </>
  );
}

export default Invitation;

import React, { useState, useMemo } from 'react'
import EmailInput from '@/components/EmailInput';
import { useHackathonStore } from '@/store/useHackathonStore';
import useOrganizer from '@/hooks/useOrganizer';

function Invitation() {
  const [emails, setEmails] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inviteLimit = 3;

  const { createHackathonMutation, updateHackathonMutation, inviteJudgesMutation } = useOrganizer();
  const getHackathonData = useHackathonStore((state) => state.getHackathonData);
  const hackathon = useMemo(() => getHackathonData(), [getHackathonData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
     await inviteJudgesMutation.mutateAsync({
        email: emails,
        hackathonId: "1",
      });


      setShowSuccessModal(true);
      setEmails([]); 
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Something went wrong while sending invites.");
    }
  }

  return (
    <>
      <section>
        <div className="space-y-3 mb-6">
          <h1 className="text-2xl font-bold">Invite Judges</h1>
          <p>Add judges to evaluate submissions for your hackathon.</p>
        </div>

        {inviteJudgesMutation.isError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label className='text-lg font-bold text-[#2F3036]'>Invite by Email</label>
            <EmailInput emails={emails} setEmails={setEmails} limit={inviteLimit} />
          </div>

          <div className='mt-10 flex flex-col'>
            <label className='text-lg text-[#2F3036]'>Instructions for Judges</label>
            <textarea className='outline-none resize-none h-24 border-2 w-full border-[#C5C6CC] mt-3 rounded-2xl px-3 py-3' placeholder='Enter any specific instructions or criteria for judges...' name='rules'></textarea>
          </div>

          <button
  type="submit"
  disabled={inviteJudgesMutation.isPending || emails.length === 0}
  className={`bg-[#0B40EE] text-white py-2 px-8 rounded mt-10 transition
    ${inviteJudgesMutation.isPending || emails.length === 0
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:opacity-90 cursor-pointer'}
  `}
>
  {inviteJudgesMutation.isPending ? 'Sending Invites...' : 'Send Invites'}
</button>

        </form>
      </section>

      {inviteJudgesMutation.isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-3">🎉 Invitation Sent!</h2>
            <p className="text-gray-700 mb-4">Your judge(s) have been successfully invited.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Invitation;

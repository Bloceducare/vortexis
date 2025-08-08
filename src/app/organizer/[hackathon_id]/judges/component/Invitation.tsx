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
        email: emails,
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
            <textarea
              className='outline-none resize-none h-24 border-2 w-full border-[#C5C6CC] mt-3 rounded-2xl px-3 py-3'
              placeholder='Enter any specific instructions or criteria for judges...'
              name='rules'
            />
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

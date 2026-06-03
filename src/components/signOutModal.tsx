"use client";

interface SignOutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SignOutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: SignOutConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-opacity-50"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-out-dialog-title"
        aria-describedby="sign-out-dialog-description"
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 flex flex-col gap-4"
      >
        <h3
          id="sign-out-dialog-title"
          className="text-lg font-semibold text-gray-900"
        >
          Are you sure you want to sign out?
        </h3>
        <p id="sign-out-dialog-description" className="text-sm text-gray-500">
          Signing out will end your current session. You will need to log in
          again to access your account.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 cursor-pointer py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

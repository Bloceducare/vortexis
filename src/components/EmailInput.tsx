import React, { useState, KeyboardEvent, ChangeEvent } from 'react';

interface EmailInputProps {
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
  limit: number;
}

const EmailInput: React.FC<EmailInputProps> = ({ emails, setEmails, limit }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed) {
        addEmail(trimmed);
      }
    }
  };

  const addEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emails.length >= limit) {
      setError(`You can only add up to ${limit} emails`);
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      return;
    }

    if (emails.includes(email)) {
      setError('Email already added');
      return;
    }

    setEmails([...emails, email]);
    setInput('');
    setError('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (error) setError('');
  };

  const removeEmail = (index: number) => {
    const updated = emails.filter((_, i) => i !== index);
    setEmails(updated);
  };
  const placeholderMessage = () => {
    if(emails.length < limit) {
      return `You can input ${limit - emails.length} more email`;
    } else if (emails.length == limit) {
     return `You have added the maximum amount of email to be sent`;
    } else {
      return  `You can enter up to ${limit} emails`;
    }
  }

  console.log(emails.length)

  return (
    <div>
      <div className="w-full p-4 flex flex-wrap gap-3  rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3">
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-2xl"
          >
            <span>{email}</span>
            <button
              onClick={() => removeEmail(index)}
              className="ml-2 font-bold"
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderMessage()}
          className={emails.length == limit ? "cursor-not-allowed flex-grow outline-none p-2 h-7":  "flex-grow outline-none p-2 h-7"}
          disabled={emails.length == limit}
        />
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default EmailInput;
import React, { useState } from 'react';

interface RuleInputProps {
  rules: string[];
  setRules: (rules: string[]) => void;
}

export default function RuleInput({ rules, setRules }: RuleInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !rules.includes(trimmed)) {
        setRules([...rules, trimmed]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && input === '') {
      setRules(rules.slice(0, -1));
    }
  };

  const removeRule = (index: number) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

  return (
    <div className="w-full border-2 border-[#C5C6CC] rounded-2xl p-3 flex flex-wrap gap-2 min-h-[120px]">
      {rules.map((rule, index) => (
        <div>
        <div
          key={index}
          className="bg-blue-500 text-white  gap-2 p-3 rounded-xl space-x-5"
        >
          <span>{rule}</span>
          <button
            type="button"
            onClick={() => removeRule(index)}
            className="hover:text-gray-300"
          >
            &times;
          </button>
        </div>
        </div>
      ))}

      <textarea
        rows={1}
        className="outline-none resize-none flex-grow min-w-[150px]"
        placeholder="Type rule and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

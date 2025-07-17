"use client";

import React, { useState } from "react";
import Search from "@/public/assets/Search.svg";
import Image from "next/image";
import { SearchCheckIcon } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md ">
      {/* <Image 
        src={Search} 
        alt="Search Icon" 
        width={20} 
        height={20} 
        className="text-gray-500" 
      /> */}

      <SearchCheckIcon className="text-gray-500 w-[20px] h-[20px]" />

      <input
        type="text"
        placeholder="Search Hackathons"
        value={query}
        onChange={handleInputChange}
        className="flex-1 p-2 bg-transparent outline-none text-gray-700"
      />
    </div>
  );
};

export default SearchInput;

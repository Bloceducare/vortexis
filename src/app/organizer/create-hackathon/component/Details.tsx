import React, { useState } from 'react'
import { FileImageIcon } from 'lucide-react'
import { NavigationProps } from '@/components/Interface';
import { toast } from 'react-toastify';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/shallow';
import RuleInput from './RuleInput';


function Details({ onNext, data }: NavigationProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const [localData, setLocalData] = useState(data || {});
  const hackathonSelector = useShallow((state: any) => ({
    title: state.title,
    description: state.description,
    start_date: state.start_date,
    end_date: state.end_date,
    rules: state.rules,
    setField: state.setField,
  }));

  const { title, description, start_date, end_date, rules, setField } = useHackathonStore(hackathonSelector);
  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(title)
  
    if (title === "") {
      toast.error("Please enter a title for the hackathon", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
  
    if (description === "") {
      toast.error("Please enter a description", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
  
    if (start_date === "") {
      toast.error("Please enter a start date", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
  
    if (end_date === "") {
      toast.error("Please enter an ending date", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
  
    if (start >= end) {
      toast.error("Start date must be before the end date", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
  
    if (!localData.banner) {
      toast.error("Please upload a banner image", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
  
    // All validations passed
    // setData(localData);
    console.log("Data submitted:", localData);
  
    if (onNext) {
      onNext();
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setLocalData({ ...localData, "banner": file }); 
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
    <form onSubmit={handleContinue}>
        <div>
            <label className='text-2xl text-[#2F3036]'>Hackathon Name</label>
            <input 
            type='text'
            placeholder='Enter Hackathon Name'
            value={title}
            onChange={(e) => setField('title', e.target.value)}
            name='title'
            className='w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3'
            />
        </div>

        <div className='flex justify-between mt-10'>
        <div className='w-[45%]'>
            <label className='text-2xl text-[#2F3036]'>Start Date</label>
            <input 
            type='date'
            placeholder='Start Date'
            value={start_date}
            onChange={(e) => setField('start_date', e.target.value)}
            name='start_date'
            className='w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3 cursor-pointer'
            />
        </div>

        <div className='w-[45%]'>
            <label className='text-2xl text-[#2F3036]'>End Date</label>
            <input 
            type='date'
            placeholder='End date'
            value={end_date}
            onChange={(e) => setField('end_date', e.target.value)}
            name='end_date'
            className='w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3 cursor-pointer'
            />
        </div>

        </div>

        <div className='mt-10'>
  <label className="text-2xl text-[#2F3036]">Hackathon Banner</label>

   <div className="mt-3">
      <input
        type="file"
        name="banner"
        id="banner-upload"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      <label
        htmlFor="banner-upload"
        className="flex flex-col items-center justify-center text-center gap-3 w-full border border-[#C5C6CC] rounded-2xl px-4 py-8 cursor-pointer bg-[#FAFAFA] hover:bg-[#f0f0f0] transition min-h-[200px]"
      >
        {!preview ? (
          <>
            <div className="text-[#0B40EE] bg-[#0B40EE1A] p-3 flex justify-center items-center rounded-full">
              <FileImageIcon className="text-3xl" />
            </div>
            <div>
              <p className="text-[#2F3036] font-medium">Click to upload banner</p>
              <p className="text-sm text-gray-500">Accepts PNG, JPG, JPEG</p>
            </div>
          </>
        ) : (
          <img
            src={preview}
            alt="Banner Preview"
            className="max-h-48 w-full object-contain rounded-xl"
          />
        )}
      </label>
    </div>
</div>



        <div className='mt-10 flex flex-col'>
        <label className='text-2xl text-[#2F3036]'>Description</label>
        <textarea className='outline-none resize-none h-52 border-2 w-full border-[#C5C6CC] mt-3 rounded-2xl px-3 py-3' placeholder='Enter a detailed description of your hackathon' 
        name='description'
        value={description}
        onChange={(e) => setField('description', e.target.value)}
        ></textarea>
        </div>

        <div className="mt-10">
      <label className="text-2xl text-[#2F3036] mb-2 block">Rules & Guidelines</label>
      <RuleInput
        rules={rules}
        setRules={(newRules) => setField('rules', newRules)}
      />
    </div>



        <div className='mt-10'>
            <button className='bg-[#0B40EE] text-white py-2 px-8 rounded cursor-pointer' type='submit'>
                Next
            </button>
        </div>



    </form>
    
    
    </>
  )
}

export default Details
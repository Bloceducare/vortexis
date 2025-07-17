"use client";

import Link from "next/link";
import { Button } from "./ui/Button";

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#E0D9FB] via-[#D8DBFF] to-[#F4F4FF] overflow-hidden">
      {/* Gradient circles - Responsive positioning */}
      <div className="w-full flex gap-0 flex-row justify-center items-center h-screen absolute top-0 bottom-0 left-0 right-0">
        {/* Left circle */}
        <div className="
          w-[12em] h-[12em] 
          md:w-[15em] md:h-[15em] 
          lg:w-[25em] lg:h-[25em] 
          bg-[#d2bcff] rounded-full opacity-50 z-0 mix-blend-multiply 
          absolute 
          left-[-2em] mt-[-18em]
          md:left-[-2em] md:mt-[-26em]
          lg:left-[3em] lg:mt-[6em]
        " />
        
        {/* Center circle */}
        <div className="
          w-[20em] h-[20em] 
          md:w-[25em] md:h-[24em] 
          lg:w-[35em] lg:h-[35em] 
          bg-[#ffffff] rounded-full opacity-50 z-0 
          mt-[-2em]
          md:mt-[-12em]
          lg:mt-[24em]
        " />
        
        {/* Right circle */}
        <div className="
          w-[12em] h-[12em] 
          md:w-[18em] md:h-[18em] 
          lg:w-[35em] lg:h-[35em] 
          bg-[#c5c3ff] rounded-full opacity-50 z-0 mix-blend-multiply 
          absolute 
          right-[-2em] mt-[15em]
          md:right-[-2em] md:mt-[-16em]
          lg:right-[-3em] lg:mt-[10em]
        " />
      </div>

      <div className="
        relative z-10 max-w-5xl mx-auto 
        px-4 py-16
        md:px-8 md:py-24
        lg:px-4 lg:py-28
        text-center
      ">
        <h1 className="
          text-2xl leading-tight
          md:text-4xl md:leading-tight
          lg:text-5xl lg:leading-tight
          xl:text-6xl xl:leading-tight
          font-bold text-[#212121] mb-3
          md:mb-4
        ">
          Run. Join. Win.
        </h1>
        
        <h2 className="
          text-xl
          md:text-3xl
          lg:text-4xl
          xl:text-5xl
          font-semibold text-[#212121] mb-4
          md:mb-6
          lg:mb-6
        ">
          Everything Hackathon, All In 
        </h2>
          <span className="  text-xl
          md:text-3xl
          lg:text-4xl
          xl:text-5xl
          font-semibold text-[#212121] mb-4
          md:mb-6
          lg:mb-8">One Place.</span> 

        <p className="
          text-sm leading-relaxed
          md:text-lg md:leading-relaxed
          lg:text-xl lg:leading-relaxed
          text-[#212121] 
          max-w-xs mx-auto
          md:max-w-2xl
          lg:max-w-3xl
          mb-6
          md:mb-8
          lg:mb-10
          lg:mt-2
          font-medium 
          px-2 
          md:px-0
        ">
          Vortexis makes it easy to{" "}
          <span className="font-semibold">host hackathons</span>,{" "}
          <span className="font-semibold">collaborate with teammates</span>,
          and <span className="font-semibold">build innovative projects</span> —
          whether {`you're an `}
          <span className="font-bold">organizer</span>,{" "}
          <span className="font-bold">participant</span>, or{" "}
          <span className="font-bold">judge</span>.
        </p>

        <div className="
          flex flex-col gap-3
          md:flex-row md:justify-center md:gap-6
        ">
          <Button
            size="lg"
            className="
              bg-[#605DEC] text-white 
              px-6 py-3 text-base
              md:text-lg md:px-8 md:py-4
              lg:text-xl lg:px-10 lg:py-5
              w-full 
              md:w-auto md:min-w-[200px]
              lg:min-w-[220px]
              font-semibold
              hover:bg-[#5048D9] transition-colors duration-200
              shadow-lg hover:shadow-xl
            "
          >
            <Link href="/participants">For Participants</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="
              px-6 py-3 text-base
              md:text-lg md:px-8 md:py-4
              lg:text-xl lg:px-10 lg:py-5
              w-full 
              md:w-auto md:min-w-[200px]
              lg:min-w-[220px]
              font-semibold
              border-2 border-[#605DEC] text-[#605DEC]
              hover:bg-[#605DEC] hover:text-white 
              transition-all duration-200
              shadow-lg hover:shadow-xl
            "
          >
            <Link href="/organizer">For Organizers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
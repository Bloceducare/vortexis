import React from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
export default function HackathonCTA() {
  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">

        {/* New To Hackathons? Card */}

        <div className="relative w-full bg-[#605DEC] overflow-hidden rounded-3xl p-4 ">variant="primary" 
  <div className="absolute inset-0 overflow-hidden">
<div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 right-22" 
     style={{
       borderRadius: '50%'
     }} 
/>
    <div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 left-26" 
     style={{
       borderRadius: '50%'
     }} 
/>
<div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 left-0.5" 
     style={{
       borderRadius: '50%'
     }} 
/>
 
<div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 -right-3" 
     style={{
       borderRadius: '50%'
     }} 
/>
  </div>
  
  {/* Content */}
  <div className="relative z-10">
    <h2 className="text-white text-4xl font-bold mb-6 leading-tight">
      New To Hackathons?
    </h2>
    <p className="text-white text-md mb-8 leading-relaxed max-w-2xl">
      Jump into innovation. Collaborate, build, and showcase your talent. 
      Connect with like-minded individuals and create something amazing together.
    </p>
     <div className="flex justify-center">
      <Button 
        variant="outline" 
        size="lg" 
        className="px-8 py-4 text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#605DEC] transition-colors duration-200 rounded-lg"
      >
        <Link href="/participants">Register as a Participants</Link>
      </Button>
    </div>
  </div>
</div>

        {/* Ready To Host? Card */}

       <div className="relative w-full bg-[#605DEC] overflow-hidden rounded-2xl p-8">
          <div className="absolute inset-0 overflow-hidden">
<div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 right-22" 
     style={{
       borderRadius: '50%'
     }} 
/>
    <div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 left-26" 
     style={{
       borderRadius: '50%'
     }} 
/>
<div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 left-0.5" 
     style={{
       borderRadius: '50%'
     }} 
/>
 
<div className="w-55 h-72 bg-gradient-to-br from-[#8399E9] to-[#605DEC] absolute -top-0 -right-3" 
     style={{
       borderRadius: '50%'
     }} 
/>
  </div>
  <div className="relative z-10">

    <h2 className="text-white text-4xl font-bold mb-6 leading-tight">
            Ready To Host?

          </h2>
          <p className="text-md mb-6">
            Create impactful events with streamlined tools and built-in judging.
            Organize, manage, and get insights from your hackathon event
            seamlessly.
          </p>
     <div className="flex justify-center">

        <Button 
        variant="outline" 
        size="lg" 
        className="px-8 py-4 text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#605DEC] transition-colors duration-200 rounded-lg"
      >
            <Link href="/organizers">Register as Organizer</Link>
          </Button>
          </div>
        </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2 text-gray-800">
          Stay Up to date with Hackathons
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Subscribe to our news letter
        </p>
        <Button size="lg" className="px-6 py-3 text-lg">
          Subscribe
        </Button>
      </div>
    </div>
  );
}

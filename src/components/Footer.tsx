import React from 'react';
import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="text-white px-6 py-10 bg-[#4925D5] dark:bg-[]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>

          <h2 className="text-2xl font-bold">VORTEXIS</h2>
          <p className="mt-12  text-sm font-light">
            The All-In-One Platform For Hackathons, Collaboration, And Innovation.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-lg">
            {/* <li><Link href="document">• Documentation</Link></li> */}
            {/* <li><Link href="api">• API</Link></li> */}
            <li><Link href="mailto:support@web3bridge.com">• Support</Link></li>
<li><Link href="https://t.me/web3bridge" target="_blank" rel="noopener noreferrer">• Join Community</Link></li>          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Resources</h3>
          <ul className="space-y-1 text-lg">
            <li><Link href="/about">• About</Link></li>
            <li><Link href="/features">• Features</Link></li>
            <li><Link href="/hackathon">• Hackathons</Link></li>
            <li><Link href="/faqs">• FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h3 className=" text-xl font-semibold mb-2">Socials</h3>
          <div className="flex flex-col space-y-4 mt-4 justify-center">
           <Link 
  href="https://ng.linkedin.com/company/web3bridge" 
  aria-label="LinkedIn" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaLinkedin className="w-5 h-5" />
</Link>

<Link 
  href="https://x.com/Web3Bridge" 
  aria-label="X" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaXTwitter className="w-5 h-5" />
</Link>

<Link 
  href="https://www.instagram.com/web3bridge" 
  aria-label="Instagram" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaInstagram className="w-5 h-5" />
</Link>
          </div>
        </div>
      </div>

      <div className="text-stert text-xs mt-10">
        © 2025 Vortexis. All rights reserved.
      </div>
    </footer>
  );
};

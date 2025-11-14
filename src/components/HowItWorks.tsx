"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import image3 from "@/public/assets/image3.svg";
import icon1 from "@/public/assets/icon1.svg";
import icon2 from "@/public/assets/icon2.svg";
import icon3 from "@/public/assets/icon3.svg";
import icon4 from "@/public/assets/icon4.svg";

export default function HowItWorks() {
  return (
    <div className="w-full mx-auto p-6 bg-white">
      <div className="max-w-7xl mx-auto p-6 bg-white">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-indigo-600 text-center mb-8"
        >
          Platform Overview
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-3 text-start ">
              How It Works
            </h2>
            <p className="text-gray-600 text-md mb-6 ">
              Bringing organizations and developers together to
              create, inspire, and innovate
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Image
                src={image3}
                alt="Team collaboration with laptops around a table"
                className="rounded-3xl md:w-96 h-auto"
              />
            </motion.div>
          </motion.div>

          {/* Right Side - Features */}
          <div className="lg:mt-8 space-y-6">
            {[
              {
                icon: icon4,
                title: "All-In-One Platform",
                text: "Manage, build, and ideate in one workspace without switching between tools.",
              },
              {
                icon: icon3,
                title: "Team Collaboration",
                text: "Work seamlessly across time zones and roles with integrated communication tools.",
              },
              {
                icon: icon2,
                title: "Real-Time Analytics",
                text: "Get actionable data on participation, engagement, and submissions.",
              },
              {
                icon: icon1,
                title: "Built For Devs",
                text: "API support, submission tracking, and powerful toolkits for technical teams.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex"
              >
                <div className="mr-4">
                  <Image src={feature.icon} alt={feature.title} className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">{feature.title}</h3>
                  <p className="text-md text-gray-600">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"


import { useState } from "react";
import {Card }from "@/components/ui/card";
import { Code, FileText, Link } from "lucide-react";

const TabMenu = ["api-documentation", "design-assets", "mentors", "faqs"];

const Resources = () => {
  const [activeTab, setActiveTab] = useState<string>("api-documentation");

  const apiDocumentationResources = [
    {
      title: "Climate Data API",
      description: "Access global climate change datasets",
      details: "Comprehensive API for climate data with historical trends, forecasts, and real-time measurements.",
      icon: <Code className="w-8 h-8 text-teal-500" />,
      linkColor: "text-teal-600",
      linkText: "View Documentation"
    },
    {
      title: "AI Assistant API", 
      description: "Natural language processing tools",
      details: "Advanced NLP API for text analysis, sentiment detection, and conversational AI capabilities.",
      icon: <Code className="w-8 h-8 text-orange-500" />,
      linkColor: "text-orange-600",
      linkText: "View Documentation"
    },
    {
      title: "Web3 SDK",
      description: "Blockchain integration tools", 
      details: "Complete SDK for building Web3 applications with smart contract templates and wallet integration.",
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      linkColor: "text-purple-600",
      linkText: "View Documentation"
    },
    {
      title: "Payment Processing API",
      description: "Secure payment integration",
      details: "Test environment for payment processing with multiple providers and currency support.",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      linkColor: "text-blue-600", 
      linkText: "View Documentation"
    },
    {
      title: "Payment Processing API",
      description: "Secure payment integration",
      details: "Test environment for payment processing with multiple providers and currency support.",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      linkColor: "text-blue-600",
      linkText: "View Documentation"
    },
    {
      title: "Payment Processing API", 
      description: "Secure payment integration",
      details: "Test environment for payment processing with multiple providers and currency support.",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      linkColor: "text-blue-600",
      linkText: "View Documentation"
    }
  ];

  const designAssets = [
    {
      title: "UI Kit Components",
      description: "Ready-to-use design components",
      details: "Complete UI kit with buttons, forms, cards, and navigation elements for rapid prototyping.",
      icon: <FileText className="w-8 h-8 text-indigo-500" />,
      linkColor: "text-indigo-600",
      linkText: "Download Assets"
    },
    {
      title: "Icon Library",
      description: "Scalable vector icons",
      details: "Comprehensive collection of SVG icons optimized for web and mobile applications.",
      icon: <FileText className="w-8 h-8 text-green-500" />,
      linkColor: "text-green-600", 
      linkText: "Browse Icons"
    }
  ];

  const mentors = [
    {
      title: "Tech Industry Experts",
      description: "Get guidance from experienced professionals",
      details: "Connect with senior developers, product managers, and CTOs from leading tech companies.",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      linkColor: "text-blue-600",
      linkText: "Find Mentors"
    },
    {
      title: "Startup Founders",
      description: "Learn from successful entrepreneurs", 
      details: "Get insights from founders who have built and scaled successful startups in various industries.",
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      linkColor: "text-purple-600",
      linkText: "Connect Now"
    }
  ];

  const faqs = [
    {
      title: "Getting Started Guide",
      description: "Everything you need to know to begin",
      details: "Step-by-step guide covering registration, team formation, and project submission requirements.",
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      linkColor: "text-orange-600",
      linkText: "Read Guide"
    },
    {
      title: "Technical Requirements",
      description: "Platform and technology specifications",
      details: "Detailed technical requirements, supported frameworks, and deployment guidelines.",
      icon: <FileText className="w-8 h-8 text-teal-500" />,
      linkColor: "text-teal-600", 
      linkText: "View Requirements"
    }
  ];

  const getResourcesForTab = (tab: string) => {
    switch (tab) {
      case "api-documentation":
        return apiDocumentationResources;
      case "design-assets":
        return designAssets;
      case "mentors":
        return mentors;
      case "faqs":
        return faqs;
      default:
        return apiDocumentationResources;
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-2xl p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Resources</h1>
          <p className="text-gray-600 text-lg">Documentations, tools, and assets for your hackathon projects</p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="grid w-full grid-cols-4 mb-8">
            {TabMenu.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                type="button"
                value="api-documentation"
                className="text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {tab}
              </button>
            ))}
          </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesForTab(activeTab).map((resource, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-4">
                        {resource.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {resource.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-3">
                        {resource.description}
                      </p>

                      {/* Details */}
                      <p className="text-gray-500 text-sm mb-4 flex-grow">
                        {resource.details}
                      </p>

                      {/* Link */}
                      <button 
                        type="button"
                        className={`${resource.linkColor} hover:bg-gray-50 justify-start p-0 h-auto font-medium`}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        {resource.linkText}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Resources;
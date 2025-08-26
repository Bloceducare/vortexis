import React from "react";

const Spinner = () => {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-white">
  //       <div className="relative">
  //         <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>

  //         <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
  //       </div>

  //       <div className="absolute mt-20 text-gray-600 text-sm font-medium animate-pulse">
  //         Loading...
  //       </div>
  //     </div>
  //   );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">{"Loading..."}</p>
      </div>
    </div>
  );
};

export default Spinner;

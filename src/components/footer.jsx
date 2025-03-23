// src/components/footer.jsx
import React, { forwardRef } from "react";

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-gradient-to-r from-[#149808] via-[#FFFFFF] to-[#FF9933] py-6 ">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left section */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-lg font-semibold text-gray-800">
            Judicare
          </h2>
          <p className="text-sm text-gray-600">
            Empowering Citizens, Simplifying Justice
          </p>
        </div>
        
        
        
        {/* Right section */}
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Judicare. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Disclaimer: This platform is for informational purposes only and is not an official legal authority.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
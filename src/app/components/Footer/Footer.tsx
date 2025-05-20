import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                CF
              </div>
              <span className="font-bold">Cf Analyser</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Improve your competitive programming skills
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <i className="fab fa-github text-xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <i className="fab fa-discord text-xl"></i>
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-sm text-gray-400 text-center">
          © 2025 Cf Analyser. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

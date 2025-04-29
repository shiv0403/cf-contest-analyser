import React from "react";

interface HandleInputProps {
  handle: string;
  setHandle: (handle: string) => void;
  isLoading: boolean;
}

const HandleInput: React.FC<HandleInputProps> = ({
  handle,
  setHandle,
  isLoading,
}) => {
  return (
    <div>
      <label
        htmlFor="handle"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Codeforces Handle
      </label>
      <div className="relative">
        <input
          type="text"
          id="handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Enter Codeforces handle"
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 text-sm"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
          <i className="fas fa-user text-sm"></i>
        </div>
      </div>
    </div>
  );
};

export default HandleInput;

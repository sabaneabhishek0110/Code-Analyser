import React from 'react';

function ProblemInput({ value, onChange }) {
  return (
    <div className="h-full flex flex-col p-6 bg-[#1e1e1e]">
      <label className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-3">
        Problem Description 
      </label>
      <p className="text-xs text-gray-500 mb-4">
        Paste the problem statement here. Giving the analyzer context helps it determine if your specific logic fits the requirements.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full resize-none bg-[#262626] border border-[#3e3e42] rounded-md p-4 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#5c5c5c] transition-colors custom-scrollbar shadow-inner"
        placeholder="e.g., Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
      />
    </div>
  );
}

export default ProblemInput;
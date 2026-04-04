import React from 'react';

function ResultCard({ label, value, fullWidth = false, icon = "" }) {
  return (
    <div className={`bg-[#2a2a2a] border border-[#3e3e42] p-4 rounded-lg shadow-sm flex flex-col gap-1 ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div className="text-gray-200 text-lg font-semibold font-mono tracking-tight mt-1">
        {value || 'N/A'}
      </div>
    </div>
  );
}

export default ResultCard;
import React from 'react';

export const DeveloperSettings: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center h-full p-6 bg-slate-50 text-slate-600">
      <div className="text-center max-w-sm">
        <span className="material-symbols-outlined text-4xl mb-4 text-[#3525cd]">settings</span>
        <h2 className="text-xl font-bold text-[#0b1c30] mb-2">Developer Settings</h2>
        <p className="text-sm leading-relaxed">Your local sandbox and IDE preferences are managed here.</p>
      </div>
    </div>
  );
};

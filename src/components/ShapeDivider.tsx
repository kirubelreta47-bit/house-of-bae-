import React from "react";

interface ShapeDividerProps {
  type?: "drop" | "rectangle" | "triangle" | "ellipse";
}

export const ShapeDivider: React.FC<ShapeDividerProps> = ({ type = "drop" }) => {
  return (
    <div className="flex items-center justify-center gap-5 my-8 max-w-4xl mx-auto px-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c7a252]/30 to-transparent" />
      <div className="text-[#c7a252] opacity-80 transition-transform hover:scale-110">
        {type === "drop" && (
          <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
            <path
              d="M13 1C13 1 1 12 1 21C1 27.6274 6.37258 33 13 33C19.6274 33 25 27.6274 25 21C25 12 13 1 13 1Z"
              stroke="#c7a252"
              strokeWidth="1.2"
            />
          </svg>
        )}
        {type === "rectangle" && (
          <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
            <rect x="4" y="4" width="18" height="26" rx="4" stroke="#c7a252" strokeWidth="1.2" />
          </svg>
        )}
        {type === "triangle" && (
          <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
            <path d="M13 1L23 21C23 27.6 18.5 33 13 33C7.5 33 3 27.6 3 21L13 1Z" stroke="#c7a252" strokeWidth="1.2" />
          </svg>
        )}
        {type === "ellipse" && (
          <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
            <circle cx="13" cy="17" r="11" stroke="#c7a252" strokeWidth="1.2" />
          </svg>
        )}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c7a252]/30 to-transparent" />
    </div>
  );
};

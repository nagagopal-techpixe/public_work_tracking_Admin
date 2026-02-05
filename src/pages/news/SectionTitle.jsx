import React from "react";

const SectionTitle = ({ title, subtitle, align = "center" }) => {
  return (
    <div
      className={`mb-12 ${
        align === "left" ? "text-left" : "text-center"
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        {title}
      </h2>

      {subtitle && (
        <div className="h-1 w-20 bg-orange-600 mx-auto rounded-full"></div>
      )}
    </div>
  );
};

export default SectionTitle;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";

function NavTabs({ tabs, selected, setSelected }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    setSelected(tab);
    if (tab === "Home") {
      navigate("/");
    } else if (tab === "Regions") {
      navigate("/regionExplorer");
    } else if (tab === "Compare") {
      navigate("/countryCompare");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-md bg-background p-6">
      {tabs.map((tab) => (
        <Tab 
          text={tab} 
          selected={selected === tab} 
          setSelected={() => handleTabClick(tab)} 
          key={tab} 
        />
      ))}
    </div>
  );
}

// Tab component remains the same
function Tab({ text, selected, setSelected }) {
  return (
    <button
      onClick={setSelected}
      className={cn(
        "relative rounded-md p-2 text-sm transition-all",
        selected ? "text-surface font-semibold" : "text-text font-bold",
      )}
    >
      <p className="relative z-50 min-w-20">{text}</p>
      {selected && (
        <motion.span
          layoutId="tabs"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 rounded-lg bg-primary"
        />
      )}
    </button>
  );
}

export default NavTabs;
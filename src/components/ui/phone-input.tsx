import React, { useState, useRef, useEffect } from "react";
import countryData from "./country-data.json";

interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country: Country;
  onCountryChange: (country: Country) => void;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  country,
  onCountryChange,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const filteredCountries = countryData.filter(
    (c: Country) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial_code.includes(search),
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={`flex ${className}`} ref={containerRef}>
      <div className="relative flex-shrink-0">
        <button
          type="button"
          className="flex items-center px-2 bg-white h-10 border-r border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded-l-lg"
          tabIndex={0}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="mr-1">{country.flag}</span>
          <span>{country.dial_code}</span>
          <svg
            className="ml-1 w-3 h-3 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.293l3.71-3.06a.75.75 0 1 1 .96 1.15l-4.25 3.5a.75.75 0 0 1-.96 0l-4.25-3.5a.75.75 0 0 1 .02-1.06z" />
          </svg>
        </button>
        {open && (
          <div className="absolute left-0 z-10 mt-1 w-56 max-h-64 overflow-auto bg-white border border-gray-200 rounded shadow-lg">
            <input
              type="text"
              className="w-full px-2 py-1 border-b border-gray-200 text-sm focus:outline-none"
              placeholder="Search country or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <ul className="max-h-48 overflow-auto" role="listbox">
              {filteredCountries.map((c) => (
                <li
                  key={c.code}
                  className={`flex items-center px-2 py-1 cursor-pointer hover:bg-blue-50 ${c.code === country.code ? "bg-blue-100" : ""}`}
                  onClick={() => {
                    onCountryChange(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  role="option"
                  aria-selected={c.code === country.code}
                >
                  <span className="mr-2">{c.flag}</span>
                  <span className="mr-2">{c.dial_code}</span>
                  <span className="text-xs text-gray-600">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        className="flex-1 bg-white px-3 h-10 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded-r-lg border-0"
        value={value}
        onChange={(e) => {
          // Only allow numbers
          const numeric = e.target.value.replace(/[^0-9]/g, "");
          onChange(numeric);
        }}
        placeholder="Phone number"
      />
    </div>
  );
};

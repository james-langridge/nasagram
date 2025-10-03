"use client";

// Date navigation component
// Allows users to browse photos by Earth date

import { useState } from "react";

interface DateNavigationProps {
  readonly selectedDate: string | null;
  readonly onDateChange: (date: string | null) => void;
}

export function DateNavigation({
  selectedDate,
  onDateChange,
}: DateNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedDate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      onDateChange(inputValue);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onDateChange(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {selectedDate || "Latest"}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full mt-2 left-0 right-0 sm:left-0 sm:right-auto z-20 bg-white border border-gray-200 rounded-lg shadow-lg sm:min-w-[300px] p-4">
            <h3 className="text-sm font-semibold mb-3">Browse by Date</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Earth Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2024-01-01"
                />
              </div>

              <div className="text-xs text-gray-500">
                Note: Not all dates have available photos. The rover may not
                have taken photos on the selected date.
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!inputValue}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                {selectedDate && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

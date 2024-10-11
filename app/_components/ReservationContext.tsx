"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { DateRange } from "../interface/interface";

interface ReservationContextType {
  range: DateRange;
  setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  resetRange: () => void; // Ensure resetRange is defined as a function that takes no arguments
}

// Initial state for the date range
const initialState: DateRange = {
  from: undefined,
  to: undefined,
};

// Create the ReservationContext with an initial undefined state
const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

// ReservationProvider component with type for children prop
export const ReservationProvider = function ({
  children,
}: {
  children: ReactNode;
}) {
  const [range, setRange] = useState<DateRange>(initialState);
  const resetRange = () => setRange(initialState);
  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
};

// Custom hook to use the ReservationContext
export const useReservation = function () {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }

  return context;
};

"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  CabinInteface,
  DateRange,
  SettingsInterface,
} from "../interface/interface";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range: DateRange, datesArr: string[]) {
  // Check if both range.from and range.to are defined
  if (range.from === undefined || range.to === undefined) {
    return false;
  }

  // Convert string dates to Date objects and check if they fall within the interval
  return datesArr.some((dateStr: string) => {
    const date = new Date(dateStr);
    return isWithinInterval(date, { start: range.from!, end: range.to! });
  });
}
function DateSelector({
  settings,
  cabin,
  bookedDates,
}: {
  settings: SettingsInterface;
  cabin: CabinInteface;
  bookedDates: Date[] | string[];
}) {
  const { range, setRange, resetRange } = useReservation();
  const displayRange = isAlreadyBooked(range, bookedDates as string[])
    ? { from: "", to: "" }
    : range;

  // CHANGE
  const { regularPrice, discount } = cabin;

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;
  const numNights = differenceInDays(
    displayRange.to as Date,
    displayRange.from as Date
  );
  const cabinPrice = numNights * regularPrice - discount;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        onSelect={(selectedRange) => {
          if (selectedRange) {
            setRange(selectedRange); // Only set range if selectedRange is not undefined
          }
        }}
        selected={range}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;

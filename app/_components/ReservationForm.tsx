"use client";

import { differenceInDays } from "date-fns";
import { User } from "next-auth";
import { createReservation } from "../_lib/action";
import { BookingDataType, CabinInteface } from "../interface/interface";
import { useReservation } from "./ReservationContext";
import SubmitButton from "./SubmitButton";

function ReservationForm({
  cabin,
  user,
}: {
  cabin: CabinInteface;
  user: User;
}) {
  // CHANGE
  const { maxCapacity, regularPrice, discount, id } = cabin;
  const { range } = useReservation();
  const startDate = range.from as Date;
  const endDate = range.to as Date;
  const numNights = differenceInDays(endDate as Date, startDate as Date);
  const cabinPrice = numNights * regularPrice - discount;
  const bookingData: BookingDataType = {
    startDate,
    endDate,
    cabinPrice,
    cabinId: id,
    numNights,
  };
  // Convert to FormData
  // const formData = new FormData();
  // formData.append("startDate", bookingData.startDate?.toISOString() || "");
  // formData.append("endDate", bookingData.endDate?.toISOString() || "");
  // formData.append("cabinPrice", bookingData.cabinPrice.toString());
  // formData.append("cabinId", bookingData.cabinId);
  // formData.append("numNights", bookingData.numNights);
  const createBookingWithData = createReservation.bind(null, bookingData);
  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <img
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image || ""}
            alt={user.name || ""}
            // width={100}
            // height={100}
          />
          <p>{user.name}</p>
        </div>
      </div>
      <p>
        {range.from ? String(range?.from) : "______"} to{" "}
        {range.to ? String(range?.to) : "______"}
      </p>

      <form
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
        action={createBookingWithData}
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">Start by selecting dates</p>

          <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;

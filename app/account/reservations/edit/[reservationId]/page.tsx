import SubmitButton from "@/app/_components/SubmitButton";
import { updateReservation } from "@/app/_lib/action";
import { getBooking } from "@/app/_lib/data-service";
import React from "react";

export default async function Page({
  params,
}: {
  params: { reservationId: string };
}) {
  const { reservationId } = params;

  const { numGuests, observations, cabinId } = await getBooking(reservationId);
  const maxCapacity = 23;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{cabinId}
      </h2>

      <form
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        action={updateReservation}
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            defaultValue={numGuests}
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
        <input type="hidden" name="reservationId" value={reservationId} />

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            defaultValue={observations}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
         <SubmitButton pendingLabel="Updating">
          Update Reservation
         </SubmitButton>
        </div>
      </form>
    </div>
  );
}

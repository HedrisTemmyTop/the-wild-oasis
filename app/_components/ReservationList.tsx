"use client";

import React, { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { BookingsInterface } from "../interface/interface";
import { deleteReservation } from "../_lib/action";

export default function ReservationList({
  bookings,
}: {
  bookings: BookingsInterface[];
}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currentBookings, bookingId) => {
      return currentBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId: string) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookingDataType, SessionInterface } from "../interface/interface";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import supabase from "./supabase";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData: FormData) {
  const session = (await auth()) as SessionInterface;

  if (session?.user) {
    const nationalID = formData.get("nationalID") as string | null; // Expecting a string or null
    const nationalityWithFlag = formData.get("nationality") as string | null; // Expecting a string or null

    if (!nationalID) {
      throw new Error("National ID is required.");
    }

    if (!nationalityWithFlag) {
      throw new Error("Nationality is required.");
    }

    const [nationality, countryFlag] = nationalityWithFlag.split("%");

    // Validate nationalID format
    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
      throw new Error("Please provide a valid national ID");
    }

    const updatedFields = { nationalID, nationality, countryFlag };

    // Update guest in the database
    const { error } = await supabase
      .from("guests")
      .update(updatedFields)
      .eq("id", session.user.guestId)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to update guest: " + error.message);
    }

    revalidatePath("/account/profile");
  } else {
    throw new Error("You are not authenticated");
  }
}

export async function deleteReservation(bookingId: string) {
  const session = (await auth()) as SessionInterface;
  const guestBookings = await getBookings(session.user.guestId as string);
  const guestBookingsId = guestBookings.map((booking) => +booking.id);
  const bookingIdNum: number = Number(bookingId);
  if (!guestBookingsId.includes(bookingIdNum)) {
    throw new Error("You are not allowed to delete the booking");
  }
  if (session?.user) {
    await supabase.from("bookings").delete().eq("id", bookingId);
    revalidatePath("/account/reservations");
  } else {
    throw new Error("You are not authenticated");
  }
}

export async function updateReservation(formData: FormData) {
  const session = (await auth()) as SessionInterface;
  const guestBookings = await getBookings(session.user.guestId as string);
  const reservationId = formData.get("reservationId") as string;
  console.log(guestBookings, reservationId, "reservationId");
  const guestBookingsId = guestBookings.map((booking) => +booking.id);
  const bookingIdNum: number = Number(reservationId);

  // The reservationId from params
  const numGuests = formData.get("numGuests"); // Number of guests selected from the dropdown (4 in this example)
  const observations = formData.get("observations");
  if (!numGuests && !observations) return;
  if (!guestBookingsId.includes(bookingIdNum)) {
    throw new Error("You are not allowed to edit the booking");
  }
  const updatedFields = {
    observations,
    numGuests,
  };
  if (session?.user) {
    await supabase
      .from("bookings")
      .update(updatedFields)
      .eq("id", reservationId)
      .select()
      .single();
    // 6) Revalidation
    revalidatePath(`/account/reservations/edit/${reservationId}`);
    revalidatePath("/account/reservations");

    // 7) Redirecting
    redirect("/account/reservations");
  } else {
    throw new Error("You are not authenticated");
  }
}

export async function createReservation(
  bookingData: BookingDataType,
  formData: FormData
) {
  const session = (await auth()) as SessionInterface;
  console.log(bookingData, "booking data");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations"),
    totalPrice: bookingData.cabinPrice,
    hasBreakfast: false,
    isPaid: false,
    status: "unconfirmed",
  };
  if (session?.user) {
    const { error } = await supabase.from("bookings").insert([newBooking]);
    console.log(error);
    if (error) throw new Error("Booking could not be created");
    revalidatePath(`/cabins/${bookingData.cabinId}`);
    redirect("/cabins/thankyou");
  } else {
    throw new Error("You are not authenticated");
  }
}

// numNights

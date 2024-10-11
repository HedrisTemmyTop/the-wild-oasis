import { eachDayOfInterval, isFuture, isPast, isToday } from "date-fns";
import { notFound } from "next/navigation";
import { subtractDates } from "../_utils/helper";
import { BookingsInterface, Guest } from "../interface/interface";
import { bookings, cabins } from "./data";
import supabase from "./supabase";

/////////////
// GET

export async function getCabin(id: string) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id: string) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}
export async function createBookings() {
  // Bookings need a guestId and a cabinId. We can't tell Supabase IDs for each object, it will calculate them on its own. So it might be different for different people, especially after multiple uploads. Therefore, we need to first get all guestIds and cabinIds, and then replace the original IDs in the booking data with the actual ones from the DB
  const { data: guestsIds } = await supabase
    .from("guests")
    .select("id")
    .order("id");
  const allGuestIds = guestsIds?.map((cabin) => cabin.id);
  const { data: cabinsIds } = await supabase
    .from("cabins")
    .select("id")
    .order("id");
  const allCabinIds = cabinsIds?.map((cabin) => cabin.id);

  const finalBookings = bookings.map((booking) => {
    // Here relying on the order of cabins, as they don't have and ID yet
    const cabin = cabins.at(booking.cabinId - 1);
    if (!cabin) return;
    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0; // hardcoded breakfast price
    const totalPrice = cabinPrice + extrasPrice;

    let status;
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    )
      status = "checked-out";
    if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = "checked-in";

    if (allGuestIds && allCabinIds)
      return {
        ...booking,
        numNights,
        cabinPrice,
        extrasPrice,
        totalPrice,
        guestId: allGuestIds.at(booking.guestId - 1),
        cabinId: allCabinIds.at(booking.cabinId - 1),
        status,
      };
  });

  console.log(finalBookings);

  const { error } = await supabase.from("bookings").insert(finalBookings);
  if (error) console.log(error.message);
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image, description")
    .order("name");

  // await new Promise((res) => setTimeout(res, 3000));
  console.log("cabin data", data);
  console.log(error);
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(
  guestId: string
): Promise<BookingsInterface[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, 
       cabins(name, image), status, extrasPrice, isPaid, cabinPrice, observations`
    ) // Ensure all necessary fields are selected
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Map the data to BookingsInterface
  const bookings: any = data.map((item) => ({
    id: item.id,
    created_at: new Date(item.created_at),
    startDate: new Date(item.startDate),
    endDate: new Date(item.endDate),
    numNights: item.numNights,
    numGuests: item.numGuests,
    totalPrice: item.totalPrice,
    guestId: item.guestId,
    cabinId: item.cabinId,
    cabins: item.cabins,
    status: item.status || "pending", // Default to "pending" if not provided
    extrasPrice: item.extrasPrice || 0, // Default to 0 if not provided
    isPaid: item.isPaid || false, // Default to false if not provided
    cabinPrice: item.cabinPrice || 0, // Default to 0 if not provided
    observations: item.observations || "", // Default to empty string if not provided
  }));

  return bookings;
}

export async function getBookedDatesByCabinId(cabinId: string) {
  let today: string | Date = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: Partial<Guest>) {
  console.log("new guest");
  const { data, error } = await supabase.from("guests").insert([newGuest]);
  console.log("guest created", data);
  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking: BookingsInterface) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: string, updatedFields: Partial<Guest>) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id: string, updatedFields: Partial<Guest>) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: string) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createCabins() {
  const { error, data } = await supabase.from("cabins").insert(cabins);
  console.log("data", data);
  if (error) console.log(error.message);
}

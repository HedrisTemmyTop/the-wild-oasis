import { DateRange as DayPickerDateRange } from "react-day-picker";

export interface CabinInteface {
  name: string;
  id: string;
  description: string;
  maxCapacity: number;
  discount: number;
  regularPrice: number;
  image: string;
}

export interface SettingsInterface {
  maxBookingLength: number;
  minBookingLength: number;
}

export interface BookingsInterface {
  id: string; // or whatever type id is
  created_at: Date; // or string depending on your setup
  startDate: Date; // or string
  endDate: Date; // or string
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: string; // or whatever type it is
  cabinId: string; // or whatever type it is
  cabins: { name: string; image: string };
  status: string; // e.g., "confirmed", "pending"
  extrasPrice: number; // amount for extras
  isPaid: boolean; // indicates if payment has been completed
  cabinPrice: number; // price per cabin
  observations?: string; // optional notes or comments
}

interface Cabin {
  name: string;
  image: string;
}

export interface BookingsInterface2 {
  id: string;
  created_at: Date;
  startDate: Date;
  endDate: Date;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: string;
  cabinId: string;
  cabins: Cabin[];
  status: string;
  extrasPrice: number;
  isPaid: boolean;
  cabinPrice: number;
  observations: string;
}

export interface BookingDataType {
  startDate: Date;
  endDate: Date;
  cabinPrice: number;
  cabinId: string;
  numNights: number;
}
export interface BookingsInterfaceType {
  id: string; // or whatever type id is
  created_at: Date; // or string depending on your setup
  startDate: Date; // or string
  endDate: Date; // or string
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: string; // or whatever type it is
  cabinId: string; // or whatever type it is
  cabins: { name: string; image: string }[];
  status: string; // e.g., "confirmed", "pending"
  extrasPrice: number; // amount for extras
  isPaid: boolean; // indicates if payment has been completed
  cabinPrice: number; // price per cabin
  observations?: string; // optional notes or comments
}
// Define types for the context state
// export  interface DateRange{}

export interface UserInterface {
  name: string;
  email: string;
  image: string;
  guestId?: string;
}

export interface SessionInterface {
  user: UserInterface;
  expires: string;
}

export interface CountryInterface {
  name: string;
  flag: string;
}
// Define the shape of a guest in your database
export interface Guest {
  id: string;
  name?: string;
  email?: string; // Optional
  phone?: string;
  fullName?: string;
  nationality?: string;
  nationalID?: string;
  countryFlag?: string;
}
export type DateRange = DayPickerDateRange;

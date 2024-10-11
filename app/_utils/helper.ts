// import { differenceInDays } from "date-fns";
import { parseISO } from "date-fns";
import { differenceInDays } from "date-fns/fp";

export const subtractDates = (dateStr1: string, dateStr2: string) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

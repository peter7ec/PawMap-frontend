import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCombinedDateTime(
  date: Date | undefined,
  time: string
): Date | undefined {
  if (!date) return undefined;
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours);
  combined.setMinutes(minutes);
  combined.setSeconds(seconds);
  combined.setMilliseconds(0);
  return combined;
}

export function parseAddress(addressStreet: string): {
  city: string;
  street: string;
} {
  const [city, ...streetParts] = addressStreet.split(",");
  return {
    city: city.trim(),
    street: streetParts.join(",").trim(),
  };
}

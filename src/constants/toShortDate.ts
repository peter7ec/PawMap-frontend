export function toShortDate(newDate: string) {
  return new Date(newDate).toLocaleDateString("hu", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toDate(value: string | null | undefined): Date {
  if (value == null) {
    return new Date();
  }
  return new Date(value);
}

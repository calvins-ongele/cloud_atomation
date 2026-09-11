// engine/utils/dates.ts

export function nowUtc(): Date {
  return new Date(Date.now());
}

export function toIso(date: Date | number | string): string {
  return new Date(date).toISOString();
}

export function unix(): number {
  return Math.floor(Date.now() / 1000);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addHours(date: Date, hours: number): Date {
  return addMinutes(date, hours * 60);
}

export function addDays(date: Date, days: number): Date {
  return addHours(date, days * 24);
}

export function isExpired(expiry: Date | number | string): boolean {
  return new Date(expiry).getTime() <= Date.now();
}

export function formatDateShort(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}
export function receiptDate(date: Date | string | number = new Date() ) {

    const d = new Date(date);

    const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const day = String(d.getDate()).padStart(2, "0");

    const month = months[d.getMonth()];

    const year = d.getFullYear();

    let hour = d.getHours();

    const minute = String(d.getMinutes()).padStart(2, "0");

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0)
        hour = 12;

    return `${day} ${month} ${year} ${hour}:${minute} ${ampm}`;
}
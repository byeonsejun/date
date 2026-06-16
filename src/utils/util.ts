import { format, addDays, fromUnixTime } from 'date-fns';

type CurrentTimeType = 'year' | 'month' | 'day' | 'hours' | 'minutes';

export function getCurrentTime(type?: CurrentTimeType): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const hours = ('0' + today.getHours()).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2);
  let timeString = `${year} / ${month} / ${day}  ${hours}:${minutes}`;
  if (type) {
    const timeUnits: Record<CurrentTimeType, string | number> = {
      year: year,
      month: month,
      day: day,
      hours: hours,
      minutes: minutes,
    };
    timeString = String(timeUnits[type]);
  }
  return timeString;
}

export function get3Days(): string[] {
  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i <= 2; i++) {
    const date = addDays(today, i);
    const formattedDate = format(date, 'MM-dd');
    dates.push(formattedDate);
  }
  return dates;
}

export function get24H(): string[] {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    hours.push(`${hour}:00`);
  }
  return hours;
}

export function fromUnixTimeToG(time: number): Date {
  return fromUnixTime(time);
}

export function getInteger(number: number): number {
  return Math.trunc(number);
}

export function findStorageItem(item: string): string | null {
  return window.localStorage.getItem(item);
}

export function createStorageItem(item: string, value: string): void {
  window.localStorage.setItem(item, value);
}

export function removeStorageItem(item: string): void {
  window.localStorage.removeItem(item);
}

export function getRandomIndexItem<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function makeRandomNumberIn(number: number): number {
  return Math.floor(Math.random() * number);
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(min + (max - min) * Math.random());
}

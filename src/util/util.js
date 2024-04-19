import proj4 from 'proj4';
import { format, addDays, fromUnixTime } from 'date-fns';

export function getCurrentTime(type) {
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const hours = ('0' + today.getHours()).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2);
  let timeString = `${year} / ${month} / ${day}  ${hours}:${minutes}`;
  if (type) {
    const timeUnits = {
      year: year,
      month: month,
      day: day,
      hours: hours,
      minutes: minutes,
    };
    switch (type) {
      case 'year':
      case 'month':
      case 'day':
      case 'hours':
      case 'minutes':
        timeString = timeUnits[type];
        break;
      default:
        break;
    }
  }
  return timeString;
}

export function get3Days() {
  const today = new Date();
  const dates = [];
  for (let i = 0; i <= 2; i++) {
    const date = addDays(today, i);
    const formattedDate = format(date, 'MM-dd');
    dates.push(formattedDate);
  }
  return dates;
}

export function get24H() {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    hours.push(`${hour}:00`);
  }
  return hours;
}

export function transLocation(x, y) {
  const grs80tm =
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +datum=GRS80 +units=m +no_defs';
  const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

  const wgs84Coords = proj4(grs80tm, wgs84, [x, y]).reverse();

  return wgs84Coords;
}

export function fromUnixTimeToG(time) {
  return fromUnixTime(time);
}

export function getInteger(number) {
  return Math.trunc(number);
}

export function findStorageItem(item) {
  return window.localStorage.getItem(item);
}

export function createStorageItem(item, value) {
  return window.localStorage.setItem(item, value);
}
export function removeStorageItem(item) {
  return window.localStorage.removeItem(item);
}

export function getRandomIndexItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function makeRandomNumberIn(number) {
  return Math.floor(Math.random() * number);
}

export function getRandomNumber(min, max) {
  return Math.floor(min + (max - min) * Math.random());
}

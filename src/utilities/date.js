export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthsShort = [
  { January: "Jan" },
  { February: "Feb" },
  { March: "Mar" },
  { April: "Apr" },
  { May: "May" },
  { June: "Jun" },
  { July: "Jul" },
  { August: "Aug" },
  { September: "Sep" },
  { October: "Oct" },
  { November: "Nov" },
  { December: "Dec" },
];

export function convertDateStandard(dateString) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }

  // Format the date object to "YYYY-MM-DD"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
}

export function isDateOutdated(dateString) {
  const now = new Date();
  const inputDate = new Date(dateString);

  if (inputDate < now) {
    return "pass";
  } else if (inputDate > now) {
    return "soon";
  } else {
    return "now";
  }
}

export function isWithinTwoHours(dateString) {
  const now = new Date();
  const inputDate = new Date(dateString);
  const twoHoursBeforeCheckIn = new Date(
    inputDate.getTime() - 2 * 60 * 60 * 1000
  );

  return now >= twoHoursBeforeCheckIn;
}

export const addHoursToDate = (date, hours) => {
  const newDate = new Date(date);

  newDate.setHours(newDate.getHours() + hours);
  return newDate.toString();
};

// Expected output: "January 18, 2025"
export const getMonthDateYear = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};
// Expected output: "9:23 PM"
export const getTimeInAMPM = (dateString) => {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateString);
    return "Invalid Date";
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${strMinutes} ${ampm}`;
};

export function getCurrentMonthAndYear() {
  // Create a new Date object
  let currentDate = new Date();

  // Get the current month (0-11, where 0 is January and 11 is December)
  let month = currentDate.getMonth(); // Adding 1 to make it 1-12

  // Get the current year
  let year = currentDate.getFullYear();

  return {
    month: month,
    year: year,
  };
}

export function getMonthYear(date) {
  let dt = new Date(date);

  let month = dt.getMonth();
  let year = dt.getFullYear();

  return {
    month,
    year,
  };
}

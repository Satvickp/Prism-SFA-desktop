export function getDaysInMonth(month, year) {
  if (month < 1 || month > 12) {
    return -1;
  }
  if (!year) {
    year = new Date().getFullYear();
  }
  const lastDay = new Date(year, month, 0);
  return lastDay.getDate();
}

export function getDateFormat(currentDate) {
  currentDate = new Date(currentDate);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function getNumberOfDays(startDate, endDate) {
  const startMillis = startDate.getTime();
  const endMillis = endDate.getTime();
  const differenceMillis = endMillis - startMillis;
  const daysDifference = Math.ceil(differenceMillis / (1000 * 60 * 60 * 24));
  const numberOfDays = daysDifference;

  return numberOfDays + 1;
}

export function getTimeFormat(now) {
  let data = new Date(now);
  let hours = data.getHours();
  const minutes = data.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

export function formatDistance(meters) {
  if (typeof meters !== "number" || meters < 0) {
    console.log("Please provide a valid non-negative distance in meters.");
    return `0 km`;
  }

  const kilometers = Math.floor(meters / 1000);
  const remainingMeters = meters % 1000;

  return `${kilometers} km ${remainingMeters} meter${
    remainingMeters === 1 ? "" : "s"
  }`;
}

export function convertSecondsToTimeFormat(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600); // 1 hour = 3600 seconds
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function calculateTotalTime(startTime, endTime) {
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  // Ensure startTime and endTime are valid Date objects
  if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
    return "N/A";
  }

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = endTime - startTime;

  // Convert the difference to hours and minutes
  const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Format the time as "HH:MM"
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;

  return formattedTime;
}

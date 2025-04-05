import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export const exportToExcel = (data) => {
  if (!Array.isArray(data) || data.length <= 0) {
    return console.log("Something went wrong");
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leave-Request");

  const fileName = "leaveRequest_data.xlsx";
  XLSX.writeFile(wb, fileName);
};

export function truncateString(str = "", maxLength = 20) {
  if (!str) return;

  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + "...";
}

function formatPriceINR(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(price);
}

export { formatPriceINR };

export const errorMsg = (error) =>
  error?.response?.data?.message ??
  "Something Went Wrong, Please Try Again later";

export const showError = (error,then=()=>{},catchFn=()=>{}) => {
  Swal.fire({
    icon: "error",
    title: "Oops!",
    text: errorMsg(error),
  }).then(then).catch(catchFn)
};

export async function getLocation(
  options = { maximumAge: 60000, timeout: 10000, enableHighAccuracy: false }
) {
  // Try to use a cached location if it's recent enough
  try {
    const cached = localStorage.getItem("geolocation");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp <= options.maximumAge) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Error reading cached location:", err);
  }

  // If no valid cached location, fetch a fresh location
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by this browser."));
    }

    const handleSuccess = (position) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
      };

      try {
        localStorage.setItem("geolocation", JSON.stringify(newLocation));
      } catch (err) {
        console.warn("Failed to cache location:", err);
      }

      resolve(newLocation);
    };

    const handleError = (error) => {
      console.error("Error getting geolocation:", error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          reject(new Error("User denied location access."));
          break;
        case error.POSITION_UNAVAILABLE:
          reject(new Error("Location information is unavailable."));
          break;
        case error.TIMEOUT:
          reject(new Error("Request to get location timed out."));
          break;
        default:
          reject(
            new Error("An unknown error occurred while getting location.")
          );
      }
    };

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              handleSuccess,
              handleError,
              options
            );
          } else {
            reject(new Error("Location permission was denied."));
          }
        })
        .catch(() => {
          reject(new Error("Error checking geolocation permission."));
        });
    } else {
      // Fallback if the Permissions API isn't supported
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
    }
  });
}

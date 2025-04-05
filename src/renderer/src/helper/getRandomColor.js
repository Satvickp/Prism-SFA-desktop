// Function to generate random colors
export default function getRandomColor(value) {
  const status = ["Pending", "Progress", "Completed", "Incomplete"];
  if (value === "Pending") {
    return "#ffc107"; // Soft orange
  } else if (value === "Progress") {
    return "#0dcaf0"; // Soft blue
  } else if (value === "Completed") {
    return "#198754"; // Soft green
  } else if (value === "Incomplete") {
    return "#dc3545"; // Soft red
  }
  return "#EE82EE"; // Soft violet
}


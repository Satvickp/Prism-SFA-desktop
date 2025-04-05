export function getOrderStatusStyle(status) {
  switch (status) {
    case "CREATED":
      return {
        color: "orange",
      };
    case "PENDING":
      return {
        color: "red",
      };
    case "DELIVERED":
      return {
        color: "green",
      };
    default:
      return {
        color: "black",
      };
  }
}

import * as yup from "yup";

export const Schema = yup.object().shape({
  productId: yup
    .number()
    .positive("Invalid Product")
    .integer("Invalid Product")
    .required("Product Name is required"),
  quantity: yup
    .number()
    .positive("Quantity must be a positive number")
    .integer("Quantity must be an integer")
    .required("Quantity is required"),
  salesLevel: yup
    .string()
    .oneOf(["WAREHOUSE", "RETAILER", "STOCKIST"], "Invalid Sales Level")
    .required("Sales Level is required"),
});

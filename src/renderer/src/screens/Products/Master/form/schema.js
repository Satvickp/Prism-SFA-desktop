import * as yup from "yup";

export const Schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  sku: yup.string().required("SKU is required"),
  productCode: yup.string().required("Product Code is required"),
  measurementUnit: yup.string().required("Measurement unit is required"),
  measurementValue: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value)) // Handle empty strings
    .nullable()
    .required("Measurement Value is required")
    .positive("Measurement Value must be positive"),
  bundleSize: yup
    .number("Bundle Size must be a valid number") // Custom error for invalid numbers
    .transform((value, originalValue) =>
      originalValue === "" || isNaN(value) ? null : value // Handle empty strings and NaN
    )
    .nullable()
    .required("Bundle Size is required")
    .positive("Bundle Size must be positive"),
  warehousePrice: yup
    .number("Warehouse Price must be a valid number")
    .transform((value, originalValue) =>
      originalValue === "" || isNaN(value) ? null : value
    )
    .nullable()
    .positive("Warehouse Price must be positive")
    .required("Warehouse Price is required"),
  stockListPrice: yup
    .number("Stock List Price must be a valid number")
    .transform((value, originalValue) =>
      originalValue === "" || isNaN(value) ? null : value
    )
    .nullable()
    .positive("Stock List Price must be positive")
    .required("Stock List Price is required"),
  retailerPrice: yup
    .number("Retailer Price must be a valid number")
    .transform((value, originalValue) =>
      originalValue === "" || isNaN(value) ? null : value
    )
    .nullable()
    .positive("Retailer Price must be positive")
    .required("Retailer Price is required"),
  gstPercentage: yup
    .number("GST Percentage must be a valid number")
    .transform((value, originalValue) =>
      originalValue === "" || isNaN(value) ? null : value
    )
    .nullable()
    .positive("GST Percentage must be positive"),
  imageUrl: yup
    .string()
    .required("Image URL is required"), // Add required validation for imageUrl
});


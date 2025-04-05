import * as yup from 'yup';

export const Schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  sku: yup.string().required("SKU is required"),
  measurementUnit: yup.string().required("Measurement unit is required"),
  productCode: yup.string().required("Product Code is required"),
  measurementValue: yup
    .number()
    .positive("Measurement Value must be positive")
    .required("Measurement Value is required"),
  warehousePrice: yup
    .number()
    .positive("Warehouse Price must be positive")
    .required("Warehouse is required"),
  stockListPrice: yup
    .number()
    .positive("Warehouse Price must be positive")
    .required("Warehouse is required"),
  retailerPrice: yup
    .number()
    .positive("Warehouse Price must be positive")
    .required("Warehouse is required"),
  gstPercentage: yup
    .number(2)
    .positive("Warehouse Price must be positive")
    .required("Warehouse is required"),
});
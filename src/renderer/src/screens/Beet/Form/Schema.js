import * as yup from "yup";

export const Schema = yup.object().shape({
  beet: yup.string().required("Beet is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup
    .string()
    .matches(/^\d{5,6}$/, "Postal Code must be a valid 5- or 6-digit number")
    .required("Postal Code is required"),
  clientFmcgId: yup.number().required("Client Id is required")
});

export const OutletSchema = yup.object().shape({
  outletName: yup.string().required("Outlet Name is required"),
  outletType: yup.string().required("Outlet Type is required"),
  ownerName: yup.string().required("Owner Name is required"),
  mobile: yup
  .string()
  .matches(/^[6-9]\d{9}$/, "Mobile Number must be a valid 10-digit number")
  .required("Mobile Number is required"),
  ownerMobileNo: yup
  .string()
  .matches(/^[6-9]\d{9}$/, "Owner Mobile Number must be a valid 10-digit number")
  // .required("Owner Mobile Number is required")
  ,
  email: yup.string().email("Invalid email").required("Email is required"),
  gstNumber: yup
  .string()
  .required("GST Number is required")
  .matches(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/,
    "Invalid GST Number"
  ),
  panNumber: yup
  .string()
  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number")
  .required("PAN Number is required"),
});


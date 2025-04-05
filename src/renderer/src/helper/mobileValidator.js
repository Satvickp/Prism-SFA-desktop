export default function mobileValidator(phoneNumber) {
  const isInteger = /^\d+$/.test(phoneNumber);
  const hasSpecificLength = phoneNumber.toString().length === 10;
  if (!phoneNumber) return "Mobile Number can't be empty.";
  if (!isInteger || !hasSpecificLength)
    return "Please Enter Valid Mobile Number";
  return "";
}


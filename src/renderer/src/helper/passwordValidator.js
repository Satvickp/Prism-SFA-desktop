export function passwordValidator(password) {
  if (!password) return "Password can't be empty."
  if (password.length < 6) return 'Password must be at least 6 characters long.'


  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password); // Add more special characters as needed

  if (!hasUppercase) return 'Password must include at least one uppercase letter.';
  if (!hasLowercase) return 'Password must include at least one lowercase letter.';
  if (!hasNumber) return 'Password must include at least one number.';
  if (!hasSpecialChar) return 'Password must include at least one special character (!@#$%^&*).';

  return ''
}

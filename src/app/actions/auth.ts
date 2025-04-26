"use server";
import * as yup from "yup";

const signupSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export async function signup(prevState: object, formData: FormData) {
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  // Validate the form data using Yup
  try {
    await signupSchema.validate({
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        errors: error.errors,
        ...prevState,
      };
    }
  }

  return {
    errors: [],
    ...prevState,
  };
}

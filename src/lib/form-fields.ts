// lib/form-fields.ts

export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  eyeView: boolean;
  description?: string;
}

export const organizerFormFields: FormField[] = [
  {
    name: "name",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name...",
    eyeView: false,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name...",
    eyeView: false,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email address...",
    eyeView: false,
  },
  {
    name: "organization",
    label: "Organization / Company Name",
    type: "text",
    placeholder: "The name of your company / organization",
    eyeView: false,
  },
  {
    name: "phone",
    label: "Phone Number (Optional)",
    type: "tel",
    placeholder: "+123",
    eyeView: false,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Input your password",
    eyeView: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    eyeView: true,
  },
];

export const participantsFormFields: FormField[] = [
  {
    name: "name",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name...",
    eyeView: false,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name...",
    eyeView: false,
  },
  {
    name: "userName",
    label: "Username",
    type: "text",
    placeholder: "Enter your username...",
    eyeView: false,
    description: "This will be shown on leaderboards and submissions",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email address...",
    eyeView: false,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Input your password",
    eyeView: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    eyeView: true,
  },
];

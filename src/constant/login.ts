export const defaultCredentials = {
  superAdmin: {
    email: "super@admin.com",
    password: "superadmin",
  },
  admin: {
    email: "admin@example.com",
    password: "adminpass",
  },
  doctor: {
    email: "dr.sarah.pediatrics@childrenshospital.org",
    password: "123456",
  },
  patient: {
    email: "abdullahalfahin183@gmail.com",
    password: "12345678",
  },
};

export const roleOptions = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "doctor", label: "Doctor" },
  { value: "patient", label: "Patient" },
];

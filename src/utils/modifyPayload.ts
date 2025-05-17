import { FieldValues } from "react-hook-form";

export const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  setProfileImage: any
) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
};

export const modifyPayload = (values: FieldValues) => {
  const { obj } = { ...values };
  const data = JSON.stringify(obj);
  const formData = new FormData()
  formData.append("data", data)

  return formData;
};

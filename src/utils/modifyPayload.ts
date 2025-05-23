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

type FieldValues = Record<string, any>;

export const modifyPayload = (values: FieldValues) => {
  const { file, ...rest } = values;
  const formData = new FormData();
  formData.append("data", JSON.stringify(rest));

  if (file) {
    if (Array.isArray(file)) {
      file.forEach((f, index) => {
        formData.append(`file${index}`, f);
      });
    } else {
      formData.append("file", file);
    }
  }

  return formData;
};

"use server";

import { authKey } from "@/constant/authKey";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const setAccessToken = async (token: string, option?: any) => {
   (await cookies()).set(authKey, token);
  if (option && option.passwordChangeRequired) {
    redirect("/dashboard/change-password");
  }
  if (option && !option.passwordChangeRequired && option.redirect) {
    redirect(option.redirect);
  }
};

export default setAccessToken;

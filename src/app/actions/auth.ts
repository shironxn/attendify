"use server";

import { createClient } from "@/lib/supabase/server";
import { Login, Register } from "@/lib/types";
import { redirect } from "next/navigation";

export async function AuthWithGoogle() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`,
      },
    });

    if (error) {
      return { message: error.message };
    }
  } catch (error) {
    console.error("AuthWithGoogle Exception:", error);
    throw new Error(
      "An unexpected error occurred during Google authentication.",
    );
  }

  redirect("/dashboard");
}

export async function LoginWithEmail(formData: Login) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(formData);

    if (error) {
      return { message: error.message };
    }
  } catch (error) {
    console.error("LoginWithEmail Exception:", error);
    throw new Error("An unexpected error occurred during login.");
  }

  redirect("/dashboard");
}

export async function RegisterWithEmail(formData: Register) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp(formData);

    if (error) {
      return { message: error.message };
    }
  } catch (error) {
    console.error("RegisterWithEmail Exception:", error);
    throw new Error("An unexpected error occurred during registration.");
  }

  redirect("/login");
}

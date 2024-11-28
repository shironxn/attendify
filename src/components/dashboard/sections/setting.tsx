"use client";

import { UserUpdateForm, UserUpdateSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/app/actions/user";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const inputField = [
  {
    name: "name",
    label: "Nama",
    placeholder: "Masukkan nama anda",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Masukkan email anda",
  },
];

export default function SettingSection({ user }: { user: User }) {
  const form = useForm<UserUpdateForm>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
    },
  });

  async function onSubmit(data: UserUpdateForm) {
    const res = await updateUser(data);

    if (res?.error) {
      toast({
        title: "Terjadi Kesalahan",
        description: res.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sukses",
      description: "Data berhasil diperbarui.",
    });
  }

  useEffect(() => {
    if (user) {
      form.reset({
        id: String(user.id),
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {inputField.map((item, index) => (
          <FormField
            key={index}
            control={form.control}
            name={item.name as keyof UserUpdateForm}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <Input placeholder={item.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Simpan</Button>
      </form>
    </Form>
  );
}

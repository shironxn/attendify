"use client"

import { Button } from "@/components/ui/button"
import { login } from "@/app/actions/auth"
import { LoginSchema, Login } from "@/lib/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { useToast } from "@/hooks/use-toast"

const inputField = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: ""
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: ""
  }
]

export function LoginForm() {
  const { toast } = useToast()
  const form = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: Login) => {
    const res = await login(data)
    if (res?.error) {
      toast({
        title: "Error",
        description: res.error
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {inputField.map((item, index) => (
          <FormField
            key={index}
            control={form.control}
            name={item.name as "email" || "password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <Input placeholder={item.placeholder} type={item.type} required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  )
}

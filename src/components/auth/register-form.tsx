'use client'

import { Button } from "@/components/ui/button"
import { AuthWithGoogle, RegisterWithEmail } from "@/app/actions/auth"
import { RegisterSchema, Register } from "@/lib/types"
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

export function RegisterForm() {
  const { toast } = useToast()
  const form = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: Register) => {
    const res = await RegisterWithEmail(data)
    if (res?.message) {
      toast({
        title: "",
        description: res.message
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
          Register
        </Button>
        <Button variant="outline" type="button" className="w-full" onClick={() => AuthWithGoogle()}>
          Register with Google
        </Button>
      </form>
    </Form>
  )
}

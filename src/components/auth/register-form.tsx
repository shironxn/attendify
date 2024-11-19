"use client"

import { Button } from "@/components/ui/button"
import { register } from "@/app/actions/auth"
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
import { ReloadIcon } from "@radix-ui/react-icons"
import { useTransition } from "react"

const inputField = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: ""
  },
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
  const [isLoading, startTransition] = useTransition()

  const { toast } = useToast()
  const form = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(data: Register) {
    startTransition(async () => {
      const res = await register(data)
      if (res?.error) {
        toast({
          title: "Error",
          description: res.error
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {inputField.map((item, index) => (
          <FormField
            key={index}
            control={form.control}
            name={item.name as "name" || "email" || "password"}
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
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  )
}

import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/alert-dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useToast } from "@/components/ui/use-toast"


export const Route = createFileRoute('/dashboard/clients/add-client')({
  component: AddClient
})


const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),

  email: z.string().email({
    message: "Invalid email address",
  }),

  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),

  id_number: z.string().min(6, {
    message: "Id number must be at least 8 digits.",
  }),


})




function AddClient() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
    setIsSubmitting(true)

    const create_client = async () => {
      if (isSubmitting) return
      try {
        const response = await fetch("/user/clients/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("auth_key")}`,
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const data = await response.json()
          setError(data.detail)
          setIsSubmitting(false)
          return
        }

        toast({
          title: "client added succesfully",
          description: "TODO: add something here"
        })

        router.history.push("/dashboard/clients")
      } catch (error) {
        setError("An error occurred. Please try again.")
        setIsSubmitting(false)
      }
    }

    create_client()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Add a New Client
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">Get started by filling out the form below.</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>

        {error && (<div className='flex w-full items-center justify-center rounded-sm bg-destructive text-center p-2 my-4'>{error}</div>)}
              <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the name of the client
                          </FormDescription>
                          <FormMessage/>
                        </FormItem>
                        )}
                        />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the email of the client
                          </FormDescription>
                          <FormMessage/>
                        </FormItem>
                        )}
                        />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the phone number of the client
                          </FormDescription>
                          <FormMessage/>
                        </FormItem>
                        )}
                        />

                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="id_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Id Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the id number of the client
                          </FormDescription>
                          <FormMessage/>
                        </FormItem>
                        )}
                        />

                  </div>

              <CardFooter>
                <div className="flex justify-end gap-2">
                  <Alert
                    title='Are you Sure'
                    description='This action can not be undone'
                    buttonLabel='Cancel'
                    onConfirm={() => router.history.back()}
                    onCancel={() => {}}
                  />
                  <Button type="submit">
                          {isSubmitting  ?
                            (<div className="border-b-secondary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-primary-foreground"/>) : "Add User" }
                  </Button>


                </div>
              </CardFooter>

                  </form>
                </Form>
              </CardContent>

            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

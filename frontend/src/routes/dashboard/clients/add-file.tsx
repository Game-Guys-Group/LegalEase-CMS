import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/alert-dialog";
import { Combobox, ComboboxOptions } from "@/components/combo-box";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  case_id: z.string().min(2, {
    message: "case id must be at least 2 characters.",
  }),

  court_station: z.string().min(1, {
    message: "court station can not be empty.",
  }),

  type_of_case: z.string().min(1, {
    message: "type of case can not be empty.",
  }),

  description: z.string().min(1, {
    message: "description can not be empty.",
  }),
});

//type mustabation
type FieldType = "case_id" | "court_station" | "type_of_case" | "description";

interface FormFieldProps {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  name: FieldType;
  description: string;
  label: string;
}

function FormFieldComponent({
  form,
  name,
  description,
  label,
}: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function AddClient() {
  const router = useRouter();
  const [client, setClient] = useState<string | string[]>("");
  const [clients, setClients] = useState<ComboboxOptions[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("/user/clients/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_key")}`,
        },
      });

      if (!response.ok) {
        let json = await response.json();
        throw new Error(json["detail"]);
      }

      const value = await response.json();
      const cls: Array<ComboboxOptions> = value.map(
        (c: { id: number; name: string }) => {
          return { value: String(c["id"]), label: c["name"] };
        },
      );

      console.log(cls);
      setClients(cls);
      if (cls.length == 0) {
        setClient("Please Add Clients");
      }
    };

    fetchClients();
  }, [client]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (client == "") {
      setError("Please select a client");
      return;
    }

    setIsSubmitting(true);

    const create_file = async () => {
      if (isSubmitting) return;
      try {
        const response = await fetch("/files/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_key")}`,
          },
          body: JSON.stringify({
            client_id: Number(client),
            ...data,
          }),
        });
        if (!response.ok) {
          const data = await response.json();
          setError(data.detail);
          setIsSubmitting(false);
          return;
        }

        toast({
          title: "file added succesfully",
          description: "TODO: add something here",
        });

        router.history.push("/dashboard/clients");
      } catch (error) {
        setError("An error occurred. Please try again.");
        setIsSubmitting(false);
      }
    };

    create_file();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Add a New File
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Get started by filling out the form below.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>New file Information</CardTitle>
              </CardHeader>
              {error && (
                <div className="flex w-full items-center justify-center rounded-sm bg-destructive text-center p-2 my-4">
                  {error}
                </div>
              )}
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <Label> Client </Label>
                      <Combobox
                        mode="single" //single or multiple
                        options={clients}
                        placeholder="Select Client"
                        selected={client} // string or array
                        onChange={(value) => setClient(value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormFieldComponent
                        form={form}
                        name="case_id"
                        description="Enter the case id"
                        label="Case Id"
                      />
                    </div>

                    <div className="space-y-2">
                      <FormFieldComponent
                        form={form}
                        name="court_station"
                        description="Enter the court station"
                        label="Court Station"
                      />
                    </div>
                    <div className="space-y-2">
                      <FormFieldComponent
                        form={form}
                        name="type_of_case"
                        description="Enter the type of case"
                        label="Case Type"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="case description"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the description
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <CardFooter>
                      <div className="flex justify-end gap-2">
                        <Alert
                          title="Are you Sure"
                          description="This action can not be undone"
                          buttonLabel="Cancel"
                          onConfirm={() => router.history.back()}
                          onCancel={() => {}}
                        />
                        <Button type="submit">Create File</Button>
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
  );
}

export const Route = createFileRoute("/dashboard/clients/add-file")({
  component: AddClient,
});

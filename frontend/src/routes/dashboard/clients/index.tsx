import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  ListCollapse,
  UploadIcon,
  CalendarSearchIcon,
  PlusIcon,
  UsersIcon,
  Search,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/clients/")({
  component: ClientIndex,
});

interface ClientProps {
  name: string;
  email: string;
  phone: string;
  id: number;
}

function shortenName(name: string): string {
  const names = name.split(" ");
  return names.map((n) => n[0]).join("");
}

function Client({ name, email, phone, id }: ClientProps) {
  const navigate = useNavigate();
  return (
    <tr
      className="border-b border-secondary cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => {
        navigate({
          to: "/dashboard/clients/$clientId",
          params: { clientId: String(id) },
        });
      }}
    >
      <td className="px-4 py-4">
        <div className="flex items-center">
          <Avatar className="mr-3">
            <AvatarImage alt={name} src="/placeholder-avatar.jpg" />
            <AvatarFallback>{shortenName(name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm">Individual</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 ">{email}</td>
      <td className="px-4 py-4 ">{phone}</td>
      <td className="px-4 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <ListCollapse className="w-4 h-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                to="/dashboard/clients/$clientId"
                params={{ clientId: String(id) }}
              >
                View Client
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Client</DropdownMenuItem>
            <DropdownMenuItem>Delete Client</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function ClientList({ name_like }: { name_like: string }) {
  let query = "/user/clients/get";

  if (name_like.length > 0) {
    query += `?name_like=${name_like}`;
  }

  const { isPending, error, data } = useQuery({
    queryKey: [name_like],
    queryFn: async () => {
      const response = await fetch(query, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_key")}`,
        },
      });

      if (!response.ok) {
        let json = await response.json();
        throw new Error(json["detail"]);
      }

      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 flex-1">
      <div className="bg-background rounded-lg shadow-md overflow-hidden">
        <ScrollArea className="rounded-md h-96 border p-4">
          <table className="w-full table-auto">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isPending && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    {error.message}
                  </td>
                </tr>
              )}
              {data &&
                data.map((client: ClientProps) => (
                  <Client key={client.id} {...client} />
                ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
}

function ClientIndex() {
  const [name_like, setNameLike] = useState("");

  return (
    <div className="flex max-h-screen w-full flex-col">
      <div className="w-full mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your client information and cases.
          </p>
        </div>

        <div className="relative mx-8">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients"
            className="w-full appearance-none bg-background pl-8 shadow-none"
            value={name_like}
            onChange={(e) => setNameLike(e.target.value)}
          />
        </div>
      </div>

      <main className="flex flex-wrap h-full">
        <Card className="flex flex-col items-center h-96">
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex sm:flex-row md:flex-col">
              <Link
                className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-muted"
                to="/dashboard/clients/add-file"
              >
                <PlusIcon className="w-6 h-6" />
                <span>New File</span>
              </Link>
              <Link
                className="flex flex-col items-center gap-2 p-2 rounded-md hover:bg-muted"
                to="/dashboard/clients/add-client"
              >
                <UsersIcon className="w-6 h-6" />
                <span>Add Client</span>
              </Link>

              <Link
                className="flex flex-col items-center gap-2 p-2 rounded-md hover:bg-muted"
                href="#"
              >
                <UploadIcon className="w-6 h-6" />
                <span>Upload Document</span>
              </Link>
              <Link
                className="flex flex-col items-center gap-2 p-2 rounded-md hover:bg-muted"
                href="#"
              >
                <CalendarSearchIcon className="w-6 h-6" />
                <span>Calendar</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <ClientList name_like={name_like} />
      </main>
    </div>
  );
}

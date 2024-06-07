import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Briefcase, DollarSign, Users } from "lucide-react";
import {
  PlusIcon,
  UsersIcon,
  UploadIcon,
  CalendarSearchIcon,
} from "lucide-react";

// import { Link} from '@tanstack/react-router'

export function Dashboard() {
  return (
    <main className="container mx-auto w-full  px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          welcome to your dashboard
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <Users />
          <h2 className="mt-2 text-xl font-semibold">Total Clients</h2>
          <p className="mt-4">4</p>
        </div>
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <Briefcase />
          <h2 className="mt-2 text-lg font-semibold">Open Cases</h2>
          <p className="mt-4">8</p>
        </div>
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <DollarSign />
          <h2 className="mt-2 text-lg font-semibold">Revenue</h2>
          <p className="mt-4">$400,897</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Client Management</h2>
      <Card className="flex items-center">
        <CardContent className="w-full h-full flex items-center justify-center mt-4">
          <div className="flex items-center justify-center w-full">
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
    </main>
  );
}

export const Route = createLazyFileRoute("/dashboard/dashboard")({
  component: Dashboard,
});

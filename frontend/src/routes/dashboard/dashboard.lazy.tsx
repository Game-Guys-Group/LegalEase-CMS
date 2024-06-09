import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { CardContent, Card } from "@/components/ui/card";
import { Briefcase, CalendarIcon, DollarSign, File, Users } from "lucide-react";
import {
  PlusIcon,
  UsersIcon,
  UploadIcon,
  CalendarSearchIcon,
} from "lucide-react";
import { useAuth } from "@/api-helper";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";

function Info({ value }: { value: number | null | undefined }) {
  if (!value) {
    return <Skeleton className="h-4 w-16" />;
  }
  return <p className="mt-4">{value}</p>;
}

interface Summary {
  file_count: number;
  event_count: number;
  attachment_count: number;
  client_count: number;
}

export function Dashboard() {
  const { getData } = useAuth<Summary>({
    url: "/user/summary",
    parseFn: (data) => data,
  });

  const { data } = useQuery({ queryKey: [], queryFn: getData });

  return (
    <main className="container mx-auto w-full  px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          welcome to your dashboard
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <Users />
          <h2 className="mt-2 text-xl font-semibold">Total Clients</h2>
          <p className="mt-4">
            <Info value={data?.client_count} />
          </p>
        </div>
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <Briefcase />
          <h2 className="mt-2 text-lg font-semibold">Open Cases</h2>
          <p className="mt-4">
            <Info value={data?.file_count} />
          </p>
        </div>
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <File />
          <h2 className="mt-2 text-lg font-semibold">Attachments</h2>
          <p className="mt-4">
            <Info value={data?.attachment_count} />
          </p>
        </div>

        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <CalendarIcon />
          <h2 className="mt-2 text-lg font-semibold">Events</h2>
          <p className="mt-4">
            <Info value={data?.event_count} />
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Client Management</h2>
      <Card className="flex items-center">
        <CardContent className="w-full h-full flex items-center justify-center mt-4">
          <div className="flex items-center space-x-8 justify-center w-full">
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
              to="/dashboard/calender"
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

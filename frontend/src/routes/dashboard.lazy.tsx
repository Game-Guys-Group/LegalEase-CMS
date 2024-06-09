import { createLazyFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster";

import { Home, LineChart, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function splitPath(path: string): Array<Array<string>> {
  const splits = path.split("/").filter((p) => p !== "");
  const paths = [];

  for (let i = 0; i < splits.length; i++) {
    paths.push([splits[i], `/${splits.slice(0, i + 1).join("/")}`]);
    if (paths.length == 2) {
      break;
    }
  }

  return paths;
}

function NavBreadcrumb() {
  const router = useRouterState();
  const paths = splitPath(router.location.pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          return (
            <>
              {index != paths.length - 1 ? (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink>
                    <Link to={path[1]}> {path[0]} </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbPage>{path[0]}</BreadcrumbPage>
              )}

              {index != paths.length - 1 && <BreadcrumbSeparator />}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function Dashboard() {
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="border-r  border-t h-full bg-muted/40 md:block">
        <div className="flex max-h-screen flex-col h-full justify-between gap-2">
          <div className="">
            <nav className="flex md:flex-col items-start mt-4 px-2 text-sm font-medium lg:px-4">
              <Link
                to="/dashboard/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/clients"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Clients
              </Link>
              <Link
                to="/dashboard/calender"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Calender
              </Link>
            </nav>
          </div>
          <div className="hidden md:block fixed mt-auto p-4 bottom-0 w-60 md:w-50 left-0">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="p-2">
          <NavBreadcrumb />
        </div>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  );
}

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

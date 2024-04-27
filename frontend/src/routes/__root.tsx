import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Scale, CircleUser } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div className="px-2 flex gap-2 items-center justify-between h-14 max-w-screen-2xl fixed w-full top-0 left-0 bg-muted/40">
          <div className="flex items-center">
            <div className="px-2 flex items-center">
              <Scale className="inline" />
            </div>
            <div className="font-bold text-lg inline pl-4 pr-8 font-mono uppercase">
              LeagalEase CMS
            </div>
            <Link to="/" className="[&.active]:font-bold px-2">
              Home
            </Link>
            <Link to="/about" className="[&.active]:font-bold px-2">
              About
            </Link>
          </div>

          <div className="flex items-center mx-4 gap-4">
            {localStorage.getItem("auth_key") ? (
              // (<Button className='px-8 mx-8' onClick={() => localStorage.removeItem("auth_key") }>
              //   <Link to="./" className='font-bold px-2'> Logout</Link>
              // </Button>):
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => localStorage.removeItem("auth_key")}
                  >
                    <Link to="./" className="font-bold px-2">
                      {" "}
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="px-8 mx-8">
                <Link to="/login" className="font-bold px-2">
                  {" "}
                  Login{" "}
                </Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>

        <hr />

        <div className="w-full mt-14">
          <Outlet />
        </div>

        <TanStackRouterDevtools />
      </>
    );
  },
});

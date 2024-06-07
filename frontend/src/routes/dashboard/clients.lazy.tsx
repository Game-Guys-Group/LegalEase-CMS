import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/clients")({
  component: Clients,
});

function Clients() {
  return (
    <div className="h-screen w-full">
      <Outlet />
    </div>
  );
}

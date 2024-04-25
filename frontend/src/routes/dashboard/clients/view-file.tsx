import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/clients/view-file")({
  component: () => <div>Hello /dashboard/clients/view-client!</div>,
});

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/clients')({
  component: () => <div>Hello /dashboard/clients!</div>
})
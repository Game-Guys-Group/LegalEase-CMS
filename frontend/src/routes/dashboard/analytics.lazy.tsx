import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/analytics')({
  component: () => <div>Hello /dashboard/analytics!</div>
})
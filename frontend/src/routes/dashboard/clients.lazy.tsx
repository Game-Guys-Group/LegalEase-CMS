import { createLazyFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/clients')({
  component: Clients
})


function Clients() {
  return (
  <>
    <Outlet />
  </>
  )
}

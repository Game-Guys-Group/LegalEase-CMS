import { createLazyFileRoute } from '@tanstack/react-router'

// import { Link} from '@tanstack/react-router'

export function Dashboard() {
  return (
    <div>Inner dashboard</div>
  )
}


export const Route = createLazyFileRoute('/dashboard/dashboard')({
  component: Dashboard
})

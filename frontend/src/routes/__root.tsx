import { ModeToggle } from '@/components/mode-toggle'
import { createRootRoute, Link, Outlet} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Scale } from 'lucide-react'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="px-2 flex gap-2 items-center justify-between h-14 max-w-screen-2xl">
        <div className='flex items-center'>
          <div className='px-2 flex items-center'>
            <Scale className='inline'/>
          </div>
          <div className='font-bold text-lg inline pl-4 pr-8 font-mono uppercase'>
            LeagalEase CMS
          </div>
          <Link to="/" className="[&.active]:font-bold px-2">
            Home
          </Link>
          <Link to="/about" className="[&.active]:font-bold px-2">
            About
          </Link>
        </div>

        <div>
          <ModeToggle/>
        </div>
      </div>

      <hr />

      <div className='w-full'>
        <Outlet/>
      </div>

      <TanStackRouterDevtools />
    </>
  ),
})

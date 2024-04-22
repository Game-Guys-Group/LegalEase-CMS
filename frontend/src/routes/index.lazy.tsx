import { createLazyFileRoute } from '@tanstack/react-router'
import { Link} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

import {File, Users, LucideIcon, DollarSign} from 'lucide-react'

export const Route = createLazyFileRoute('/')({
  component: Index
})


interface FeatureProps {
  Icon: LucideIcon
  title: string,
  description: string
}

function Feature({Icon, title, description}: FeatureProps) {
  return (
    <div className='flex flex-col items-center w-64'>
      <Icon className='h-24 w-16'/>
      <h2 className='text-xl font-bold mt-2'>{title}</h2>
      <p className='text-center mt-4'>{description}</p>
    </div>
  )

}

function Index() {
  return (
      <div className='flex items-center justify-center flex-col w-full mt-16'>
        <h1 className='text-7xl text-center font-bold leading-tight'>Streamline Your Law Practice</h1>
        <p className='mt-2 text-xl w-1/2 text-center text-muted-foreground'>
          Our powerful Content Management System helps lawyers manage their documents, clients, and billing with ease.
        </p>

        <div className='mt-4 flex gap-x-4'>
          <Button>
            <Link to="/create_account" className="[&.active]:font-bold px-2">
              Get Started
            </Link>
          </Button>
          <Button variant='secondary'>Learn More</Button>
        </div>


        <div className='w-full mt-20 flex items-center justify-center bg-secondary'>
        <div className='flex m-4 justify-between w-full max-w-screen-lg'>

        <Feature
          Icon={File}
          title='Document Management'
          description='Manage your documents with ease. Our powerful search and filter features make it easy to find the document you need.'/>

        <Feature
          Icon={Users}
          title='Client Management'
          description='Manage your clients with ease. Our powerful search and filter features make it easy to find the client you need.'/>

        <Feature
          Icon={DollarSign}
          title='Billing and Invoicing'
          description='Manage your billing with ease. Our powerful search and filter features make it easy to find the invoice you need.'/>

        </div>
        </div>
      </div>


  )
}

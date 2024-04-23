import { createLazyFileRoute } from '@tanstack/react-router'
import { Link} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

import {File, Users, LucideIcon, DollarSign} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

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
    const navigate = useNavigate()

    const auth_key = localStorage.getItem("auth_key")

    if (auth_key) {
      navigate({to:"/dashboard/dashboard"})
      return(
      <div className='flex flex-col items-center justify-center h-full w-full mt-24'>
        <div className=" border-b-secondary-foreground  h-60 w-60 animate-spin rounded-full border-8 border-t-primary-foreground"/>
        <h1 className='mt-16'>Loading</h1>
      </div>
      )
    }
  return (
      <div className='flex items-center justify-center flex-col w-full'>

      <div className='flex flex-col items-center my-32'>
        <h1 className='text-7xl text-center font-bold leading-tight'>Streamline Your Law Practice</h1>
        <p className='mt-10 text-xl w-1/2 text-center text-muted-foreground'>
          Our powerful Content Management System helps lawyers manage their documents, clients, and billing with ease.
        </p>

        <div className='mt-8 flex gap-x-4'>
          <Button>
            <Link to="/create_account" className="[&.active]:font-bold px-2">
              Get Started
            </Link>
          </Button>
          <Button variant='secondary'>Learn More</Button>
        </div>
        </div>


        <div className='w-full flex items-center justify-center bg-muted/50'>
        <div className='flex flex-wrap m-4 w-full gap-10 justify-center items-center max-w-screen-lg'>

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

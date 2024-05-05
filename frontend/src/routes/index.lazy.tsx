import { useEffect, useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'

import { useNavigate } from '@tanstack/react-router'
import { LoginForm } from './login.lazy'

export const Route = createLazyFileRoute('/')({
  component: Index
})


function Index() {
  const navigate = useNavigate()
  const [key, setKey] = useState("")

  useEffect(() => {
    const auth_key = localStorage.getItem("auth_key")
    if (auth_key)
      setKey(auth_key)

  }, [key]);

  if (key) {
    navigate({ to: "/dashboard/dashboard", replace: true })
    return (
      <div className='flex flex-col items-center justify-center h-full w-full mt-24'>
        <div className=" border-b-secondary-foreground  h-60 w-60 animate-spin rounded-full border-8 border-t-primary-foreground" />
        <h1 className='mt-16'>Loading</h1>
      </div>
    )
  }
  return (

    <>
      <section id='home' className="bg-gray-50 dark:bg-gray-900">
        <div className="py-8 px-12 mx-auto max-w-screen-xl lg:py-16 flex flex-col lg:flex-row justify-between gap-8 lg:gap-16">
          <div className="flex flex-col justify-center lg:w-1/2">
            <h3 className="mb-4 text-2xl font-semibold leading-none text-gray-900 md:text-2xl lg:text-2xl dark:text-white">LegalEase CMS</h3>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Revolutionizing Legal Workflow</h1>
            <h3 className="mb-4 text-2xl font-regular leading-none text-gray-900 md:text-2xl lg:text-2xl dark:text-white">Unlock the Power of Simplified Legal Management</h3>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
              Navigate the complexities of legal documentation, client communications, and case file integrations with ease. LegalEase CMS is tailored to meet the unique demands of legal professionals, making your daily operations smoother and more efficient.
            </p>
            <a href="#features" className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more about our app
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
          <div className="lg:w-1/2">
            <LoginForm />
          </div>
        </div>
      </section>

      <section id='about' className="dark:bg-gray-900">
        <div className="bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 mx-auto max-w-screen-xl pt-20 pb-20 mx-auto w-full text-center">
            <h1 className="mb-4 p-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-3xl lg:text-4xl dark:text-white">Why Choose LegalEase CMS?</h1>
            <div className="px-8 gap-4 lg:grid-cols-3 grid md:grid-cols-2 mt-4 md:mt-4 flex flex-wrap justify-center" >
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white dark:text-yellow-400">Streamlined Document Management</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Effortlessly manage and organize your legal documents. Access files anytime, anywhere, and ensure your information is secure and up-to-date.</p>
              </div>
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">

                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white dark:text-yellow-400">Integrated Case File System</h5>

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Connect and consolidate your case files in one central hub. Easily track, update, and collaborate on case details with your team.</p>
              </div>
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white dark:text-yellow-400">Efficient Client Communication</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Enhance client relationships with seamless communication tools. Stay connected, provide updates, and manage client interactions more effectively.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='features' className="bg-white dark:bg-gray-900">
        <h2 className="pt-8 text-4xl tracking-tight text-center font-extrabold text-gray-900 dark:text-white">LegalEase Main Features</h2>
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">

          <img className="w-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg" alt="dashboard image" />
          <img className="w-full hidden dark:block" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg" alt="dashboard image" />
          <div className="mt-4 md:mt-0">
            <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">User-Friendly Interface</dt>
                <dd className="text-lg font-semibold">Intuitive design that simplifies complex legal workflows.</dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Top-Tier Security</dt>
                <dd className="text-lg font-semibold">Robust security measures to protect sensitive information</dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Customizable Templates</dt>
                <dd className="text-lg font-semibold">Adapt to your specific legal needs with customizable templates.</dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Real-Time Collaboration</dt>
                <dd className="text-lg font-semibold">Collaborate with your team in real-time, enhancing productivity.</dd>
              </div>
            </dl>
            <div className="flex flex-col-6 py-3">
              <a href="#" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                Get started
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id='register' className="bg-white dark:bg-gray-800">
        <div className="py-8 px-2 mx-auto max-w-screen-xl sm:py-16 lg:px-2">
          <div className="mx-auto max-w-screen-sm text-center">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">Get Started with LegalEase CMS Today!</h2>
            <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
              Join the growing community of legal professionals who trust LegalEase CMS to streamline their operations. Take the first step towards a more organized and efficient legal practice.
            </p>
            <a href="#" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join the Waiting List</a>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-white shadow dark:bg-gray-900">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scale inline"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path></svg>
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">LegalEase CMS</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#about" className="hover:underline me-4 md:me-6">Why Us</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
              </li>
              <li>
                <a href="#register" className="hover:underline">Contact</a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" class="hover:underline">LegalEase CMS™</a>. All Rights Reserved.</span>
        </div>
      </footer>

    </>


  )
}

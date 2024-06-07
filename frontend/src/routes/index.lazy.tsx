import { useEffect, useState } from "react";
import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

import { CreateAccount } from "./create_account.lazy";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [key, setKey] = useState(localStorage.getItem("auth_key"));

  useEffect(() => {
    const auth_key = localStorage.getItem("auth_key");
    if (auth_key) setKey(auth_key);
  }, [key]);

  if (key) {
    return <Navigate to="/dashboard/dashboard" />;
  }

  return (
    <>
      <section id="home" className="w-full dark:text-black bg-orange-100">
        <div className="container flex flex-wrap space-x-4 px-4 mx-auto max-w-screen-xl justify-between pt-20 pb-20  w-full md:h-3/4">
          <div className="flex flex-col justify-center lg:w-1/2">
            <h3 className="mb-4 text-2xl font-semibold leading-none md:text-2xl lg:text-2xl">
              LegalEase CMS
            </h3>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none  md:text-5xl lg:text-6xl">
              Revolutionizing Legal Workflow
            </h1>
            <h3 className="mb-4 text-2xl font-regular leading-none md:text-2xl lg:text-2xl">
              Unlock the Power of Simplified Legal Management
            </h3>
            <p className="mb-6 text-lg font-normal  lg:text-xl">
              Navigate the complexities of legal documentation, client
              communications, and case file integrations with ease. LegalEase
              CMS is tailored to meet the unique demands of legal professionals,
              making your daily operations smoother and more efficient.
            </p>
            <a
              href="#features"
              className="text-accent-foreground hover:underline dark:text-orange-950 font-medium text-lg inline-flex items-center"
            >
              Read more about our app
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>

          <div className="hidden lg:flex w-1/3">
            <CreateAccount />
          </div>
        </div>
      </section>

      <section id="about" className="bg-muted">
        <div>
          <div className="container px-4 mx-auto max-w-screen-xl pt-20 pb-20  w-full text-center">
            <h1 className="mb-4 p-4 text-3xl font-extrabold tracking-tight leading-none  md:text-3xl lg:text-4xl dark:text-white">
              Why Choose LegalEase CMS?
            </h1>
            <div className="px-8 gap-4  mt-4 md:mt-4 flex flex-wrap justify-center">
              <div className="max-w-sm p-6  border border-gray-200 rounded-lg shadow  dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-orange-500">
                  Streamlined Document Management
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Effortlessly manage and organize your legal documents. Access
                  files anytime, anywhere, and ensure your information is secure
                  and up-to-date.
                </p>
              </div>
              <div className="max-w-sm p-6  border border-gray-200 rounded-lg shadow  dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight  text-orange-500">
                  Integrated Case File System
                </h5>

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Connect and consolidate your case files in one central hub.
                  Easily track, update, and collaborate on case details with
                  your team.
                </p>
              </div>
              <div className="max-w-sm p-6  border border-gray-200 rounded-lg shadow  dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-orange-500">
                  Efficient Client Communication
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Enhance client relationships with seamless communication
                  tools. Stay connected, provide updates, and manage client
                  interactions more effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className=" ">
        <h2 className="pt-8 text-4xl tracking-tight text-center font-extrabold  dark:text-white">
          LegalEase Main Features
        </h2>
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <img
            className="w-full dark:hidden"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
            alt="dashboard image"
          />
          <img
            className="w-full hidden dark:block"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg"
            alt="dashboard image"
          />
          <div className="mt-4 md:mt-0">
            <dl className="max-w-md  divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  User-Friendly Interface
                </dt>
                <dd className="text-lg font-semibold">
                  Intuitive design that simplifies complex legal workflows.
                </dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Top-Tier Security
                </dt>
                <dd className="text-lg font-semibold">
                  Robust security measures to protect sensitive information
                </dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Customizable Templates
                </dt>
                <dd className="text-lg font-semibold">
                  Adapt to your specific legal needs with customizable
                  templates.
                </dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Real-Time Collaboration
                </dt>
                <dd className="text-lg font-semibold">
                  Collaborate with your team in real-time, enhancing
                  productivity.
                </dd>
              </div>
            </dl>
            <div className="flex flex-col-6 py-3">
              <a
                href="#"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg focus:ring-4 focus:ring-accent-foreground"
              >
                Get started
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-muted">
        <div className="container px-4 md:px-6">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              What Our Clients Say
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from lawyers who have transformed their practices with Acme
              Legal CMS.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-bold">Sofia Davis</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Founder, Davis Law Firm
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-gray-500 dark:text-gray-400">
                "Legal Ease CMS has been a game-changer for my law firm.The
                intuitive document management and client communication tools
                have streamlined our workflows and allowed us to provide better
                service to our clients."
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-bold">John Williams</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Partner, Williams & Associates
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-gray-500 dark:text-gray-400">
                "I was hesitant to switch to a new CMS, but Legal Ease CMS has
                exceeded my expectations. The reporting features have been
                invaluable in helping me make data-driven decisions to grow my
                practice."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="register" className=" ">
        <div className="py-8 px-2 mx-auto max-w-screen-xl sm:py-16 lg:px-2">
          <div className="mx-auto max-w-screen-sm text-center">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight  dark:text-white">
              Get Started with LegalEase CMS Today!
            </h2>
            <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
              Join the growing community of legal professionals who trust
              LegalEase CMS to streamline their operations. Take the first step
              towards a more organized and efficient legal practice.
            </p>
            <a
              href="#"
              className="w-full px-5 py-3 text-base font-medium text-center text-white  rounded-lg hover:bg-muted/40 focus:ring-4 focus:ring-offset-accent-foreground sm:w-auto"
            >
              Join the Waiting List
            </a>
          </div>
        </div>
      </section>

      <footer id="footer" className="shadow ">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="/"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-scale inline"
              >
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                <path d="M7 21h10"></path>
                <path d="M12 3v18"></path>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
              </svg>
              <span className="self-center text-2xl font-bold font-mono whitespace-nowrap dark:text-white">
                LegalEase CMS
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#about" className="hover:underline me-4 md:me-6">
                  Why Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#register" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023{" "}
            <a href="/" className="hover:underline">
              LegalEase CMS™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}

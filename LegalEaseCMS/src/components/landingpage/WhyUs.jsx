function WhyUs() {
    return (
        <div className="dark:bg-gray-900">
            <div className="bg-gray-100 dark:bg-gray-800">
                <div className="container px-4 mx-auto max-w-screen-xl pt-20 pb-8 mx-auto w-full text-center">
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
        </div>
    )
}

export default WhyUs
import { useEffect, useRef } from 'react';
import { Collapse } from 'flowbite';

const Navbar = () => {
    const targetElRef = useRef(null);
    const triggerElRef = useRef(null);

    useEffect(() => {
        const collapse = new Collapse(
            targetElRef.current,
            triggerElRef.current,
            {
                onCollapse: () => {
                    console.log('element has been collapsed');
                },
                onExpand: () => {
                    console.log('element has been expanded');
                },
                onToggle: () => {
                    console.log('element has been toggled');
                },
            },
            {
                id: 'targetEl',
                override: true
            }
        );

        collapse.expand();
    }, [])

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div id="targetEl" ref={targetElRef} className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 px-12">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="public/logo.png" className="h-8" alt="Legalease CMS Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Legalease CMS</span>
                </a>
                <button data-collapse-toggle="navbar-dropdown" type="button" id="triggerEl" ref={triggerElRef} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#whyus" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Why Us</a>
                        </li>
                        <li>
                            <a href="#features" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Features</a>
                        </li>
                        <li>
                            <a href="#register" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar
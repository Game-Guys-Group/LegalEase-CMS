import React from 'react';
import CMSdashboard from "./app/dashboard/CMSdashboard";
import LandingPage from "./app/landingpage/LandingPage";
import NoPage from "./components/pages/NoPage";
import { Navigate } from "react-router-dom";
import Register from './components/pages/landingpage/Register';
import WhyUs from './components/pages/landingpage/WhyUs';

const appRoutes = [
    {
        path: '/',
        element: <LandingPage />, // Use element instead of children for the root path
    },
    {
        path: '/404',
        element: <NoPage />,
    },
    {
        path: '*',
        element: <Navigate to="/404" />,
    },
    {
        path: '/app', // Start with a forward slash for absolute path
        element: <CMSdashboard />,
    },
    {
        path: '/app/dashboard', // Absolute path for dashboard
        element: <CMSdashboard />,
    },
    {
        path: '/app/*', // Catch-all for app routes
        element: <Navigate to="/404" />,
    },
    // {
    //     path: '#register', // Catch-all for app routes
    //     component: {Register},
    // },
    // {
    //     path: '#whyus', // Catch-all for app routes
    //     component: {WhyUs},
    // },
];

export default appRoutes;

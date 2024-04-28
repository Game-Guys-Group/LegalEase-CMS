import React from 'react'
import Hero from '../../components/pages/landingpage/Hero'
import WhyUs from '../../components/pages/landingpage/WhyUs'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Features from '../../components/pages/landingpage/Features'
import Register from '../../components/pages/landingpage/Register'

function LandingPage() {
  return (
    <>
    <Hero />
    <WhyUs />
    <Features />
    <Register />
    <Footer />
    </>
  )
}

export default LandingPage
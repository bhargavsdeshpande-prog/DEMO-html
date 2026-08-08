import React from 'react'
import Navbar from './components/Navbar'
import ScrollVideo from './components/ScrollVideo'
import SectionOne from './components/SectionOne'
import SectionTwo from './components/SectionTwo'

export default function App(){
  return (
    <div className="relative root">
      <ScrollVideo />
      <div className="relative z-10 wrapper px-5 sm:px-8 md:px-12">
        <Navbar />
        <main className="pt-24 sm:pt-28 pb-12 md:pb-16">
          <SectionOne />
          <div aria-hidden className="h-[80vh]"></div>
          <SectionTwo />
        </main>
      </div>
    </div>
  )
}

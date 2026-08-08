import React from 'react'
import { Hexagon } from 'lucide-react'

const links = ['Projects', 'About', 'Blog', 'Contact']

function useReveal() {
  React.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('reveal-visible')
          (e.target as HTMLElement).classList.remove('reveal-hidden')
          obs.unobserve(e.target)
        }
      }
    }, { threshold: 0.15 })
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Navbar(){
  useReveal()
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 md:px-12 h-16">
        <div className="flex items-center gap-3" data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: '0ms'}}>
          <Hexagon size={24} strokeWidth={1.5} />
          <span className="text-lg sm:text-xl font-medium tracking-tight">novaai</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Primary">
          {links.map((label, i) => (
            <a key={label} href="#" className="text-sm text-white/85 hover:text-white" data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: `${100 + i*100}ms`}}>
              {label}{label === 'Projects' ? <sup className="ml-1 font-mono text-[10px] text-white/60 align-super">6</sup> : null}
            </a>
          ))}
        </nav>

        <div data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: '500ms'}}>
          <button className="rounded-md border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2 text-xs sm:px-5 sm:text-sm hover:bg-white/25 transition duration-300">Get Free Consultation</button>
        </div>
      </div>
    </header>
  )
}

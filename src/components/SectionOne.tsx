import React from 'react'
import { ChevronRight } from 'lucide-react'

function Reveal({children, delay=0}:{children:any, delay?:number}){
  const ref = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(()=>{
    const el = ref.current!
    el.classList.add('reveal-hidden')
    const obs = new IntersectionObserver((entries)=>{
      for(const e of entries){
        if (e.isIntersecting){
          el.classList.add('reveal-visible')
          el.classList.remove('reveal-hidden')
          obs.disconnect()
        }
      }
    }, {threshold: 0.15})
    obs.observe(el)
    return ()=>obs.disconnect()
  },[])
  return (
    <div ref={ref} data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: `${delay}ms`, willChange: 'transform'}}>
      {children}
    </div>
  )
}

export default function SectionOne(){
  return (
    <section className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between">
      <div className="pt-4">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-2">
            {['AI AUTOMATION','AI INTEGRATION','AI AGENT DEVELOPMENT'].map((s,i)=> (
              <Reveal key={s} delay={150 + i*120}>
                <div className="font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md">/{s}</div>
              </Reveal>
            ))}
          </div>

          <div className="max-w-xs sm:text-right">
            <Reveal delay={300}>
              <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">We design automation that brings clarity, precision, and efficiency to the way your company operates.</p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal delay={150}>
            <div className="border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md font-mono text-[11px] uppercase tracking-[0.15em] mb-5 inline-block">We Automate 100+ Businesses</div>
          </Reveal>

          <Reveal delay={280}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">Clear. Precise.<br/>Automated.</h1>
          </Reveal>
        </div>

        <Reveal delay={420}>
          <div className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md max-w-sm">
            <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85" alt="Mitha, co-founder of NovaAI" className="h-24 w-20 rounded-lg object-cover"/>
            <div className="gap-1.5 pr-2">
              <div className="text-sm font-medium text-white">Talk with Mitha</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">Co-founder of NovaAI</div>
              <button className="mt-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-white/85 transition duration-300 inline-flex items-center gap-2">Book 15-mins call <ChevronRight size={14} /></button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

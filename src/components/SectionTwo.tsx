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

export default function SectionTwo(){
  const rows = [
    {idx: '01', title: 'Real-time vision', body: 'Reads context as it happens and surfaces what matters before you ask.'},
    {idx: '02', title: 'Layered insight', body: 'Moves from rough outline to sharp output without losing the thread.'},
    {idx: '03', title: 'Adaptive speed', body: 'Learns your cadence and tightens every pass as you work.'},
  ]

  return (
    <section className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-8">
        <div>
          <div data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: '120ms'}} className="border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md font-mono text-[11px] uppercase tracking-[0.15em] inline-block">Insight On Demand</div>
        </div>
        <div className="max-w-sm sm:text-right">
          <div data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: '220ms'}}>
            <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">Our AI doesn't just respond — it interprets, sharpens, and delivers the signal you need.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-12 md:flex-row items-end justify-between gap-16 mt-6">
        <div className="max-w-xl">
          <div data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: '180ms'}}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">Learn to see<br/>brilliantly.</h2>
          </div>
          <div data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: '320ms'}} className="mt-6 max-w-md text-sm sm:text-base text-white/80 drop-shadow-md">
            From the first sketch to the final render, Nova turns raw intent into decisions your team can act on — quietly, precisely, at speed.
          </div>

          <div data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: '420ms'}} className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-black hover:bg-white/85 transition duration-300 inline-flex items-center gap-2">Run the demo <ChevronRight size={14} /></button>
            <button className="rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-5 py-2.5 text-xs sm:text-sm hover:bg-white/20 transition duration-300">Free consultation</button>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-5 sm:px-6">
          {rows.map((r,i) => (
            <div key={r.idx} data-reveal style={{transition: 'all 700ms ease-out', transitionDelay: `${300 + i*110}ms`}} className={`flex gap-5 py-5 ${i < rows.length-1 ? 'border-b border-white/15' : ''}`}>
              <div className="font-mono text-[11px] tracking-[0.15em] text-white/55">{r.idx}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-base sm:text-lg font-medium text-white">{r.title}</div>
                  <ChevronRight size={16} className="text-white/40 hover:text-white transition-transform duration-300" />
                </div>
                <div className="mt-1.5 text-sm leading-relaxed text-white/70">{r.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

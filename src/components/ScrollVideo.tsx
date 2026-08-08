import React, { useEffect, useRef } from 'react'

const HERO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'
const POSTER_URL = '/hero-poster.jpg'

function clamp(v:number, a:number, b:number){return Math.max(a, Math.min(b, v))}

export default function ScrollVideo(){
  const containerRef = useRef<HTMLDivElement | null>(null)
  const posterRef = useRef<HTMLImageElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const offscreenRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const framesRef = useRef<ImageBitmap[] | null>(null)
  const frameCountRef = useRef<number>(0)
  const durationRef = useRef<number>(0)
  const smoothedRef = useRef<number>(0)
  const readyCanvasRef = useRef<boolean>(false)
  const posterReadyRef = useRef<boolean>(false)

  useEffect(() => {
    const poster = posterRef.current!
    const video = videoRef.current!
    const canvas = canvasRef.current!

    // Setup offscreen video for frame extraction
    const off = document.createElement('video')
    off.crossOrigin = 'anonymous'
    off.src = HERO_URL
    off.preload = 'auto'
    off.muted = true
    off.playsInline = true
    off.style.display = 'none'
    offscreenRef.current = off

    let isMounted = true

    const onVideoLoaded = () => {
      durationRef.current = video.duration || 0
      // hide poster when video has a decoded frame (we check by drawing once)
      // we will start extraction after a small yield
      setTimeout(startExtractionIfNeeded, 300)
    }

    function startExtractionIfNeeded(){
      // start frame extraction using offscreen video
      const offv = offscreenRef.current!
      if (!offv) return
      // ensure metadata
      const dur = offv.duration || 0
      if (!dur || !isFinite(dur)) return
      const targetFrames = Math.min(90, Math.max(24, Math.floor(dur * 12)))
      frameCountRef.current = targetFrames
      const canvasTmp = document.createElement('canvas')
      const maxW = 960
      const videoW = offv.videoWidth || 1920
      const videoH = offv.videoHeight || 1080
      const scale = Math.min(1, maxW / videoW)
      canvasTmp.width = Math.round(videoW * scale)
      canvasTmp.height = Math.round(videoH * scale)
      const ctx = canvasTmp.getContext('2d')!

      let i = 0
      const frames: ImageBitmap[] = []

      const extractNext = () => {
        if (!isMounted) return
        if (i >= targetFrames) {
          framesRef.current = frames
          readyCanvasRef.current = true
          frameCountRef.current = frames.length
          // fade poster/video out will be handled in render loop
          return
        }
        const t = Math.max(0, (i/(targetFrames-1))*(dur - 0.05))
        const onseek = async () => {
          try{
            ctx.clearRect(0,0,canvasTmp.width,canvasTmp.height)
            ctx.drawImage(offv, 0, 0, canvasTmp.width, canvasTmp.height)
            const bitmap = await createImageBitmap(canvasTmp)
            frames.push(bitmap)
          }catch(e){
            // ignore frame
          }
          i++
          // small delay to yield
          setTimeout(extractNext, 10)
        }
        offv.currentTime = t
        const handler = () => { offv.removeEventListener('seeked', handler); onseek() }
        offv.addEventListener('seeked', handler)
      }

      // ensure offv metadata + loadeddata
      if (offv.readyState >= 2) {
        extractNext()
      } else {
        const onld = () => { offv.removeEventListener('loadeddata', onld); extractNext() }
        offv.addEventListener('loadeddata', onld)
      }
    }

    const rafLoop = () => {
      const scrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const innerHeight = window.innerHeight
      const target = clamp(scrollY / Math.max(1, scrollHeight - innerHeight), 0, 1)
      smoothedRef.current += (target - smoothedRef.current) * 0.12

      const ctx = canvas.getContext('2d')!
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth * dpr
      const h = canvas.clientHeight * dpr
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      if (readyCanvasRef.current && framesRef.current && framesRef.current.length > 0) {
        // draw from frame cache
        const idx = Math.min(framesRef.current.length-1, Math.max(0, Math.round(smoothedRef.current * (framesRef.current.length-1))))
        const bmp = framesRef.current[idx]
        // draw with object-cover math
        const srcW = bmp.width
        const srcH = bmp.height
        const dstW = canvas.width
        const dstH = canvas.height
        const scale = Math.max(dstW/srcW, dstH/srcH)
        const sw = dstW/scale
        const sh = dstH/scale
        const sx = Math.max(0, (srcW - sw)/2)
        const sy = Math.max(0, (srcH - sh)/2)
        ctx.clearRect(0,0,dstW,dstH)
        ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, dstW, dstH)

        // ensure transitions
        canvas.style.opacity = '1'
        if (video) video.style.opacity = '0'
        if (poster) poster.style.opacity = '0'
      } else {
        // fallback: seek visible video
        if (video.readyState >= 2 && durationRef.current > 0) {
          const targetTime = Math.max(0, smoothedRef.current * Math.max(0, durationRef.current - 0.05))
          if (Math.abs(video.currentTime - targetTime) > 0.04) {
            try{ video.currentTime = targetTime }catch(e){}
          }
          // draw current frame of visible video to canvas for smooth visual (but canvas hidden until cache ready)
          try{
            ctx.clearRect(0,0,canvas.width, canvas.height)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          }catch(e){}
        }
        canvas.style.opacity = '0'
        video.style.opacity = '1'
        poster.style.opacity = '1'
      }

      rafRef.current = requestAnimationFrame(rafLoop)
    }

    // attach events
    const onLoadedData = () => {
      // draw once to ensure poster fades
      if (poster) { poster.style.transition = 'opacity 500ms ease'; poster.style.opacity = '0' }
      durationRef.current = video.duration || 0
      // start offscreen loading
      const offv = offscreenRef.current!
      if (offv && offv.readyState < 2) offv.load()
      setTimeout(() => {
        // kick extraction attempt; if offscreen already loaded, it'll start
        try{ startExtractionIfNeeded() }catch(e){}
      }, 300)
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.src = HERO_URL
    video.crossOrigin = 'anonymous'
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.style.objectFit = 'cover'
    video.style.width = '100%'
    video.style.height = '100%'
    video.style.opacity = '0'
    canvas.style.opacity = '0'

    rafRef.current = requestAnimationFrame(rafLoop)

    return () => {
      isMounted = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      video.removeEventListener('loadeddata', onLoadedData)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
      <img ref={posterRef} src={POSTER_URL} alt="hero poster" className="absolute inset-0 w-full h-full object-cover media-layer" style={{opacity:1}} />
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover media-layer" muted playsInline preload="auto" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover media-layer" />
    </div>
  )
}

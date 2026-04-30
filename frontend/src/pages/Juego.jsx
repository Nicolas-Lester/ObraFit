import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const CW = 400
const CH = 520
const WORKER_W = 52
const WORKER_H = 52
const ITEM_SIZE = 38
const SPD = 7

const GOOD = ['🥦', '🍎', '🥕', '🍌', '💧', '🥗', '🍳', '🧃', '🥑', '🫐', '🍊', '🥒', '🍇', '🥜']
const BAD  = ['🍔', '🍟', '🥤', '🍕', '🍩', '🍺', '🍭', '🌭', '🍫', '🧁', '🍪', '🥓']

export default function Juego() {
  const canvasRef   = useRef(null)
  const runningRef  = useRef(false)
  const workerRef   = useRef({ x: CW / 2 - WORKER_W / 2, y: CH - WORKER_H - 28 })
  const itemsRef    = useRef([])
  const scoreRef    = useRef(0)
  const livesRef    = useRef(3)
  const levelRef    = useRef(1)
  const keysRef     = useRef({})
  const touchRef    = useRef(null)
  const lastSpawnRef= useRef(0)
  const rafRef      = useRef(null)

  const [screen, setScreen] = useState('idle')   // idle | playing | gameover
  const [finalScore, setFinalScore] = useState(0)

  /* ── Spawn ── */
  const spawn = () => {
    const healthy = Math.random() < 0.55
    const pool = healthy ? GOOD : BAD
    const emoji = pool[Math.floor(Math.random() * pool.length)]
    const x = Math.random() * (CW - ITEM_SIZE - 10) + 5
    const speed = 2.2 + (levelRef.current - 1) * 0.4 + Math.random() * 0.6
    itemsRef.current.push({ x, y: -ITEM_SIZE, emoji, healthy, speed })
  }

  /* ── Loop ── */
  const loop = useCallback((ts) => {
    if (!runningRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = workerRef.current
    const k = keysRef.current

    /* Mover obrero */
    if (k.ArrowLeft  || k.a || k.A || touchRef.current === 'left')  w.x = Math.max(0, w.x - SPD)
    if (k.ArrowRight || k.d || k.D || touchRef.current === 'right') w.x = Math.min(CW - WORKER_W, w.x + SPD)

    /* Spawn */
    const spawnGap = Math.max(480, 1300 - (levelRef.current - 1) * 90)
    if (ts - lastSpawnRef.current > spawnGap) { spawn(); lastSpawnRef.current = ts }

    /* Física */
    let scored = 0, hit = 0
    itemsRef.current = itemsRef.current.filter((it) => {
      it.y += it.speed
      const col = it.y + ITEM_SIZE > w.y + 6 && it.y < w.y + WORKER_H &&
                  it.x + ITEM_SIZE > w.x + 4 && it.x < w.x + WORKER_W - 4
      if (col) { it.healthy ? scored += 10 : hit++; return false }
      return it.y < CH
    })
    scoreRef.current += scored
    livesRef.current  = Math.max(0, livesRef.current - hit)
    levelRef.current  = Math.floor(scoreRef.current / 150) + 1

    /* ── Dibujo ── */
    // Fondo gradiente
    const bg = ctx.createLinearGradient(0, 0, 0, CH)
    bg.addColorStop(0, '#dbeafe'); bg.addColorStop(1, '#f0f9ff')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH)

    // Decoración cielo
    ctx.globalAlpha = 0.25
    ctx.font = '38px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    ctx.fillText('☁️', 40, 40); ctx.fillText('☁️', 310, 20); ctx.fillText('🌤️', 175, 60)
    ctx.globalAlpha = 1

    // Suelo
    ctx.fillStyle = '#475569'; ctx.fillRect(0, CH - 26, CW, 26)
    ctx.fillStyle = '#334155'; ctx.fillRect(0, CH - 29, CW, 3)
    // Líneas suelo
    ctx.fillStyle = '#f8fafc'
    for (let i = 0; i < CW; i += 40) ctx.fillRect(i, CH - 18, 20, 4)

    // Items
    ctx.font = `${ITEM_SIZE}px serif`
    ctx.textBaseline = 'top'
    for (const it of itemsRef.current) ctx.fillText(it.emoji, it.x + ITEM_SIZE / 2, it.y)

    // Obrero
    ctx.font = `${WORKER_H}px serif`
    ctx.fillText('👷', w.x + WORKER_W / 2, w.y - 2)

    /* HUD */
    ctx.textBaseline = 'alphabetic'
    const pill = (x, y, w2, h, r) => {
      ctx.beginPath(); ctx.roundRect(x, y, w2, h, r)
      ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fill()
    }
    ctx.font = 'bold 13px Inter,system-ui,sans-serif'

    pill(8, 8, 104, 30, 15)
    ctx.fillStyle = '#0369a1'; ctx.textAlign = 'left'
    ctx.fillText(`⭐ ${scoreRef.current} pts`, 16, 28)

    pill(CW / 2 - 38, 8, 76, 30, 15)
    ctx.fillStyle = '#7c3aed'; ctx.textAlign = 'center'
    ctx.fillText(`Nv. ${levelRef.current}`, CW / 2, 28)

    const livesStr = '❤️'.repeat(livesRef.current)
    pill(CW - 100, 8, 92, 30, 15)
    ctx.fillStyle = '#b91c1c'; ctx.textAlign = 'right'
    ctx.fillText(livesStr, CW - 10, 28)

    /* Game Over */
    if (livesRef.current <= 0) {
      runningRef.current = false
      setFinalScore(scoreRef.current)
      setScreen('gameover')
      return
    }
    rafRef.current = requestAnimationFrame(loop)
  }, []) // eslint-disable-line

  /* ── Start ── */
  const startGame = useCallback(() => {
    workerRef.current  = { x: CW / 2 - WORKER_W / 2, y: CH - WORKER_H - 28 }
    itemsRef.current   = []
    scoreRef.current   = 0
    livesRef.current   = 3
    levelRef.current   = 1
    lastSpawnRef.current = 0
    runningRef.current = true
    setScreen('playing')
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  /* ── Eventos teclado ── */
  useEffect(() => {
    const onKey = (e) => { keysRef.current[e.key] = e.type === 'keydown' }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)

    // Dibujo pantalla inicial
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      const bg = ctx.createLinearGradient(0, 0, 0, CH)
      bg.addColorStop(0, '#dbeafe'); bg.addColorStop(1, '#f0f9ff')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH)
      ctx.font = `${CW * 0.25}px serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('👷', CW / 2, CH / 2)
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4">

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
            🎮 MINIJUEGO
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight">
            ObraFit Rush
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Atrapa lo sano, esquiva la chatarra</p>
        </div>

        {/* Canvas */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-sky-200">
          <canvas ref={canvasRef} width={CW} height={CH} className="w-full block" />

          {/* Pantalla idle */}
          {screen === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6"
              style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.65) 100%)' }}>
              <div className="text-8xl mb-4 drop-shadow-lg animate-bounce">👷</div>
              <h2 className="text-2xl font-extrabold mb-2">¡Hora de comer sano!</h2>
              <p className="text-sm text-white/80 mb-1">Usa las flechas ← → o los botones.</p>
              <p className="text-sm text-white/80 mb-6">Atrapa frutas y verduras. Esquiva la chatarra.</p>
              <button onClick={startGame}
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-extrabold px-10 py-3 rounded-2xl text-lg shadow-xl transition-all duration-150">
                ¡Jugar! 🚀
              </button>
            </div>
          )}

          {/* Game Over */}
          {screen === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6"
              style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.75) 100%)' }}>
              <div className="text-6xl mb-3">😵</div>
              <h2 className="text-2xl font-extrabold mb-1">¡Game Over!</h2>
              <p className="text-6xl font-extrabold text-yellow-300 my-2 drop-shadow">{finalScore}</p>
              <p className="text-sm text-white/60 mb-1">puntos</p>
              <p className="text-base font-semibold text-white/90 mb-6">
                {finalScore >= 400 ? '🏆 ¡Leyenda de la obra!' : finalScore >= 200 ? '💪 ¡Muy bien!' : finalScore >= 80 ? '👍 ¡Buen intento!' : '📖 Sigue practicando'}
              </p>
              <button onClick={startGame}
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-extrabold px-10 py-3 rounded-2xl text-lg shadow-xl transition-all duration-150">
                Intentar de nuevo 🔄
              </button>
            </div>
          )}
        </div>

        {/* Controles táctiles */}
        <div className="flex gap-3 mt-3">
          <button
            onPointerDown={() => { touchRef.current = 'left' }}
            onPointerUp={() => { touchRef.current = null }}
            onPointerLeave={() => { touchRef.current = null }}
            className="flex-1 bg-white hover:bg-sky-50 active:bg-sky-100 border-2 border-sky-200 text-sky-600 text-4xl font-bold rounded-2xl py-4 select-none shadow-sm transition-colors"
          >←</button>
          <button
            onPointerDown={() => { touchRef.current = 'right' }}
            onPointerUp={() => { touchRef.current = null }}
            onPointerLeave={() => { touchRef.current = null }}
            className="flex-1 bg-white hover:bg-sky-50 active:bg-sky-100 border-2 border-sky-200 text-sky-600 text-4xl font-bold rounded-2xl py-4 select-none shadow-sm transition-colors"
          >→</button>
        </div>

        {/* Leyenda */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
            <p className="text-xs text-emerald-700 font-bold mb-1 uppercase tracking-wide">✅ Atrapa (+10)</p>
            <p className="text-2xl leading-relaxed">🥦 🍎 🥕 🍌 💧 🥗</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
            <p className="text-xs text-red-700 font-bold mb-1 uppercase tracking-wide">❌ Esquiva (-❤️)</p>
            <p className="text-2xl leading-relaxed">🍔 🍟 🥤 🍕 🍩 🍺</p>
          </div>
        </div>

        {/* Cómo jugar */}
        <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">¿Cómo jugar?</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
            <div className="bg-gray-50 rounded-xl p-2">
              <div className="text-xl mb-1">⌨️</div>
              <p>Flechas ← →</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2">
              <div className="text-xl mb-1">📱</div>
              <p>Botones táctiles</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2">
              <div className="text-xl mb-1">🔼</div>
              <p>Sube de nivel</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-sky-600 hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}

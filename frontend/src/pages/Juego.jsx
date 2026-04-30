import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

// ─── Canvas size ───────────────────────────────────────────────────────────────
const CW = 420
const CH = 580

// ─── Perspective / road geometry ──────────────────────────────────────────────
const HORIZON_Y = CH * 0.32
const ROAD_W_NEAR = CW * 0.92
const ROAD_W_FAR  = CW * 0.14
const ROAD_L = CW / 2

// Lanes: 0=left 1=center 2=right
const LANE_OFFSETS = [-1, 0, 1]

// ─── Physics ───────────────────────────────────────────────────────────────────
const GRAVITY      = 0.55
const JUMP_VY      = -12.5

// ─── Perspective helpers ────────────────────────────────────────────────────────
function perspX(laneOffset, depth) {
  const roadW = ROAD_W_FAR + (ROAD_W_NEAR - ROAD_W_FAR) * depth
  return ROAD_L + laneOffset * roadW / 3
}
function perspY(depth) {
  return HORIZON_Y + (CH - HORIZON_Y - 40) * depth
}
function perspScale(depth) {
  return 0.18 + 0.82 * depth
}

// ─── Items ─────────────────────────────────────────────────────────────────────
const GOOD = ['🥦','🍎','🥕','🍌','💧','🥗','🍳','🧃','🥑','🫐','🍊','🥒','🍇','🥜']
const BAD  = ['🍔','🍟','🥤','🍕','🍩','🍺','🍭','🌭','🍫','🧁','🍪','🥓']

// ─── Colors ────────────────────────────────────────────────────────────────────
const SKY_TOP    = '#87ceeb'
const SKY_BOT    = '#c8e6f5'
const ROAD_DARK  = '#3d3d3d'
const ROAD_MID   = '#4a4a4a'
const SIDEWALK   = '#b8a898'
const GRASS_FAR  = '#5aab4a'
const GRASS_NEAR = '#4e9940'
const NUM_STRIPES = 14

export default function Juego() {
  const canvasRef      = useRef(null)
  const runningRef     = useRef(false)
  const gameRef        = useRef(null)
  const rafRef         = useRef(null)
  const keysRef        = useRef({})

  const [screen, setScreen]         = useState('idle')
  const [finalScore, setFinalScore] = useState(0)

  const initGame = () => ({
    lane: 1,
    laneX: perspX(0, 1),
    jumpY: 0,
    jumpVY: 0,
    isJumping: false,
    score: 0,
    lives: 3,
    level: 1,
    distance: 0,
    items: [],
    obstacles: [],
    stripes: Array.from({ length: NUM_STRIPES }, (_, i) => i / NUM_STRIPES),
    lastSpawn: 0,
    lastObstacle: 0,
    particles: [],
    tilt: 0,
    flashGreen: 0,
    flashRed: 0,
    buildings: Array.from({ length: 8 }, (_, i) => ({
      side: i % 2 === 0 ? 'left' : 'right',
      z: i / 8,
      hue: 210 + (i * 17 % 40),
      h: 0.15 + (i * 0.07 % 0.25),
    })),
    clouds: Array.from({ length: 5 }, (_, i) => ({
      x: 30 + (i * 83 % (CW - 60)),
      y: CH * 0.04 + (i * 19 % (CH * 0.18)),
      scale: 0.6 + (i * 0.13 % 0.7),
      speed: 0.15 + (i * 0.07 % 0.25),
    })),
  })

  const spawnItem = (g) => {
    const lane  = Math.floor(Math.random() * 3)
    const good  = Math.random() < 0.55
    const pool  = good ? GOOD : BAD
    const emoji = pool[Math.floor(Math.random() * pool.length)]
    g.items.push({ lane, depth: 0, emoji, good, hit: false })
  }

  const spawnObstacle = (g) => {
    const lane   = Math.floor(Math.random() * 3)
    const emojis = ['🧱','🪨','⚠️','🪣','🔩','🪜']
    const emoji  = emojis[Math.floor(Math.random() * emojis.length)]
    g.obstacles.push({ lane, depth: 0, emoji, hit: false })
  }

  const drawBuilding = (ctx, b) => {
    const z = ((b.z % 1) + 1) % 1
    if (z < 0.05) return
    const scale = perspScale(z)
    const py    = perspY(z)
    const bh    = b.h * CH * scale
    const bw    = 38 * scale
    let bx
    if (b.side === 'left') {
      bx = perspX(-1.65, z) - bw / 2
    } else {
      bx = perspX(1.65, z) - bw / 2
    }
    ctx.globalAlpha = 0.18 * z
    ctx.fillStyle = '#000'
    ctx.fillRect(bx + 3 * scale, py - bh + 3 * scale, bw, bh)
    ctx.globalAlpha = 1
    ctx.fillStyle = `hsl(${b.hue},22%,${38 + z * 24}%)`
    ctx.fillRect(bx, py - bh, bw, bh)
    ctx.fillStyle = `rgba(255,230,100,${0.5 + z * 0.4})`
    const rows = Math.max(1, Math.floor(3 * scale))
    const cols = Math.max(1, Math.floor(2 * scale))
    const wx = bw / (cols + 1)
    const wy = bh / (rows + 1)
    for (let r = 1; r <= rows; r++)
      for (let c = 1; c <= cols; c++)
        ctx.fillRect(bx + wx * c - 2 * scale, py - bh + wy * r - 2 * scale, 4 * scale, 3 * scale)
    ctx.fillStyle = `hsl(${b.hue},30%,50%)`
    ctx.fillRect(bx, py - bh, bw, 4 * scale)
  }

  const loop = useCallback((ts) => {
    if (!runningRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const g   = gameRef.current

    const speedMult = 1 + (g.level - 1) * 0.12
    const baseSpeed = 0.018 * speedMult
    g.distance += baseSpeed
    g.level = Math.floor(g.distance / 20) + 1

    const targetLaneX = perspX(LANE_OFFSETS[g.lane], 1)
    const dx = targetLaneX - g.laneX
    g.laneX += dx * 0.22
    g.tilt   = dx * 0.012

    if (g.isJumping) {
      g.jumpVY += GRAVITY
      g.jumpY  += g.jumpVY
      if (g.jumpY >= 0) { g.jumpY = 0; g.jumpVY = 0; g.isJumping = false }
    }

    g.stripes = g.stripes.map(z => { z += baseSpeed * 1.5; return z >= 1 ? z - 1 : z })
    g.buildings.forEach(b => { b.z += baseSpeed * 0.7; if (b.z >= 1) b.z -= 1 })
    g.clouds.forEach(c => { c.x -= c.speed; if (c.x < -80) c.x = CW + 40 })

    const spawnGap = Math.max(400, 1100 - (g.level - 1) * 50)
    if (ts - g.lastSpawn > spawnGap) { spawnItem(g); g.lastSpawn = ts }
    const obsGap = Math.max(800, 2200 - (g.level - 1) * 80)
    if (ts - g.lastObstacle > obsGap && g.level >= 2) { spawnObstacle(g); g.lastObstacle = ts }

    g.items = g.items.filter(it => {
      it.depth += baseSpeed * 1.1
      if (it.depth >= 1.05) return false
      if (it.depth >= 0.92 && !it.hit && it.lane === g.lane) {
        const playerY = perspY(1) + g.jumpY
        const itemY   = perspY(it.depth)
        if (playerY > itemY - 35) {
          it.hit = true
          if (it.good) {
            g.score += 10
            g.flashGreen = 8
            const ix = perspX(LANE_OFFSETS[it.lane], it.depth)
            const iy = perspY(it.depth) - 28 * perspScale(it.depth)
            for (let i = 0; i < 6; i++) {
              g.particles.push({ x: ix, y: iy, vx: (Math.random() - 0.5) * 5, vy: -2 - Math.random() * 4, emoji: it.emoji, alpha: 1, scale: 0.8 + Math.random() * 0.4 })
            }
          } else {
            g.lives = Math.max(0, g.lives - 1)
            g.flashRed = 10
          }
          return false
        }
      }
      return true
    })

    g.obstacles = g.obstacles.filter(ob => {
      ob.depth += baseSpeed * 1.1
      if (ob.depth >= 1.05) return false
      if (ob.depth >= 0.88 && !ob.hit && ob.lane === g.lane) {
        if (g.jumpY > -18) {
          ob.hit = true
          g.lives = Math.max(0, g.lives - 1)
          g.flashRed = 12
        }
      }
      return true
    })

    g.particles = g.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.alpha -= 0.04; return p.alpha > 0 })
    if (g.flashGreen > 0) g.flashGreen--
    if (g.flashRed   > 0) g.flashRed--

    // ── DRAW ──
    const sky = ctx.createLinearGradient(0, 0, 0, HORIZON_Y + 10)
    sky.addColorStop(0, SKY_TOP); sky.addColorStop(1, SKY_BOT)
    ctx.fillStyle = sky; ctx.fillRect(0, 0, CW, HORIZON_Y + 10)

    const sunGrad = ctx.createRadialGradient(CW * 0.75, HORIZON_Y * 0.35, 2, CW * 0.75, HORIZON_Y * 0.35, 22)
    sunGrad.addColorStop(0, '#fffde7'); sunGrad.addColorStop(0.6, '#ffe082'); sunGrad.addColorStop(1, 'rgba(255,224,130,0)')
    ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(CW * 0.75, HORIZON_Y * 0.35, 22, 0, Math.PI * 2); ctx.fill()

    g.clouds.forEach(c => {
      ctx.globalAlpha = 0.82 * c.scale
      ctx.font = `${28 * c.scale}px serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'
      ctx.fillText('☁️', c.x, c.y)
    })
    ctx.globalAlpha = 1

    const nearLeft  = ROAD_L - ROAD_W_NEAR / 2
    const nearRight = ROAD_L + ROAD_W_NEAR / 2
    const farLeft   = ROAD_L - ROAD_W_FAR / 2
    const farRight  = ROAD_L + ROAD_W_FAR / 2
    const nearY = CH
    const farY  = HORIZON_Y

    ctx.fillStyle = GRASS_FAR
    ctx.fillRect(0, HORIZON_Y - 2, farLeft, 10)
    ctx.fillRect(farRight, HORIZON_Y - 2, CW - farRight, 10)

    ctx.fillStyle = GRASS_NEAR
    ctx.beginPath(); ctx.moveTo(0, nearY); ctx.lineTo(nearLeft, nearY); ctx.lineTo(farLeft, farY); ctx.lineTo(0, farY); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(nearRight, nearY); ctx.lineTo(CW, nearY); ctx.lineTo(CW, farY); ctx.lineTo(farRight, farY); ctx.closePath(); ctx.fill()

    const swL = 18
    ctx.fillStyle = SIDEWALK
    ctx.beginPath(); ctx.moveTo(nearLeft - swL, nearY); ctx.lineTo(nearLeft, nearY); ctx.lineTo(farLeft, farY); ctx.lineTo(farLeft - swL * 0.12, farY); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(nearRight, nearY); ctx.lineTo(nearRight + swL, nearY); ctx.lineTo(farRight + swL * 0.12, farY); ctx.lineTo(farRight, farY); ctx.closePath(); ctx.fill()

    const roadGrad = ctx.createLinearGradient(0, farY, 0, nearY)
    roadGrad.addColorStop(0, ROAD_MID); roadGrad.addColorStop(1, ROAD_DARK)
    ctx.fillStyle = roadGrad
    ctx.beginPath(); ctx.moveTo(farLeft, farY); ctx.lineTo(farRight, farY); ctx.lineTo(nearRight, nearY); ctx.lineTo(nearLeft, nearY); ctx.closePath(); ctx.fill()

    ctx.strokeStyle = '#f5c518'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(farLeft, farY);  ctx.lineTo(nearLeft,  nearY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(farRight, farY); ctx.lineTo(nearRight, nearY); ctx.stroke()

    const drawDash = (laneEdge) => {
      g.stripes.forEach(z => {
        if (z < 0.05 || z > 0.98) return
        const x1 = perspX(laneEdge, z); const y1 = perspY(z)
        const d2 = Math.min(z + 0.025, 1)
        const x2 = perspX(laneEdge, d2); const y2 = perspY(d2)
        const sc = perspScale(z)
        ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = Math.max(1, 2.5 * sc)
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
      })
    }
    drawDash(-1); drawDash(0); drawDash(1)

    const sorted = [...g.buildings].sort((a, b) => b.z - a.z)
    sorted.forEach(b => drawBuilding(ctx, b))

    const allObjects = [
      ...g.items.map(it => ({ ...it, type: 'item' })),
      ...g.obstacles.map(ob => ({ ...ob, type: 'obstacle' })),
    ].sort((a, b) => a.depth - b.depth)

    allObjects.forEach(obj => {
      if (obj.depth < 0.05) return
      const sc  = perspScale(obj.depth)
      const ox  = perspX(LANE_OFFSETS[obj.lane], obj.depth)
      const oy  = perspY(obj.depth)

      if (obj.type === 'obstacle') {
        ctx.globalAlpha = 0.3 * obj.depth
        ctx.fillStyle = '#000'
        ctx.beginPath(); ctx.ellipse(ox, oy, 18 * sc, 5 * sc, 0, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = 1
        ctx.font = `${40 * sc}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
        ctx.fillText(obj.emoji, ox, oy)
        if (obj.depth > 0.7 && obj.lane === g.lane) {
          ctx.font = `bold ${12 * sc}px Inter,sans-serif`
          ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2
          ctx.textBaseline = 'bottom'
          ctx.strokeText('¡SALTA!', ox, oy - 36 * sc)
          ctx.fillText('¡SALTA!', ox, oy - 36 * sc)
        }
      } else {
        const bob = Math.sin(obj.depth * 25 + ts * 0.003) * 4 * sc
        const iy  = oy - 28 * sc + bob
        const size = 40 * sc
        ctx.globalAlpha = 0.9
        ctx.strokeStyle = obj.good ? 'rgba(52,211,153,0.55)' : 'rgba(239,68,68,0.45)'
        ctx.lineWidth = 2 * sc
        ctx.beginPath(); ctx.arc(ox, iy - size * 0.3, size * 0.55, 0, Math.PI * 2); ctx.stroke()
        ctx.globalAlpha = 0.25 * obj.depth
        ctx.fillStyle = '#000'
        ctx.beginPath(); ctx.ellipse(ox, oy, 12 * sc, 4 * sc, 0, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = 1
        ctx.font = `${size}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
        ctx.fillText(obj.emoji, ox, iy)
      }
    })

    // Player
    const playerX = g.laneX
    const groundY = perspY(1)
    const playerY = groundY + g.jumpY
    const psc = perspScale(1)
    const shadowSc = g.isJumping ? 0.5 + 0.5 * (1 - (-g.jumpY / 80)) : 1
    ctx.globalAlpha = 0.3
    ctx.fillStyle = '#000'
    ctx.beginPath(); ctx.ellipse(playerX, groundY, 22 * psc * shadowSc, 7 * psc * shadowSc, 0, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 1
    ctx.save()
    ctx.translate(playerX, playerY)
    ctx.rotate(g.tilt)
    ctx.font = `${58 * psc}px serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
    if (g.flashGreen > 0) { ctx.shadowColor = '#34d399'; ctx.shadowBlur = 18 }
    else if (g.flashRed > 0) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 18 }
    ctx.fillText('👷', 0, 0)
    ctx.shadowBlur = 0
    ctx.restore()

    g.particles.forEach(p => {
      ctx.globalAlpha = p.alpha
      ctx.font = `${22 * p.scale}px serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(p.emoji, p.x, p.y)
    })
    ctx.globalAlpha = 1

    // HUD
    const hud = (x, y, w, h, r = 14) => {
      ctx.beginPath(); ctx.roundRect(x, y, w, h, r)
      ctx.fillStyle = 'rgba(0,0,0,0.48)'; ctx.fill()
    }
    ctx.font = 'bold 13px Inter,system-ui,sans-serif'; ctx.textBaseline = 'middle'
    hud(8, 8, 118, 28); ctx.fillStyle = '#fde68a'; ctx.textAlign = 'left'; ctx.fillText(`⭐ ${g.score} pts`, 16, 23)
    hud(CW / 2 - 42, 8, 84, 28); ctx.fillStyle = '#a5f3fc'; ctx.textAlign = 'center'; ctx.fillText(`Nivel ${g.level}`, CW / 2, 23)
    const livesStr = '❤️'.repeat(g.lives) + '🖤'.repeat(3 - g.lives)
    hud(CW - 114, 8, 106, 28); ctx.fillStyle = '#fff'; ctx.textAlign = 'right'; ctx.fillText(livesStr, CW - 10, 23)

    if (g.flashGreen > 0) { ctx.fillStyle = `rgba(52,211,153,${0.18 * g.flashGreen / 8})`; ctx.fillRect(0, 0, CW, CH) }
    if (g.flashRed   > 0) { ctx.fillStyle = `rgba(239,68,68,${0.22 * g.flashRed / 12})`;  ctx.fillRect(0, 0, CW, CH) }

    if (g.lives <= 0) {
      runningRef.current = false
      setFinalScore(g.score)
      setScreen('gameover')
      return
    }
    rafRef.current = requestAnimationFrame(loop)
  }, []) // eslint-disable-line

  const startGame = useCallback(() => {
    gameRef.current    = initGame()
    runningRef.current = true
    setScreen('playing')
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop]) // eslint-disable-line

  useEffect(() => {
    const onKey = (e) => {
      keysRef.current[e.key] = e.type === 'keydown'
      if (e.type === 'keydown') {
        const g = gameRef.current
        if (!g || !runningRef.current) return
        if ((e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') && g.lane > 0) g.lane--
        if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && g.lane < 2) g.lane++
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && !g.isJumping) {
          g.isJumping = true; g.jumpVY = JUMP_VY; e.preventDefault()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      const sky = ctx.createLinearGradient(0, 0, 0, CH)
      sky.addColorStop(0, SKY_TOP); sky.addColorStop(1, SKY_BOT)
      ctx.fillStyle = sky; ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = ROAD_DARK
      ctx.beginPath()
      ctx.moveTo(ROAD_L - ROAD_W_FAR / 2, HORIZON_Y); ctx.lineTo(ROAD_L + ROAD_W_FAR / 2, HORIZON_Y)
      ctx.lineTo(ROAD_L + ROAD_W_NEAR / 2, CH);       ctx.lineTo(ROAD_L - ROAD_W_NEAR / 2, CH)
      ctx.closePath(); ctx.fill()
      ctx.font = `80px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
      ctx.fillText('👷', ROAD_L, CH - 28)
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleLeft  = () => { const g = gameRef.current; if (g && runningRef.current && g.lane > 0) g.lane-- }
  const handleRight = () => { const g = gameRef.current; if (g && runningRef.current && g.lane < 2) g.lane++ }
  const handleJump  = () => { const g = gameRef.current; if (g && runningRef.current && !g.isJumping) { g.isJumping = true; g.jumpVY = JUMP_VY } }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-50 pb-10">
      <div className="max-w-lg mx-auto px-3 pt-5 pb-4">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
            🎮 Minijuego
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight">ObraFit Rush</h1>
          <p className="text-gray-500 mt-1 text-sm">Corre, salta y come sano en la obra</p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-sky-200">
          <canvas ref={canvasRef} width={CW} height={CH} className="w-full block" />

          {screen === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6"
              style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.72) 100%)' }}>
              <div className="text-7xl mb-3 drop-shadow-xl animate-bounce">👷</div>
              <h2 className="text-2xl font-extrabold mb-2 drop-shadow">¡A correr en la obra!</h2>
              <p className="text-sm text-white/80 mb-1">← → cambiar carril &nbsp;|&nbsp; ↑ / Espacio saltar</p>
              <p className="text-sm text-white/75 mb-5">Recoge comida sana · esquiva la chatarra · salta obstáculos</p>
              <button onClick={startGame}
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-extrabold px-10 py-3 rounded-2xl text-lg shadow-xl transition-all duration-150">
                ¡Jugar! 🚀
              </button>
            </div>
          )}

          {screen === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6"
              style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.82) 100%)' }}>
              <div className="text-6xl mb-3">😵</div>
              <h2 className="text-2xl font-extrabold mb-1">¡Game Over!</h2>
              <p className="text-6xl font-extrabold text-yellow-300 my-2 drop-shadow">{finalScore}</p>
              <p className="text-sm text-white/60 mb-1">puntos</p>
              <p className="text-base font-semibold text-white/90 mb-6">
                {finalScore >= 500 ? '🏆 ¡Leyenda de la obra!' : finalScore >= 250 ? '💪 ¡Muy buen corredor!' : finalScore >= 100 ? '👍 ¡Buen intento!' : '📖 Sigue practicando'}
              </p>
              <button onClick={startGame}
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-extrabold px-10 py-3 rounded-2xl text-lg shadow-xl transition-all duration-150">
                Intentar de nuevo 🔄
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <button onPointerDown={handleLeft}
            className="flex-1 bg-white hover:bg-sky-50 active:bg-sky-100 border-2 border-sky-200 text-sky-600 text-3xl font-bold rounded-2xl py-4 select-none shadow-sm transition-colors">←</button>
          <button onPointerDown={handleJump}
            className="flex-[1.3] bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-2xl font-extrabold rounded-2xl py-4 select-none shadow-md transition-colors">⬆ Saltar</button>
          <button onPointerDown={handleRight}
            className="flex-1 bg-white hover:bg-sky-50 active:bg-sky-100 border-2 border-sky-200 text-sky-600 text-3xl font-bold rounded-2xl py-4 select-none shadow-sm transition-colors">→</button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
            <p className="text-xs text-emerald-700 font-bold mb-1 uppercase tracking-wide">✅ Recoge (+10)</p>
            <p className="text-xl leading-relaxed">🥦 🍎 🥕 🍌 💧 🥗</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
            <p className="text-xs text-red-700 font-bold mb-1 uppercase tracking-wide">❌ Esquiva (−❤️)</p>
            <p className="text-xl leading-relaxed">🍔 🍟 🥤 🍕 🍩 🍺</p>
          </div>
        </div>

        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
          <p className="text-xs text-amber-700 font-bold mb-1 uppercase tracking-wide">🧱 Obstáculos — ¡Sáltalos! (desde nivel 2)</p>
          <p className="text-xl">🧱 🪨 ⚠️ 🪣 🔩 🪜</p>
        </div>

        <div className="mt-3 bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">¿Cómo jugar?</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
            <div className="bg-gray-50 rounded-xl p-2"><div className="text-xl mb-1">⌨️</div><p>← → cambiar carril</p></div>
            <div className="bg-gray-50 rounded-xl p-2"><div className="text-xl mb-1">⬆️</div><p>↑ / Espacio saltar</p></div>
            <div className="bg-gray-50 rounded-xl p-2"><div className="text-xl mb-1">🔼</div><p>Más rápido cada nivel</p></div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-sky-600 hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}

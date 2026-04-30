import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const CW = 420, CH = 580
const HORIZON_Y = CH * 0.30
const ROAD_W_NEAR = CW * 0.90, ROAD_W_FAR = CW * 0.12
const ROAD_L = CW / 2
const LANE_OFFSETS = [-1, 0, 1]
const GRAVITY = 0.44, JUMP_VY = -11.5

function perspX(off, d) { return ROAD_L + off * (ROAD_W_FAR + (ROAD_W_NEAR - ROAD_W_FAR) * d) / 3 }
function perspY(d) { return HORIZON_Y + (CH - HORIZON_Y - 28) * d }
function perspScale(d) { return 0.14 + 0.86 * d }

const GOOD = ['🥦','🍎','🥕','🍌','💧','🥗','🍳','🧃','🥑','🫐','🍊','🥒','🍇','🥜']
const BAD  = ['🍔','🍟','🥤','🍕','🍩','🍺','🍭','🌭','🍫','🧁','🍪','🥓']
const NUM_STRIPES = 16

function drawWorker(ctx, x, y, sc, frame, tilt, jumping) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(tilt)
  const s = sc * 0.88
  const leg = jumping ? -28 : Math.sin(frame * 0.22) * 24
  const arm = jumping ? -22 : Math.cos(frame * 0.22) * 20

  // Left leg + boot
  ctx.save(); ctx.translate(-6*s, 10*s); ctx.rotate(leg * Math.PI / 180)
  ctx.fillStyle = '#1e3a8a'; ctx.beginPath(); ctx.roundRect(-5*s,0,10*s,20*s,2*s); ctx.fill()
  ctx.fillStyle = '#1c1917'; ctx.beginPath(); ctx.roundRect(-6*s,18*s,13*s,10*s,2*s); ctx.fill()
  ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.ellipse(2*s,27*s,5.5*s,3*s,0,0,Math.PI*2); ctx.fill()
  ctx.restore()

  // Right leg + boot
  ctx.save(); ctx.translate(6*s, 10*s); ctx.rotate(-leg * Math.PI / 180)
  ctx.fillStyle = '#1e3a8a'; ctx.beginPath(); ctx.roundRect(-5*s,0,10*s,20*s,2*s); ctx.fill()
  ctx.fillStyle = '#1c1917'; ctx.beginPath(); ctx.roundRect(-6*s,18*s,13*s,10*s,2*s); ctx.fill()
  ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.ellipse(2*s,27*s,5.5*s,3*s,0,0,Math.PI*2); ctx.fill()
  ctx.restore()

  // Pants upper
  ctx.fillStyle = '#1e3a8a'; ctx.beginPath(); ctx.roundRect(-11*s,-8*s,22*s,20*s,2*s); ctx.fill()

  // Left arm
  ctx.save(); ctx.translate(-13*s,-28*s); ctx.rotate(arm * Math.PI / 180)
  ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.roundRect(-4*s,0,8*s,22*s,3*s); ctx.fill()
  ctx.fillStyle = '#fcd34d'; ctx.beginPath(); ctx.arc(0,23*s,4*s,0,Math.PI*2); ctx.fill()
  ctx.restore()

  // Right arm
  ctx.save(); ctx.translate(13*s,-28*s); ctx.rotate(-arm * Math.PI / 180)
  ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.roundRect(-4*s,0,8*s,22*s,3*s); ctx.fill()
  ctx.fillStyle = '#fcd34d'; ctx.beginPath(); ctx.arc(0,23*s,4*s,0,Math.PI*2); ctx.fill()
  ctx.restore()

  // Body / safety vest
  ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.roundRect(-12*s,-36*s,24*s,30*s,3*s); ctx.fill()
  // Reflective stripes
  ctx.fillStyle = '#fef08a'
  ctx.fillRect(-12*s,-24*s,24*s,3.5*s)
  ctx.fillRect(-12*s,-15*s,24*s,3.5*s)
  // Zip line
  ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 1.5*s
  ctx.beginPath(); ctx.moveTo(0,-36*s); ctx.lineTo(0,-7*s); ctx.stroke()
  // Neck
  ctx.fillStyle = '#fcd34d'; ctx.fillRect(-3*s,-40*s,6*s,6*s)

  // Head
  ctx.fillStyle = '#fcd34d'; ctx.beginPath(); ctx.arc(0,-50*s,13*s,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(-12.5*s,-50*s,3.5*s,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(12.5*s,-50*s,3.5*s,0,Math.PI*2); ctx.fill()
  // Eyes
  ctx.fillStyle = '#1e293b'
  ctx.beginPath(); ctx.arc(-5*s,-52*s,2*s,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(5*s,-52*s,2*s,0,Math.PI*2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(-4*s,-53*s,0.9*s,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(6*s,-53*s,0.9*s,0,Math.PI*2); ctx.fill()
  // Mouth
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.5*s
  if (jumping) {
    ctx.beginPath(); ctx.arc(0,-46*s,4.5*s,0.2,Math.PI-0.2,true); ctx.stroke()
  } else {
    ctx.beginPath(); ctx.arc(0,-47*s,4*s,0.1,Math.PI-0.1); ctx.stroke()
  }

  // Hard hat brim
  ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.roundRect(-19*s,-62*s,38*s,5*s,2*s); ctx.fill()
  // Dome
  ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.ellipse(0,-64*s,17*s,12*s,0,Math.PI,0); ctx.fill()
  ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.ellipse(-3*s,-68*s,7*s,4*s,-0.3,Math.PI,0); ctx.fill()
  ctx.fillStyle = '#b45309'; ctx.fillRect(-17*s,-62*s,34*s,2*s)
  ctx.restore()
}

function drawObstacle(ctx, type, ox, gy, sc) {
  const s = sc
  ctx.globalAlpha = 0.3 * sc; ctx.fillStyle = '#000'
  ctx.beginPath(); ctx.ellipse(ox,gy,18*s,5*s,0,0,Math.PI*2); ctx.fill()
  ctx.globalAlpha = 1
  if (type === 'cone') {
    ctx.fillStyle = '#f97316'
    ctx.beginPath(); ctx.moveTo(ox-11*s,gy); ctx.lineTo(ox+11*s,gy); ctx.lineTo(ox+3*s,gy-26*s); ctx.lineTo(ox-3*s,gy-26*s); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#fff'; ctx.fillRect(ox-8*s,gy-10*s,16*s,3*s); ctx.fillRect(ox-5.5*s,gy-18*s,11*s,2.5*s)
    ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.roundRect(ox-13*s,gy-3*s,26*s,4*s,1*s); ctx.fill()
  } else if (type === 'barrier') {
    const bh=26*s, bw=32*s
    const gr=ctx.createLinearGradient(ox-bw/2,gy-bh,ox+bw/2,gy)
    gr.addColorStop(0,'#dc2626'); gr.addColorStop(0.5,'#f87171'); gr.addColorStop(1,'#991b1b')
    ctx.fillStyle=gr; ctx.beginPath()
    ctx.moveTo(ox-bw/2,gy); ctx.lineTo(ox-bw/2+4*s,gy-bh*0.4); ctx.lineTo(ox-bw/2+7*s,gy-bh)
    ctx.lineTo(ox+bw/2-7*s,gy-bh); ctx.lineTo(ox+bw/2-4*s,gy-bh*0.4); ctx.lineTo(ox+bw/2,gy)
    ctx.closePath(); ctx.fill()
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillRect(ox-10*s,gy-bh*0.88,8*s,3*s); ctx.fillRect(ox+2*s,gy-bh*0.88,8*s,3*s)
  } else if (type === 'bag') {
    const bag=(bx,by,rot,col)=>{ctx.save();ctx.translate(bx,by);ctx.rotate(rot);ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(0,0,16*s,10*s,0,0,Math.PI*2);ctx.fill();ctx.restore()}
    bag(ox,gy-7*s,0,'#a8a29e'); bag(ox-7*s,gy-18*s,0.3,'#78716c'); bag(ox+6*s,gy-17*s,-0.2,'#a8a29e')
    ctx.fillStyle='#44403c'; ctx.font=`bold ${6*s}px monospace`; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('CEMENTO',ox,gy-7*s)
  } else {
    const pc=['#92400e','#78350f','#a16207']
    for(let i=0;i<3;i++){
      ctx.fillStyle=pc[i]; ctx.beginPath(); ctx.roundRect(ox-(22-i*2)*s,gy-(6+i*6)*s,(44-i*4)*s,5.5*s,1*s); ctx.fill()
      ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=0.7*s
      for(let j=-18+i*2;j<18-i*2;j+=8){ctx.beginPath();ctx.moveTo(ox+j*s,gy-(6+i*6)*s);ctx.lineTo(ox+j*s,gy-(0.5+i*6)*s);ctx.stroke()}
    }
    ctx.fillStyle='#9ca3af'
    for(let n=0;n<3;n++){ctx.beginPath();ctx.arc(ox+(-10+n*10)*s,gy-9*s,1.5*s,0,Math.PI*2);ctx.fill()}
  }
}

function drawBuilding(ctx, bx, gy, bh, bw, type, sc, hue) {
  const top = gy - bh
  ctx.save()
  if (type === 0) {
    ctx.fillStyle=`hsl(${hue},8%,${40+sc*15}%)`
    ctx.fillRect(bx,top,9*sc,bh); ctx.fillRect(bx+bw-9*sc,top,9*sc,bh)
    const fl=Math.max(2,Math.floor(bh/(20*sc)))
    for(let f=0;f<=fl;f++) ctx.fillRect(bx,top+f*(bh/fl),bw,5*sc)
    ctx.fillStyle=`rgba(10,15,30,${0.55+sc*0.25})`
    for(let f=0;f<fl;f++){const wh=bh/fl-14*sc;if(wh>4*sc)ctx.fillRect(bx+12*sc,top+f*(bh/fl)+7*sc,bw-24*sc,wh)}
    ctx.strokeStyle='rgba(156,163,175,0.7)'; ctx.lineWidth=1.5*sc
    for(let r=0;r<4;r++){ctx.beginPath();ctx.moveTo(bx+(10+r*6)*sc,top);ctx.lineTo(bx+(10+r*6)*sc,top-9*sc);ctx.stroke()}
  } else if (type === 1) {
    ctx.fillStyle=`hsl(${hue},10%,${33+sc*12}%)`; ctx.globalAlpha=0.75
    ctx.fillRect(bx+8*sc,top+8*sc,bw-16*sc,bh-8*sc); ctx.globalAlpha=1
    ctx.fillStyle='rgba(249,115,22,0.09)'; ctx.fillRect(bx,top,bw,bh)
    ctx.strokeStyle=`rgba(249,115,22,${0.55+sc*0.35})`; ctx.lineWidth=Math.max(1,2*sc)
    const vc=Math.max(2,Math.floor(bw/(12*sc))),hr=Math.max(2,Math.floor(bh/(14*sc)))
    for(let i=0;i<=vc;i++){const px=bx+i*(bw/vc);ctx.beginPath();ctx.moveTo(px,top-4*sc);ctx.lineTo(px,gy);ctx.stroke()}
    for(let j=0;j<=hr;j++){const py=top+j*(bh/hr);ctx.beginPath();ctx.moveTo(bx,py);ctx.lineTo(bx+bw,py);ctx.stroke()}
    ctx.fillStyle=`rgba(251,146,60,${0.75+sc*0.2})`
    for(let i=0;i<=vc;i++)for(let j=0;j<=hr;j++){ctx.beginPath();ctx.arc(bx+i*(bw/vc),top+j*(bh/hr),2.5*sc,0,Math.PI*2);ctx.fill()}
    if(sc>0.35){
      ctx.fillStyle='#fbbf24'; ctx.beginPath(); ctx.roundRect(bx+bw/2-18*sc,top-14*sc,36*sc,11*sc,2*sc); ctx.fill()
      ctx.fillStyle='#1c1917'; ctx.font=`bold ${6*sc}px monospace`; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText('EN OBRA',bx+bw/2,top-8.5*sc)
    }
  } else {
    ctx.fillStyle=`hsl(${hue},22%,${42+sc*14}%)`; ctx.fillRect(bx,top,bw,bh)
    ctx.strokeStyle=`rgba(0,0,0,${0.1*sc})`; ctx.lineWidth=0.8*sc
    const bkH=5*sc,bkW=12*sc
    for(let row=0;row*bkH<bh;row++){
      const off=(row%2)*(bkW/2),ry=top+row*bkH
      ctx.beginPath();ctx.moveTo(bx,ry);ctx.lineTo(bx+bw,ry);ctx.stroke()
      for(let col=-1;col*bkW<bw+bkW;col++){ctx.beginPath();ctx.moveTo(bx+col*bkW+off,ry);ctx.lineTo(bx+col*bkW+off,ry+bkH);ctx.stroke()}
    }
    const wc=Math.max(1,Math.floor((bw-8*sc)/(15*sc))),wr=Math.max(1,Math.floor((bh-8*sc)/(20*sc)))
    for(let r=0;r<wr;r++)for(let c=0;c<wc;c++){
      const wx=bx+5*sc+c*(bw-8*sc)/wc,wy=top+6*sc+r*(bh-8*sc)/wr
      ctx.fillStyle=`rgba(186,230,253,${0.5+sc*0.28})`; ctx.fillRect(wx,wy,9*sc,13*sc)
      ctx.fillStyle=`rgba(255,255,255,${0.38*sc})`; ctx.fillRect(wx,wy,3.5*sc,3.5*sc)
      ctx.strokeStyle='rgba(100,116,139,0.35)'; ctx.lineWidth=0.7*sc; ctx.strokeRect(wx,wy,9*sc,13*sc)
    }
    ctx.fillStyle=`hsl(${hue},28%,${50+sc*12}%)`; ctx.fillRect(bx-2*sc,top,bw+4*sc,5*sc)
  }
  ctx.restore()
}

function drawCrane(ctx, z, side) {
  if (z < 0.22 || z > 0.97) return
  const sc = perspScale(z) * 1.5
  const gy = perspY(z)
  const cx = perspX(side === 'left' ? -2.35 : 2.35, z)
  const mH = 130*sc, jL = 90*sc, jS = 28*sc
  const dir = side === 'left' ? 1 : -1
  const al = Math.min(1, 0.5 + sc * 0.5)
  ctx.strokeStyle=`rgba(234,88,12,${al})`; ctx.lineWidth=5*sc
  ctx.beginPath(); ctx.moveTo(cx,gy); ctx.lineTo(cx,gy-mH); ctx.stroke()
  ctx.lineWidth=2*sc
  for(let i=0;i<3;i++){const y0=gy-i*(mH/3),y1=gy-(i+1)*(mH/3);ctx.beginPath();ctx.moveTo(cx-4*sc,y0);ctx.lineTo(cx+4*sc,y1);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+4*sc,y0);ctx.lineTo(cx-4*sc,y1);ctx.stroke()}
  ctx.lineWidth=4*sc; ctx.beginPath(); ctx.moveTo(cx-jS*dir,gy-mH+4*sc); ctx.lineTo(cx+jL*dir,gy-mH+4*sc); ctx.stroke()
  ctx.strokeStyle=`rgba(251,191,36,${al})`; ctx.lineWidth=2.5*sc
  ctx.beginPath(); ctx.moveTo(cx,gy-mH); ctx.lineTo(cx-jS*dir,gy-mH*0.88); ctx.stroke()
  ctx.lineWidth=1.5*sc
  ctx.beginPath(); ctx.moveTo(cx,gy-mH+2*sc); ctx.lineTo(cx+jL*dir,gy-mH+4*sc); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx,gy-mH+2*sc); ctx.lineTo(cx+jL*0.55*dir,gy-mH+4*sc); ctx.stroke()
  const hkX=cx+jL*0.65*dir
  ctx.strokeStyle=`rgba(234,88,12,${al})`; ctx.lineWidth=1.5*sc
  ctx.beginPath(); ctx.moveTo(hkX,gy-mH+4*sc); ctx.lineTo(hkX,gy-mH*0.42); ctx.stroke()
  ctx.beginPath(); ctx.arc(hkX,gy-mH*0.40,4*sc,0,Math.PI); ctx.stroke()
  ctx.fillStyle=`rgba(100,116,139,${al})`; ctx.fillRect(cx-jS*dir-8*sc,gy-mH*0.93,16*sc,10*sc)
}

export default function Juego() {
  const canvasRef  = useRef(null)
  const runningRef = useRef(false)
  const gameRef    = useRef(null)
  const rafRef     = useRef(null)
  const frameRef   = useRef(0)
  const [screen, setScreen]         = useState('idle')
  const [finalScore, setFinalScore] = useState(0)

  const initGame = () => ({
    lane:1, laneX:perspX(0,1), jumpY:0, jumpVY:0, isJumping:false,
    score:0, lives:3, level:1, distance:0,
    items:[], obstacles:[],
    stripes:Array.from({length:NUM_STRIPES},(_,i)=>i/NUM_STRIPES),
    lastSpawn:0, lastObstacle:0, particles:[], tilt:0, flashGreen:0, flashRed:0,
    buildings:[
      {side:'left', z:0.08,type:1,h:0.42,w:60,hue:220},
      {side:'right',z:0.20,type:0,h:0.55,w:70,hue:215},
      {side:'left', z:0.35,type:2,h:0.38,w:55,hue:25},
      {side:'right',z:0.48,type:1,h:0.50,w:65,hue:210},
      {side:'left', z:0.62,type:0,h:0.48,w:60,hue:220},
      {side:'right',z:0.74,type:2,h:0.44,w:58,hue:30},
      {side:'left', z:0.86,type:1,h:0.36,w:55,hue:215},
      {side:'right',z:0.95,type:0,h:0.42,w:65,hue:210},
    ],
    craneL:0.42, craneR:0.78,
    clouds:Array.from({length:4},(_,i)=>({x:40+(i*88%(CW-80)),y:CH*0.03+(i*18%(CH*0.16)),sc:0.5+(i*0.18%0.7),spd:0.10+(i*0.07%0.2)})),
    dust:Array.from({length:22},()=>({x:Math.random()*CW,y:CH-35-Math.random()*25,sz:1+Math.random()*2,al:Math.random()*0.25,vx:(Math.random()-0.5)*0.4})),
  })

  const spawnItem = (g) => {
    const lane=Math.floor(Math.random()*3),good=Math.random()<0.55
    g.items.push({lane,depth:0,emoji:(good?GOOD:BAD)[Math.floor(Math.random()*(good?GOOD.length:BAD.length))],good,hit:false})
  }
  const spawnObstacle = (g) => {
    const t=['cone','barrier','bag','plank']
    g.obstacles.push({lane:Math.floor(Math.random()*3),depth:0,type:t[Math.floor(Math.random()*4)],hit:false})
  }

  const loop = useCallback((ts) => {
    if (!runningRef.current) return
    const canvas=canvasRef.current; if(!canvas)return
    const ctx=canvas.getContext('2d'), g=gameRef.current
    frameRef.current++
    const frame=frameRef.current
    const spd=0.010*(1+(g.level-1)*0.08)
    g.distance+=spd; g.level=Math.floor(g.distance/25)+1
    const tx=perspX(LANE_OFFSETS[g.lane],1),dx=tx-g.laneX
    g.laneX+=dx*0.20; g.tilt=dx*0.010
    if(g.isJumping){g.jumpVY+=GRAVITY;g.jumpY+=g.jumpVY;if(g.jumpY>=0){g.jumpY=0;g.jumpVY=0;g.isJumping=false}}
    g.stripes=g.stripes.map(z=>{z+=spd*1.4;return z>=1?z-1:z})
    g.buildings.forEach(b=>{b.z+=spd*0.65;if(b.z>=1)b.z-=1})
    g.craneL=(g.craneL+spd*0.45)%1; g.craneR=(g.craneR+spd*0.45)%1
    g.clouds.forEach(c=>{c.x-=c.spd*0.5;if(c.x<-80)c.x=CW+50})
    g.dust.forEach(d=>{d.x+=d.vx;if(d.x<0)d.x=CW;if(d.x>CW)d.x=0;d.al=0.06+Math.abs(Math.sin(ts*0.0008+d.x*0.04))*0.12})

    if(ts-g.lastSpawn>Math.max(600,1500-(g.level-1)*55)){spawnItem(g);g.lastSpawn=ts}
    if(ts-g.lastObstacle>Math.max(1200,3000-(g.level-1)*90)&&g.level>=2){spawnObstacle(g);g.lastObstacle=ts}

    g.items=g.items.filter(it=>{
      it.depth+=spd*1.05; if(it.depth>=1.05)return false
      if(it.depth>=0.92&&!it.hit&&it.lane===g.lane&&perspY(1)+g.jumpY>perspY(it.depth)-40){
        it.hit=true
        if(it.good){
          g.score+=10; g.flashGreen=8
          const ix=perspX(LANE_OFFSETS[it.lane],it.depth),iy=perspY(it.depth)-30*perspScale(it.depth)
          for(let i=0;i<8;i++)g.particles.push({x:ix,y:iy,vx:(Math.random()-0.5)*5,vy:-2-Math.random()*4,emoji:it.emoji,alpha:1,sc:0.7+Math.random()*0.5})
        }else{g.lives=Math.max(0,g.lives-1);g.flashRed=12}
        return false
      }
      return true
    })
    g.obstacles=g.obstacles.filter(ob=>{
      ob.depth+=spd*1.05; if(ob.depth>=1.05)return false
      if(ob.depth>=0.87&&!ob.hit&&ob.lane===g.lane&&g.jumpY>-22){ob.hit=true;g.lives=Math.max(0,g.lives-1);g.flashRed=14}
      return true
    })
    g.particles=g.particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.alpha-=0.032;return p.alpha>0})
    if(g.flashGreen>0)g.flashGreen--; if(g.flashRed>0)g.flashRed--

    // ═══════ DRAW ═══════
    // Sky (construction morning: dark blue → royal blue → orange → gold)
    const sky=ctx.createLinearGradient(0,0,0,HORIZON_Y+15)
    sky.addColorStop(0,'#0f172a'); sky.addColorStop(0.42,'#1e40af')
    sky.addColorStop(0.82,'#ea580c'); sky.addColorStop(1,'#fbbf24')
    ctx.fillStyle=sky; ctx.fillRect(0,0,CW,HORIZON_Y+15)

    // Sun glow
    const sX=CW*0.70,sY=HORIZON_Y*0.58
    const sg=ctx.createRadialGradient(sX,sY,0,sX,sY,80)
    sg.addColorStop(0,'rgba(255,235,80,0.92)'); sg.addColorStop(0.28,'rgba(251,146,60,0.58)'); sg.addColorStop(1,'rgba(251,146,60,0)')
    ctx.fillStyle=sg; ctx.fillRect(0,0,CW,HORIZON_Y+15)
    ctx.fillStyle='#fef08a'; ctx.beginPath(); ctx.arc(sX,sY,16,0,Math.PI*2); ctx.fill()
    ctx.fillStyle='#fffde7'; ctx.beginPath(); ctx.arc(sX,sY,8,0,Math.PI*2); ctx.fill()

    // City silhouette
    const silH=[0.45,0.55,0.40,0.65,0.30,0.55,0.28,0.62,0.45,0.50,0.38,0.60,0.52,0.35,0.58,0.42,0.55,0.30,0.48,0.58]
    const segW=CW/silH.length
    ctx.fillStyle='rgba(8,12,28,0.62)'
    ctx.beginPath(); ctx.moveTo(0,HORIZON_Y)
    silH.forEach((h,i)=>{ctx.lineTo(i*segW,HORIZON_Y-h*HORIZON_Y);ctx.lineTo((i+1)*segW,HORIZON_Y-h*HORIZON_Y)})
    ctx.lineTo(CW,HORIZON_Y); ctx.closePath(); ctx.fill()

    // Clouds
    g.clouds.forEach(c=>{
      ctx.save(); ctx.globalAlpha=0.48*c.sc
      ctx.fillStyle='rgba(255,255,255,0.72)'
      ctx.beginPath()
      ctx.arc(c.x,c.y+9*c.sc,9*c.sc,0,Math.PI*2); ctx.arc(c.x+40*c.sc*0.3,c.y,13*c.sc,0,Math.PI*2)
      ctx.arc(c.x+40*c.sc*0.65,c.y+6*c.sc,10*c.sc,0,Math.PI*2); ctx.arc(c.x+40*c.sc,c.y+11*c.sc,7*c.sc,0,Math.PI*2)
      ctx.fill(); ctx.restore()
    })

    // Road geometry
    const nL=ROAD_L-ROAD_W_NEAR/2,nR=ROAD_L+ROAD_W_NEAR/2
    const fL=ROAD_L-ROAD_W_FAR/2,fR=ROAD_L+ROAD_W_FAR/2
    const nY=CH,fY=HORIZON_Y

    // Ground (dirt / construction site)
    ctx.fillStyle='#7c6534'
    ctx.beginPath();ctx.moveTo(0,nY);ctx.lineTo(nL,nY);ctx.lineTo(fL,fY);ctx.lineTo(0,fY);ctx.closePath();ctx.fill()
    ctx.beginPath();ctx.moveTo(nR,nY);ctx.lineTo(CW,nY);ctx.lineTo(CW,fY);ctx.lineTo(fR,fY);ctx.closePath();ctx.fill()
    ctx.fillStyle='rgba(0,0,0,0.10)'
    for(let i=0;i<30;i++){const tx=(i*43%CW),ty=HORIZON_Y+(i*57%(CH-HORIZON_Y));if(tx<nL-5||tx>nR+5){ctx.beginPath();ctx.arc(tx,ty,1+(i%3)*0.8,0,Math.PI*2);ctx.fill()}}

    // Sidewalks
    const sw=20; ctx.fillStyle='#d6cfc6'
    ctx.beginPath();ctx.moveTo(nL-sw,nY);ctx.lineTo(nL,nY);ctx.lineTo(fL,fY);ctx.lineTo(fL-sw*0.12,fY);ctx.closePath();ctx.fill()
    ctx.beginPath();ctx.moveTo(nR,nY);ctx.lineTo(nR+sw,nY);ctx.lineTo(fR+sw*0.12,fY);ctx.lineTo(fR,fY);ctx.closePath();ctx.fill()

    // Road surface
    const rdG=ctx.createLinearGradient(0,fY,0,nY)
    rdG.addColorStop(0,'#242424'); rdG.addColorStop(0.4,'#2c2c2c'); rdG.addColorStop(1,'#191919')
    ctx.fillStyle=rdG
    ctx.beginPath();ctx.moveTo(fL,fY);ctx.lineTo(fR,fY);ctx.lineTo(nR,nY);ctx.lineTo(nL,nY);ctx.closePath();ctx.fill()

    // Road edge lines (yellow)
    ctx.strokeStyle='#ca8a04'; ctx.lineWidth=2
    ctx.beginPath();ctx.moveTo(fL,fY);ctx.lineTo(nL,nY);ctx.stroke()
    ctx.beginPath();ctx.moveTo(fR,fY);ctx.lineTo(nR,nY);ctx.stroke()

    // Lane dashes (animated)
    g.stripes.forEach(z=>{
      if(z<0.06||z>0.97)return
      const s2=perspScale(z),d2=Math.min(z+0.022,1)
      ctx.strokeStyle=`rgba(250,250,250,${0.48+s2*0.35})`; ctx.lineWidth=Math.max(1,2.5*s2)
      ctx.beginPath();ctx.moveTo(perspX(-1,z),perspY(z));ctx.lineTo(perspX(-1,d2),perspY(d2));ctx.stroke()
      ctx.beginPath();ctx.moveTo(perspX(0,z),perspY(z));ctx.lineTo(perspX(0,d2),perspY(d2));ctx.stroke()
      ctx.beginPath();ctx.moveTo(perspX(1,z),perspY(z));ctx.lineTo(perspX(1,d2),perspY(d2));ctx.stroke()
    })

    // Road-edge safety cones
    for(let z=0.07;z<1;z+=0.10){
      const s2=perspScale(z); if(s2<0.08)continue
      const lx=perspX(-1,z),rx=perspX(1,z),cy=perspY(z),ch2=8*s2
      ctx.fillStyle=`rgba(249,115,22,${0.6+s2*0.35})`
      ctx.beginPath();ctx.moveTo(lx-1.5*s2,cy);ctx.lineTo(lx+1.5*s2,cy);ctx.lineTo(lx,cy-ch2);ctx.closePath();ctx.fill()
      ctx.beginPath();ctx.moveTo(rx-1.5*s2,cy);ctx.lineTo(rx+1.5*s2,cy);ctx.lineTo(rx,cy-ch2);ctx.closePath();ctx.fill()
    }

    // Buildings (back to front)
    const sortedB=[...g.buildings].sort((a,b)=>((b.z%1+1)%1)-((a.z%1+1)%1))
    sortedB.forEach(b=>{
      const z=((b.z%1)+1)%1; if(z<0.04||z>0.98)return
      const s2=perspScale(z),gy2=perspY(z),bh=b.h*CH*s2,bw=b.w*s2
      const ex=b.side==='left'?perspX(-1.72,z):perspX(1.72,z)
      const bx=b.side==='left'?ex-bw*0.65:ex-bw*0.35
      drawBuilding(ctx,bx,gy2,bh,bw,b.type,s2,b.hue)
    })

    // Cranes
    drawCrane(ctx,((g.craneL%1)+1)%1,'left')
    drawCrane(ctx,((g.craneR%1)+1)%1,'right')

    // Objects sorted back-to-front
    const allObj=[...g.items.map(it=>({...it,_t:'item'})),...g.obstacles.map(ob=>({...ob,_t:'obs'}))].sort((a,b)=>a.depth-b.depth)
    allObj.forEach(obj=>{
      if(obj.depth<0.05)return
      const s2=perspScale(obj.depth),ox=perspX(LANE_OFFSETS[obj.lane],obj.depth),oy2=perspY(obj.depth)
      if(obj._t==='obs'){
        drawObstacle(ctx,obj.type,ox,oy2,s2)
        if(obj.depth>0.62&&obj.lane===g.lane){
          ctx.save(); ctx.globalAlpha=0.5+0.5*Math.sin(ts*0.009)
          ctx.font=`bold ${11*s2}px Inter,sans-serif`; ctx.fillStyle='#fef08a'; ctx.strokeStyle='#000'; ctx.lineWidth=2
          ctx.textAlign='center'; ctx.textBaseline='bottom'
          ctx.strokeText('¡SALTA!',ox,oy2-40*s2); ctx.fillText('¡SALTA!',ox,oy2-40*s2); ctx.restore()
        }
      } else {
        const bob=Math.sin(obj.depth*22+ts*0.004)*5*s2,sz=36*s2,iy=oy2-30*s2+bob
        ctx.globalAlpha=0.82
        const glowR=ctx.createRadialGradient(ox,iy-sz*0.3,0,ox,iy-sz*0.3,sz*1.1)
        glowR.addColorStop(0,obj.good?'rgba(52,211,153,0.5)':'rgba(239,68,68,0.5)')
        glowR.addColorStop(1,obj.good?'rgba(52,211,153,0)':'rgba(239,68,68,0)')
        ctx.fillStyle=glowR; ctx.fillRect(ox-sz,iy-sz*1.2,sz*2,sz*2); ctx.globalAlpha=1
        ctx.strokeStyle=obj.good?'#34d399':'#ef4444'; ctx.lineWidth=1.5*s2
        ctx.setLineDash([3*s2,2*s2]); ctx.beginPath(); ctx.arc(ox,iy-sz*0.35,sz*0.6,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([])
        ctx.font=`${sz}px serif`; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(obj.emoji,ox,iy)
      }
    })

    // Player shadow
    const gYp=perspY(1),pYp=gYp+g.jumpY,pSp=perspScale(1)
    const shrk=g.isJumping?Math.max(0.3,1-(-g.jumpY/110)):1
    ctx.globalAlpha=0.35*shrk; ctx.fillStyle='#000'
    ctx.beginPath(); ctx.ellipse(g.laneX,gYp,24*pSp*shrk,7*pSp*shrk,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1

    // Screen flash
    if(g.flashGreen>0){ctx.fillStyle=`rgba(52,211,153,${0.20*g.flashGreen/8})`;ctx.fillRect(0,0,CW,CH)}
    if(g.flashRed>0){ctx.fillStyle=`rgba(239,68,68,${0.22*g.flashRed/12})`;ctx.fillRect(0,0,CW,CH)}

    // Animated worker
    drawWorker(ctx,g.laneX,pYp,pSp,frame,g.tilt,g.isJumping)

    // Particles
    g.particles.forEach(p=>{ctx.globalAlpha=p.alpha;ctx.font=`${22*p.sc}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.emoji,p.x,p.y)}); ctx.globalAlpha=1

    // Ground dust
    g.dust.forEach(d=>{if(d.x>nL+20&&d.x<nR-20){ctx.globalAlpha=d.al;ctx.fillStyle='#c4a363';ctx.beginPath();ctx.arc(d.x,d.y,d.sz,0,Math.PI*2);ctx.fill()}}); ctx.globalAlpha=1

    // HUD
    const hud=(x,y,w,h,r=12)=>{
      ctx.beginPath(); ctx.roundRect(x,y,w,h,r)
      const hg=ctx.createLinearGradient(x,y,x,y+h)
      hg.addColorStop(0,'rgba(10,15,30,0.90)'); hg.addColorStop(1,'rgba(10,15,30,0.72)')
      ctx.fillStyle=hg; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.10)'; ctx.lineWidth=1; ctx.stroke()
    }
    ctx.font='bold 13px Inter,system-ui,sans-serif'; ctx.textBaseline='middle'
    hud(8,8,122,30); ctx.fillStyle='#fde68a'; ctx.textAlign='left'; ctx.fillText(`⭐ ${g.score} pts`,16,24)
    hud(CW/2-48,8,96,30); ctx.fillStyle='#7dd3fc'; ctx.textAlign='center'; ctx.fillText(`🏗️ Nivel ${g.level}`,CW/2,24)
    const lStr='❤️'.repeat(g.lives)+'🖤'.repeat(3-g.lives)
    hud(CW-120,8,112,30); ctx.fillStyle='#fff'; ctx.textAlign='right'; ctx.fillText(lStr,CW-10,24)

    if(g.lives<=0){runningRef.current=false;setFinalScore(g.score);setScreen('gameover');return}
    rafRef.current=requestAnimationFrame(loop)
  }, []) // eslint-disable-line

  const startGame = useCallback(()=>{
    gameRef.current=initGame(); frameRef.current=0; runningRef.current=true; setScreen('playing')
    if(rafRef.current)cancelAnimationFrame(rafRef.current)
    rafRef.current=requestAnimationFrame(loop)
  },[loop]) // eslint-disable-line

  useEffect(()=>{
    const onKey=(e)=>{
      if(e.type!=='keydown')return
      const g=gameRef.current; if(!g||!runningRef.current)return
      if((e.key==='ArrowLeft'||e.key==='a'||e.key==='A')&&g.lane>0)g.lane--
      if((e.key==='ArrowRight'||e.key==='d'||e.key==='D')&&g.lane<2)g.lane++
      if((e.key==='ArrowUp'||e.key==='w'||e.key==='W'||e.key===' ')&&!g.isJumping){g.isJumping=true;g.jumpVY=JUMP_VY;e.preventDefault()}
    }
    window.addEventListener('keydown',onKey); window.addEventListener('keyup',onKey)
    const canvas=canvasRef.current
    if(canvas){
      const ctx=canvas.getContext('2d')
      const sky=ctx.createLinearGradient(0,0,0,CH)
      sky.addColorStop(0,'#0f172a'); sky.addColorStop(0.6,'#1e40af'); sky.addColorStop(1,'#f97316')
      ctx.fillStyle=sky; ctx.fillRect(0,0,CW,CH)
      ctx.fillStyle='#1a1a1a'
      ctx.beginPath();ctx.moveTo(ROAD_L-ROAD_W_FAR/2,HORIZON_Y);ctx.lineTo(ROAD_L+ROAD_W_FAR/2,HORIZON_Y)
      ctx.lineTo(ROAD_L+ROAD_W_NEAR/2,CH);ctx.lineTo(ROAD_L-ROAD_W_NEAR/2,CH);ctx.closePath();ctx.fill()
      drawWorker(ctx,ROAD_L,CH-30,perspScale(1),0,0,false)
    }
    return()=>{window.removeEventListener('keydown',onKey);window.removeEventListener('keyup',onKey);if(rafRef.current)cancelAnimationFrame(rafRef.current)}
  },[])

  const handleLeft =()=>{const g=gameRef.current;if(g&&runningRef.current&&g.lane>0)g.lane--}
  const handleRight=()=>{const g=gameRef.current;if(g&&runningRef.current&&g.lane<2)g.lane++}
  const handleJump =()=>{const g=gameRef.current;if(g&&runningRef.current&&!g.isJumping){g.isJumping=true;g.jumpVY=JUMP_VY}}

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-10">
      <div className="max-w-lg mx-auto px-3 pt-5 pb-4">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider border border-orange-500/30">
            🎮 Minijuego · ObraFit Rush
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">Construcción al Límite</h1>
          <p className="text-slate-400 mt-1 text-sm">Corre, salta y come sano en la obra</p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-orange-500/40">
          <canvas ref={canvasRef} width={CW} height={CH} className="w-full block" />

          {screen==='idle'&&(
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6"
              style={{background:'linear-gradient(180deg,rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.80) 100%)'}}>
              <div className="text-7xl mb-3 drop-shadow-xl animate-bounce">👷</div>
              <h2 className="text-2xl font-extrabold mb-2 drop-shadow">¡A correr en la obra!</h2>
              <p className="text-sm text-white/80 mb-1">← → cambiar carril &nbsp;|&nbsp; ↑ / Espacio para saltar</p>
              <p className="text-sm text-white/70 mb-5">Recoge comida sana · esquiva chatarra · salta obstáculos</p>
              <button onClick={startGame}
                className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-extrabold px-10 py-3 rounded-2xl text-lg shadow-xl transition-all duration-150 border border-orange-400">
                ¡Jugar! 🚧
              </button>
            </div>
          )}

          {screen==='gameover'&&(
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6"
              style={{background:'linear-gradient(180deg,rgba(0,0,0,0.22) 0%,rgba(0,0,0,0.88) 100%)'}}>
              <div className="text-6xl mb-3">😵</div>
              <h2 className="text-2xl font-extrabold mb-1">¡Game Over!</h2>
              <p className="text-6xl font-extrabold text-yellow-300 my-2 drop-shadow">{finalScore}</p>
              <p className="text-sm text-white/60 mb-1">puntos</p>
              <p className="text-base font-semibold text-white/90 mb-6">
                {finalScore>=500?'🏆 ¡Leyenda de la obra!':finalScore>=250?'💪 ¡Muy buen corredor!':finalScore>=100?'👍 ¡Buen intento!':'📖 Sigue practicando'}
              </p>
              <button onClick={startGame}
                className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-extrabold px-10 py-3 rounded-2xl text-lg shadow-xl transition-all duration-150">
                Intentar de nuevo 🔄
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <button onPointerDown={handleLeft}
            className="flex-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-slate-200 text-3xl font-bold rounded-2xl py-4 select-none transition-colors">←</button>
          <button onPointerDown={handleJump}
            className="flex-[1.4] bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white text-xl font-extrabold rounded-2xl py-4 select-none shadow-lg transition-colors border border-orange-400">⬆ SALTAR</button>
          <button onPointerDown={handleRight}
            className="flex-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-slate-200 text-3xl font-bold rounded-2xl py-4 select-none transition-colors">→</button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-2xl p-3 text-center">
            <p className="text-xs text-emerald-400 font-bold mb-1 uppercase tracking-wide">✅ Recoge (+10)</p>
            <p className="text-xl leading-relaxed">🥦 🍎 🥕 🍌 💧 🥗</p>
          </div>
          <div className="bg-red-900/40 border border-red-700/40 rounded-2xl p-3 text-center">
            <p className="text-xs text-red-400 font-bold mb-1 uppercase tracking-wide">❌ Esquiva (−❤️)</p>
            <p className="text-xl leading-relaxed">🍔 🍟 🥤 🍕 🍩 🍺</p>
          </div>
        </div>
        <div className="mt-3 bg-amber-900/40 border border-amber-700/40 rounded-2xl p-3 text-center">
          <p className="text-xs text-amber-400 font-bold mb-1 uppercase tracking-wide">🧱 Obstáculos — ¡Sáltalos! (desde nivel 2)</p>
          <p className="text-sm text-slate-300">Conos · Barreras rojas · Cemento · Tablas</p>
        </div>
        <div className="mt-3 bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">¿Cómo jugar?</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
            <div className="bg-slate-700/50 rounded-xl p-2"><div className="text-xl mb-1">⌨️</div><p>← → carril</p></div>
            <div className="bg-slate-700/50 rounded-xl p-2"><div className="text-xl mb-1">⬆️</div><p>Saltar obstáculos</p></div>
            <div className="bg-slate-700/50 rounded-xl p-2"><div className="text-xl mb-1">🔼</div><p>Nivel = más rápido</p></div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-slate-400 hover:text-orange-400 hover:underline transition-colors">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}

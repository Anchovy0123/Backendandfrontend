'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

export default function EndfieldProfileCard() {
  const [sel, setSel] = useState(0);
  const [mx, setMx] = useState(0.5);
  const [my, setMy] = useState(0.5);
  const [dir, setDir] = useState(1);     // 1=ไปขวา (next), -1=ไปซ้าย (prev)
  const [bump, setBump] = useState(0);   // รีสตาร์ท animation ของกรอบภาพทุกครั้งที่เปลี่ยน
  const op = OPS[sel];

  // ----- Parallax / pointer move -----
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setMx(Number(x.toFixed(3)));
    setMy(Number(y.toFixed(3)));
  };
  const resetMove = () => { setMx(0.5); setMy(0.5); };

  // ----- เปลี่ยนตัวละคร + เด้งกรอบภาพ -----
  const selectIndex = (i) => {
    if (i === sel) { setBump((n) => n + 1); return; }
    setDir(i > sel ? 1 : -1);
    setSel(i);
    setBump((n) => n + 1);  // ทำให้กรอบภาพเกิด pulse/tilt ทุกครั้งที่เปลี่ยน
  };
  const goNext = () => selectIndex((sel + 1) % OPS.length);
  const goPrev = () => selectIndex((sel - 1 + OPS.length) % OPS.length);

  // ----- ลากนิ้ว/เมาส์เพื่อเลื่อนตัวละคร -----
  const dragStartX = useRef(null);
  const onPointerDown = (e) => { dragStartX.current = e.clientX; };
  const onPointerUp   = (e) => {
    if (dragStartX.current == null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) > 48) { dx < 0 ? goNext() : goPrev(); }
  };
  const onPointerCancel = () => { dragStartX.current = null; };

  // ----- คีย์บอร์ด (ซ้าย/ขวา) -----
  const wrapRef = useRef(null);
  useEffect(() => { wrapRef.current?.focus(); }, []);
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
  };

  return (
    <div className="ef-profile" aria-live="polite">
      {/* ซ้าย */}
      <div className="left">
        <div className="eyebrow">/// ARKNIGHTS : ENDFIELD</div>

        <div className="title-row">
          <h2 className="title">[ {op.name} ]</h2>
          <button className="btn-zoom" aria-label="Expand artwork">
            <i className="bi bi-arrows-fullscreen" />
          </button>
        </div>

        <div className="title-accent"><span className="yglow" /></div>

        <div className="meta">
          <div className="group"><span className="label">FACTION</span><span className="pill">{op.faction}</span></div>
          <div className="group"><span className="label">RACE</span><span className="pill">{op.race}</span></div>
        </div>

        <div className="copy">{op.desc.map((p, i) => <p key={i}>{p}</p>)}</div>

        {/* แถบตัวเลือก */}
        <div className="mini" role="listbox" aria-label="เลือกตัวละคร">
          {OPS.map((m, i) => {
            const active = i === sel;
            return (
              <button
                key={m.id}
                className={`mini-item ${active ? 'active' : ''}`}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => selectIndex(i)}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <Image src={m.thumb} alt={m.name} fill sizes="220px" className="mini-img" />
                <div className="mini-cap">
                  <div className="mini-no">{String(i + 1).padStart(2, '0')}</div>
                  <div className="mini-text">
                    <div className="mini-sub">/ {m.code}</div>
                    <div className="mini-name">{m.name}</div>
                  </div>
                </div>
              </button>
            );
          })}
          <button type="button" className="mini-next" aria-label="Next" onClick={goNext}>
            <span className="chev" />
          </button>
        </div>
      </div>

      {/* ขวา */}
      <div className="right">
        <div
          ref={wrapRef}
          className="hero"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerCancel}
          onPointerMove={handleMove}
          onMouseLeave={resetMove}
          // ใช้ CSS variables เพื่อบอกทิศ/ตำแหน่งเมาส์ให้แอนิเมชันรู้
          style={{ '--mx': mx, '--my': my, '--dir': dir }}
        >
          <span className="wedge" aria-hidden />
          <div
            key={`${sel}-${bump}`}               // ทำให้ pulse/tilt rerun ทุกครั้งที่เปลี่ยน
            className="artwrap"
            style={{ '--hero': `url(${op.hero})` }}
          >
            <Image
              key={op.hero}
              src={op.hero}
              alt={op.name}
              fill
              priority
              sizes="(max-width: 1100px) 62vw, 460px"
              className="hero-img"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===== Card ===== */
        .ef-profile{
          --g:#e3e6ea; --yl:#ffe500; --yl2:#ffd100;
          position:relative;
          display:grid; grid-template-columns: 1.1fr .9fr; gap: 24px;
          border:1px solid var(--g); border-radius:16px; background:#fff;
          padding: 22px; overflow:hidden;
          box-shadow: 0 12px 24px rgba(0,0,0,.08);
          animation: cardIn .45s ease both;
        }
        @keyframes cardIn{ from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:none} }
        .ef-profile::before{
          content:""; position:absolute; inset:0; pointer-events:none; opacity:.35;
          background:
            repeating-linear-gradient(0deg, rgba(0,0,0,.04) 0 1px, transparent 1px 32px),
            repeating-linear-gradient(90deg, rgba(0,0,0,.04) 0 1px, transparent 1px 32px);
        }

        /* ===== Left ===== */
        .left{ position:relative; z-index:2; }
        .eyebrow{ font-size:12px; letter-spacing:.24em; color:#444; opacity:0; margin-bottom:6px;
          animation: slideIn .5s cubic-bezier(.2,.8,.2,1) .05s both; }
        .title-row{ display:flex; align-items:center; gap:10px; opacity:0; animation: fadeUp .45s ease .10s both; }
        .title{ font-weight:900; font-size: clamp(22px, 3.3vw, 38px); margin:0; line-height:1.15; }
        .btn-zoom{ border:1px solid var(--g); background:#fff; border-radius:8px; padding:6px 8px; line-height:1;
          transition: transform .18s ease, box-shadow .18s ease; }
        .btn-zoom:hover{ transform: translateY(-1px) scale(1.03); box-shadow:0 6px 14px rgba(0,0,0,.08); }

        .title-accent{ position:relative; height:10px; margin:8px 0 4px; background:linear-gradient(90deg, #222 0 110px, transparent 110px); mask: linear-gradient(#000 0 55%, transparent 55% 100%); }
        .title-accent .yglow{ position:absolute; left:110px; top:6px; width:120px; height:4px; border-radius:2px; background: linear-gradient(90deg, var(--yl), var(--yl2)); box-shadow:0 0 16px rgba(255,213,0,.35); animation: sweep 3.5s ease-in-out infinite; }
        @keyframes sweep{ 0%{transform:translateX(-40px)} 50%{transform:translateX(180px)} 100%{transform:translateX(-40px)} }

        .meta{ display:flex; gap:18px; flex-wrap:wrap; margin:8px 0 12px; }
        .group{ display:flex; align-items:center; gap:10px; opacity:0; transform:translateY(6px); animation: fadeUp .4s ease both; }
        .group:nth-child(1){ animation-delay:.18s }
        .group:nth-child(2){ animation-delay:.26s }
        .label{ font-size:12px; letter-spacing:.18em; color:#222; background:#fffbe6; border:1px solid #e8d66b; padding:4px 10px; border-radius:999px; font-weight:800; }
        .pill{ border:1px solid var(--g); padding:4px 10px; border-radius:999px; background:#fff; color:#111; font-weight:700; }

        .copy p{ color:#222; line-height:1.7; margin:0 0 10px; opacity:0; transform:translateY(6px); animation: fadeUp .45s ease both; }
        .copy p:nth-child(1){ animation-delay:.34s }
        .copy p:nth-child(2){ animation-delay:.42s }
        @keyframes fadeUp { to { opacity:1; transform:none } }
        @keyframes slideIn { from{opacity:0; transform:translateX(-8px)} to{opacity:1; transform:none} }

        /* ===== Thumbnails ===== */
        .mini{ display:flex; gap:12px; margin-top:14px; flex-wrap:wrap; align-items:stretch; }
        .mini-item{
          position:relative; width: 240px; aspect-ratio: 5 / 4;
          border:1px solid var(--g); border-radius:12px; overflow:hidden; background:#f6f7f9; cursor:pointer;
          transition: transform .16s ease, box-shadow .2s ease, border-color .2s ease;
          isolation:isolate; opacity:0; transform: translateY(6px); padding:6px;
          animation: thumbIn .45s cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes thumbIn { to { opacity:1; transform:none } }
        .mini-item:hover{ transform:translateY(-2px) scale(1.01); box-shadow:0 10px 18px rgba(0,0,0,.12) }
        .mini-item:active{ transform:translateY(0) scale(.99) }
        .mini-item.active{ border-color:#d6c259; }
        .mini-img{
          object-fit: contain; object-position: center bottom;
          z-index:0; filter:contrast(1.02);
          background: radial-gradient(120% 80% at 50% 30%, #fff, #eef1f6);
        }
        .mini-cap{
          position:absolute; inset:auto 6px 6px 6px; display:flex; align-items:center; gap:10px;
          padding:8px 10px; background:rgba(10,12,14,.78); color:#fff; z-index:1; border-radius:10px;
          transform: translateY(0); transition: .2s;
        }
        .mini-item:hover .mini-cap{ transform: translateY(-2px); }

        .mini-next{ width:56px; border:1px solid var(--g); border-radius:12px; background:#fff; position:relative; transition:transform .16s ease; }
        .mini-next:hover{ transform:translateX(2px) }
        .mini-next .chev{ position:absolute; inset:0; margin:auto; width:14px; height:14px; border-right:2px solid #111; border-bottom:2px solid #111; transform:rotate(-45deg) translate(-1px,1px); }

        /* ===== Right / Hero ===== */
        .right{ position:relative; overflow:hidden; z-index:1; }
        .hero{
          position:relative; width:100%;
          min-height: clamp(320px, 48vh, 520px);
          display:flex; align-items:flex-end; justify-content:flex-end;
          padding-right: clamp(6px, 1.2vw, 16px);
          cursor: grab;
          touch-action: pan-y; /* ให้เลื่อนหน้าตามแนวตั้งได้ แต่เราจับ swipe ตามแนวนอน */
        }
        .hero:active{ cursor: grabbing; }

        /* พื้นเหลือง */
        .wedge{
          position:absolute; right:0; top: max(12px, 3%);
          width: clamp(300px, 32vw, 460px);
          height: calc(100% - max(28px, 8%));
          background:linear-gradient(180deg,var(--yl),var(--yl2));
          clip-path: polygon(10% 0, 100% 0, 70% 100%, 0 100%);
          filter: drop-shadow(0 10px 18px rgba(255,213,0,.25));
          opacity:.85; z-index:0;
          animation: wedgeDrift 6s ease-in-out infinite alternate;
          transform: translate3d(calc((.5 - var(--mx, .5)) * 10px), calc((.5 - var(--my, .5)) * 4px), 0);
          transition: transform .25s cubic-bezier(.2,.8,.2,1);
        }
        @keyframes wedgeDrift{ from{ transform:translate3d(0,0,0) } to{ transform:translate3d(0,4px,0) } }

        /* กรอบภาพ: letterbox + blur bg + pulse/tilt เมื่อเปลี่ยน */
        .artwrap{
          position:relative; width: clamp(260px, 28vw, 440px); aspect-ratio: 4 / 5;
          margin-left:auto; pointer-events:none; overflow:hidden; border-radius:14px;
          filter: drop-shadow(0 12px 24px rgba(0,0,0,.20));
          transform: translate3d(calc((var(--mx, .5) - .5) * 16px), calc((var(--my, .5) - .5) * -6px), 0);
          transition: transform .25s cubic-bezier(.2,.8,.2,1);
          background: radial-gradient(120% 100% at 50% 30%, #fff, #eef1f6);
          animation: tap .34s cubic-bezier(.2,.8,.2,1); /* เด้งทุกครั้งที่ key เปลี่ยน */
        }
        @keyframes tap{
          0%   { transform: scale(1) rotate(0deg); }
          35%  { transform: scale(1.03) rotate(calc(.35deg * var(--dir, 1))); }
          100% { transform: scale(1) rotate(0deg); }
        }
        /* พื้นหลังเบลอจากรูปเดียวกัน */
        .artwrap::before{
          content:""; position:absolute; inset:-12%; background: center / cover no-repeat var(--hero);
          filter: blur(18px) saturate(1.1); transform: scale(1.08); opacity:.38; z-index:0;
        }

        /* รูปตัวละคร: สไลด์เข้าตามทิศทาง + ลอยช้า */
        .hero-img{
          object-fit: contain; object-position: center bottom; z-index:1;
          animation:
            heroIn .45s cubic-bezier(.2,.8,.2,1) both,
            slowFloat 8s ease-in-out .5s infinite alternate;
          transform-origin: 50% 80%;
          will-change: transform, opacity;
        }
        @keyframes heroIn{
          from { opacity:0; transform: translateX(calc(24px * var(--dir, 1))) scale(.98) rotate(calc(-.4deg * var(--dir, 1))); }
          to   { opacity:1; transform:none; }
        }
        @keyframes slowFloat{ from{ transform: translateY(0) } to{ transform: translateY(-6px) } }

        /* แสงสวิง */
        .artwrap::after{
          content:""; position:absolute; inset:-6% -6%; pointer-events:none;
          background: radial-gradient(600px 90px at -10% 50%, rgba(255,255,255,.18), rgba(255,255,255,0) 60%);
          transform: translateX(-120%);
          animation: lightSweep 7s ease-in-out 1.1s infinite;
          mix-blend-mode: overlay; opacity:.6;
        }
        @keyframes lightSweep{ 0%,20%{ transform: translateX(-120%) } 55%{ transform: translateX(30%) } 100%{ transform: translateX(120%) } }

        /* ลดแอนิเมชัน */
        @media (prefers-reduced-motion: reduce){
          .ef-profile, .mini-item, .hero-img, .artwrap, .wedge, .eyebrow, .title-row, .group, .copy p { animation: none !important; transition: none !important; }
        }

        /* Responsive */
        @media (max-width: 1100px){
          .ef-profile{ grid-template-columns:1fr; }
          .hero{ min-height: clamp(280px, 52vh, 480px); }
          .artwrap{ width: clamp(240px, 62vw, 420px); aspect-ratio: 4 / 5; margin: 0 auto; }
          .wedge{ width: clamp(260px, 72vw, 440px); left: 0; right: 0; margin-inline:auto; }
        }
      `}</style>
    </div>
  );
}

/* ข้อมูลเดิม */
const OPS = [
  {
    id: 'end-01',
    name: 'Endministrator',
    code: 'ENDMINISTRATOR',
    faction: 'Endfield Industries',
    race: '[data_missing]',
    thumb: '/images/sliders/endministrator-assets-from-the-official-website-female-and-v0-vc8rb3kht0xb1.png',
    hero : '/images/sliders/endministrator-assets-from-the-official-website-female-and-v0-vc8rb3kht0xb1.png',
    desc: [
      `"I'm ready." The Endministrator of Endfield Industries.`,
      'According to the historical records of Talos-II, the Endministrator stands as a key guardian who protected civilization on this planet and saved humanity from multiple catastrophic disasters.',
    ],
  },
  {
    id: 'end-02',
    name: 'Endministrator',
    code: 'ENDMINISTRATOR',
    faction: 'Endfield Industries',
    race: '[data_missing]',
    thumb: '/images/sliders/endministrator-assets-from-the-official-website-female-and-v0-19vbuixjt0xb1.png',
    hero : '/images/sliders/endministrator-assets-from-the-official-website-female-and-v0-19vbuixjt0xb1.png',
    desc: [
      'The Endministrator’s mastery over Originium and the Protocol network is shrouded in mystery.',
      'Periodic long-term hibernation remains one of Endfield’s most closely guarded secrets.',
    ],
  },
  {
    id: 'per-01',
    name: 'Perlica',
    code: 'PERLICA',
    faction: 'Endfield Industries',
    race: '[data_missing]',
    thumb: '/images/sliders/perlica-assets-info-from-website-v0-6omzyh2vfaxb1.webp',
    hero : '/images/sliders/perlica-assets-info-from-website-v0-6omzyh2vfaxb1.webp',
    desc: [
      'Calm and precise, Perlica is a core force on the frontline.',
      'Her battlefield control pairs perfectly with Endfield’s expeditions on Talos-II.',
    ],
  },
];

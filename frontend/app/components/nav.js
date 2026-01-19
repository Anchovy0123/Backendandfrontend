'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // sync auth
  useEffect(() => {
    const sync = () => setAuthed(!!localStorage.getItem('token'));
    sync();
    const onStorage = () => sync();
    const onFocus = () => sync();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // ปิดเมนูเมื่อเปลี่ยนหน้า
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // sticky + shrink + hide/show (anti-jitter)
  useEffect(() => {
    const nav = document.querySelector('.ef-nav');
    if (!nav) return;

    const setNavH = () => {
      const h = nav.offsetHeight || 64;
      document.documentElement.style.setProperty('--navH', `${h}px`);
    };
    setNavH();
    const ro = new ResizeObserver(setNavH);
    ro.observe(nav);
    window.addEventListener('resize', setNavH);
    window.addEventListener('orientationchange', setNavH);

    let lastY = window.scrollY;
    let dir = 0;   // 1 ลง, -1 ขึ้น
    let acc = 0;
    let hidden = false;
    let ticking = false;

    const HIDE_AFTER = 48;
    const SHOW_AFTER = 28;
    const nearBottom = () =>
      (document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)) < 24;

    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const d = y - lastY;
      lastY = y;
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        nav.classList.toggle('ef-shrink', y > 40);

        if (!menuOpen && !nearBottom()) {
          const newDir = d > 0 ? 1 : d < 0 ? -1 : dir;
          if (newDir !== dir) { dir = newDir; acc = 0; }
          const delta = Math.abs(d) < 2 ? 0 : Math.abs(d); // กันสั่น
          acc += delta;

          if (!hidden && dir === 1 && acc > HIDE_AFTER && y > 40) {
            nav.classList.add('ef-hide'); hidden = true; acc = 0;
          } else if (hidden && dir === -1 && acc > SHOW_AFTER) {
            nav.classList.remove('ef-hide'); hidden = false; acc = 0;
          }
          if (y <= 2) { nav.classList.remove('ef-hide'); hidden = false; acc = 0; }
        } else {
          nav.classList.remove('ef-hide'); hidden = false; acc = 0;
        }
        ticking = false;
      });
    };

    nav.classList.add('ef-ready');
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', setNavH);
      window.removeEventListener('orientationchange', setNavH);
      ro.disconnect();
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    const res = await Swal.fire({
      title: 'ออกจากระบบ?',
      text: 'คุณต้องการออกจากระบบหรือไม่',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
    });
    if (!res.isConfirmed) return;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthed(false);
    await Swal.fire({ title: 'ออกจากระบบแล้ว', icon: 'success', timer: 900, showConfirmButton: false });
    router.push(pathname?.startsWith('/admin') ? '/admin/login' : '/login');
  };

  const items = [
    { name: 'Home', href: '/' },
    { name: 'Service', href: '/service' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
    { name: 'เข้าสู่ระบบ', href: '/login' },
  ];

  const isActiveLink = (href) => pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <nav className="navbar navbar-expand-lg ef-nav" role="navigation" aria-label="Main">
      <div className="container ef-inner">
        <Link className="navbar-brand ef-brand" href="/" aria-label="Home">
          RHODES <span>ISLAND</span>
        </Link>

        {/* Hamburger ใช้ React state คุมเอง */}
        <button
          className="navbar-toggler ef-toggler ms-auto"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* เมนู */}
        <div
          id="navbarSupportedContent"
          className={`ef-collapse navbar-collapse ms-lg-auto ${menuOpen ? 'show' : ''}`}
          // ปิดด้วยคีย์ ESC
          onKeyDown={(e) => {
            if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
          }}
        >
          <ul className="navbar-nav ef-menu ms-lg-auto mb-2 mb-lg-0">
            {items.map((item) => {
              const active = isActiveLink(item.href);
              const isLogin = item.href === '/login';
              return (
                <li className="nav-item" key={item.name}>
                  <Link
                    className={`nav-link ef-link ${active ? 'active' : ''}`}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)} // ปิดอัตโนมัติเมื่อกดลิงก์
                  >
                    {isLogin ? (<><i className="bi bi-soundwave me-2" /><span>{item.name}</span></>) : <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {authed && (
            <button type="button" onClick={handleSignOut} className="btn btn-outline-ink ef-signout ms-lg-3">
              <i className="bi bi-box-arrow-right" />
              <span className="ms-2 d-none d-xl-inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* คลิกพื้นหลังเพื่อปิด (มือถือ) */}
      <button
        type="button"
        className={`ef-backdrop ${menuOpen ? 'show' : ''}`}
        aria-hidden={!menuOpen}
        tabIndex={-1}
        onClick={() => setMenuOpen(false)}
      />

      <style jsx>{`
        .ef-nav{
          --h:64px;
          position: sticky; top: 0; z-index: 1030;
          background: rgba(255,255,255,.86);
          backdrop-filter: saturate(180%) blur(10px);
          border-bottom: 1px solid rgba(0,0,0,.06);
          transform: translateZ(0);
          transition: transform .28s ease, box-shadow .2s ease, background-color .2s ease;
          isolation: isolate;
        }
        @supports not (backdrop-filter: blur(1px)){ .ef-nav{ background:#fff; } }
        .ef-inner{ min-height: var(--h); }
        .ef-brand{ font-weight: 900; letter-spacing:.06em; }
        .ef-brand span{ color:#b98100 }

        .ef-toggler{ border-radius: 10px; position: relative; z-index: 1061; }
        .ef-toggler .navbar-toggler-icon{
          background-image: none; width: 1.4rem; height: 1.4rem; position: relative;
        }
        .ef-toggler .navbar-toggler-icon::before,
        .ef-toggler .navbar-toggler-icon::after{
          content:""; position:absolute; left:0; right:0; height:2px; background:#111; border-radius:2px;
        }
        .ef-toggler .navbar-toggler-icon::before{ top: 4px }
        .ef-toggler .navbar-toggler-icon::after{ bottom: 4px }

        .ef-menu .ef-link{ padding: .5rem .9rem; border-radius: 10px; transition: background-color .15s ease }
        .ef-menu .ef-link:hover{ background: rgba(0,0,0,.04) }
        .ef-menu .ef-link.active{ background: rgba(255,193,7,.20) }
        .ef-signout{ border-color:#222; color:#222 }
        .ef-signout:hover{ background:#222; color:#fff }

        /* Shrink & hide */
        .ef-nav.ef-shrink{ --h:56px; box-shadow: 0 6px 14px rgba(0,0,0,.06) }
        .ef-nav.ef-hide{ transform: translateY(calc(-1 * var(--h))); }

        /* ===== Collapse ที่เราคุมเอง ===== */
        @media (max-width: 991.98px){
          .ef-collapse{ display: none; background: rgba(255,255,255,.95); border-radius: 12px; padding: .4rem; margin-top:.5rem; }
          .ef-collapse.show{ display: block; }
          .ef-menu .ef-link{ padding: .7rem .9rem }
          /* backdrop ด้านหลังเมนู */
          .ef-backdrop{
            position: fixed; inset:0; background: rgba(0,0,0,.12);
            opacity: 0; pointer-events: none; z-index: 1059; transition: opacity .18s ease;
          }
          .ef-backdrop.show{ opacity:1; pointer-events: auto; }
        }
        @media (min-width: 992px){
          .ef-collapse{ display: flex !important; }
          .ef-backdrop{ display:none; }
        }

        @media (prefers-reduced-motion: reduce){ .ef-nav{ transition:none } }
      `}</style>
    </nav>
  );
}

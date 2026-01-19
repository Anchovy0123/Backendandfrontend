'use client';
import { useEffect } from 'react';

export default function Footer() {
  useEffect(() => { import('bootstrap/dist/js/bootstrap.bundle.min.js'); }, []);
  const year = new Date().getFullYear();

  return (
    <footer className="ef-footer-dark" role="contentinfo">
      <div className="inner">
        {/* ลิงก์เมนูกลาง + ตัวคั่นแนวตั้ง */}
        <ul className="links">
          <li><a href="/privacy">PRIVACY POLICY</a></li>
          <li><a href="/terms">TERMS OF SERVICE</a></li>
          <li><a href="/contact">CONTACT US</a></li>
        </ul>

        {/* โลโก้/เวิร์ดมาร์กกลาง (ถ้ามีไฟล์โลโก้จริง ให้ใช้ <img> แทน span ได้เลย) */}
        <div className="brand">
          {/* <img src="/images/gryphline.svg" alt="GRYPHLINE" /> */}
          <span className="wordmark">GRYPHLINE</span>
          <span className="tag">GRYPH FRONTIER PTE. LTD.</span>
        </div>

        {/* ลิขสิทธิ์ */}
        <div className="copy">
          Copyright © 2022 - {year} GRYPHLINE. All Rights Reserved.
        </div>
      </div>

      <style jsx>{`
        .ef-footer-dark{
          background:#171717;
          color:#dcdcdc;
          border-top:1px solid #2a2a2a;
        }
        .inner{
          width:min(1200px,92%);
          margin:0 auto;
          padding:22px 0 28px;
          text-align:center;
        }

        .links{
          list-style:none; padding:0; margin:6px 0 14px;
          display:flex; align-items:center; justify-content:center; gap:26px;
          text-transform:uppercase; font-weight:800; letter-spacing:.06em;
        }
        .links a{ color:#e9e9e9; text-decoration:none; }
        .links a:hover{ text-decoration:underline; }
        .links li + li{ position:relative; }
        .links li + li::before{
          content:""; position:absolute; left:-14px; top:50%; transform:translateY(-50%);
          width:1px; height:18px; background:#3a3a3a;
        }

        .brand{
          margin:6px 0 8px;
          display:flex; flex-direction:column; align-items:center; gap:4px;
        }
        .brand .wordmark{
          font-weight:900; letter-spacing:.12em; font-size:20px; color:#9f9f9f;
          filter: drop-shadow(0 0 1px #111);
        }
        .brand .tag{
          font-size:11px; letter-spacing:.18em; color:#7c7c7c;
        }
        /* ถ้าใช้รูปโลโก้ ให้กำหนดขนาดได้ */
        .brand :global(img){ width:140px; height:auto; opacity:.85; }

        .copy{ font-size:12px; color:#8d8d8d; margin-top:8px; }

        @media (max-width:600px){
          .links{ gap:18px; font-size:12px; }
          .brand .wordmark{ font-size:18px; }
        }
      `}</style>
    </footer>
  );
}

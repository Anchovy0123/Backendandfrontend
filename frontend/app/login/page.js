'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  subsets: ['thai','latin'],
  weight: ['400','600','700','800'],
  variable: '--font-kanit',
});

export default function LoginPage(){
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('https://backend-nextjs-virid.vercel.app/api/auth/login',{
        method:'POST',
        headers:{ 'Content-Type':'application/json', Accept:'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(()=> ({}));
      if(res.ok && data?.token){
        localStorage.setItem('token', data.token);
        await Swal.fire({ icon:'success', title:'<h3>Login Successfully!</h3>', timer:1200, showConfirmButton:false, background:'#fff', color:'#111' });
        window.location.href = '/admin/users';
      }else{
        Swal.fire({ icon:'warning', title:'<h3>Login Failed!</h3>', text: data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      }
    }finally{ setLoading(false); }
  };

  return (
    <div className={`auth-screen ak-yellow ${kanit.variable}`}>
      <div className="auth-bg" aria-hidden />
      <div className="scanline" aria-hidden />

      <section className="container">
        <header className="auth-head">
          <div className="auth-brand">ARKNIGHTS: <span>ENDFIELD</span></div>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-sub">ยืนยันตัวตนเพื่อเข้าควบคุมการปฏิบัติการบน Talos-II</p>
        </header>

        <form className="auth-card fade-in-up" onSubmit={handleLogin}>
          <div className="auth-grid">
            <div className="form-field auth-span-2">
              <label>Username</label>
              <input
                name="username" type="text" autoComplete="username" placeholder="ชื่อผู้ใช้"
                value={username} onChange={(e)=>setUsername(e.target.value)} required
              />
            </div>

            <div className="form-field auth-span-2">
              <label>Password</label>
              <div className="pw-wrap">
                <input
                  name="password" type={showPw ? 'text':'password'} autoComplete="current-password" placeholder="รหัสผ่าน"
                  value={password} onChange={(e)=>setPassword(e.target.value)} required
                />
                <button type="button" className="pw-toggle" onClick={()=>setShowPw(v=>!v)}>
                  {showPw ? 'Hide':'Show'}
                </button>
              </div>
            </div>
          </div>

          <div className="auth-actions">
            <button className="btn-yl" type="submit" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ…' : 'Sign In'}
            </button>
            {/* ปุ่ม Create Account พร้อมเอฟเฟกต์ */}
            <Link className="btn-ghost" href="/register">
              <i className="bi bi-person-plus me-2" />
              Create Account
              <span className="trail" aria-hidden />
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

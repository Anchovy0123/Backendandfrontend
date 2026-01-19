'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  subsets: ['thai','latin'],
  weight: ['400','600','700','800'],
  variable: '--font-kanit',
});

export default function RegisterPage(){
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname:'', fullname:'', lastname:'', username:'',
    address:'', sex:'', birthday:'', password:''
  });
  const update = (k,v)=> setForm(s=>({ ...s, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('https://backend-nextjs-virid.vercel.app/api/users',{
        method:'POST',
        headers:{ 'Content-Type':'application/json', Accept:'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(()=> ({}));
      if(res.ok){
        await Swal.fire({ icon:'success', title:'<h3>บันทึกข้อมูลเรียบร้อยแล้ว</h3>', timer:1600, showConfirmButton:false });
        router.push('/login');
      }else{
        Swal.fire({ icon:'error', title:'เกิดข้อผิดพลาด!', text:data?.message || '' });
      }
    }catch{
      Swal.fire({ icon:'error', title:'ข้อผิดพลาดเครือข่าย', text:'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    }finally{ setLoading(false); }
  };

  return (
    <div className={`auth-screen ak-yellow ${kanit.variable}`}>
      <div className="auth-bg" aria-hidden />
      <div className="scanline" aria-hidden />

      <section className="container">
        <header className="auth-head">
          <div className="auth-brand">ARKNIGHTS: <span>ENDFIELD</span></div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">ลงทะเบียนผู้ปฏิบัติการใหม่</p>
        </header>

        <form className="auth-card fade-in-up" onSubmit={handleSubmit}>
          <div className="auth-grid">
            <div className="form-field">
              <label>คำนำหน้า (Firstname)</label>
              <select required value={form.firstname} onChange={e=>update('firstname', e.target.value)}>
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
              </select>
            </div>

            <div className="form-field">
              <label>ชื่อ (Fullname)</label>
              <input type="text" required value={form.fullname} onChange={e=>update('fullname', e.target.value)} />
            </div>

            <div className="form-field">
              <label>นามสกุล (Lastname)</label>
              <input type="text" required value={form.lastname} onChange={e=>update('lastname', e.target.value)} />
            </div>

            <div className="form-field">
              <label>Username</label>
              <input type="text" required value={form.username} onChange={e=>update('username', e.target.value)} />
            </div>

            <div className="form-field auth-span-2">
              <label>Address</label>
              <textarea rows={2} required value={form.address} onChange={e=>update('address', e.target.value)} />
            </div>

            <div className="form-field">
              <label>Sex</label>
              <select required value={form.sex} onChange={e=>update('sex', e.target.value)}>
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
              </select>
            </div>

            <div className="form-field">
              <label>Birthday</label>
              <input type="date" required value={form.birthday} onChange={e=>update('birthday', e.target.value)} />
            </div>

            <div className="form-field auth-span-2">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={e=>update('password', e.target.value)} />
            </div>
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn-yl" disabled={loading}>
              {loading ? 'กำลังสร้างบัญชี…' : 'Create Account'}
            </button>

            <a href="/login" className="btn-ghost">
              <i className="bi bi-box-arrow-in-right me-2" />
              Sign In
              <span className="trail" aria-hidden />
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}

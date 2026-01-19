'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Kanit } from 'next/font/google';
import { apiRequest } from '@/lib/apiClient';

const kanit = Kanit({
  subsets: ['thai','latin'],
  weight: ['400','600','700','800'],
  variable: '--font-kanit',
});

const initialForm = {
  firstname:'', fullname:'', lastname:'', username:'',
  address:'', sex:'', birthday:'', password:''
};

export default function RegisterPage(){
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const updateField = (key, value) => setForm((state) => ({ ...state, [key]: value }));
  const handleFieldChange = (key) => (event) => updateField(key, event.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      await apiRequest('/api/auth/register', {
        method:'POST',
        body: form,
        auth: false,
      });
      await Swal.fire({ icon:'success', title:'<h3>บันทึกข้อมูลเรียบร้อยแล้ว</h3>', timer:1600, showConfirmButton:false });
      router.push('/login');
    }catch(error){
      Swal.fire({ icon:'error', title:'ข้อผิดพลาดเครือข่าย', text: error?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
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
              <select required value={form.firstname} onChange={handleFieldChange('firstname')}>
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
              </select>
            </div>

            <div className="form-field">
              <label>ชื่อ (Fullname)</label>
              <input type="text" required value={form.fullname} onChange={handleFieldChange('fullname')} />
            </div>

            <div className="form-field">
              <label>นามสกุล (Lastname)</label>
              <input type="text" required value={form.lastname} onChange={handleFieldChange('lastname')} />
            </div>

            <div className="form-field">
              <label>Username</label>
              <input type="text" required value={form.username} onChange={handleFieldChange('username')} />
            </div>

            <div className="form-field auth-span-2">
              <label>Address</label>
              <textarea rows={2} required value={form.address} onChange={handleFieldChange('address')} />
            </div>

            <div className="form-field">
              <label>Sex</label>
              <select required value={form.sex} onChange={handleFieldChange('sex')}>
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
              </select>
            </div>

            <div className="form-field">
              <label>Birthday</label>
              <input type="date" required value={form.birthday} onChange={handleFieldChange('birthday')} />
            </div>

            <div className="form-field auth-span-2">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={handleFieldChange('password')} />
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

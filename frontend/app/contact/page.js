'use client';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4">Contact Us</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">ชื่อ</label>
            <input type="text" className="form-control" id="name" placeholder="กรอกชื่อของคุณ" />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">อีเมล</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">ข้อความ</label>
            <textarea className="form-control" id="message" rows="4" placeholder="เขียนข้อความของคุณที่นี่"></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100">ส่งข้อความ</button>
        </form>
        <div className="text-center mt-3">
          <Link href="/" className="text-decoration-none">กลับหน้าหลัก</Link>
        </div>
      </div>
    </div>
  );
}

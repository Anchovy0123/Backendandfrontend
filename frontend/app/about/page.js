'use client';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '700px' }}>
        <h2 className="text-center mb-4">เกี่ยวกับเรา</h2>
        <div className="mb-3 text-center">
          {/* สามารถเปลี่ยน src เป็นโลโก้หรือรูปภาพของเว็บไซต์คุณ */}
          <Image 
            src="/images/sliders/hatsune-miku-vocaloid.gif" 
            alt="Logo" 
            width={120} 
            height={120} 
            className="rounded-circle"
          />
        </div>
        <p className="text-center">
          เว็บไซต์ของเราถูกสร้างขึ้นเพื่อเป็นศูนย์รวมข้อมูล ข่าวสาร และบริการที่เป็นประโยชน์ต่อผู้ใช้งาน
          เรามุ่งมั่นที่จะพัฒนาและปรับปรุงเพื่อให้ทุกคนได้รับประสบการณ์ที่ดีที่สุด
        </p>
        <p>
          เรามีทีมงานที่ทุ่มเทและพร้อมให้บริการ รวมถึงมีฟีเจอร์มากมาย เช่น ระบบสมัครสมาชิก, ติดต่อสอบถาม,
          และบริการอื่น ๆ ที่จะช่วยให้คุณได้รับความสะดวกสบายในการใช้งาน
        </p>
        <p>
          ขอบคุณที่ไว้วางใจและเลือกใช้บริการของเรา!
        </p>
      </div>
    </div>
  );
}

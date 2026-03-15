import Link from 'next/link'
import { Home, ShieldCheck, Zap, ArrowRight, CheckCircle2, TrendingUp, Users, CreditCard } from 'lucide-react'

const PAIN_POINTS = [
  { title: 'Sungkan Nagih', desc: 'Rasa canggung saat menagih penyewa kamar yang sudah melewati tanggal jatuh tempo.' },
  { title: 'Drama Bukti Transfer', desc: 'Bolak-balik konfirmasi pembayaran lewat chat yang menyita waktu dan tenaga.' },
  { title: 'Cek Mutasi Manual', desc: 'Harus periksa rekening bank satu per satu setiap awal bulan untuk memastikan pelunasan.' },
]

const STEPS = [
  { step: '01', title: 'Input Data', desc: 'Daftarkan nama kamar, nominal sewa, dan nomor WhatsApp penyewa dalam 2 menit saja.' },
  { step: '02', title: 'Kirim via WhatsApp', desc: 'Sistem otomatis menyiapkan draf pesan tagihan dan link pembayaran Mayar ke WhatsApp penyewa.' },
  { step: '03', title: 'Lunas Otomatis', desc: 'Penyewa bayar via QRIS/VA, status di dashboard langsung berubah menjadi Lunas tanpa cek mutasi.' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: 'var(--bg)' }}>

      {/* ── Background Abstract Shapes & Gradients ── */}
      {/* Gradients removed completely to ensure a pure white background as requested */}
      <svg style={{ position: 'absolute', top: 120, right: '10%', width: 400, height: 400, zIndex: 0, pointerEvents: 'none', opacity: 0.05 }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--brand)" d="M47.7,-57.2C59.4,-47.3,64.8,-29.7,66.9,-12.3C69,5.1,67.8,22.3,59.3,35.6C50.8,48.9,35,58.3,17.4,63.1C-0.2,68,-19.6,68.4,-36.4,61.4C-53.2,54.4,-67.4,40.1,-75.1,22.4C-82.8,4.7,-84,-16.4,-75.4,-32.4C-66.8,-48.4,-48.4,-59.3,-30.9,-63.3C-13.4,-67.3,3.3,-64.3,18.8,-59.4C28.5,-55.8,36,-67.1,47.7,-57.2Z" transform="translate(100 100)" />
      </svg>
      {/* Grid Pattern Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100vh',
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }} />

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 32px',
        background: 'rgba(250, 250, 250, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(6, 78, 59, 0.2)'
            }}>
              <Home size={16} color="#ffffff" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em', color: 'var(--brand)' }}>
              KontrakanKoe
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/sign-in" className="btn btn-ghost" style={{ padding: '8px 18px', border: 'none', boxShadow: 'none' }}>Masuk</Link>
            <Link href="/sign-up" className="btn btn-primary" style={{ padding: '8px 20px', background: 'var(--brand)', color: 'white', border: 'none' }}>
              Mulai Gratis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ~ Minimal, Editorial with UI Mockups ── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, padding: '160px 24px 80px', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          
          {/* Left: Text Content */}
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'white',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 20px',
              marginBottom: 32,
              fontSize: '0.85rem',
              color: 'var(--brand)',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: 'var(--brand-light)' }}><Zap size={16} fill="currentColor" /></span>
              Pembayaran otomatis dengan Mayar QRIS & VA
            </div>

            <h1 style={{
              fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
              fontWeight: 700,
              marginBottom: 24,
              color: 'var(--brand)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px rgba(6, 78, 59, 0.05)'
            }}>
              Autopilot tagihan kos, <br />
              <span style={{ position: 'relative', display: 'inline-block', fontStyle: 'italic', fontWeight: 800 }}>
                tanpa sungkan.
                {/* Decorative underline */}
                <svg width="100%" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: 'auto', zIndex: -1 }}>
                  <path d="M2 16.5C40 -11.5 160 -3.5 198 16.5" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(1.15rem, 2vw, 1.35rem)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              lineHeight: 1.6,
              marginBottom: 48,
              maxWidth: 540,
            }}>
              Kirim tagihan ke WhatsApp penyewa dalam satu klik, terima pembayaran otomatis, 
              dan pantau status semua kamar dari satu dashboard elegan.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <Link href="/sign-up" className="btn btn-accent" style={{ padding: '16px 36px', fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 8px 32px rgba(217, 249, 95, 0.4)' }}>
                Daftar Gratis <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link href="/sign-in" className="btn btn-ghost" style={{ padding: '15px 36px', fontSize: '1.1rem', fontWeight: 600, borderRadius: 'var(--radius-pill)', background: 'white', border: '2px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', color: 'var(--text)' }}>
                Masuk Dashboard
              </Link>
            </div>
          </div>
          
          {/* Right: Abstract UI Mockup Block */}
          <div className="hero-mockup" style={{
            flex: '1 1 500px',
            position: 'relative',
            width: '100%',
            height: 520,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 24,
            boxShadow: '0 40px 80px -20px rgba(6, 78, 59, 0.25), 0 0 0 1px rgba(255,255,255,0.5) inset',
            backdropFilter: 'blur(32px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Mock Header */}
            <div style={{ height: 60, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, background: '#ffffff' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <div style={{ width: 240, height: 28, background: 'var(--bg)', borderRadius: 6, margin: '0 auto' }} />
            </div>
            
            {/* Mock Body */}
            <div style={{ display: 'flex', flex: 1, padding: 24, gap: 24, background: '#fafafa' }}>
              {/* Sidebar Mock */}
              <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ height: 36, background: 'rgba(6, 78, 59, 0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12 }}>
                  <Home size={16} color="var(--brand)" />
                  <div style={{ width: 80, height: 12, background: 'var(--brand)', borderRadius: 4, opacity: 0.8 }} />
                </div>
                <div style={{ height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12 }}>
                  <Users size={16} color="var(--text-muted)" />
                  <div style={{ width: 100, height: 12, background: 'var(--text-muted)', borderRadius: 4, opacity: 0.3 }} />
                </div>
                <div style={{ height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12 }}>
                  <CreditCard size={16} color="var(--text-muted)" />
                  <div style={{ width: 70, height: 12, background: 'var(--text-muted)', borderRadius: 4, opacity: 0.3 }} />
                </div>
              </div>
              
              {/* Content Mock */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Stats row */}
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ flex: 1, height: 100, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ width: 80, height: 12, background: 'var(--text-muted)', borderRadius: 4, opacity: 0.3, marginBottom: 12 }} />
                    <div style={{ width: 140, height: 28, background: 'var(--brand)', borderRadius: 6, opacity: 0.9 }} />
                  </div>
                  <div style={{ flex: 1, height: 100, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(217, 249, 95, 0.2))' }} />
                    <div style={{ width: 100, height: 12, background: 'var(--text-muted)', borderRadius: 4, opacity: 0.3, marginBottom: 12 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 120, height: 28, background: 'var(--brand)', borderRadius: 6, opacity: 0.9 }} />
                      <TrendingUp size={20} color="var(--accent-dark)" />
                    </div>
                  </div>
                </div>

                {/* List Mock */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ width: 120, height: 16, background: 'var(--brand)', borderRadius: 4, opacity: 0.8, marginBottom: 8 }} />
                  {[1,2,3].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i !== 3 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-alt)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ width: 100, height: 12, background: 'var(--text-primary)', borderRadius: 4, opacity: 0.7 }} />
                          <div style={{ width: 60, height: 10, background: 'var(--text-muted)', borderRadius: 4, opacity: 0.3 }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 80, height: 14, background: 'var(--text-primary)', borderRadius: 4, opacity: 0.5 }} />
                        <div style={{ padding: '6px 12px', borderRadius: 20, background: i === 1 ? 'rgba(39, 201, 63, 0.1)' : 'rgba(255, 189, 46, 0.1)', color: i === 1 ? '#27c93f' : '#ffbd2e', fontSize: 12, fontWeight: 600 }}>
                          {i === 1 ? 'LUNAS' : 'PENDING'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating popover element to make it dynamic */}
            <div style={{
              position: 'absolute', right: -20, top: '40%',
              background: '#fff', padding: '16px 20px', borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 12,
              animation: 'float 6s ease-in-out infinite'
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#27c93f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 color="#fff" size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', marginBottom: 4 }}>Pembayaran Diterima</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Kamar 02 telah lunas via QRIS</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CSS Animation & Hover Effects */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .hero-mockup {
            transform: perspective(1000px) rotateY(-4deg) translateY(-5px);
            transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .hero-mockup:hover {
            transform: perspective(1000px) rotateY(0deg) translateY(0px);
          }
          .pain-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.05) !important;
          }
        `}} />
      </section>

      {/* ── Pain Points ~ Clean Cards ── */}
      <section style={{ padding: '120px 24px', background: 'var(--brand)', color: 'white', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Abstract shape in background */}
          <div style={{ position: 'absolute', right: 0, top: '20%', width: 300, height: 300, background: 'rgba(217, 249, 95, 0.1)', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', filter: 'blur(40px)', zIndex: -1 }} />
          
          <div style={{ textAlign: 'left', marginBottom: 64, maxWidth: 640 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
              Tinggalkan cara lama mengelola <strong>kamar kos.</strong>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Sistem manual tidak hanya membuang waktu, tapi juga rentan human-error dan membuat Anda stres di akhir bulan.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {PAIN_POINTS.map((p, i) => (
              <div key={p.title} className="card pain-card" style={{ 
                padding: '40px 32px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'default'
              }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, background: i === 0 ? 'rgba(255, 95, 86, 0.15)' : i === 1 ? 'rgba(255, 189, 46, 0.15)' : 'rgba(39, 201, 63, 0.15)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                  color: i === 0 ? '#ff5f56' : i === 1 ? '#ffbd2e' : '#27c93f', fontWeight: 'bold'
                }}>0{i + 1}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 12, color: 'white' }}>{p.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ~ Dark Section ── */}
      <section style={{
        background: 'var(--brand)',
        color: 'white',
        padding: '120px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Subtle grid pattern */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        {/* Soft lime gradient blob */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '120%', background: 'radial-gradient(circle, rgba(217, 249, 95, 0.1) 0%, rgba(250,250,250,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 60 }}>
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'white', marginBottom: 20, lineHeight: 1.05 }}>
              Sistem simpel, <br/><strong>hasil instan.</strong>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', fontWeight: 500 }}>Tiga langkah mudah untuk mencapai kebebasan waktu Anda.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ position: 'relative', paddingLeft: 40, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ position: 'absolute', left: -1, top: 0, width: 2, height: i === 0 ? '100%' : '40%', background: 'var(--accent)', transition: 'height 0.5s ease' }} />
                <div style={{
                  fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', 
                  marginBottom: 16, letterSpacing: '0.05em'
                }}>LANGKAH {s.step}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: 16, color: 'white', fontFamily: 'var(--font-heading)' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.65, fontWeight: 500 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ~ Final Push ── */}
      <section style={{ padding: '140px 24px', textAlign: 'center', background: 'var(--brand)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 800, height: 400, background: 'radial-gradient(circle, rgba(217, 249, 95, 0.15) 0%, rgba(250,250,250,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
        
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'white', marginBottom: 24, lineHeight: 1.05 }}>
            Mulai autopilot <strong>sekarang.</strong>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 48, fontSize: '1.15rem' }}>
            Atur tagihan kamar kos dengan cara yang jauh lebih profesional dan elegan. Gratis selamanya.
          </p>
          <Link href="/sign-up" className="btn btn-accent" style={{ padding: '18px 40px', fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 8px 32px rgba(217, 249, 95, 0.2)' }}>
            Buat Akun Gratis <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.05)', padding: '60px 32px 40px', background: 'var(--bg)', color: 'var(--text)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Home size={14} color="#ffffff" />
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--brand)' }}>KontrakanKoe</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 280, lineHeight: 1.6 }}>
                Solusi manajemen kos modern. Tagih instan, rekap akurat, tidur tenang.
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} KontrakanKoe · Powered by Mayar
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link href="#" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="#" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Home, Loader2, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Gagal daftar'); return }

      const result = await signIn('credentials', {
        email: form.email, password: form.password, redirect: false,
      })
      if (result?.ok) router.push('/onboarding')
    } catch {
      setError('Terjadi kesalahan, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--brand)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Home size={18} color="#ffffff" />
            </div>
          </Link>
          <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--brand)' }}>Buat Akun Baru</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>
            Mulai autopilot kos Anda secara gratis
          </p>
        </div>

        <div className="card" style={{ padding: '36px 32px' }}>
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', padding: '14px 18px', marginBottom: 24, gap: 12 }}
          >
            {googleLoading ? <Loader2 size={18} className="loading" /> : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.3 30.3 0 24 0 14.7 0 6.7 5.4 2.8 13.3l7.9 6.2C12.5 13.2 17.8 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.1z"/>
                <path fill="#FBBC05" d="M10.7 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5l-7.9-6.2C1 16.4 0 20.1 0 24s1 7.6 2.8 10.7l7.9-6.2z"/>
                <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7.6-5.9c-2.1 1.4-4.8 2.3-7.9 2.3-6.2 0-11.5-3.7-13.3-9l-7.9 6.2C6.7 42.6 14.7 48 24 48z"/>
              </svg>
            )}
            {googleLoading ? 'Menghubungkan...' : 'Daftar dengan Google'}
          </button>

          <div className="divider" style={{ marginBottom: 24 }}>atau dengan email</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="label">Nama Lengkap</label>
              <input className="input" placeholder="Budi Santoso" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="label">Alamat Email</label>
                <input className="input" type="email" placeholder="email@domain.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="label">No. WhatsApp</label>
                <input className="input" placeholder="08xxxxxxxxxxx" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Kata Sandi</label>
              <input className="input" type="password" placeholder="Minimal 6 karakter" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', background: 'var(--red-dim)', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 18px', marginTop: 8 }} disabled={loading}>
              {loading ? <Loader2 size={16} className="loading" /> : null}
              {loading ? 'Mendaftar...' : 'Buat Akun'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Sudah punya akun?{' '}
            <Link href="/sign-in" style={{ color: 'var(--brand)', fontWeight: 700 }}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

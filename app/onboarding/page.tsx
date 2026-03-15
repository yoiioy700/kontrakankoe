'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Home, Building2, ChevronRight, Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [property, setProperty] = useState({ propertyName: '', propertyAddress: '' })
  const formatRupiah = (val: string) => {
    const num = val.replace(/[^0-9]/g, '')
    if (!num) return ''
    return 'Rp ' + parseInt(num).toLocaleString('id-ID')
  }
  const parseRupiah = (val: string) => val.replace(/[^0-9]/g, '')
  const [room, setRoom] = useState({
    roomName: '', rentAmount: '', dueDateDay: '5',
    tenantName: '', tenantPhone: '',
  })

  const handlePropertyNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!property.propertyName || !property.propertyAddress) {
      setError('Nama kos dan alamat wajib diisi')
      return
    }
    setError('')
    setStep(2)
  }

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!room.roomName || !room.rentAmount) {
      setError('Nama kamar dan nominal sewa wajib diisi')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...property, room: { ...room, rentAmount: parseRupiah(room.rentAmount) } }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Gagal menyimpan'); return }
      router.push('/dashboard')
    } catch {
      setError('Terjadi kesalahan, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <Home size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Setup Kos Kamu</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Langkah {step} dari 2
          </p>
          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                height: 4, width: 40, borderRadius: 99,
                background: s <= step ? 'var(--green)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {step === 1 ? (
            <form onSubmit={handlePropertyNext} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Building2 size={18} color="var(--green)" />
                <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Data Properti Kamu</h2>
              </div>
              <div className="form-group">
                <label className="label">Nama Kos / Kontrakan</label>
                <input className="input" placeholder='Misal: "Kos Pak Hendra Depok"'
                  value={property.propertyName} onChange={e => setProperty({ ...property, propertyName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="label">Alamat Lengkap</label>
                <input className="input" placeholder="Jl. Margonda Raya No. 10, Depok"
                  value={property.propertyAddress} onChange={e => setProperty({ ...property, propertyAddress: e.target.value })} required />
              </div>
              {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }}>
                Lanjut <ChevronRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinish} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Home size={18} color="var(--green)" />
                <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Tambah Kamar Pertama</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Nama / Nomor Kamar</label>
                  <input className="input" placeholder='Kamar 01, Kamar Depan...'
                    value={room.roomName} onChange={e => setRoom({ ...room, roomName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Sewa per Bulan (Rp)</label>
                  <input className="input" type="text" placeholder="Rp 800.000"
                    value={room.rentAmount} onChange={e => setRoom({ ...room, rentAmount: formatRupiah(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label className="label">Tanggal Jatuh Tempo</label>
                  <input className="input" type="number" min="1" max="28" placeholder="1 - 28"
                    value={room.dueDateDay} onChange={e => setRoom({ ...room, dueDateDay: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Nama Penyewa <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opsional)</span></label>
                  <input className="input" placeholder="Budi Santoso"
                    value={room.tenantName} onChange={e => setRoom({ ...room, tenantName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">WhatsApp Penyewa <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opsional)</span></label>
                  <input className="input" placeholder="08xxxxxxxxx"
                    value={room.tenantPhone} onChange={e => setRoom({ ...room, tenantPhone: e.target.value })} />
                </div>
              </div>
              {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>← Kembali</button>
                <button type="submit" className="btn btn-green" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 size={16} className="loading" /> : null}
                  {loading ? 'Menyimpan...' : 'Simpan & Masuk Dashboard 🏠'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

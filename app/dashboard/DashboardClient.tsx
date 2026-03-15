'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Plus, RefreshCw, Send, CheckCircle2, Clock, AlertCircle, XCircle, ChevronRight, LogOut, Loader2, X } from 'lucide-react'
import { signOut } from 'next-auth/react'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function currentPeriod() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const STATUS_CFG: Record<string, { label: string; badge: string; icon: React.ReactNode; borderColor: string; dotColor: string }> = {
  paid:    { label: 'Lunas',           badge: 'badge-lunas',    icon: <CheckCircle2 size={12} />, borderColor: 'rgba(16, 185, 129, 0.4)', dotColor: 'var(--green)' },
  sent:    { label: 'Menunggu',        badge: 'badge-terkirim', icon: <Clock size={12} />,        borderColor: 'rgba(245, 158, 11, 0.4)', dotColor: 'var(--yellow)' },
  pending: { label: 'Belum Bayar',     badge: 'badge-belum',    icon: <AlertCircle size={12} />,  borderColor: 'rgba(239, 68, 68, 0.4)',  dotColor: 'var(--red)' },
  vacant:  { label: 'Kosong',          badge: 'badge-kosong',   icon: <XCircle size={12} />,      borderColor: 'var(--border)',           dotColor: 'var(--text-muted)' },
}

export default function DashboardClient({ user, rooms, invoices }: { user: any; rooms: any[]; invoices: any[] }) {
  const router = useRouter()
  const [sending, setSending] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [localInvoices, setLocalInvoices] = useState<Record<string, any>>({})

  const period = currentPeriod()

  // Build room → invoice map
  const invoiceByRoom: Record<string, any> = {}
  ;(invoices || []).forEach(inv => { invoiceByRoom[inv.roomId] = inv })
  const merged = { ...invoiceByRoom, ...localInvoices }

  const roomWithStatus = rooms.map(r => {
    const inv = merged[r.id]
    let status = r.status === 'vacant' ? 'vacant' : (inv?.status || 'pending')
    return { ...r, inv, status }
  })

  const paidCount = roomWithStatus.filter(r => r.status === 'paid').length
  const pendingCount = roomWithStatus.filter(r => r.status === 'pending').length
  const sentCount = roomWithStatus.filter(r => r.status === 'sent').length
  const totalPemasukan = invoices.filter(i => i.status === 'paid' && i.periodMonth === period).reduce((s, i) => s + i.amount, 0)

  const handleKirimTagihan = async (room: any) => {
    setSending(room.id)
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Gagal kirim tagihan'); return }

      setLocalInvoices(prev => ({ ...prev, [room.id]: { status: 'sent', periodMonth: period } }))

      const month = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      const waMsg = encodeURIComponent(
        `Halo ${room.tenantName || 'Kak'} 👋\n\nTagihan sewa *${room.roomName}* bulan ${month} sudah siap.\n\nSilakan bayar di sini:\n${data.paymentUrl || data.invoiceUrl}\n\nTerima kasih 🙏`
      )
      const phone = room.tenantPhone?.replace(/\D/g, '') || ''
      window.open(`https://wa.me/${phone}?text=${waMsg}`, '_blank')
    } finally {
      setSending(null)
    }
  }

  const monthLabel = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 28px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Home size={14} color="#ffffff" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--brand)' }}>KontrakanKoe</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/dashboard/riwayat" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: '0.8rem', border: 'none', boxShadow: 'none' }}>Riwayat</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', border: 'none', boxShadow: 'none' }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--brand)' }}>
              Hai, {user?.name?.split(' ')[0] || 'Bos'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.95rem' }}>
              Ringkasan kos Anda di bulan <span style={{ fontWeight: 600, color: 'var(--text)' }}>{monthLabel}</span>
            </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Plus size={16} /> Tambah Kamar
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Kamar', value: rooms.length, sub: 'terdaftar', color: 'var(--text)' },
            { label: 'Lunas', value: paidCount, sub: 'bulan ini', color: 'var(--green)' },
            { label: 'Menunggu', value: sentCount, sub: 'sudah ditagih', color: 'var(--yellow)' },
            { label: 'Pemasukan', value: fmtCurrency(totalPemasukan), sub: 'realisasi', color: 'var(--brand)', span: true },
          ].map((c, i) => (
            <div key={i} className="card" style={{ 
              padding: '24px', 
              gridColumn: c.span ? 'span 2' : 'auto',
              borderTop: `3px solid ${c.color === 'var(--text)' ? 'var(--border-dark)' : c.color}`
            }}>
              <p style={{ fontSize: c.span ? '2rem' : '1.75rem', fontWeight: 700, color: c.color, fontFamily: 'var(--font-heading)' }}>{c.value}</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 4, color: 'var(--text)' }}>{c.label}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Room Grid ── */}
        <h2 style={{ fontSize: '1.35rem', marginBottom: 20, color: 'var(--brand)', fontFamily: 'var(--font-heading)' }}>Daftar Kamar</h2>
        
        {roomWithStatus.length === 0 ? (
          <div className="card" style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--surface-alt)', borderStyle: 'dashed' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
              <Home size={28} color="var(--brand)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--brand)' }}>Belum ada kamar</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
              Mulai kelola properti Anda dengan menambahkan kamar pertama.
            </p>
            <button onClick={() => setShowAdd(true)} className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <Plus size={16} /> Tambah Kamar
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {roomWithStatus.map(room => {
              const cfg = STATUS_CFG[room.status] || STATUS_CFG.pending
              const isSending = sending === room.id
              return (
                <div key={room.id} className="card" style={{
                  padding: '24px',
                  borderLeft: `4px solid ${cfg.dotColor}`,
                  display: 'flex', flexDirection: 'column'
                }}>
                  {/* Room header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4, color: 'var(--brand)' }}>{room.roomName}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {room.tenantName ? room.tenantName : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Kosong</span>}
                      </p>
                    </div>
                    <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                  </div>

                  {/* Rent amount */}
                  <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)' }}>
                      {fmtCurrency(room.rentAmount)}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}> /bln</span>
                    </p>
                  </div>

                  {/* Action row */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                    {room.status !== 'vacant' && room.status !== 'paid' ? (
                      <button
                        onClick={() => handleKirimTagihan(room)}
                        disabled={isSending}
                        className={room.status === 'sent' ? 'btn btn-ghost' : 'btn btn-primary'}
                        style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                      >
                        {isSending ? <Loader2 size={16} className="loading" /> : room.status === 'sent' ? <RefreshCw size={14} /> : <Send size={14} />}
                        {isSending ? 'Mengirim...' : room.status === 'sent' ? 'Tagih Ulang' : 'Kirim Tagihan'}
                      </button>
                    ) : (
                      <div style={{ flex: 1 }} />
                    )}
                    <Link href={`/dashboard/kamar/${room.id}`} className="btn btn-ghost" style={{ padding: '10px 16px', border: '1px solid var(--border)' }}>
                      Detail <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {showAdd && <AddRoomModal onClose={() => setShowAdd(false)} onAdded={() => { setShowAdd(false); router.refresh() }} />}
    </div>
  )
}

// ── Add Room Modal ──────────────────────────────────────────────────────────
function AddRoomModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ roomName: '', rentAmount: '', dueDateDay: '5', tenantName: '', tenantPhone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Gagal tambah kamar'); return }
      onAdded()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--brand)', fontFamily: 'var(--font-heading)' }}>Tambah Kamar</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '8px', border: 'none', boxShadow: 'none' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Nama Kamar</label>
              <input className="input" placeholder="Kamar 101" value={form.roomName} onChange={e => setForm({ ...form, roomName: e.target.value })} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Sewa Bulanan (Rp)</label>
              <input className="input" type="number" placeholder="1500000" value={form.rentAmount} onChange={e => setForm({ ...form, rentAmount: e.target.value })} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <div className="divider" style={{ margin: '8px 0' }}>Data Penyewa (Opsional)</div>
            </div>
            <div className="form-group">
              <label className="label">Nama Penyewa</label>
              <input className="input" placeholder="Budi" value={form.tenantName} onChange={e => setForm({ ...form, tenantName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">WhatsApp</label>
              <input className="input" placeholder="08xxxxxxxx" value={form.tenantPhone} onChange={e => setForm({ ...form, tenantPhone: e.target.value })} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Tanggal Jatuh Tempo (1-28)</label>
              <input className="input" type="number" min="1" max="28" placeholder="5" value={form.dueDateDay} onChange={e => setForm({ ...form, dueDateDay: e.target.value })} required />
            </div>
          </div>
          {error && <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', background: 'var(--red-dim)', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1, padding: '12px' }}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }} disabled={loading}>
              {loading ? <Loader2 size={16} className="loading" /> : <Plus size={16} />}
              {loading ? 'Menyimpan...' : 'Simpan Kamar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

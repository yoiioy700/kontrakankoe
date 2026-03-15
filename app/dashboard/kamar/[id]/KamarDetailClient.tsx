'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Trash2, Send, RefreshCw, CheckCircle, Clock, AlertCircle, Loader2, X } from 'lucide-react'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
function fmtDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  paid:    { label: 'Lunas',    cls: 'badge-lunas',    icon: <CheckCircle size={12} /> },
  sent:    { label: 'Terkirim', cls: 'badge-terkirim', icon: <Clock size={12} /> },
  pending: { label: 'Pending',  cls: 'badge-belum',    icon: <AlertCircle size={12} /> },
  expired: { label: 'Expired',  cls: 'badge-kosong',   icon: <AlertCircle size={12} /> },
}

export default function KamarDetailClient({ room }: { room: any }) {
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [sending, setSending] = useState(false)

  const currentPeriod = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  const period = currentPeriod()
  const currentInv = room.invoices.find((i: any) => i.periodMonth === period)

  const handleKirimTagihan = async () => {
    setSending(true)
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Gagal kirim tagihan'); return }

      const month = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      const waMsg = encodeURIComponent(
        `Halo ${room.tenantName || 'Kak'} 👋, ini tagihan sewa *${room.roomName}* bulan ${month}.\n\nSilakan bayar di sini:\n${data.invoiceUrl}\n\nTerima kasih 🙏`
      )
      const phone = room.tenantPhone?.replace(/\D/g, '') || ''
      window.open(`https://wa.me/${phone}?text=${waMsg}`, '_blank')
      router.refresh()
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus ${room.roomName}? Semua data tagihan akan ikut terhapus.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/rooms/${room.id}`, { method: 'DELETE' })
      if (res.ok) router.push('/dashboard')
      else alert('Gagal menghapus kamar')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,13,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '0.825rem' }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ {room.roomName}</span>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
        {/* Room Header Card */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{room.roomName}</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                {room.tenantName ? `Penyewa: ${room.tenantName}` : <em style={{ color: 'var(--text-muted)' }}>Belum ada penyewa</em>}
                {room.tenantPhone && <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>· {room.tenantPhone}</span>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowEdit(true)} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.825rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn btn-danger" style={{ padding: '8px 14px', fontSize: '0.825rem' }}>
                {deleting ? <Loader2 size={14} className="loading" /> : <Trash2 size={14} />}
                Hapus
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Sewa/Bulan', value: fmtCurrency(room.rentAmount) },
              { label: 'Jatuh Tempo', value: `Tgl ${room.dueDateDay} tiap bulan` },
              { label: 'Status Kamar', value: room.status === 'occupied' ? '🟢 Ditempati' : '⚪ Kosong' },
            ].map(item => (
              <div key={item.label}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Month Action */}
        <div className="card" style={{ padding: 20, marginBottom: 20, borderColor: currentInv?.status === 'paid' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontWeight: 700 }}>Status Bulan Ini</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>
                {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {currentInv && (
                <span className={`badge ${STATUS_CFG[currentInv.status]?.cls}`}>
                  {STATUS_CFG[currentInv.status]?.icon} {STATUS_CFG[currentInv.status]?.label}
                </span>
              )}
              {room.status !== 'vacant' && (!currentInv || currentInv.status !== 'paid') && (
                <button onClick={handleKirimTagihan} disabled={sending} className="btn btn-primary" style={{ padding: '9px 16px', fontSize: '0.825rem' }}>
                  {sending ? <Loader2 size={14} className="loading" /> : currentInv?.status === 'sent' ? <RefreshCw size={14} /> : <Send size={14} />}
                  {sending ? 'Mengirim...' : currentInv?.status === 'sent' ? 'Kirim Ulang' : 'Kirim Tagihan'}
                </button>
              )}
            </div>
          </div>
          {currentInv?.paidAt && (
            <p style={{ color: 'var(--green)', fontSize: '0.82rem', marginTop: 10 }}>
              ✓ Dibayar pada {fmtDate(currentInv.paidAt)}
            </p>
          )}
        </div>

        {/* Invoice History */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Riwayat Tagihan</h2>
          {room.invoices.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Belum ada riwayat tagihan</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {room.invoices.map((inv: any, i: number) => {
                const cfg = STATUS_CFG[inv.status]
                const monthLabel = new Date(inv.periodMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                return (
                  <div key={inv.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', gap: 12,
                    borderBottom: i < room.invoices.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{monthLabel}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {inv.paidAt ? `Lunas: ${fmtDate(inv.paidAt)}` : `Jatuh tempo: ${fmtDate(inv.dueAt)}`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{fmtCurrency(inv.amount)}</span>
                      {cfg && <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {showEdit && <EditRoomModal room={room} onClose={() => setShowEdit(false)} onSaved={() => { setShowEdit(false); router.refresh() }} />}
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditRoomModal({ room, onClose, onSaved }: { room: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    roomName: room.roomName,
    rentAmount: String(room.rentAmount),
    dueDateDay: String(room.dueDateDay),
    tenantName: room.tenantName || '',
    tenantPhone: room.tenantPhone || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Gagal menyimpan'); return }
      onSaved()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Edit {room.roomName}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Nama Kamar</label>
              <input className="input" value={form.roomName} onChange={e => setForm({ ...form, roomName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Sewa/Bulan (Rp)</label>
              <input className="input" type="text" value={form.rentAmount} onChange={e => setForm({ ...form, rentAmount: 'Rp ' + e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') })} required />
            </div>
            <div className="form-group">
              <label className="label">Tgl Jatuh Tempo</label>
              <input className="input" type="number" min="1" max="28" value={form.dueDateDay} onChange={e => setForm({ ...form, dueDateDay: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Nama Penyewa</label>
              <input className="input" placeholder="(Kosongkan jika tidak ada)" value={form.tenantName} onChange={e => setForm({ ...form, tenantName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">WhatsApp Penyewa</label>
              <input className="input" placeholder="08xxxxxxxxx" value={form.tenantPhone} onChange={e => setForm({ ...form, tenantPhone: e.target.value })} />
            </div>
          </div>
          {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--red-dim)', color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? <Loader2 size={14} className="loading" /> : null}
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { Home, CheckCircle, CreditCard, Clock, Loader2 } from 'lucide-react'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function TagihanClient({ invoice }: { invoice: any }) {
  const [simulating, setSimulating] = useState(false)
  const [paid, setPaid] = useState(invoice.status === 'paid')

  const month = new Date(invoice.periodMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const dueDate = new Date(invoice.dueAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  const handleSimulatePaid = async () => {
    setSimulating(true)
    const res = await fetch(`/api/invoices/${invoice.token}/simulate-paid`, { method: 'POST' })
    if (res.ok) setPaid(true)
    setSimulating(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
          }}>
            <Home size={22} color="white" />
          </div>
          <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>KontrakanKoe</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>{invoice.room.owner.propertyName}</p>
        </div>

        {/* Invoice Card */}
        <div className="card" style={{ padding: 28 }}>
          {paid ? (
            /* PAID STATE */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <CheckCircle size={52} color="var(--green)" style={{ marginBottom: 14 }} />
              <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--green)' }}>Tagihan Sudah Lunas!</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9rem' }}>
                Terima kasih, {invoice.room.tenantName || 'Kak'}! 🙏
              </p>
              <div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p style={{ color: 'var(--green)', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ Sewa {invoice.room.roomName} — {month}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 4 }}>
                  {fmtCurrency(invoice.amount)}
                </p>
              </div>
            </div>
          ) : (
            /* UNPAID STATE */
            <>
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>TAGIHAN SEWA</p>
                <h2 style={{ fontWeight: 800, fontSize: '1.15rem' }}>Bulan {month}</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'Kamar', value: invoice.room.roomName },
                  { label: 'Penyewa', value: invoice.room.tenantName || '-' },
                  { label: 'Nominal', value: fmtCurrency(invoice.amount), highlight: true },
                  { label: 'Jatuh Tempo', value: dueDate },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.label}</span>
                    <span style={{ fontWeight: item.highlight ? 700 : 500, color: item.highlight ? 'var(--green)' : 'var(--text)', fontSize: item.highlight ? '1rem' : '0.875rem' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {invoice.mayarPaymentUrl && invoice.mayarPaymentUrl.startsWith('http') && (
                  <a href={invoice.mayarPaymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center', padding: 14, fontSize: '0.95rem' }}>
                    <CreditCard size={16} /> Bayar Sekarang via Mayar
                  </a>
                )}

                {/* Demo simulation button */}
                <button
                  onClick={handleSimulatePaid}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'center', fontSize: '0.8rem' }}
                  disabled={simulating}
                >
                  {simulating ? <Loader2 size={13} className="loading" /> : <Clock size={13} />}
                  {simulating ? 'Memproses...' : '🔧 Simulasi Bayar (Demo)'}
                </button>
              </div>

              <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Pembayaran diproses aman via Mayar
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

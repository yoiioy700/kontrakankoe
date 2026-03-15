'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  paid:    { label: 'Lunas',    cls: 'badge-lunas',    icon: <CheckCircle size={12} /> },
  sent:    { label: 'Terkirim', cls: 'badge-terkirim', icon: <Clock size={12} /> },
  pending: { label: 'Pending',  cls: 'badge-belum',    icon: <AlertCircle size={12} /> },
  expired: { label: 'Expired',  cls: 'badge-kosong',   icon: <AlertCircle size={12} /> },
}

export default function RiwayatClient({ invoices }: { invoices: any[] }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMonth, setFilterMonth] = useState('all')

  // Get unique months
  const months = useMemo(() => {
    const set = new Set(invoices.map(i => i.periodMonth))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [invoices])

  const filtered = invoices.filter(inv => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false
    if (filterMonth !== 'all' && inv.periodMonth !== filterMonth) return false
    return true
  })

  const totalPemasukan = filtered
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,13,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '0.825rem' }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <span style={{ fontWeight: 700 }}>Riwayat Pembayaran</span>
        </div>
      </nav>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Tagihan', value: filtered.length, color: 'var(--blue)' },
            { label: 'Sudah Lunas', value: filtered.filter(i => i.status === 'paid').length, color: 'var(--green)' },
            { label: 'Total Pemasukan', value: fmtCurrency(totalPemasukan), color: 'var(--green)', small: true },
          ].map(c => (
            <div key={c.label} className="card" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: c.small ? '1rem' : '1.7rem', fontWeight: 800, color: c.color }}>{c.value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 3 }}>{c.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <select className="input" style={{ width: 'auto', minWidth: 140 }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
            <option value="all">Semua Bulan</option>
            {months.map(m => {
              const label = new Date(m + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
              return <option key={m} value={m}>{label}</option>
            })}
          </select>
          <select className="input" style={{ width: 'auto', minWidth: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="paid">Lunas</option>
            <option value="sent">Terkirim</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Tidak ada data</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Kamar', 'Penyewa', 'Periode', 'Nominal', 'Status', 'Tgl Bayar'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => {
                    const cfg = STATUS_CFG[inv.status]
                    const monthLabel = new Date(inv.periodMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                    return (
                      <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          <Link href={`/dashboard/kamar/${inv.roomId}`} style={{ color: 'var(--blue)', textDecoration: 'none' }}>
                            {inv.room.roomName}
                          </Link>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{inv.room.tenantName || '-'}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{monthLabel}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: inv.status === 'paid' ? 'var(--green)' : 'var(--text)' }}>
                          {fmtCurrency(inv.amount)}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {cfg && <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                          {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

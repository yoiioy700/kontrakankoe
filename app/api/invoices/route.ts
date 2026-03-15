import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

function currentPeriod() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { roomId } = await req.json()

  const room = await prisma.room.findUnique({
    where: { id: roomId, ownerId: session.user.id },
    include: { owner: true },
  })
  if (!room) return NextResponse.json({ error: 'Kamar tidak ditemukan' }, { status: 404 })

  const period = currentPeriod()
  const token = uuidv4()

  // Calculate due date
  const now = new Date()
  const dueAt = new Date(now.getFullYear(), now.getMonth(), room.dueDateDay)
  if (dueAt < now) dueAt.setMonth(dueAt.getMonth() + 1)

  // If sent invoice already exists this period, reuse it
  const existingInv = await prisma.invoice.findFirst({
    where: { roomId, periodMonth: period, status: { in: ['sent', 'pending'] } },
  })

  let invoice
  let mayarUrl: string

  if (existingInv) {
    invoice = existingInv
    mayarUrl = existingInv.mayarPaymentUrl || `${process.env.NEXTAUTH_URL}/tagihan/${existingInv.token}`
  } else {
    const invoiceUrl = `${process.env.NEXTAUTH_URL}/tagihan/${token}`
    mayarUrl = invoiceUrl // fallback
    let mayarPaymentId: string | undefined

    if (process.env.MAYAR_API_KEY) {
      try {
        const month = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        const expiredAt = new Date(dueAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()

        const mayarRes = await fetch('https://api.mayar.id/hl/v1/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
          },
          body: JSON.stringify({
            name: `Sewa ${room.roomName} - ${room.tenantName || 'Penyewa'} ${month}`,
            amount: Math.round(room.rentAmount),
            mobile: room.tenantPhone?.replace(/\D/g, '') || '08000000000',
            email: room.owner.email,
            description: `Tagihan sewa ${room.roomName} bulan ${month}`,
            redirectURL: invoiceUrl,
            expiredAt,
          }),
        })

        if (mayarRes.ok) {
          const mayarData = await mayarRes.json()
          mayarUrl = mayarData?.data?.link || mayarData?.link || invoiceUrl
          mayarPaymentId = mayarData?.data?.id || mayarData?.id
        } else {
          const errText = await mayarRes.text()
          console.error('Mayar API error:', mayarRes.status, errText)
        }
      } catch (e) {
        console.error('Mayar request failed:', e)
      }
    }

    invoice = await prisma.invoice.create({
      data: {
        token,
        periodMonth: period,
        amount: room.rentAmount,
        status: 'sent',
        mayarPaymentId: mayarPaymentId || null,
        mayarPaymentUrl: mayarUrl,
        sentAt: new Date(),
        dueAt,
        roomId,
      },
    })
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
  const invoiceUrl = `${baseUrl}/tagihan/${invoice.token}`

  return NextResponse.json({
    success: true,
    invoiceUrl,
    paymentUrl: mayarUrl,
  })
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') || currentPeriod()

  const invoices = await prisma.invoice.findMany({
    where: {
      periodMonth: month,
      room: { ownerId: session.user.id },
    },
    include: { room: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(invoices)
}

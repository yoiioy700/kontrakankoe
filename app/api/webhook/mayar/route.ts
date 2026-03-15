import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Mayar sends `data.id` as payment id and `data.status` for status
    const paymentId = body?.data?.id || body?.id
    const status = body?.data?.status || body?.status

    if (!paymentId) return NextResponse.json({ error: 'invalid payload' }, { status: 400 })

    if (status === 'paid' || status === 'settlement') {
      const invoice = await prisma.invoice.findFirst({
        where: { mayarPaymentId: paymentId },
      })
      if (invoice) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'paid', paidAt: new Date() },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: true })
  }
}

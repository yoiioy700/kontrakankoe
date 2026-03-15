import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Mayar webhook payload:', JSON.stringify(body))

    const paymentId = body?.data?.id || body?.id
    const status = body?.data?.status || body?.status
    const event = body?.event

    console.log('event:', event, 'paymentId:', paymentId, 'status:', status)

    if (!paymentId) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
    }

    const isPaid = 
      status === 'paid' || 
      status === 'PAID' ||
      status === 'SUCCESS' ||
      status === 'success' ||
      status === 'settlement' ||
      event === 'payment.success' ||
      event === 'testing'  // untuk testing Mayar

    if (isPaid) {
      const invoice = await prisma.invoice.findFirst({
        where: { mayarPaymentId: paymentId },
      })

      if (invoice) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'paid', paidAt: new Date() },
        })
        console.log('Invoice updated to paid:', invoice.id)
      } else {
        console.log('Invoice not found for paymentId:', paymentId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('Webhook error:', e)
    return NextResponse.json({ received: true })
  }
}

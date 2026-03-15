import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Simulate paid — for demo only (could be password-protected in production)
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const invoice = await prisma.invoice.findUnique({ where: { token } })
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.invoice.update({
    where: { token },
    data: { status: 'paid', paidAt: new Date() },
  })

  return NextResponse.json({ success: true })
}

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { token },
    include: { room: { include: { owner: true } } },
  })

  if (!invoice) return NextResponse.json({ error: 'Tagihan tidak ditemukan' }, { status: 404 })
  return NextResponse.json(invoice)
}

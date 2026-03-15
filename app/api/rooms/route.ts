import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rooms = await prisma.room.findMany({
    where: { ownerId: session.user.id },
    include: { invoices: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(rooms)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { roomName, rentAmount, dueDateDay, tenantName, tenantPhone } = await req.json()

  if (!roomName || !rentAmount || !dueDateDay) {
    return NextResponse.json({ error: 'Nama kamar, sewa, dan jatuh tempo wajib diisi' }, { status: 400 })
  }

  const room = await prisma.room.create({
    data: {
      roomName,
      rentAmount: parseFloat(rentAmount),
      dueDateDay: parseInt(dueDateDay),
      tenantName: tenantName || null,
      tenantPhone: tenantPhone || null,
      status: tenantName ? 'occupied' : 'vacant',
      ownerId: session.user.id,
    },
  })

  return NextResponse.json(room)
}

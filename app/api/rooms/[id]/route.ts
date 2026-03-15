import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const room = await prisma.room.findUnique({
    where: { id, ownerId: session.user.id },
    include: { invoices: { orderBy: { createdAt: 'desc' } } },
  })
  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(room)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const { roomName, rentAmount, dueDateDay, tenantName, tenantPhone } = await req.json()

  const room = await prisma.room.update({
    where: { id, ownerId: session.user.id },
    data: {
      roomName,
      rentAmount: parseFloat(rentAmount),
      dueDateDay: parseInt(dueDateDay),
      tenantName: tenantName || null,
      tenantPhone: tenantPhone || null,
      status: tenantName ? 'occupied' : 'vacant',
    },
  })
  return NextResponse.json(room)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  await prisma.room.delete({ where: { id, ownerId: session.user.id } })
  return NextResponse.json({ success: true })
}

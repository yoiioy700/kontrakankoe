import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { propertyName, propertyAddress, room } = await req.json()

  // Save property info + mark onboarded
  await prisma.user.update({
    where: { id: session.user.id },
    data: { propertyName, propertyAddress, onboarded: true },
  })

  // Create first room
  await prisma.room.create({
    data: {
      roomName: room.roomName,
      rentAmount: parseFloat(room.rentAmount),
      dueDateDay: parseInt(room.dueDateDay),
      tenantName: room.tenantName || null,
      tenantPhone: room.tenantPhone || null,
      status: room.tenantName ? 'occupied' : 'vacant',
      ownerId: session.user.id,
    },
  })

  return NextResponse.json({ success: true })
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import KamarDetailClient from './KamarDetailClient'
import { notFound } from 'next/navigation'

export default async function KamarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const { id } = await params

  const room = await prisma.room.findUnique({
    where: { id, ownerId: session.user.id },
    include: {
      invoices: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!room) notFound()

  return <KamarDetailClient room={JSON.parse(JSON.stringify(room))} />
}

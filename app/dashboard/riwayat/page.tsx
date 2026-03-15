import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RiwayatClient from './RiwayatClient'

export default async function RiwayatPage() {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const invoices = await prisma.invoice.findMany({
    where: { room: { ownerId: session.user.id } },
    include: { room: true },
    orderBy: { createdAt: 'desc' },
  })

  return <RiwayatClient invoices={JSON.parse(JSON.stringify(invoices))} />
}

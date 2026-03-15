import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from './DashboardClient'
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.onboarded) redirect('/onboarding')

  const rooms = await prisma.room.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'asc' },
  })

  const currentPeriod = (() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })()

  const invoices = await prisma.invoice.findMany({
    where: {
      room: { ownerId: user.id },
      periodMonth: currentPeriod,
    },
  })

  return (
    <DashboardClient
      user={user}
      rooms={rooms}
      invoices={invoices}
    />
  )
}


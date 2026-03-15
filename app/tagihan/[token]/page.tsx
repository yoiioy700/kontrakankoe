import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TagihanClient from './TagihanClient'

export default async function TagihanPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { token },
    include: { room: { include: { owner: true } } },
  })

  if (!invoice) notFound()

  return <TagihanClient invoice={JSON.parse(JSON.stringify(invoice))} />
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Honey Batches - Honey Blockchain',
  description: 'Browse and verify authentic honey batches recorded on the blockchain for transparency and authenticity',
}

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
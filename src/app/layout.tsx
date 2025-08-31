import './globals.css'

export const metadata = {
  title: 'ChatSherlock - Your AI Conversation Detective',
  description: 'Search your ChatGPT conversations with detective-level precision. Never lose a brilliant insight again.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

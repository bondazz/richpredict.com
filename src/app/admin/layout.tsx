export const metadata = {
  title: 'Admin Dashboard | RichPredict',
  description: 'Administrative panel for managing predictions.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout-wrapper bg-zinc-950 text-white min-h-screen">
      {children}
    </div>
  )
}

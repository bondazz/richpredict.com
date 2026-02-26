"use client";
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      {!isLoginPage && <Sidebar />}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}

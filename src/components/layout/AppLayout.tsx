import Sidebar from './sidebar'
import MobileNav from './MobileNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className='md:ml-60 min-h-screen'>
                <div className="px-4 md:px-8 py-6 pb-24 md:pb-8">
                    {children}
                </div>
            </main>

            <MobileNav />
        </div>
        </>
    )
}
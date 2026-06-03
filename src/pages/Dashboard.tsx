import AppLayout from '@/components/layout/AppLayout'

export default function Dashboard() {
    return (
        <>
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h2 className='text-xl font-bold text-white'> Dashboard </h2>
                    <p className='text-zinc-400 text-sm mt-1'>Your financial overview</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {['Monthly Obligations', 'Salary Committed', 'Active Installments', 'Health Score'].map(label => (
                        <div key={label} className='bg-zinc-900 border border-zinc-800 rounded-xl p-4'> 
                            <p className='text-zinc-500 text-xs'>{label}</p>
                            <p className='text-white text-xl font-bold mt-1'>-</p>
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-64 flex items-center justify-center">
                    <p className="text-zinc-600 text-sm">Overlap chart coming soon</p>
                </div>
            </div>  
        </AppLayout>
        </>
    )
}
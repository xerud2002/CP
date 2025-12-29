import Link from 'next/link';

export default function TransportNotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Rută negăsită
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Ne pare rău, dar această rută de transport nu există. 
          Verifică rutele disponibile sau creează o comandă nouă.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/comanda"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
          >
            Creează comandă
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-white/10 transition-all"
          >
            Înapoi acasă
          </Link>
        </div>
      </div>
    </div>
  );
}

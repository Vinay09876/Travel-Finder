import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function DestinationNotFound() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Destination not found</h2>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        We couldn&apos;t find the destination you&apos;re looking for. It may have been removed, or the link might be incorrect.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
      >
        Go Home
      </Link>
    </div>
  );
}

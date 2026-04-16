import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold">ExpiryGuard</span>
        </Link>
        {children}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Shield, Bell, Users, ScanLine, BarChart3, QrCode } from "lucide-react";

const features = [
  { icon: Shield, title: "Track Everything", desc: "Passports, licenses, insurance, warranties, subscriptions — all in one place." },
  { icon: Bell, title: "Smart Reminders", desc: "Get email alerts at 30, 7, and 1 day before expiry. Never miss a deadline." },
  { icon: ScanLine, title: "OCR Scanning", desc: "Snap a photo of any receipt or document. We'll extract the expiry date automatically." },
  { icon: Users, title: "Family Sharing", desc: "Track documents for your entire family — spouse, kids, and parents." },
  { icon: BarChart3, title: "Analytics", desc: "Visual dashboard showing what's expiring when, by category and family member." },
  { icon: QrCode, title: "Emergency Card", desc: "Generate a QR code with critical document info for emergencies." },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold">ExpiryGuard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-20 px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Never Miss an
            <span className="text-indigo-600"> Expiry Date</span> Again
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Track your passports, licenses, insurance policies, warranties, and subscriptions.
            Get smart reminders before they expire. Keep your family covered.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              Start Tracking Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border bg-gray-50 hover:shadow-md transition-shadow">
                <f.icon className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ExpiryGuard. Built for your peace of mind.
      </footer>
    </div>
  );
}

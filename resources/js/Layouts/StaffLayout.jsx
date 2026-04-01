import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function StaffLayoutContent({ children }) {
  const { user } = useAuth();

  const navLink = (href, label, active = false) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
        active
          ? 'bg-slate-900 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    router.visit(route('staff.dashboard'));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Navbar */}
      <nav className="bg-slate-800 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Left */}
            <div className="flex items-center">
              <span className="font-bold text-xl tracking-wider">
                OptiManager
                <span className="text-blue-400 text-sm ml-2">
                  Staff Portal
                </span>
              </span>

              {/* Menu */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navLink(route('staff.dashboard'), 'Dashboard', route().current('staff.dashboard'))}
                  {navLink(route('staff.billing.create'), 'Create Billing', route().current('staff.billing.create'))}
                  {navLink(route('staff.billing.view'), 'View Billing', route().current('staff.billing.view'))}
                  {navLink(route('staff.find-billing'), 'Find Billing', route().current('staff.find-billing'))}
                  {navLink(route('staff.update-billing'), 'Update Billing', route().current('staff.update-billing'))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  onClick={goBack}
                  className="mr-3 inline-flex items-center rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </button>

                <span className="text-sm text-slate-300 mr-4">
                  Welcome back, {user?.name?.split(" ")[0] || 'Staff'}
                </span>

                {/* Logout */}
                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-700 hover:text-red-300 transition"
                >
                  Log Out
                </Link>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto  px-4 py-6">
        {children}
      </main>
    </div>
  );
}

export default function StaffLayout({ children }) {
  return (
    <AuthProvider>
      <StaffLayoutContent>{children}</StaffLayoutContent>
    </AuthProvider>
  );
}

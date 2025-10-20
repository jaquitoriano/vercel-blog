'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import '@/styles/admin.css';

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  
  if (isLoginPage) {
    return <div className="admin-panel">{children}</div>;
  }
  
  // Extract page title from pathname for breadcrumb display
  const getPageInfo = () => {
    const path = pathname.split('/').filter(Boolean);
    const section = path[1] ? path[1].charAt(0).toUpperCase() + path[1].slice(1) : 'Dashboard';
    const isSubPage = path.length > 2;
    const subSection = isSubPage ? path[2].charAt(0).toUpperCase() + path[2].slice(1) : null;
    
    return { section, subSection, isSubPage };
  };
  
  const { section, subSection, isSubPage } = getPageInfo();
  
  return (
    <div className="flex min-h-screen bg-zinc-100 admin-panel">
      <AdminSidebar />
      <div className="flex-1 flex flex-col admin-panel">
        <AdminHeader />
        
        {/* Breadcrumb navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-2.5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="/admin/dashboard" className="text-gray-500 hover:text-pink-500 transition-colors">
                  Admin
                </a>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <a 
                  href={`/admin/${section.toLowerCase()}`}
                  className={`ml-1 ${!isSubPage ? 'text-pink-500 font-medium' : 'text-gray-500 hover:text-pink-500 transition-colors'}`}
                >
                  {section}
                </a>
              </li>
              {isSubPage && (
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="ml-1 text-pink-500 font-medium">{subSection}</span>
                </li>
              )}
            </ol>
          </nav>
        </div>
        
        {/* Main content area with improved styling */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="rounded-lg overflow-hidden">
            {children}
          </div>
        </main>
        
        {/* Footer with version info */}
        <footer className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Your Blog Name. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Admin v1.0.0
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AuthStatus() {
  // Since we're in a client component, we can't directly use the auth function
  // So we'll mock the user data for now
  const [user, setUser] = useState({ name: 'Admin', email: 'admin@example.com' });
  
  return (
    <div className="flex flex-col items-end">
      <div className="text-sm font-medium">
        Logged in as {user.email}
      </div>
      <Link 
        href="/admin/logout"
        className="text-sm text-primary hover:underline"
      >
        Sign out
      </Link>
    </div>
  );
}
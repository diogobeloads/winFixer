import React from 'react';
import Header from '@/components/Header';

const AdminPage = () => {
  return (
    <div>
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="mt-4">
          <h2 className="text-xl">Overview</h2>
          <p>Manage errors, fixes, and other administrative tasks.</p>
        </div>
        <div className="mt-6">
          <h2 className="text-lg">Quick Links</h2>
          <ul className="list-disc pl-5">
            <li>
              <a href="/admin/errors" className="text-blue-500 hover:underline">
                Manage Errors
              </a>
            </li>
            <li>
              <a href="/admin/fixes" className="text-blue-500 hover:underline">
                Manage Fixes
              </a>
            </li>
            <li>
              <a href="/admin/evidence" className="text-blue-500 hover:underline">
                Manage Evidence
              </a>
            </li>
            <li>
              <a href="/admin/tests" className="text-blue-500 hover:underline">
                Manage Tests
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
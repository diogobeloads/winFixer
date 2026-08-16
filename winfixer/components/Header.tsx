import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">WinFixer</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="hover:underline">Home</a>
                    </li>
                    <li>
                        <a href="/search" className="hover:underline">Search</a>
                    </li>
                    <li>
                        <a href="/login" className="hover:underline">Login</a>
                    </li>
                    <li>
                        <a href="/admin" className="hover:underline">Admin</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
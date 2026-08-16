import React from 'react';
import Header from '../components/Header';
import './globals.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="PT-BR">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
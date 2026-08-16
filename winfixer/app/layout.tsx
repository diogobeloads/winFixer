import React from 'react';
import Header from '../components/Header';
import '../globals.css';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
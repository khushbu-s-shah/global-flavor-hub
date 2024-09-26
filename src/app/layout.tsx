import './globals.css';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import Header from './components/Header';

interface LayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="min-h-screen bg-gray-100 border-2 border-gray-300">
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;

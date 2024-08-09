import "./globals.css";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";


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
            {children}

            <footer className='bg-gray-800 text-white py-4'>
              <div className='container mx-auto text-center'>
                <p>Developed for  Global Flavor</p>
            </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;

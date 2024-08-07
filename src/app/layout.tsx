//import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";


interface LayoutProps {
  children: ReactNode;
} 

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    
    // Clerk Provider and Layout wrapper for Authentication 
    <ClerkProvider>
        <html lang="en">
        <body>  
          <div className="min-h-screen"> 
          <Header/>
          {children}
          </div> 
        </body>
      </html>
   </ClerkProvider>
 );

};

export default RootLayout;

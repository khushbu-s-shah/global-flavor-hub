//import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";


interface LayoutProps {
  children: ReactNode;
}

//const inter = Inter({ subsets: ['latin'] });

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;

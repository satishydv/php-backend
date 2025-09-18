'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import Footer from "@/components/Home/Footer/Footer";
import FloatingSocialBar from "@/components/Helper/FloatingSocialBar";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // If on login page, only render children (no nav, footer, or social bar)
  if (pathname === '/login' || pathname === '/login/') {
    return <>{children}</>;
  }
  
  // If on admin pages, render nav but no footer or social bar
  if (pathname.startsWith('/admin')) {
    return (
      <>
        {/* <ResponsiveNav/> */}
        {children}
      </>
    );
  }
  
  // For all other pages, render the full layout with nav, footer, and social bar
  return (
    <>
      <ResponsiveNav/>
      {children}
      <Footer/>
      <FloatingSocialBar/>
    </>
  );
}

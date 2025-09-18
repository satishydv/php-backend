'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { FcGallery } from "react-icons/fc";
import { MdReviews } from "react-icons/md";
import { TfiLayoutSlider } from "react-icons/tfi";
import { 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut,
  User
} from "lucide-react";
import Logo from '@/components/Helper/Logo';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    description: "Overview and analytics"
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: <FcGallery className="h-5 w-5" />,
    description: "Manage gallery images"
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: <MdReviews className="h-5 w-5" />,
    description: "Manage customer reviews"
  },
  {
    title: "Hero Slider",
    href: "/admin/hero-slider",
    icon: <TfiLayoutSlider className="h-5 w-5" />,
    description: "Manage hero section slider"
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        
        // Fetch user information
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
          const response = await fetch(`${apiUrl}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    checkAuthAndFetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="p-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-2">
                      {sidebarItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`group flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                            pathname === item.href
                              ? 'bg-orange-500 text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span className={`transition-colors duration-200 ${
                            pathname === item.href 
                              ? 'text-white' 
                              : 'text-gray-500 group-hover:text-gray-700'
                          }`}>
                            {item.icon}
                          </span>
                          <div className="flex-1">
                            <span className="block">{item.title}</span>
                            {item.description && (
                              <span className={`block text-xs mt-0.5 ${
                                pathname === item.href 
                                  ? 'text-orange-100' 
                                  : 'text-gray-400 group-hover:text-gray-500'
                              }`}>
                                {item.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </nav>
                  </ScrollArea>
                  <div className="p-3 border-t">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start space-x-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user ? user.username : 'Admin'}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Content */}
      <main className="lg:hidden pt-16">
        {children}
      </main>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-7 border-b border-gray-300">
            <Logo />
            {/* <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your website</p> */}
          </div>

          {/* Sidebar Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className={`transition-colors duration-200 ${
                    pathname === item.href 
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <span className="block">{item.title}</span>
                    {item.description && (
                      <span className={`block text-xs mt-0.5 ${
                        pathname === item.href 
                          ? 'text-orange-100' 
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user ? user.username : 'Loading...'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start space-x-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

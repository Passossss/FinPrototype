import { useState, useRef, useEffect } from "react";
import { Bell, User, Search, Sun, Moon, Settings, LogOut, LogIn, UserPlus, KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import finLogo from "figma:asset/cb6e84f9267ba7d9df65b2df986e7030850c04ce.png";

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onPageChange: (page: string) => void;
}

// Ícone de três barrinhas customizado
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export function Header({ isDark, onThemeToggle, isSidebarCollapsed, onSidebarToggle, onPageChange }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-gray-100 dark:bg-gray-800 h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="lg:hidden"
        >
          <MenuIcon />
        </Button>
        
        <div className="flex items-center gap-3">
          <img src={finLogo} alt="Fin" className="w-10 h-10" />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        {isSearchOpen && (
          <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
            <Input
              placeholder="Pesquisar..."
              className="w-64"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        )}
        
        {!isSearchOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
        
        <div className="relative" ref={dropdownRef}>
          <button 
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={finLogo} alt="Profile" className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-[100] py-1">
              <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                Menu do usuário
              </div>
              
              <button
                onClick={() => {
                  onPageChange('config');
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </button>
              
              <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
              
              <button
                onClick={() => {
                  onPageChange('login');
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </button>
              
              <button
                onClick={() => {
                  onPageChange('create-account');
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Conta
              </button>
              
              <button
                onClick={() => {
                  onPageChange('forgot-password');
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Esqueceu a Senha
              </button>
              
              <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
              
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
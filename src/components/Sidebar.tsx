import { useState } from "react";
import { Home, Users, Tag, DollarSign, BarChart3, CreditCard, Pin, Grip, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  isPinned: boolean;
}

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ currentPage, onPageChange, isCollapsed, onCollapsedChange }: SidebarProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "dashboard", label: "Dashboard", icon: Home, isPinned: true },
    { id: "transactions", label: "Transações", icon: DollarSign, isPinned: true },
    { id: "categories", label: "Categorias", icon: Tag, isPinned: true },
    { id: "users", label: "Usuários", icon: Users, isPinned: false },
    { id: "reports", label: "Relatórios", icon: BarChart3, isPinned: false },
    { id: "cards", label: "Cartões", icon: CreditCard, isPinned: false },
  ]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const pinnedItems = menuItems.filter(item => item.isPinned);
  const unpinnedItems = menuItems.filter(item => !item.isPinned);

  const togglePin = (itemId: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSection: 'pinned' | 'unpinned') => {
    e.preventDefault();
    if (draggedItem) {
      setMenuItems(items =>
        items.map(item =>
          item.id === draggedItem
            ? { ...item, isPinned: targetSection === 'pinned' }
            : item
        )
      );
      setDraggedItem(null);
    }
  };

  const MenuItemComponent = ({ item }: { item: MenuItem }) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;
    const isDragging = draggedItem === item.id;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        className={`group relative ${isDragging ? 'opacity-50' : ''}`}
      >
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start gap-3 pr-8 ${
            isActive
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          } ${isCollapsed ? 'px-2' : ''}`}
          onClick={() => onPageChange(item.id)}
          title={isCollapsed ? item.label : undefined}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </Button>
        
        {!isCollapsed && (
          <>
            <Grip className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-grab" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => togglePin(item.id)}
            >
              <Pin className={`h-3 w-3 ${item.isPinned ? 'text-primary' : 'text-gray-400'}`} />
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <aside className={`fixed left-0 top-16 bottom-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-gray-100 dark:bg-gray-800 transition-all duration-300 z-40`}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Toggle Button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCollapsedChange(!isCollapsed)}
              className="p-1 h-8 w-8"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Pinned Items */}
          <div
            className="space-y-2 mb-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'pinned')}
          >
            {!isCollapsed && (
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">
                PINNED
              </div>
            )}
            {pinnedItems.map((item) => (
              <MenuItemComponent key={item.id} item={item} />
            ))}
          </div>

          {unpinnedItems.length > 0 && (
            <>
              <Separator className="my-4" />
              
              {/* Unpinned Items */}
              <div
                className="space-y-2"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'unpinned')}
              >
                {!isCollapsed && (
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">
                    NOT USED
                  </div>
                )}
                {unpinnedItems.map((item) => (
                  <MenuItemComponent key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
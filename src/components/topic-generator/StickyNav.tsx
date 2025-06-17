
import React from 'react';

interface NavItem {
  id: string;
  label: string;
}

interface StickyNavProps {
  navItems: NavItem[];
  activeTab: string;
  onNavLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const StickyNav: React.FC<StickyNavProps> = ({
  navItems,
  activeTab,
  onNavLinkClick
}) => {
  return (
    <div className="sticky top-0 bg-background z-50 border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => onNavLinkClick(e, item.id)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === item.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default StickyNav;

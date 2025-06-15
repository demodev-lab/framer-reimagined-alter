
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

const StickyNav: React.FC<StickyNavProps> = ({ navItems, activeTab, onNavLinkClick }) => {
  return (
    <div className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-sm py-4 flex justify-center mb-12">
      <div className="p-1 bg-muted rounded-full flex items-center space-x-1 shadow-sm border">
        {navItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={e => onNavLinkClick(e, item.id)}
            className={`text-sm font-medium px-5 py-1.5 rounded-full transition-all duration-200 ${
              activeTab === item.id ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default StickyNav;

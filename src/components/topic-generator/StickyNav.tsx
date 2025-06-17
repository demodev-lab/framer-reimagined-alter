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
  return <div className="sticky top-0 bg-background z-50 border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map(item => {})}
        </div>
      </nav>
    </div>;
};
export default StickyNav;
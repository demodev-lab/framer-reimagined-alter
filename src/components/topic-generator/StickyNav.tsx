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
  return;
};
export default StickyNav;
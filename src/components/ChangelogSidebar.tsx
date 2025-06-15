
import React from 'react';
import { changelogData } from '@/data/changelogData';

const ChangelogSidebar = () => {
  const years = Object.keys(changelogData).sort((a, b) => Number(b) - Number(a));

  return (
    <aside className="sticky top-28 h-full w-48 hidden lg:block pr-8">
      <nav>
        <ul>
          {years.map(year => (
            <li key={year} className="mb-4">
              <h3 className="text-lg font-bold text-foreground mb-2">{year}</h3>
              <ul>
                {Object.keys(changelogData[year]).map(month => (
                  <li key={`${year}-${month}`}>
                    <a 
                      href={`#${year}-${month}`} 
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {month}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ChangelogSidebar;

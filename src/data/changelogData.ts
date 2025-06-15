
export type ChangelogEntryType = {
  id: number;
  type: 'New' | 'Improvement' | 'Fix';
  version: string;
  title: string;
  description: string;
};

export type ChangelogData = {
  [year: string]: {
    [month: string]: ChangelogEntryType[];
  };
};

export const changelogData: ChangelogData = {
  "2024": {
    "June": [
      {
        id: 1,
        type: "New",
        version: "3.2.0",
        title: "AI-Powered Content Generation",
        description: "Generate high-quality content instantly with our new AI assistant. Perfect for blog posts, social media, and more."
      },
      {
        id: 2,
        type: "Improvement",
        version: "3.1.5",
        title: "Dashboard UI Refresh",
        description: "We've updated the main dashboard with a cleaner look, improved navigation, and faster load times."
      }
    ],
    "May": [
      {
        id: 3,
        type: "Fix",
        version: "3.1.4",
        title: "Resolved Authentication Bug",
        description: "Fixed a critical bug where users were occasionally logged out. Your sessions are now more stable."
      },
      {
        id: 4,
        type: "Improvement",
        version: "3.1.3",
        title: "Enhanced API Rate Limits",
        description: "We've increased the API rate limits for all plans to better support high-traffic applications."
      }
    ]
  },
  "2023": {
    "December": [
      {
        id: 5,
        type: "New",
        version: "3.0.0",
        title: "Launch of Alter 3.0",
        description: "The next generation of Alter is here! Featuring a complete redesign, new collaboration tools, and advanced analytics."
      }
    ]
  }
};

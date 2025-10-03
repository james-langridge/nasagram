// Immutable rover profile data
// Each rover gets an Instagram-like profile

export interface RoverProfile {
  readonly id: string;
  readonly username: string;
  readonly displayName: string;
  readonly bio: string;
  readonly verified: boolean;
  readonly avatar: string;
  readonly stats: {
    readonly posts: string;
    readonly followers: string;
    readonly following: string;
  };
  readonly landingDate: string;
  readonly location: string;
  readonly status: "active" | "complete";
}

export const ROVER_PROFILES: Record<string, RoverProfile> = {
  curiosity: {
    id: "curiosity",
    username: "@curiosity_rover",
    displayName: "Curiosity",
    bio: "Exploring Mars since 2012 🔴 | Gale Crater | Nuclear-powered explorer",
    verified: true,
    avatar: "/rovers/curiosity-avatar.jpg",
    stats: {
      posts: "600K+",
      followers: "2.3M",
      following: "3",
    },
    landingDate: "2012-08-06",
    location: "Gale Crater",
    status: "active",
  },
  perseverance: {
    id: "perseverance",
    username: "@perseverance",
    displayName: "Perseverance",
    bio: "Latest Mars explorer 🚁 | Jezero Crater | Looking for ancient life",
    verified: true,
    avatar: "/rovers/perseverance-avatar.jpg",
    stats: {
      posts: "200K+",
      followers: "1.8M",
      following: "4",
    },
    landingDate: "2021-02-18",
    location: "Jezero Crater",
    status: "active",
  },
  opportunity: {
    id: "opportunity",
    username: "@opportunity_rover",
    displayName: "Opportunity",
    bio: "Mars explorer 2004-2018 ⭐ | Meridiani Planum | 15-year mission complete",
    verified: true,
    avatar: "/rovers/opportunity-avatar.jpg",
    stats: {
      posts: "180K+",
      followers: "1.5M",
      following: "2",
    },
    landingDate: "2004-01-25",
    location: "Meridiani Planum",
    status: "complete",
  },
  spirit: {
    id: "spirit",
    username: "@spirit_rover",
    displayName: "Spirit",
    bio: "Mars explorer 2004-2010 ⭐ | Gusev Crater | Twin of Opportunity",
    verified: true,
    avatar: "/rovers/spirit-avatar.jpg",
    stats: {
      posts: "124K+",
      followers: "1.2M",
      following: "2",
    },
    landingDate: "2004-01-04",
    location: "Gusev Crater",
    status: "complete",
  },
} as const;

export const ACTIVE_ROVERS = Object.values(ROVER_PROFILES).filter(
  (rover) => rover.status === "active",
);

export const ALL_ROVERS = Object.values(ROVER_PROFILES);

// Type guard for valid rover IDs
export function isValidRoverId(id: string): id is keyof typeof ROVER_PROFILES {
  return id in ROVER_PROFILES;
}

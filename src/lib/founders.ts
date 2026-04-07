export type Founder = {
  name: string;
  image: string;
  major: string;
  role: string;
  factLabel: string;
  factValue: string;
  factHref: string;
};

export const FOUNDERS: Record<string, Founder> = {
  maaj: {
    name: "Maaj",
    image: "/rpm/maaj.jpeg",
    major: "CS / Pre-Med",
    role: "Product Design · R&D · Brand Design",
    factLabel: "Favorite candy",
    factValue: "Coffee Crisp",
    factHref: "https://en.wikipedia.org/wiki/Coffee_Crisp",
  },
  sim: {
    name: "Sim",
    image: "/rpm/sim.jpeg",
    major: "CS",
    role: "Technical Lead · Moment Maker",
    factLabel: "Favorite playlist",
    factValue: "RapCaviar",
    factHref: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
  },
  pop: {
    name: "Pop",
    image: "/rpm/pop.jpeg",
    major: "MechE",
    role: "Lead Operations · Management · Logistics",
    factLabel: "Favorite genre",
    factValue: "Country",
    factHref: "https://open.spotify.com/artist/4oUHIQIBe0LHzYfvXNW4QM",
  },
  mirr: {
    name: "Mirr",
    image: "/rpm/mirr.png",
    major: "Finance",
    role: "Lead Logistics · Rick Rubin",
    factLabel: "Most listened to",
    factValue: "2slimey",
    factHref: "https://open.spotify.com/search/2slimey",
  },
};

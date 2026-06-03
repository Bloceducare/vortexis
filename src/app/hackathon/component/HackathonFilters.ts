import { useState, useMemo } from "react";

export const useHackathonFilters = (hackathons: any[]) => {
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [prizeFilter, setPrizeFilter] = useState("all");

  const filteredHackathons = useMemo(() => {
    const now = new Date();
    const hackathonList = Array.isArray(hackathons) ? hackathons : [];
    let filtered = hackathonList.filter(
      (h: any) =>
        h.title.toLowerCase().includes(searchQuery) ||
        h.venue.toLowerCase().includes(searchQuery)
    );

    if (selectedCountry) {
      filtered = filtered.filter(
        (h: any) => h.country?.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    if (prizeFilter !== "all") {
      if (prizeFilter === "under5k") {
        filtered = filtered.filter((h: any) => h.grand_prize < 5000);
      } else if (prizeFilter === "5kto10k") {
        filtered = filtered.filter(
          (h: any) => h.grand_prize >= 5000 && h.grand_prize <= 10000
        );
      } else if (prizeFilter === "over10k") {
        filtered = filtered.filter((h: any) => h.grand_prize > 10000);
      }
    }

    switch (sortOption) {
      case "newest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "upcoming":
        filtered = filtered.filter((h: any) => new Date(h.start_date) > now);
        break;
      case "active":
        filtered = filtered.filter(
          (h: any) =>
            new Date(h.start_date) <= now && new Date(h.end_date) >= now
        );
        break;
      case "finished":
        filtered = filtered.filter((h: any) => new Date(h.end_date) < now);
        break;
    }

    return filtered;
  }, [hackathons, sortOption, searchQuery, selectedCountry, prizeFilter]);

  return {
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    prizeFilter,
    setPrizeFilter,
    filteredHackathons,
  };
};
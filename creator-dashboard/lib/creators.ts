export type Creator = {
  id: number;
  name: string;
  followers: number;
  revenue: number;
  active: boolean;
  createdAt: string;
};

export const creators: Creator[] = [
  { id: 1, name: "Aman", followers: 1200, revenue: 4500, active: true, createdAt: "2025-01-10" },
  { id: 2, name: "Riya", followers: 540, revenue: 0, active: false, createdAt: "2025-01-12" },
  { id: 3, name: "Karan", followers: 9800, revenue: 12000, active: true, createdAt: "2025-01-21" },
  { id: 4, name: "Neha", followers: 9800, revenue: 2000, active: true, createdAt: "2025-02-02" }
];

export function filterCreators(
  data: Creator[],
  search: string,
  activeOnly: boolean
): Creator[] {
  return data.filter((creator) => {
    const matchesSearch = creator.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesActive = !activeOnly || creator.active;

    return matchesSearch && matchesActive;
  });
}

export type SortClass = "followers" | "revenue";
export type SortDir = "asc" | "desc";

export function sortCreators(
  data: Creator[],
  field: "followers" | "revenue",
  direction: "asc" | "desc"
): Creator[] {
  const copiedData = [...data];
  copiedData.sort((a, b) => {
    let valueA: number;
    let valueB: number;
    if (field === "followers") {
      valueA = a.followers;
      valueB = b.followers;
    } else {
      valueA = a.revenue;
      valueB = b.revenue;
    }

    if (valueA > valueB) {
      return direction === "asc" ? 1 : -1;
    }

    if (valueA < valueB) {
      return direction === "asc" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return copiedData;
}


export function calculateMetrics(data: Creator[]) {
  const totalCreators = data.length;
  const activeCreators = data.filter((c) => c.active);
  const totalRevenue = data.reduce((sum,c) => sum + c.revenue , 0);

  const avgRevenuePerActive =
    activeCreators.length === 0
      ? 0
      : totalRevenue / activeCreators.length;

  return {
    totalCreators,
    activeCount: activeCreators.length,
    totalRevenue,
    avgRevenuePerActive
  };
}


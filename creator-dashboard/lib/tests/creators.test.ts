import {
  creators,
  sortCreators,
  filterCreators,
  calculateMetrics
} from "@/lib/creators";

describe("Sorting Logic", () => {

  test("sort followers ascending full order", () => {
    const result = sortCreators(creators, "followers", "asc");

    const names = result.map(c => c.name);

    expect(names).toEqual([
      "Riya",   
      "Aman",   
      "Karan",  
      "Neha"    
    ]);
  });

  test("sort followers descending full order", () => {
    const result = sortCreators(creators, "followers", "desc");

    const names = result.map(c => c.name);

    expect(names).toEqual([
      "Karan",
      "Neha",     
      "Aman",   
      "Riya"    
    ]);
  });

  test("sort revenue ascending full order", () => {
    const result = sortCreators(creators, "revenue", "asc");

    const names = result.map(c => c.name);

    expect(names).toEqual([
      "Riya",   
      "Neha",   
      "Aman",   
      "Karan"   
    ]);
  });

  test("sort revenue descending full order", () => {
    const result = sortCreators(creators, "revenue", "desc");

    const names = result.map(c => c.name);

    expect(names).toEqual([
      "Karan",
      "Aman",
      "Neha",
      "Riya"
    ]);
  });

  test("stable tie case by name", () => {
    const result = sortCreators(creators, "followers", "asc");
    const tied = result.filter(c => c.followers === 9800);

    expect(tied.map(c => c.name)).toEqual(["Karan", "Neha"]);
  });


});

describe("Filtering Logic", () => {


  test("active only filter", () => {
    const result = filterCreators(creators, "", true);

    const names = result.map(c => c.name);

    expect(names).toEqual(["Aman", "Karan", "Neha"]);
  });

  test("search + active together", () => {
    const result = filterCreators(creators, "ka", true);

    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Karan");
  });

  test("no match returns empty array", () => {
    const result = filterCreators(creators, "xyz", false);
    expect(result.length).toBe(0);
  });

});

describe("Metrics Logic", () => {

  test("calculate correct metrics", () => {
    const result = calculateMetrics(creators);

    expect(result.totalCreators).toBe(4);
    expect(result.activeCount).toBe(3);
    expect(result.totalRevenue).toBe(18500);
    expect(result.avgRevenuePerActive).toBeCloseTo(18500 / 3);
  });

  test("empty dataset metrics", () => {
    const result = calculateMetrics([]);

    expect(result.totalCreators).toBe(0);
    expect(result.activeCount).toBe(0);
    expect(result.totalRevenue).toBe(0);
    expect(result.avgRevenuePerActive).toBe(0);
  });

});

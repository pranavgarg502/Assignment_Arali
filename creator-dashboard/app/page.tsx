"use client";

import { useMemo, useState } from "react";
import {
  creators,
  sortCreators,
  filterCreators,
  calculateMetrics
} from "@/lib/creators";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [sortField, setSortField] =
    useState<"followers" | "revenue">("followers");
  const [direction, setDirection] =
    useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    return filterCreators(creators, search, activeOnly);
  }, [search, activeOnly]);

  const sorted = useMemo(() => {
    return sortCreators(filtered, sortField, direction);
  }, [filtered, sortField, direction]);

  const metrics = useMemo(() => {
    return calculateMetrics(sorted);
  }, [sorted]);

  const toggleSort = (field: "followers" | "revenue") => {
    if (field === sortField) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setDirection("asc");
    }
  };

  const renderSortIcon = (field: "followers" | "revenue") => {
    if (field !== sortField) return null;
    return direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="min-h-screen bg-muted/40 p-8 space-y-8">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold ">
          Creator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage creators, analyze revenue, and track performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Total Creators</p>
            <p className="text-2xl font-semibold">
              {metrics.totalCreators}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Active Creators</p>
            <p className="text-2xl font-semibold">
              {metrics.activeCount}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-semibold">
              ₹{metrics.totalRevenue}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              Avg Revenue / Active
            </p>
            <p className="text-2xl font-semibold">
              ₹{metrics.avgRevenuePerActive.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <Input
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:max-w-sm"
          />

          <div className="flex items-center gap-3">
            <Switch
              checked={activeOnly}
              onCheckedChange={setActiveOnly}
            />
            <span className="text-sm font-medium">
              Show active only
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">

          {sorted.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-lg font-medium">
                No creators found
              </p>
              <p className="text-muted-foreground text-sm">
                Try adjusting search or filters.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("followers")}
                      className="p-0 font-semibold"
                    >
                      Followers {renderSortIcon("followers")}
                    </Button>
                  </TableHead>

                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("revenue")}
                      className="p-0 font-semibold"
                    >
                      Revenue {renderSortIcon("revenue")}
                    </Button>
                  </TableHead>

                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sorted.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.name}
                    </TableCell>

                    <TableCell>
                      {c.followers.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      ₹{c.revenue.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <p className={c.active ? "text-green-600" : "text-gray-500"}>
                        {c.active ? "Active" : "Inactive"}
                      </p>
                    </TableCell>

                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

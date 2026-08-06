import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Input from "@/components/ui/input/Input";
import ProblemTable from "@/components/ui/career/ProblemTable";
import FilterPanel from "@/components/ui/collaboration/FilterPanel";
import PageHeader from "@/components/ui/layout/PageHeader";
import { queryCodingProblems, type CodingProblem } from "@/services/problems";

export default function Catalog() {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true);
        const data = await queryCodingProblems();
        setProblems(data);
      } catch {
        toast.error("Failed to query coding problems.");
      } finally {
        setLoading(false);
      }
    }
    void loadProblems();
  }, []);

  const difficulties = ["ALL", "Easy", "Medium", "Hard"];

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === "ALL" || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading problem catalog matrices...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        <PageHeader
          title="LeetCode Challenges Sandbox"
          subtitle="Hone your data structures and algorithms capability. Filter by difficulty, browse editorial solutions, and inspect metrics."
        />

        {/* Daily Challenge */}
        <Card variant="glass" className="p-5 border-cyan-500/20 bg-cyan-500/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative">
            <div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded font-extrabold uppercase select-none">
                Daily Coding Challenge
              </span>
              <h3 className="text-sm font-bold text-white mt-2">Two Sum — Hash Map Optimization</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xl mt-1">
                Solve the daily query task, maintain your solving streak score, and earn verified points towards recruiting targets.
              </p>
            </div>
            <a href="/coding/problems/1" className="shrink-0 self-start sm:self-auto">
              <button className="text-xs py-2 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-blue-500">
                Solve Challenge
              </button>
            </a>
          </div>
        </Card>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search problem title or topic tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <FilterPanel
            categories={difficulties}
            selectedCategory={selectedDifficulty}
            onSelectCategory={setSelectedDifficulty}
            title="Filter by Difficulty"
          />
        </div>

        {/* Catalog Table */}
        <ProblemTable problems={filteredProblems} />

      </div>
    </DashboardLayout>
  );
}

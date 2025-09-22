import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, MapPin, Users } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  constituency: string;
  type: "MLA" | "MP";
  reportsCount: number;
  resolvedCount: number;
  score: number;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Bangalore South",
    constituency: "Bangalore South",
    type: "MP",
    reportsCount: 245,
    resolvedCount: 198,
    score: 81,
  },
  {
    id: "2",
    name: "Jayanagar",
    constituency: "Jayanagar",
    type: "MLA",
    reportsCount: 189,
    resolvedCount: 142,
    score: 75,
  },
  {
    id: "3",
    name: "BTM Layout",
    constituency: "BTM Layout",
    type: "MLA",
    reportsCount: 156,
    resolvedCount: 108,
    score: 69,
  },
  {
    id: "4",
    name: "Koramangala",
    constituency: "Koramangala",
    type: "MLA",
    reportsCount: 134,
    resolvedCount: 89,
    score: 66,
  },
  {
    id: "5",
    name: "Bangalore North",
    constituency: "Bangalore North",
    type: "MP",
    reportsCount: 178,
    resolvedCount: 112,
    score: 63,
  },
  {
    id: "6",
    name: "Indiranagar",
    constituency: "Indiranagar",
    type: "MLA",
    reportsCount: 123,
    resolvedCount: 74,
    score: 60,
  },
];

const fetchLeaderboard = async (
  type: "all" | "MLA" | "MP",
): Promise<LeaderboardEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredData =
        type === "all"
          ? mockLeaderboardData
          : mockLeaderboardData.filter((entry) => entry.type === type);
      resolve(filteredData.sort((a, b) => b.score - a.score));
    }, 500);
  });
};

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "MLA" | "MP">("all");

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", activeTab],
    queryFn: () => fetchLeaderboard(activeTab),
  });

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}`;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center mb-6">
        <Trophy className="w-8 h-8 text-yellow-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "MLA", label: "MLAs" },
          { key: "MP", label: "MPs" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="w-16 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboard?.map((entry, index) => (
            <div
              key={entry.id}
              className={`bg-white rounded-lg shadow-sm p-4 border-2 ${getRankColor(index)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full border-2 border-current font-bold text-lg">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {entry.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{entry.constituency}</span>
                      <span className="mx-2">•</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                        {entry.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {entry.score}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry.resolvedCount}/{entry.reportsCount} resolved
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${entry.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <div className="flex items-center text-blue-800 mb-2">
          <Users className="w-5 h-5 mr-2" />
          <span className="font-medium">How it works</span>
        </div>
        <p className="text-blue-700 text-sm">
          Rankings are based on the percentage of resolved pothole reports in
          each constituency. Higher resolution rates indicate better
          infrastructure management and responsiveness to citizen reports.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../../lib/api';

interface CreatorStats {
  totalViews: number;
  totalFollowers: number;
  totalRewards: number;
  earnings: number;
  viewsGrowth: number;
  followersGrowth: number;
  rewardsGrowth: number;
  earningsGrowth: number;
}

const CreatorDashboard = () => {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await api.creator.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] p-8">
        <div className="bg-red-600/10 border-l-4 border-red-600 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const StatCard = ({ title, value, icon: Icon, growth }: any) => (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-red-600/10 rounded-lg">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
        <div className={`flex items-center ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="ml-1">{Math.abs(growth)}%</span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#141414] p-8">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={TrendingUp}
          growth={stats.viewsGrowth}
        />
        <StatCard
          title="Followers"
          value={stats.totalFollowers}
          icon={Users}
          growth={stats.followersGrowth}
        />
        <StatCard
          title="Rewards"
          value={stats.totalRewards}
          icon={Award}
          growth={stats.rewardsGrowth}
        />
        <StatCard
          title="Earnings"
          value={stats.earnings}
          icon={DollarSign}
          growth={stats.earningsGrowth}
        />
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
};

export default CreatorDashboard;
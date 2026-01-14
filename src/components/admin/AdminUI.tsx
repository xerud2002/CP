'use client';

import { StatItem, TabItem } from './types';
import { SearchIcon } from '@/components/icons/DashboardIcons';

// Stats Grid Component
export function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-all group"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
            </div>
            <span className="text-gray-400 text-xs sm:text-sm leading-tight">{stat.label}</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-xl sm:text-2xl font-bold text-white">{stat.value}</span>
            {stat.trend && (
              <span className={`text-[10px] sm:text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'} hidden sm:block`}>
                {stat.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

// Tab Navigation Component - Optimized for mobile with horizontal scroll
export function TabNavigation({ tabs, activeTab, onTabChange }: {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) {
  return (
    <div className="-mx-3 sm:mx-0 px-3 sm:px-0">
      <div className="flex gap-1 sm:gap-1.5 bg-slate-800/30 p-1 sm:p-1.5 rounded-xl border border-white/5 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden min-[400px]:inline">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`ml-0.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-red-500/20 text-red-400'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Search Bar Component
export function SearchBar({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
      />
    </div>
  );
}

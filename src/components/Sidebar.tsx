import React from 'react';
import { Users, Cake, Award } from 'lucide-react';
import type { Rule } from '../types';

interface SidebarProps {
  rules: Rule[];
  language: 'en' | 'es';
}

export default function Sidebar({ rules, language }: SidebarProps) {
  return (
    <div className="space-y-4">
      {/* Community Profile Card */}
      <div className="bg-white rounded-md shadow">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-md" />
        
        {/* Profile Content */}
        <div className="p-4">
          <div className="relative">
            {/* Community Avatar */}
            <div className="absolute -top-12 left-4 w-20 h-20 rounded-full bg-white border-4 border-white">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Join Button */}
            <div className="flex justify-end">
              <button className="px-8 py-1.5 bg-blue-500 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-colors">
                {language === 'en' ? 'Join' : 'Unirse'}
              </button>
            </div>
          </div>

          {/* Community Info */}
          <div className="mt-4">
            <h1 className="text-xl font-bold">r/AskReddit</h1>
            <p className="text-gray-500 text-sm mt-2">
              {language === 'en' 
                ? 'Ask Reddit: the front page of the internet' 
                : 'Ask Reddit: la portada del internet'}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-500" />
              <span>
                <strong>41.2m</strong> {language === 'en' ? 'members' : 'miembros'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>
                <strong>98.5k</strong> {language === 'en' ? 'online' : 'en línea'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Cake className="w-4 h-4 text-gray-500" />
              <span>
                {language === 'en' ? 'Created Jan 25, 2008' : 'Creado el 25 de enero de 2008'}
              </span>
            </div>
          </div>

          {/* Awards */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'Top 1% of all Reddit communities' : 'Top 1% de todas las comunidades de Reddit'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Card */}
      <div className="bg-white rounded-md shadow p-4">
        <h2 className="text-sm font-bold mb-4">
          {language === 'en' ? 'Subreddit Rules' : 'Reglas del Subreddit'}
        </h2>
        <ol className="list-decimal list-inside space-y-4">
          {rules.map((rule) => (
            <li key={rule.id} className="text-sm">
              <span className="font-medium">{rule.title}</span>
              <p className="text-gray-600 ml-4 mt-1">{rule.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
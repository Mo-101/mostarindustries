'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, Database, Cloud, Radio, Zap, Music } from 'lucide-react';
import { toast } from 'sonner';
import { env } from '../../lib/envConfig';

interface EnvCheck {
  name: string;
  icon: JSX.Element;
  status: 'active' | 'missing' | 'error';
  value?: string;
}

const EnvStatusGrid: React.FC = () => {
  const [checks, setChecks] = useState<EnvCheck[]>([]);

  useEffect(() => {
    const systems: EnvCheck[] = [
      {
        name: 'Supabase',
        icon: <Database className="h-5 w-5 text-cyan-400" />,
        status: env.supabaseUrl && env.supabaseAnonKey ? 'active' : 'missing',
        value: env.supabaseUrl,
      },
      {
        name: 'Spotify',
        icon: <Music className="h-5 w-5 text-green-400" />,
        status: env.spotifyClientId && env.spotifyClientSecret ? 'active' : 'missing',
        value: env.spotifyClientId,
      },
      {
        name: 'Google AI',
        icon: <Cloud className="h-5 w-5 text-yellow-400" />,
        status: env.googleApiKey && env.googleProjectId ? 'active' : 'missing',
        value: env.googleProjectId,
      },
      {
        name: 'Neon Database',
        icon: <Radio className="h-5 w-5 text-blue-400" />,
        status: env.databaseUrl ? 'active' : 'missing',
        value: env.databaseUrl,
      },
      {
        name: 'RBAC Security',
        icon: <ShieldCheck className="h-5 w-5 text-red-400" />,
        status: env.secretKey && env.rbacMasterKey ? 'active' : 'missing',
      },
      {
        name: 'Grid Integrity',
        icon: <Zap className="h-5 w-5 text-purple-400" />,
        status:
          env.supabaseUrl && env.spotifyClientId && env.googleProjectId
            ? 'active'
            : 'error',
      },
    ];

    setChecks(systems);

    if (systems.some(s => s.status === 'missing' || s.status === 'error')) {
      toast.error('⚠️ Some environment systems are missing or misconfigured.');
    } else {
      toast.success('✅ All environment systems are active.');
    }
  }, []);

  return (
    <div className="glassmorphism p-6 rounded-xl border border-white/10 bg-black/30 shadow-lg">
      <h3 className="text-xl font-display text-white mb-4">
        Environment System Status
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg flex items-center justify-between border ${
              check.status === 'active'
                ? 'border-green-500/30 bg-green-500/10'
                : check.status === 'error'
                ? 'border-yellow-500/30 bg-yellow-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              {check.icon}
              <span className="text-white font-mono text-sm">{check.name}</span>
            </div>
            <span
              className={`text-xs uppercase font-bold ${
                check.status === 'active'
                  ? 'text-green-400'
                  : check.status === 'error'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {check.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvStatusGrid;

"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface Overview {
    total_errors: number;
    errors_last_24h: number;
    avg_input_tokens: number;
    avg_output_tokens: number;
    top_5_endpoints: { endpoint: string; count: number }[];
}

interface Trend {
    date: string; // ISO "2024‑02‑01"
    count: number;
}

// Temporary placeholder data to replace the useQuery fetching until API is integrated
const MOCK_OVERVIEW: Overview = {
    total_errors: 142,
    errors_last_24h: 12,
    avg_input_tokens: 450,
    avg_output_tokens: 120,
    top_5_endpoints: [
        { endpoint: '/api/v1/auth/login', count: 45 },
        { endpoint: '/api/v1/patients/records', count: 32 },
        { endpoint: '/api/v1/appointments/book', count: 28 },
    ]
};

const MOCK_TRENDS: Trend[] = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
        date: d.toISOString(),
        count: Math.floor(Math.random() * 20),
    };
});


export const AnalyticsDashboard: React.FC = () => {
    // Note: Replaced react-query useQuery with mock data for initial import.
    // In the future, this should be wired up to the actual doctic-care endpoints.
    const overview = MOCK_OVERVIEW;
    const trends = MOCK_TRENDS;
    const loadingOverview = false;
    const errOverview = null;
    const loadingTrends = false;
    const errTrends = null;

    return (
        <div className="glass-card bg-card/50 p-8 mt-8 border-border/50">
            <h2 className="text-xl font-bold mb-6 text-white">📊 Tableau de bord d'analytics IA</h2>

            {/* ---------- Overview ---------- */}
            {loadingOverview && <p>Chargement des indicateurs…</p>}
            {errOverview && <p className="text-red-500">Erreur: {String(errOverview)}</p>}
            {overview && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm">
                        <h3 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Total erreurs</h3>
                        <p className="text-3xl font-bold text-destructive">{overview.total_errors}</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm">
                        <h3 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Dernières 24h</h3>
                        <p className="text-3xl font-bold text-warning">{overview.errors_last_24h}</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm">
                        <h3 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Coût IA (tokens)</h3>
                        <p className="text-white/70">
                            In: <strong className="text-white">{overview.avg_input_tokens}</strong><br />
                            Out: <strong className="text-white">{overview.avg_output_tokens}</strong>
                        </p>
                    </div>
                </section>
            )}

            {overview && overview.top_5_endpoints.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-white">Top erreurs par endpoint</h3>
                    <div className="bg-black/20 rounded-xl overflow-hidden border border-white/10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-white/50 text-sm">
                                    <th className="p-4 font-medium border-b border-white/10">Endpoint</th>
                                    <th className="p-4 font-medium border-b border-white/10">Occurrences</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {overview.top_5_endpoints.map((e, i) => (
                                    <tr key={e.endpoint} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono-tech text-white/70">{e.endpoint}</td>
                                        <td className="p-4 font-bold text-white">{e.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* ---------- Trends (chart) ---------- */}
            {loadingTrends && <p>Chargement de la courbe…</p>}
            {errTrends && <p className="text-red-500">{String(errTrends)}</p>}
            {trends && trends.length > 0 && (
                <section className="bg-black/20 p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold mb-6 text-white">Évolution des erreurs (30 jours)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    activeDot={{ r: 8 }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={false}
                                    tickFormatter={(val) => {
                                        const d = new Date(val);
                                        return `${d.getDate()}/${d.getMonth() + 1}`;
                                    }}
                                />
                                <YAxis 
                                    allowDecimals={false} 
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                    contentStyle={{ 
                                        borderRadius: "8px", 
                                        border: "1px solid #e2e8f0", 
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        color: '#0f172a'
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name="Erreurs" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            )}
        </div>
    );
};

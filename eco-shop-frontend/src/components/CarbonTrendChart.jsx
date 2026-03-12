import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function CarbonTrendChart({ data }) {
    return (
        <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--gray-800)', fontWeight: 700 }}>
                📈 Monthly Carbon Footprint Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#52b788" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#52b788" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                    <YAxis tick={{ fontSize: 13 }} unit=" kg" />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value} kg CO₂`, 'Carbon Saved']}
                    />
                    <Area
                        type="monotone"
                        dataKey="carbon"
                        stroke="#2d6a4f"
                        strokeWidth={2.5}
                        fill="url(#carbonGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

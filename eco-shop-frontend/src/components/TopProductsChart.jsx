import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'];

export default function TopProductsChart({ data }) {
    return (
        <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--gray-800)', fontWeight: 700 }}>
                🛒 Top 5 Eco-Friendly Products
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis type="number" tick={{ fontSize: 13 }} unit=" kg" />
                    <YAxis
                        type="category"
                        dataKey="productName"
                        width={130}
                        tick={{ fontSize: 13 }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value} kg CO₂`, 'Carbon Saved']}
                    />
                    <Bar dataKey="carbonSaved" radius={[0, 6, 6, 0]} barSize={28}>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

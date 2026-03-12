import { useState, useEffect } from 'react';
import { carbonAPI } from '../services/api';
import StatCard from '../components/StatCard';
import CarbonTrendChart from '../components/CarbonTrendChart';
import EcoBadges from '../components/EcoBadges';
import TopProductsChart from '../components/TopProductsChart';
import './Dashboard.css';

//Mock Data 
const MOCK_STATS = {
    totalCarbonSaved: 42,
    monthlyFootprint: 8.5,
    carbonRank: 12,
};

const MOCK_TREND = [
    { month: 'Jan', carbon: 12 },
    { month: 'Feb', carbon: 18 },
    { month: 'Mar', carbon: 25 },
    { month: 'Apr', carbon: 22 },
    { month: 'May', carbon: 35 },
    { month: 'Jun', carbon: 42 },
];

const MOCK_PRODUCTS = [
    { productName: 'Bamboo Toothbrush', carbonSaved: 12 },
    { productName: 'Steel Bottle', carbonSaved: 8 },
    { productName: 'Organic Tote Bag', carbonSaved: 6 },
    { productName: 'Recycled Notebook', carbonSaved: 4 },
    { productName: 'Eco Soap Bar', carbonSaved: 3 },
];



export default function Dashboard() {
    const [stats, setStats] = useState(MOCK_STATS);
    const [trend, setTrend] = useState(MOCK_TREND);
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, trendRes, productsRes] = await Promise.all([
                    carbonAPI.getUserStats(),
                    carbonAPI.getMonthlyTrend(),
                    carbonAPI.getTopProducts(),
                ]);
                setStats(statsRes.data);
                setTrend(trendRes.data);
                setProducts(productsRes.data);
            } catch {
                console.log('Using mock data (backend unavailable)');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="page container">
                <div className="spinner" style={{ marginTop: '200px' }}></div>
            </div>
        );
    }

    return (
        <div className="page container dashboard animate-in">
            {/* Page Header */}
            <div className="page-header">
                <h1>🌱 Carbon Insights Dashboard</h1>
                <p>Track your environmental impact and eco achievements</p>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-cards">
                <StatCard
                    icon="🌿"
                    value={`${stats.totalCarbonSaved} kg`}
                    label="Total Carbon Saved"
                    color="#2d6a4f"
                />
                <StatCard
                    icon="📊"
                    value={`${stats.monthlyFootprint} kg`}
                    label="Monthly Carbon Footprint"
                    color="#f4a261"
                />
                <StatCard
                    icon="🏆"
                    value={`#${stats.carbonRank}`}
                    label="Carbon Rank"
                    color="#457b9d"
                />
            </div>

            {/* Carbon Trend Chart */}
            <div className="dashboard-section">
                <CarbonTrendChart data={trend} />
            </div>

            {/* Two-column: Badges + Top Products */}
            <div className="dashboard-grid-2">
                <div className="dashboard-section">
                    <EcoBadges />
                </div>
                <div className="dashboard-section">
                    <TopProductsChart data={products} />
                </div>
            </div>
        </div>
    );
}

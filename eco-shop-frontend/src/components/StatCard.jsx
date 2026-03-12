import './StatCard.css';

export default function StatCard({ icon, value, label, color }) {
    return (
        <div className="stat-card card" style={{ borderTop: `4px solid ${color}` }}>
            <div className="stat-card__icon" style={{ background: color }}>
                {icon}
            </div>
            <div className="stat-card__value">{value}</div>
            <div className="stat-card__label">{label}</div>
        </div>
    );
}

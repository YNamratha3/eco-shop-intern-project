import './EcoBadges.css';

const BADGES = [
    { name: 'Bronze Leaf', icon: '🌿', color: '#cd7f32', unlocked: true },
    { name: 'Silver Leaf', icon: '🍃', color: '#adb5bd', unlocked: true },
    { name: 'Gold Leaf', icon: '🌟', color: '#f4a261', unlocked: false },
    { name: 'Planet Protector', icon: '🌍', color: '#2d6a4f', unlocked: false },
];

export default function EcoBadges() {
    return (
        <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--gray-800)', fontWeight: 700 }}>
                🏅 Eco Achievement Badges
            </h3>
            <div className="eco-badges-grid">
                {BADGES.map((b) => (
                    <div
                        key={b.name}
                        className={`eco-badge-item ${b.unlocked ? '' : 'eco-badge-locked'}`}
                    >
                        <div className="eco-badge-circle" style={{ background: b.color }}>
                            <span>{b.icon}</span>
                        </div>
                        <span className="eco-badge-name">{b.name}</span>
                        {!b.unlocked && <span className="eco-badge-lock-label">🔒 Locked</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

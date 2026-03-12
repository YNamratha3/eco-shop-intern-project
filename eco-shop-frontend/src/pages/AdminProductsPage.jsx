import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminProductsPage.css';

const emptyForm = {
    name: '', description: '', price: '', imageUrl: '',
    category: 'Clothing', ecoRating: 3, carbonFootprintKg: '',
    isEcoFriendly: false, stock: 100,
};

export default function AdminProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const categories = ['Clothing', 'Home', 'Personal Care', 'Electronics', 'Food & Drink'];

    const fetchProducts = () => {
        setLoading(true);
        const params = user?.role === 'SELLER' ? { sellerId: user.userId } : {};
        productAPI.getAll(params)
            .then(res => setProducts(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProducts(); }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setMessage('');
    };

    const openEdit = (p) => {
        setEditingId(p.id);
        setForm({
            name: p.name, description: p.description, price: p.price,
            imageUrl: p.imageUrl, category: p.category, ecoRating: p.ecoRating,
            carbonFootprintKg: p.carbonFootprintKg, isEcoFriendly: p.isEcoFriendly,
            stock: p.stock,
        });
        setShowForm(true);
        setMessage('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                carbonFootprintKg: parseFloat(form.carbonFootprintKg),
                ecoRating: parseInt(form.ecoRating),
                stock: parseInt(form.stock),
            };
            if (editingId) {
                await productAPI.update(editingId, payload);
                setMessage('✅ Product updated!');
            } else {
                await productAPI.create(payload);
                setMessage('✅ Product created!');
            }
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Save failed'));
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await productAPI.delete(id);
            setMessage('✅ Product deleted');
            fetchProducts();
        } catch {
            setMessage('❌ Delete failed');
        }
    };

    const handleChange = (field, value) => setForm({ ...form, [field]: value });

    return (
        <div className="page admin-page">
            <div className="container">
                <div className="page-header">
                    <h1>📦 Product Management</h1>
                    <p>Create, edit, and manage your product catalog</p>
                </div>

                {message && (
                    <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
                        {message}
                    </div>
                )}

                <div className="admin-toolbar">
                    <span className="admin-count">{products.length} products</span>
                    <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
                </div>

                {/* ── Create / Edit Form ── */}
                {showForm && (
                    <div className="admin-form-overlay animate-fade" onClick={() => setShowForm(false)}>
                        <div className="admin-form card animate-in" onClick={e => e.stopPropagation()}>
                            <h2>{editingId ? 'Edit Product' : 'New Product'}</h2>
                            <form onSubmit={handleSave}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Product Name *</label>
                                        <input className="form-input" value={form.name}
                                            onChange={e => handleChange('name', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select className="form-input" value={form.category}
                                            onChange={e => handleChange('category', e.target.value)}>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-input" rows="3" value={form.description}
                                        onChange={e => handleChange('description', e.target.value)} />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price ($) *</label>
                                        <input className="form-input" type="number" step="0.01" min="0"
                                            value={form.price} onChange={e => handleChange('price', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input className="form-input" type="number" min="0"
                                            value={form.stock} onChange={e => handleChange('stock', e.target.value)} required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input className="form-input" type="url" value={form.imageUrl}
                                        onChange={e => handleChange('imageUrl', e.target.value)}
                                        placeholder="https://images.unsplash.com/..." />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Carbon Footprint (kg CO₂) *</label>
                                        <input className="form-input" type="number" step="0.1" min="0"
                                            value={form.carbonFootprintKg}
                                            onChange={e => handleChange('carbonFootprintKg', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Eco Rating (1-5)</label>
                                        <input className="form-input" type="number" min="1" max="5"
                                            value={form.ecoRating}
                                            onChange={e => handleChange('ecoRating', e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group eco-check">
                                    <label>
                                        <input type="checkbox" checked={form.isEcoFriendly}
                                            onChange={e => handleChange('isEcoFriendly', e.target.checked)} />
                                        🌿 Mark as Eco-Friendly
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Product Table ── */}
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="admin-table-wrapper card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>CO₂ (kg)</th>
                                    <th>Eco</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="admin-product-cell">
                                                <img src={p.imageUrl} alt={p.name} className="admin-thumb" />
                                                <span className="admin-product-name">{p.name}</span>
                                            </div>
                                        </td>
                                        <td>{p.category}</td>
                                        <td>${p.price.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${p.carbonFootprintKg < 3 ? 'badge-eco' : 'badge-carbon'}`}>
                                                {p.carbonFootprintKg}
                                            </span>
                                        </td>
                                        <td>{p.isEcoFriendly ? '🌿' : '—'}</td>
                                        <td>{p.stock}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                            <div className="admin-empty">
                                <p>No products yet. Click <strong>+ Add Product</strong> to get started.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

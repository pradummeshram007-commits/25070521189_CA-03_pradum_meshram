import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  IconMarket,
  IconPlus,
  IconSearch,
  IconPhone,
  IconWhatsApp,
  IconTrash,
  IconEdit,
  IconCheck,
} from '../components/common/Icons';

export const MarketPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-listings'

  // Filters & Sorting
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_asc' | 'price_desc'

  // Item Detail Modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Post / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Books',
    price: '',
    condition: 'Used',
    description: '',
    contactPhone: user?.phone || '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Books',
    'Electronics',
    'Cycles',
    'Furniture',
    'Hostel Items',
    'Lab Equipment/Drafter',
    'Clothing',
    'Other',
  ];

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/market?`;
      if (activeTab === 'my-listings') {
        url += `myListings=true&`;
      }
      if (categoryFilter !== 'All') {
        url += `category=${encodeURIComponent(categoryFilter)}&`;
      }
      if (searchQuery.trim()) {
        url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      }
      if (sortBy) {
        url += `sort=${sortBy}&`;
      }

      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, searchQuery, sortBy, authFetch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Books',
      price: '',
      condition: 'Used',
      description: '',
      contactPhone: user?.phone || '',
    });
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      price: item.price,
      condition: item.condition,
      description: item.description,
      contactPhone: item.contactPhone,
    });
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price || !formData.contactPhone.trim()) {
      showToast('error', 'Please fill in all required listing fields.');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('condition', formData.condition);
    data.append('description', formData.description.trim());
    data.append('contactPhone', formData.contactPhone.trim());

    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append('images', selectedFiles[i]);
      }
    }

    try {
      const url = editingItem ? `/api/market/${editingItem._id}` : '/api/market';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: data,
      });
      const result = await res.json();

      if (res.ok) {
        showToast('success', editingItem ? 'Listing updated!' : 'Item posted on Market Hub!');
        setIsModalOpen(false);
        fetchItems();
      } else {
        showToast('error', result.message || 'Operation failed.');
      }
    } catch (err) {
      showToast('error', 'Error submitting listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSold = async (item) => {
    try {
      const newStatus = item.status === 'sold' ? 'available' : 'sold';
      const res = await authFetch(`/api/market/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast('success', newStatus === 'sold' ? 'Item marked as SOLD!' : 'Item marked as Available.');
        fetchItems();
      }
    } catch (err) {
      showToast('error', 'Failed to update item status.');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await authFetch(`/api/market/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Listing deleted.');
        fetchItems();
      }
    } catch (err) {
      showToast('error', 'Error deleting listing.');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Market Hub</h1>
          <p className="page-subtitle">
            Buy and sell pre-owned textbooks, cycles, drafters, hostel gear, and gadgets
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <IconPlus size={18} /> Post Item for Sale
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          🛍️ Browse Marketplace
        </button>
        <button
          className={`tab-btn ${activeTab === 'my-listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-listings')}
        >
          🏷️ My Listings
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.85rem',
        alignItems: 'center',
      }}>
        <div style={{ flex: '2 1 240px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search items by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ flex: '1 1 170px' }}>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 170px' }}>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High (₹)</option>
            <option value="price_desc">Price: High to Low (₹)</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <Loader message="Loading marketplace listings..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<IconMarket size={32} />}
          title={activeTab === 'my-listings' ? 'You have no listings yet' : 'No items match your criteria'}
          description="Post an item for sale or modify your filters to explore items."
          actionLabel="Sell an Item"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid-cards">
          {items.map((item) => {
            const isOwner = (item.user?._id || item.user) === user?.id || (item.user?._id || item.user) === user?._id || user?.role === 'admin';
            const isSold = item.status === 'sold';
            const mainImg = item.images && item.images.length > 0 ? item.images[0] : null;

            return (
              <div key={item._id} className="card" style={{ opacity: isSold ? 0.75 : 1 }}>
                {mainImg ? (
                  <div style={{ width: '100%', height: '190px', overflow: 'hidden', background: '#f1f5f9' }}>
                    <img
                      src={mainImg}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '140px',
                    background: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-light)',
                  }}>
                    <IconMarket size={36} />
                  </div>
                )}

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="badge badge-warning">{item.category}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Condition: <strong>{item.condition}</strong>
                    </span>
                    {isSold && <span className="badge badge-sold">SOLD</span>}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      color: 'var(--primary-navy)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                    ₹{item.price.toLocaleString()}
                  </div>

                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    maxHeight: '42px',
                    overflow: 'hidden',
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      View Details & Seller
                    </button>

                    {isOwner && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          className={`btn btn-sm ${isSold ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => handleToggleSold(item)}
                        >
                          <IconCheck size={14} /> {isSold ? 'Mark Available' : 'Mark SOLD'}
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteListing(item._id)}
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || 'Listing Details'}
        maxWidth="620px"
      >
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Image Gallery */}
            {selectedItem.images && selectedItem.images.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {selectedItem.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Item ${idx + 1}`}
                    style={{
                      width: '180px',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  />
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-warning" style={{ marginRight: '0.5rem' }}>
                  {selectedItem.category}
                </span>
                <span className="badge badge-open">Condition: {selectedItem.condition}</span>
                {selectedItem.status === 'sold' && <span className="badge badge-sold" style={{ marginLeft: '0.5rem' }}>SOLD</span>}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                ₹{selectedItem.price.toLocaleString()}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Description
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {selectedItem.description}
              </p>
            </div>

            {/* Seller Contact Box */}
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                Seller Information
              </h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <strong>Name:</strong> {selectedItem.user?.name || 'SIT Student'}
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <strong>Phone:</strong> {selectedItem.contactPhone}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href={`tel:${selectedItem.contactPhone}`}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <IconPhone size={14} /> Call Seller
                </a>
                <a
                  href={`https://wa.me/91${selectedItem.contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! I am interested in your listing: "${selectedItem.title}" on SIT Nagpur Market Hub.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{ background: '#25D366', color: '#fff', flex: 1 }}
                >
                  <IconWhatsApp size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Post / Edit Listing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Marketplace Listing' : 'Sell an Item on Market Hub'}
      >
        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Item Title *</label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="e.g. Engineering Graphics Mini Drafter, 1st Year Chemistry Book"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="mCategory">Category *</label>
              <select
                id="mCategory"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="condition">Condition *</label>
              <select
                id="condition"
                className="form-select"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                required
              >
                <option value="New">New (Unused)</option>
                <option value="Like New">Like New</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 400"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mPhone">Contact Phone *</label>
              <input
                id="mPhone"
                type="tel"
                className="form-input"
                placeholder="10-digit number"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mDesc">Description *</label>
            <textarea
              id="mDesc"
              rows="3"
              className="form-textarea"
              placeholder="State edition, physical condition, pickup point on campus..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mImages">Upload Photos (Up to 3, max 2MB each)</label>
            <input
              id="mImages"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              className="form-input"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files).slice(0, 3))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : (editingItem ? 'Save Changes' : 'Post Listing')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MarketPage;

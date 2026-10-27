import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  IconLostFound,
  IconPlus,
  IconSearch,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconCheck,
  IconTrash,
  IconEdit,
} from '../components/common/Icons';

export const LostFoundPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Lost'); // 'Lost' | 'Found' | 'My Posts'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Contact Modal State
  const [selectedContactItem, setSelectedContactItem] = useState(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Lost',
    itemName: '',
    category: 'Electronics',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactPhone: user?.phone || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Electronics',
    'ID Card',
    'Books',
    'Bottle',
    'Clothing',
    'Keys',
    'Wallet',
    'Other',
  ];

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/lost-found?`;
      if (activeTab === 'My Posts') {
        url += `myPosts=true&`;
      } else {
        url += `type=${activeTab}&`;
      }

      if (categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (dateFilter) url += `date=${encodeURIComponent(dateFilter)}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setItems(data);
      } else {
        showToast('error', data.message || 'Error loading posts.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, dateFilter, searchQuery, authFetch, showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      type: activeTab === 'Found' ? 'Found' : 'Lost',
      itemName: '',
      category: 'Electronics',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      contactPhone: user?.phone || '',
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      location: item.location,
      date: item.date,
      contactPhone: item.contactPhone,
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.itemName.trim() || !formData.location.trim() || !formData.contactPhone.trim()) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('type', formData.type);
    data.append('itemName', formData.itemName);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('date', formData.date);
    data.append('contactPhone', formData.contactPhone);
    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      const url = editingItem ? `/api/lost-found/${editingItem._id}` : '/api/lost-found';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: data,
      });
      const result = await res.json();

      if (res.ok) {
        showToast('success', editingItem ? 'Post updated successfully!' : 'Post submitted successfully!');
        setIsModalOpen(false);
        fetchItems();
      } else {
        showToast('error', result.message || 'Operation failed.');
      }
    } catch (err) {
      showToast('error', err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (item) => {
    try {
      const res = await authFetch(`/api/lost-found/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: item.status === 'Resolved' ? 'Open' : 'Resolved' }),
      });
      if (res.ok) {
        showToast('success', item.status === 'Resolved' ? 'Post marked as Open.' : 'Post marked as Resolved / Returned!');
        fetchItems();
      }
    } catch (err) {
      showToast('error', 'Failed to update post status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await authFetch(`/api/lost-found/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Post deleted successfully.');
        fetchItems();
      } else {
        showToast('error', 'Failed to delete post.');
      }
    } catch (err) {
      showToast('error', 'Error deleting post.');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Lost & Found Hub</h1>
          <p className="page-subtitle">
            Report lost possessions or submit items found across SIT Nagpur campus
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <IconPlus size={18} /> Report Item
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        {['Lost', 'Found', 'My Posts'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Lost' && '🔎 Lost Items'}
            {tab === 'Found' && '📦 Found Items'}
            {tab === 'My Posts' && '👤 My Posts'}
          </button>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.75rem',
        background: '#fff',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Search */}
        <div style={{ flex: '2 1 240px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by item name, location, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div style={{ flex: '1 1 160px' }}>
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

        {/* Date Filter */}
        <div style={{ flex: '1 1 140px' }}>
          <input
            type="date"
            className="form-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title="Filter by date"
          />
        </div>

        {(categoryFilter !== 'All' || dateFilter || searchQuery) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCategoryFilter('All');
              setDateFilter('');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Items List */}
      {loading ? (
        <Loader message="Loading items..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<IconLostFound size={32} />}
          title={`No ${activeTab} items found`}
          description="Try broadening your search or submit a new post to alert fellow students."
          actionLabel="Report New Item"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid-cards">
          {items.map((item) => {
            const isOwner = (item.user?._id || item.user) === user?.id || (item.user?._id || item.user) === user?._id || user?.role === 'admin';
            const isResolved = item.status === 'Resolved';

            return (
              <div key={item._id} className="card" style={{ opacity: isResolved ? 0.85 : 1 }}>
                {item.imageUrl && (
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', background: '#f1f5f9' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`badge ${item.type === 'Lost' ? 'badge-danger' : 'badge-open'}`}>
                      {item.type}
                    </span>
                    <span className="badge badge-warning">{item.category}</span>
                    {isResolved && (
                      <span className="badge badge-resolved">
                        <IconCheck size={12} /> Resolved / Returned
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginTop: '0.25rem' }}>
                    {item.itemName}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, flex: 1 }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <IconMapPin size={14} /> <span>{item.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <IconCalendar size={14} /> <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
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
                    {/* Public Contact Button */}
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedContactItem(item)}
                    >
                      <IconPhone size={14} />
                      {item.type === 'Lost' ? 'This is mine' : 'I found this'}
                    </button>

                    {/* Owner / Admin Controls */}
                    {isOwner && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          className={`btn btn-sm ${isResolved ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => handleResolve(item)}
                          title="Toggle Resolved Status"
                        >
                          <IconCheck size={14} /> {isResolved ? 'Re-open' : 'Mark Resolved'}
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit Post"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                          title="Delete Post"
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

      {/* Contact Verification Modal */}
      <Modal
        isOpen={!!selectedContactItem}
        onClose={() => setSelectedContactItem(null)}
        title="Poster Contact Details"
      >
        {selectedContactItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Get in touch with the student who posted <strong>{selectedContactItem.itemName}</strong> to verify and return the item.
            </p>
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Posted By:</strong> {selectedContactItem.user?.name || 'SIT Student'}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {selectedContactItem.user?.email || 'N/A'}
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Contact Phone:</strong>{' '}
                <a
                  href={`tel:${selectedContactItem.contactPhone}`}
                  style={{ color: 'var(--primary-blue)', fontWeight: 700 }}
                >
                  {selectedContactItem.contactPhone}
                </a>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <a
                  href={`tel:${selectedContactItem.contactPhone}`}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <IconPhone size={14} /> Direct Call
                </a>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedContactItem.contactPhone);
                    showToast('success', 'Phone number copied to clipboard!');
                  }}
                >
                  Copy Number
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Lost & Found Post' : 'Report Item (Lost or Found)'}
      >
        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label">Post Type *</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="Lost"
                  checked={formData.type === 'Lost'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <span>Lost (I lost something)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="Found"
                  checked={formData.type === 'Found'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <span>Found (I found something)</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="itemName">Item Name *</label>
            <input
              id="itemName"
              type="text"
              className="form-input"
              placeholder="e.g. Casio Calculator, Blue Milton Bottle"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
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
              <label className="form-label" htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">Campus Location *</label>
            <input
              id="location"
              type="text"
              className="form-input"
              placeholder="e.g. Academic Block B 2nd Floor, Canteen, Football Ground"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description *</label>
            <textarea
              id="description"
              className="form-textarea"
              rows="3"
              placeholder="Provide color, stickers, markings, or specifics to help identify the item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contactPhone">Contact Phone *</label>
            <input
              id="contactPhone"
              type="tel"
              className="form-input"
              placeholder="10-digit mobile number"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="image">Upload Image (Optional, max 2MB)</label>
            <input
              id="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="form-input"
              onChange={(e) => setSelectedFile(e.target.files[0])}
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
              {submitting ? 'Submitting...' : (editingItem ? 'Save Changes' : 'Submit Report')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LostFoundPage;

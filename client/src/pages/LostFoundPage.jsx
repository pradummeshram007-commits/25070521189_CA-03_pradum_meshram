import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AppShell from '../components/common/AppShell';
import HubHeader from '../components/common/HubHeader';
import SegmentedControl from '../components/common/SegmentedControl';
import Chip from '../components/common/Chip';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Skeleton from '../components/common/Skeleton';
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
  IconCopy,
} from '../components/common/Icons';

export const LostFoundPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Lost'); // 'Lost' | 'Found' | 'My Posts'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Contact Modal
  const [selectedContactItem, setSelectedContactItem] = useState(null);

  // Create / Edit Modal
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
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setItems(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, searchQuery, authFetch]);

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
    data.append('itemName', formData.itemName.trim());
    data.append('category', formData.category);
    data.append('description', formData.description.trim());
    data.append('location', formData.location.trim());
    data.append('date', formData.date);
    data.append('contactPhone', formData.contactPhone.trim());
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
        showToast('success', editingItem ? 'Post updated successfully!' : 'Item reported successfully!');
        setIsModalOpen(false);
        fetchItems();
      } else {
        showToast('error', result.message || 'Operation failed.');
      }
    } catch (err) {
      showToast('error', 'Error submitting post.');
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
        showToast('success', item.status === 'Resolved' ? 'Post marked as Open.' : 'Item marked as Resolved / Returned!');
        fetchItems();
      }
    } catch (err) {
      showToast('error', 'Failed to update post status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      const res = await authFetch(`/api/lost-found/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Notice deleted.');
        fetchItems();
      }
    } catch (err) {
      showToast('error', 'Error deleting notice.');
    }
  };

  return (
    <AppShell pageTitle="Lost &amp; Found Hub">
      <div>
        {/* Hub Header */}
        <HubHeader
          hubNumber="01"
          category="CAMPUS REGISTRY ARCHIVE"
          title="Lost & Found"
          description="Lost something? Found something? Post it here for SIT Nagpur students & staff."
          stripColor="var(--hub-lost)"
          stripTint="var(--hub-lost-tint)"
          activeCountText={`${items.length} Logged Items`}
          ledgerText="CENTRAL DESK: Academic Block Ground Floor (Security Counter) · TIMINGS: 09:30 AM – 05:30 PM IST"
          actionButton={
            <Button
              variant="primary"
              icon={<IconPlus size={18} />}
              onClick={handleOpenCreateModal}
            >
              + Report item
            </Button>
          }
        />

        {/* Toolbar & Filter Deck */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.5rem 1rem' }}>
          {/* Row 1: Segmented Control & Search */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <SegmentedControl
              options={[
                { value: 'Lost', label: 'Lost' },
                { value: 'Found', label: 'Found' },
                { value: 'My Posts', label: 'My posts' },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />

            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ink-muted)' }}>
                <IconSearch size={18} />
              </span>
              <input
                type="text"
                placeholder="Search items by name, location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ height: '44px', paddingLeft: '38px', backgroundColor: 'var(--color-surface)' }}
              />
            </div>
          </div>

          {/* Row 2: Category Filter Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}>
            <span className="eyebrow" style={{ fontSize: '11px', marginRight: '0.35rem', flexShrink: 0 }}>
              Category:
            </span>
            <Chip
              active={categoryFilter === 'All'}
              onClick={() => setCategoryFilter('All')}
            >
              All ({items.length})
            </Chip>
            {categories.map((c) => (
              <Chip
                key={c}
                active={categoryFilter === c}
                onClick={() => setCategoryFilter(c)}
              >
                {c}
              </Chip>
            ))}
          </div>
        </section>

        {/* Items Grid (Luggage Tag Noticeboard Cards) */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 4rem' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card-notice" style={{ minHeight: '180px' }}>
                  <Skeleton height="24px" width="40%" style={{ marginBottom: '1rem' }} />
                  <Skeleton height="20px" width="70%" style={{ marginBottom: '0.5rem' }} />
                  <Skeleton height="16px" width="90%" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<IconLostFound size={32} />}
              title={`No ${activeTab.toLowerCase()} items found`}
              description="No registered notices match your filter. Submit a report to alert fellow campus students."
              actionLabel="+ Report item"
              onAction={handleOpenCreateModal}
            />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {items.map((item) => {
                const isOwner = (item.user?._id || item.user) === user?.id || (item.user?._id || item.user) === user?._id || user?.role === 'admin';
                const isResolved = item.status === 'Resolved';

                return (
                  <article
                    key={item._id}
                    className="card-notice"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: isResolved ? 0.75 : 1,
                    }}
                  >
                    <div>
                      {item.imageUrl && (
                        <div style={{
                          width: '100%',
                          height: '160px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-sunken)',
                          marginBottom: '0.85rem',
                        }}>
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className={`chip ${item.type === 'Lost' ? 'badge-lost' : 'badge-sports'}`} style={{ height: '22px', fontSize: '10px' }}>
                          {item.type.toUpperCase()}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                          {item.category}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink)', fontWeight: 700 }}>
                        {item.itemName}
                      </h3>

                      <p style={{ color: 'var(--color-ink-secondary)', fontSize: '13.5px', lineHeight: 1.5, marginTop: '0.35rem' }}>
                        {item.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '12px', color: 'var(--color-ink-muted)', marginTop: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <IconMapPin size={13} />
                          <span>{item.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <IconCalendar size={13} />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedContactItem(item)}
                      >
                        <IconPhone size={14} />
                        <span>{item.type === 'Lost' ? 'This is mine' : 'I found this'}</span>
                      </Button>

                      {isOwner && (
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            type="button"
                            onClick={() => handleResolve(item)}
                            className="btn-campus btn-secondary-line"
                            style={{ height: '32px', padding: '0 0.6rem', fontSize: '12px' }}
                            title="Toggle Resolved Status"
                          >
                            <IconCheck size={13} />
                            <span>{isResolved ? 'Reopen' : 'Resolved'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="btn-campus btn-secondary-line"
                            style={{ height: '32px', padding: '0 0.5rem' }}
                            title="Edit"
                          >
                            <IconEdit size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            className="btn-campus"
                            style={{ height: '32px', padding: '0 0.5rem', color: 'var(--status-error)' }}
                            title="Delete"
                          >
                            <IconTrash size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Verification Modal */}
        <Modal
          isOpen={!!selectedContactItem}
          onClose={() => setSelectedContactItem(null)}
          title="Verify & Claim Item"
        >
          {selectedContactItem && (
            <div>
              <p style={{ fontSize: '14px', color: 'var(--color-ink-secondary)', marginBottom: '1.25rem' }}>
                Connect directly with the poster to verify distinguishing marks and coordinate safe handoff.
              </p>

              <div style={{
                backgroundColor: 'var(--color-sunken)',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--color-line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>ITEM TITLE</span>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{selectedContactItem.itemName}</div>
                </div>

                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>POSTED BY</span>
                  <div style={{ fontSize: '14px' }}>{selectedContactItem.user?.name || 'SIT Student'}</div>
                </div>

                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>CONTACT PHONE</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600 }}>
                    {selectedContactItem.contactPhone}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <a
                  href={`tel:${selectedContactItem.contactPhone}`}
                  className="btn-campus btn-primary-ink"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <IconPhone size={15} />
                  <span>Direct Call</span>
                </a>
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedContactItem.contactPhone);
                    showToast('success', 'Phone number copied to clipboard!');
                  }}
                >
                  <IconCopy size={15} />
                  <span>Copy</span>
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Report / Edit Item Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Notice' : 'Report Item (Lost or Found)'}
        >
          <form onSubmit={handleSubmitForm}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="input-label">Report Type *</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Lost' })}
                  className={`btn-campus ${formData.type === 'Lost' ? 'btn-primary-ink' : 'btn-secondary-line'}`}
                  style={{ flex: 1, height: '40px' }}
                >
                  Lost (I lost something)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Found' })}
                  className={`btn-campus ${formData.type === 'Found' ? 'btn-primary-ink' : 'btn-secondary-line'}`}
                  style={{ flex: 1, height: '40px' }}
                >
                  Found (I picked up an item)
                </button>
              </div>
            </div>

            <Input
              label="Item Name"
              id="itemName"
              placeholder="e.g. Blue Casio fx-991EX Calculator"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Select
                label="Category"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={categories}
                required
              />

              <Input
                label="Date"
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <Input
              label="Campus Location"
              id="location"
              placeholder="e.g. Academic Block 2nd Floor Library"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />

            <div style={{ marginBottom: '1rem' }}>
              <label className="input-label">Description *</label>
              <textarea
                rows="3"
                className="input-textarea"
                placeholder="Color, unique scratches, stickers, or where it can be picked up…"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <Input
              label="Contact Phone"
              id="contactPhone"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
            />

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label">Upload Photo (Optional, max 2MB)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ fontSize: '13px', color: 'var(--color-ink-secondary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-line)' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Submitting…' : (editingItem ? 'Save Changes' : 'Post Notice')}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
};

export default LostFoundPage;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AppShell from '../components/common/AppShell';
import HubHeader from '../components/common/HubHeader';
import SegmentedControl from '../components/common/SegmentedControl';
import Chip from '../components/common/Chip';
import Modal from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import Skeleton from '../components/common/Skeleton';
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
  IconShield,
  IconClock,
  IconMapPin,
  IconTag,
  IconExternalLink,
  IconX,
} from '../components/common/Icons';

export const MarketPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-stash'

  // Filters & Sorting
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_asc' | 'price_desc'

  // Item Detail Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

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
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'All',
    'Books',
    'Electronics',
    'Cycles',
    'Lab Equipment/Drafter',
    'Hostel Items',
    'Furniture',
    'Clothing',
    'Other',
  ];

  const conditions = ['All', 'New', 'Like New', 'Used'];

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/market?`;
      if (activeTab === 'my-stash') {
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
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Unable to load marketplace items.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, searchQuery, sortBy, authFetch, showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Client-side condition filter if selected
  const filteredItems = useMemo(() => {
    if (conditionFilter === 'All') return items;
    return items.filter((item) =>
      item.condition?.toLowerCase() === conditionFilter.toLowerCase()
    );
  }, [items, conditionFilter]);

  const myListingCount = useMemo(() => {
    if (!user) return 0;
    return items.filter((it) => {
      const uId = it.user?._id || it.user;
      return uId === user.id || uId === user._id;
    }).length;
  }, [items, user]);

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
    setFilePreviews([]);
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
      contactPhone: item.contactPhone || user?.phone || '',
    });
    setSelectedFiles([]);
    setFilePreviews(item.images || []);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setSelectedFiles(files);

    // Create object URLs for previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
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
        showToast('success', editingItem ? 'Listing updated successfully!' : 'Item posted to Market Hub!');
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
        showToast('success', newStatus === 'sold' ? 'Item marked as SOLD.' : 'Item reopened as Available.');
        if (selectedItem?._id === item._id) {
          setSelectedItem({ ...selectedItem, status: newStatus });
        }
        fetchItems();
      }
    } catch (err) {
      showToast('error', 'Failed to update item status.');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to remove this listing from Market Hub?')) return;
    try {
      const res = await authFetch(`/api/market/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Listing deleted.');
        if (selectedItem?._id === id) setSelectedItem(null);
        fetchItems();
      }
    } catch (err) {
      showToast('error', 'Error deleting listing.');
    }
  };

  const isUserOwner = (item) => {
    if (!user || !item) return false;
    const uId = item.user?._id || item.user;
    return uId === user.id || uId === user._id || user.role === 'admin';
  };

  return (
    <AppShell pageTitle="Market Hub">
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Hub Header */}
        <HubHeader
          hubNumber="04"
          hubName="Market Hub"
          hubColor="#B4532A"
          hubTint="#F7E6DC"
          eyebrow="HUB 04 · PEER-TO-PEER CAMPUS EXCHANGE"
          description="Second-hand, first-rate. Buy and sell verified items securely within SIT campus."
          actionLabel="+ Sell an item"
          onAction={handleOpenCreateModal}
          actionIcon={<IconPlus size={16} />}
          subLedger={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
              }}>
                ACTIVE INVENTORY: <strong style={{ color: 'var(--text-primary)' }}>{items.length}</strong> LISTINGS
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: '#F7E6DC',
                border: '1px solid #B4532A',
                color: '#B4532A',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}>
                <IconShield size={12} />
                <span>PRN VERIFIED SELLERS</span>
              </div>
            </div>
          }
        />

        {/* Top Control Toolbar: Tabs & Search */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            {/* View Mode Segmented Control */}
            <SegmentedControl
              options={[
                { value: 'browse', label: 'Browse listings' },
                { value: 'my-stash', label: `My stash (${myListingCount})` },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />

            {/* Quick Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Sort By:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '170px', height: '36px', fontSize: '0.82rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Search bar & Condition Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex',
              }}>
                <IconSearch size={16} />
              </span>
              <input
                type="text"
                className="form-input"
                style={{
                  height: '40px',
                  paddingLeft: '38px',
                  background: 'var(--color-paper)',
                  fontSize: '0.85rem',
                }}
                placeholder="Search textbooks, drafters, calculators, cycles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Condition Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                marginRight: '0.25rem',
              }}>
                CONDITION:
              </span>
              {conditions.map((cond) => {
                const active = conditionFilter === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setConditionFilter(cond)}
                    style={{
                      height: '28px',
                      padding: '0 10px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: active ? 600 : 500,
                      background: active ? '#F7E6DC' : 'var(--color-paper)',
                      border: active ? '1px solid #B4532A' : '1px solid var(--color-border)',
                      color: active ? '#B4532A' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Chips Horizontal Ribbon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}>
            {categories.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <Chip
                  key={cat}
                  label={cat}
                  active={active}
                  hubColor="#B4532A"
                  onClick={() => setCategoryFilter(cat)}
                />
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <Skeleton height="320px" count={6} />
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={<IconMarket size={36} />}
            title={activeTab === 'my-stash' ? 'Your stash is empty' : 'No items match your filter'}
            description="Clear search or be the first to list a textbook, drafter or cycle for campus peers."
            actionLabel="+ Sell an item"
            onAction={handleOpenCreateModal}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.25rem',
          }}>
            {filteredItems.map((item) => {
              const isOwner = isUserOwner(item);
              const isSold = item.status === 'sold';
              const mainImg = item.images && item.images.length > 0 ? item.images[0] : null;

              return (
                <article
                  key={item._id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    opacity: isSold ? 0.72 : 1,
                    position: 'relative',
                  }}
                >
                  <div>
                    {/* Media container */}
                    <div
                      onClick={() => {
                        setSelectedImgIndex(0);
                        setSelectedItem(item);
                      }}
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4 / 3',
                        background: 'var(--color-sunken)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginBottom: '0.85rem',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
                      }}
                    >
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.25s ease',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          color: 'var(--text-muted)',
                        }}>
                          <IconMarket size={32} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>NO PHOTO</span>
                        </div>
                      )}

                      {/* Condition badge */}
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: item.condition === 'Like New' ? '#F7E6DC' : '#EDE7DA',
                        border: item.condition === 'Like New' ? '1px solid #B4532A' : '1px solid var(--color-border)',
                        color: item.condition === 'Like New' ? '#B4532A' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}>
                        {item.condition || 'USED'}
                      </span>

                      {/* SOLD pill overlay */}
                      {isSold && (
                        <span style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#1A1A17',
                          color: '#FFFDF9',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                        }}>
                          SOLD
                        </span>
                      )}
                    </div>

                    {/* Price and Category Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: '0.35rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                      }}>
                        ₹{Number(item.price || 0).toLocaleString()}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: '#B4532A',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}>
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      onClick={() => {
                        setSelectedImgIndex(0);
                        setSelectedItem(item);
                      }}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.title}
                    </h2>

                    {/* Short description */}
                    <p style={{
                      fontSize: '0.82rem',
                      lineHeight: 1.45,
                      color: 'var(--text-secondary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '0.85rem',
                    }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer: Seller info & Quick actions */}
                  <div style={{
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                        <Avatar name={item.user?.name || 'SIT Student'} size={22} />
                        <span style={{ truncate: true, fontWeight: 500 }}>
                          {item.user?.name || 'Student'}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                      }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1, height: '36px', fontSize: '0.8rem' }}
                        onClick={() => {
                          setSelectedImgIndex(0);
                          setSelectedItem(item);
                        }}
                      >
                        Details & Contact
                      </button>

                      {isOwner && (
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            title={isSold ? 'Mark Available' : 'Mark as Sold'}
                            onClick={() => handleToggleSold(item)}
                            style={{
                              height: '36px',
                              width: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)',
                              background: isSold ? '#2E6B4E' : 'var(--color-card)',
                              color: isSold ? '#FFFDF9' : 'var(--text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <IconCheck size={16} />
                          </button>
                          <button
                            type="button"
                            title="Edit listing"
                            onClick={() => handleOpenEditModal(item)}
                            style={{
                              height: '36px',
                              width: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)',
                              background: 'var(--color-card)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            title="Delete listing"
                            onClick={() => handleDeleteListing(item._id)}
                            style={{
                              height: '36px',
                              width: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px',
                              border: '1px solid #ffdad6',
                              background: '#FFFDF9',
                              color: '#D7261E',
                              cursor: 'pointer',
                            }}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Item Detail Modal (Stitch Model Alignment) */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.title || 'Listing Detail'}
          maxWidth="720px"
        >
          {selectedItem && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Media Gallery Showcase */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 10',
                background: 'var(--color-sunken)',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}>
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <img
                    src={selectedItem.images[selectedImgIndex] || selectedItem.images[0]}
                    alt={selectedItem.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                  }}>
                    <IconMarket size={48} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>NO ATTACHED MEDIA</span>
                  </div>
                )}

                {/* Overlaid badges */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '4px',
                    background: '#F7E6DC',
                    border: '1px solid #B4532A',
                    color: '#B4532A',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}>
                    {selectedItem.condition || 'USED'}
                  </span>
                  {selectedItem.status === 'sold' && (
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '4px',
                      background: '#1A1A17',
                      color: '#FFFDF9',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}>
                      SOLD
                    </span>
                  )}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  background: 'rgba(255, 253, 249, 0.95)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}>
                  <IconShield size={13} color="#7B1E2E" />
                  <span>SIT VERIFIED SELLER</span>
                </div>
              </div>

              {/* Thumbnails row if multiple images */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                  {selectedItem.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIndex(idx)}
                      style={{
                        width: '80px',
                        height: '60px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: selectedImgIndex === idx ? '2px solid #B4532A' : '1px solid var(--color-border)',
                        padding: 0,
                        cursor: 'pointer',
                        background: 'transparent',
                        opacity: selectedImgIndex === idx ? 1 : 0.7,
                      }}
                    >
                      <img src={img} alt={`thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Price Header */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.75rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: '#B4532A',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.25rem',
                  }}>
                    {selectedItem.category} · PRN VERIFIED LISTING
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}>
                    {selectedItem.title}
                  </h2>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  ₹{Number(selectedItem.price || 0).toLocaleString()}
                </div>
              </div>

              {/* Description */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.35rem',
                }}>
                  ITEM DETAILS & CONDITION
                </div>
                <p style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {selectedItem.description}
                </p>
              </div>

              {/* Campus Handover & Logistics Block */}
              <div style={{
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <IconMapPin size={16} color="#B4532A" />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>Campus Handover:</strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>Central Library, Boys Hostel 2, or Canteen Plaza</span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <IconClock size={16} color="#B4532A" />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>Timing:</strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>After 16:30 hrs or between class blocks</span>
                  </span>
                </div>
              </div>

              {/* Seller Information Card */}
              <div style={{
                background: 'rgba(237, 231, 218, 0.45)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Avatar name={selectedItem.user?.name || 'SIT Student'} size={44} />
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      {selectedItem.user?.name || 'Enrolled SIT Student'}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}>
                      {selectedItem.user?.department ? `${selectedItem.user.department} · ` : ''}
                      {selectedItem.user?.year ? `${selectedItem.user.year} · ` : ''}
                      PRN {selectedItem.user?.prn || 'Verified'}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}>
                  <IconPhone size={14} color="#B4532A" />
                  <span>{selectedItem.contactPhone || 'Available upon call'}</span>
                </div>
              </div>

              {/* Primary Buyer Contact Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <a
                  href={`https://wa.me/91${(selectedItem.contactPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedItem.user?.name || 'there'}, I saw your "${selectedItem.title}" listed on SIT Nagpur Campus Hub and I am interested in buying it.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    height: '44px',
                    background: '#1A1A17',
                    color: '#FFFDF9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderRadius: '8px',
                  }}
                >
                  <IconWhatsApp size={18} color="#25D366" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${selectedItem.contactPhone}`}
                  className="btn btn-secondary"
                  style={{
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <IconPhone size={16} />
                  <span>Call Seller</span>
                </a>
              </div>

              {/* Owner Controls Panel */}
              {isUserOwner(selectedItem) && (
                <div style={{
                  background: 'var(--color-paper)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    <span>Listing Management (You own this listing)</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B4532A' }}></span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleToggleSold(selectedItem)}
                      style={{
                        flex: '1 1 140px',
                        height: '38px',
                        background: selectedItem.status === 'sold' ? '#2E6B4E' : '#B4532A',
                        color: '#FFFDF9',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <IconCheck size={14} />
                      <span style={{ marginLeft: '4px' }}>
                        {selectedItem.status === 'sold' ? 'Mark as Available' : 'Mark as Sold'}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        const itemToEdit = selectedItem;
                        setSelectedItem(null);
                        handleOpenEditModal(itemToEdit);
                      }}
                      style={{
                        flex: '1 1 120px',
                        height: '38px',
                        fontSize: '0.82rem',
                      }}
                    >
                      <IconEdit size={14} />
                      <span style={{ marginLeft: '4px' }}>Edit Listing</span>
                    </button>

                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleDeleteListing(selectedItem._id)}
                      style={{
                        height: '38px',
                        background: '#FFFDF9',
                        border: '1px solid #ffdad6',
                        color: '#D7261E',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        padding: '0 14px',
                      }}
                    >
                      <IconTrash size={14} />
                      <span style={{ marginLeft: '4px' }}>Delete</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Campus Safety Warning */}
              <div style={{
                background: 'var(--color-sunken)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}>
                <IconShield size={18} color="#7B1E2E" />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Campus Safety Notice:</strong>{' '}
                  Meet in public campus locations (Library porch, Canteen plaza). Always examine items in person before transferring funds via cash or UPI.
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Sell / Edit Listing Modal (Stitch Form Alignment) */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Market Listing' : 'Sell an item on Market Hub'}
          maxWidth="640px"
        >
          <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* PRN Verification banner */}
            <div style={{
              background: '#EDE7DA',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  PRN VERIFIED POSTING
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.name?.toUpperCase() || 'STUDENT'} · {user?.prn || 'SIT-NAGPUR'}
                </div>
              </div>
              <IconShield size={18} color="#B4532A" />
            </div>

            {/* Photos upload slot */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Item Photos (Max 3, up to 2MB each)
              </label>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                The first photo will serve as the cover card on the campus noticeboard.
              </p>

              {/* Previews if any */}
              {filePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {filePreviews.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        width: '80px',
                        height: '70px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <img src={p} alt={`preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        background: '#1A1A17',
                        color: '#FFFDF9',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        padding: '1px 4px',
                        borderRadius: '3px',
                      }}>
                        {idx === 0 ? 'Cover' : `${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <input
                id="market-file-input"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                className="form-input"
                style={{ padding: '8px' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="listing-title" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Listing title *
              </label>
              <input
                id="listing-title"
                type="text"
                className="form-input"
                placeholder="e.g. Mini drafter · Omega Engineering (with table clamp)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Include brand and model name so peers find it in search.
              </span>
            </div>

            {/* Category & Condition Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="listing-category" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Category *
                </label>
                <select
                  id="listing-category"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Condition *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                  {['New', 'Like New', 'Used'].map((cond) => {
                    const active = formData.condition === cond;
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setFormData({ ...formData, condition: cond })}
                        style={{
                          height: '44px',
                          borderRadius: '8px',
                          border: active ? '1px solid #B4532A' : '1px solid var(--color-border)',
                          background: active ? '#F7E6DC' : 'var(--color-paper)',
                          color: active ? '#B4532A' : 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          fontWeight: active ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Price & Contact Phone Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="listing-price" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Selling price (₹) *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                  }}>
                    ₹
                  </span>
                  <input
                    id="listing-price"
                    type="number"
                    min="0"
                    className="form-input"
                    style={{ paddingLeft: '30px', fontFamily: 'var(--font-mono)' }}
                    placeholder="350"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="listing-phone" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Contact Phone (WhatsApp / Call) *
                </label>
                <input
                  id="listing-phone"
                  type="tel"
                  className="form-input"
                  placeholder="10-digit campus mobile number"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label htmlFor="listing-description" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Description & Handover Point *
                </label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {formData.description.length} / 500
                </span>
              </div>
              <textarea
                id="listing-description"
                rows="4"
                maxLength={500}
                className="form-textarea"
                placeholder="Mention edition, physical condition, missing parts, and preferred campus meetup point (e.g. Canteen, Boys Hostel 2)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Modal Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--color-border)',
            }}>
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
                style={{ minWidth: '130px' }}
              >
                {submitting ? 'Publishing...' : (editingItem ? 'Save Changes' : '+ Publish Listing')}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
};

export default MarketPage;

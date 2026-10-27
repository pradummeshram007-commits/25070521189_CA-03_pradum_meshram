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
  IconFeedback,
  IconPlus,
  IconThumbsUp,
  IconTrash,
  IconEdit,
  IconUser,
  IconShield,
  IconCheck,
  IconClock,
  IconArrowUp,
  IconMessageSquare,
  IconAlertTriangle,
  IconSend,
} from '../components/common/Icons';

export const FeedbackPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my'

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest'); // 'newest' | 'upvotes'

  // Comment expansion state
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [commentAnonymous, setCommentAnonymous] = useState({});

  // Create / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academics',
    description: '',
    isAnonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'All',
    'Academics',
    'Faculty',
    'Hostel',
    'Canteen',
    'Transport',
    'Sports',
    'Infrastructure',
    'Events',
    'Other',
  ];

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/feedback?';
      if (activeTab === 'my') url += 'myPosts=true&';
      if (categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (statusFilter !== 'All') url += `status=${encodeURIComponent(statusFilter)}&`;
      if (sortOption) url += `sort=${sortOption}&`;

      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setFeedbacks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Unable to fetch campus feedback.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, statusFilter, sortOption, authFetch, showToast]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleOpenCreateModal = () => {
    setEditingFeedback(null);
    setFormData({
      title: '',
      category: 'Academics',
      description: '',
      isAnonymous: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (fb) => {
    setEditingFeedback(fb);
    setFormData({
      title: fb.title,
      category: fb.category,
      description: fb.description,
      isAnonymous: fb.isAnonymous,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('error', 'Title and description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingFeedback ? `/api/feedback/${editingFeedback._id}` : '/api/feedback';
      const method = editingFeedback ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('success', editingFeedback ? 'Feedback updated!' : 'Feedback published to campus forum!');
        setIsModalOpen(false);
        fetchFeedbacks();
      } else {
        showToast('error', data.message || 'Operation failed.');
      }
    } catch (err) {
      showToast('error', 'Error submitting feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleUpvote = async (id) => {
    try {
      const res = await authFetch(`/api/feedback/${id}/upvote`, { method: 'POST' });
      const updated = await res.json();
      if (res.ok) {
        setFeedbacks((prev) => prev.map((f) => (f._id === id ? updated : f)));
      }
    } catch (err) {
      showToast('error', 'Error toggling upvote.');
    }
  };

  const handleAddComment = async (feedbackId) => {
    const text = newCommentText[feedbackId];
    if (!text || text.trim() === '') return;

    try {
      const res = await authFetch(`/api/feedback/${feedbackId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          isAnonymous: !!commentAnonymous[feedbackId],
        }),
      });
      const updated = await res.json();

      if (res.ok) {
        setFeedbacks((prev) => prev.map((f) => (f._id === feedbackId ? updated : f)));
        setNewCommentText((prev) => ({ ...prev, [feedbackId]: '' }));
        showToast('success', 'Comment posted!');
      } else {
        showToast('error', updated.message || 'Error posting comment.');
      }
    } catch (err) {
      showToast('error', 'Failed to add comment.');
    }
  };

  const handleAdminStatusChange = async (feedbackId, newStatus) => {
    try {
      const res = await authFetch(`/api/feedback/${feedbackId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      if (res.ok) {
        setFeedbacks((prev) => prev.map((f) => (f._id === feedbackId ? updated : f)));
        showToast('success', `Status updated to ${newStatus}`);
      }
    } catch (err) {
      showToast('error', 'Error changing status.');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback post?')) return;
    try {
      const res = await authFetch(`/api/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Feedback removed.');
        fetchFeedbacks();
      }
    } catch (err) {
      showToast('error', 'Error deleting feedback.');
    }
  };

  const toggleComments = (id) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Metrics for Sidebar
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const resolved = feedbacks.filter((f) => f.status === 'Resolved').length;
    const review = feedbacks.filter((f) => f.status === 'Under Review').length;
    const open = feedbacks.filter((f) => f.status === 'Open' || !f.status).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Top 3 by upvotes
    const top3 = [...feedbacks]
      .sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0))
      .slice(0, 3);

    return { total, resolved, review, open, resolutionRate, top3 };
  }, [feedbacks]);

  const isAuthorOrAdmin = (fb) => {
    if (!user || !fb) return false;
    const authorId = fb.user?._id || fb.user;
    return authorId === user.id || authorId === user._id || user.role === 'admin';
  };

  return (
    <AppShell pageTitle="Feedback Hub">
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Hub Header */}
        <HubHeader
          hubNumber="06"
          hubName="Feedback Hub"
          hubColor="#1E6E6A"
          hubTint="#DDEFED"
          eyebrow="HUB 06 · CAMPUS OPEN FORUM & FEEDBACK"
          description="Say what's working and what isn't. Upvote what matters."
          actionLabel="+ Submit feedback"
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
                CAMPUS PULSE: <strong style={{ color: '#1E6E6A' }}>{stats.total} POSTS</strong> ({stats.resolved} RESOLVED)
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: '#DDEFED',
                border: '1px solid #1E6E6A',
                color: '#1E6E6A',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}>
                <IconShield size={12} />
                <span>DEAN'S WEEKLY REVIEW</span>
              </div>
            </div>
          }
        />

        {/* Quick Composer Callout Bar */}
        <section style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Avatar name={user?.name || 'Student'} size={40} />
            <div
              onClick={handleOpenCreateModal}
              style={{
                flex: 1,
                height: '44px',
                padding: '0 1rem',
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Share feedback with the campus… (Academics, Hostel, Mess, Facilities)
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenCreateModal}
              style={{ height: '44px', padding: '0 20px', flexShrink: 0 }}
            >
              Post
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--color-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: '#1E6E6A' }}>•</span> Anonymous posting enabled
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: '#2E6B4E' }}>•</span> PRN verified voting
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: '#A0660E' }}>•</span> Reviewed weekly by Campus Council
            </span>
          </div>
        </section>

        {/* Filter Controls Toolbar */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Top row: Tab Switcher & Sort buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <SegmentedControl
              options={[
                { value: 'all', label: 'Public Campus Feed' },
                { value: 'my', label: 'My Submissions' },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Status Filter Dropdown */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '160px', height: '36px', fontSize: '0.8rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open Only</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </select>

              {/* Sort Segmented Pills */}
              <div style={{
                display: 'flex',
                background: 'var(--color-sunken)',
                padding: '2px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
              }}>
                <button
                  type="button"
                  onClick={() => setSortOption('upvotes')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: sortOption === 'upvotes' ? 700 : 500,
                    background: sortOption === 'upvotes' ? '#1A1A17' : 'transparent',
                    color: sortOption === 'upvotes' ? '#FFFDF9' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ▲ Top
                </button>
                <button
                  type="button"
                  onClick={() => setSortOption('newest')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: sortOption === 'newest' ? 700 : 500,
                    background: sortOption === 'newest' ? '#1A1A17' : 'transparent',
                    color: sortOption === 'newest' ? '#FFFDF9' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  New
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Ribbon */}
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
                  hubColor="#1E6E6A"
                  onClick={() => setCategoryFilter(cat)}
                />
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout (Feed + Right Sidebar) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
          {/* LEFT FEED COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Skeleton height="150px" count={4} />
              </div>
            ) : feedbacks.length === 0 ? (
              <EmptyState
                icon={<IconFeedback size={36} />}
                title={activeTab === 'my' ? 'No feedback submitted by you' : 'No feedback found'}
                description="Share your observations or suggestions to help improve campus life."
                actionLabel="+ Submit feedback"
                onAction={handleOpenCreateModal}
              />
            ) : (
              feedbacks.map((fb) => {
                const isUpvoted = fb.upvotes?.some((id) => id === user?.id || id === user?._id);
                const upvoteCount = fb.upvotes?.length || 0;
                const canManage = isAuthorOrAdmin(fb);
                const isExpanded = !!expandedComments[fb._id];

                return (
                  <article
                    key={fb._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      {/* Vertical Vote Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleUpvote(fb._id)}
                        style={{
                          width: '50px',
                          minHeight: '74px',
                          borderRadius: '10px',
                          background: isUpvoted ? '#1E6E6A' : 'var(--color-card)',
                          color: isUpvoted ? '#FFFDF9' : 'var(--text-primary)',
                          border: isUpvoted ? '1px solid #1E6E6A' : '1px solid var(--color-border)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <IconArrowUp size={18} />
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          fontWeight: 700,
                          lineHeight: 1,
                        }}>
                          {upvoteCount}
                        </span>
                      </button>

                      {/* Content Body */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Header chips row */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                          marginBottom: '0.4rem',
                        }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-border)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: 'var(--text-secondary)',
                          }}>
                            {fb.category}
                          </span>

                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: fb.status === 'Resolved' ? '#E2EFE7' : (fb.status === 'Under Review' ? '#FBF0D9' : '#EDE7DA'),
                            color: fb.status === 'Resolved' ? '#2E6B4E' : (fb.status === 'Under Review' ? '#A0660E' : '#57534A'),
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            {fb.status === 'Resolved' && <IconCheck size={12} />}
                            <span>{fb.status || 'Open'}</span>
                          </span>

                          <span style={{
                            marginLeft: 'auto',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                          }}>
                            #FB-{fb._id.slice(-4).toUpperCase()}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          lineHeight: 1.35,
                          marginBottom: '0.35rem',
                        }}>
                          {fb.title}
                        </h3>

                        {/* Description */}
                        <p style={{
                          fontSize: '0.88rem',
                          lineHeight: 1.55,
                          color: 'var(--text-secondary)',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                        }}>
                          {fb.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & Controls Footer */}
                    <div style={{
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                      }}>
                        {fb.isAnonymous ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: '#EDE7DA',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                            }}>
                              <IconUser size={12} />
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Anonymous Student</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Avatar name={fb.user?.name || 'Student'} size={20} />
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {fb.user?.name || 'Student'}
                            </span>
                            {fb.user?.department && (
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                ({fb.user.department})
                              </span>
                            )}
                          </div>
                        )}

                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {/* Admin Status Selector */}
                        {user?.role === 'admin' && (
                          <select
                            className="form-select"
                            style={{ width: 'auto', height: '32px', fontSize: '0.75rem', padding: '0 8px' }}
                            value={fb.status || 'Open'}
                            onChange={(e) => handleAdminStatusChange(fb._id, e.target.value)}
                          >
                            <option value="Open">Status: Open</option>
                            <option value="Under Review">Status: Review</option>
                            <option value="Resolved">Status: Resolved</option>
                          </select>
                        )}

                        {/* Comment Toggle */}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{
                            height: '32px',
                            padding: '0 10px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                          onClick={() => toggleComments(fb._id)}
                        >
                          <IconMessageSquare size={14} />
                          <span>{fb.comments?.length || 0} comments</span>
                        </button>

                        {/* Author / Admin Quick Actions */}
                        {canManage && (
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ height: '32px', width: '32px', padding: 0 }}
                              title="Edit feedback"
                              onClick={() => handleOpenEditModal(fb)}
                            >
                              <IconEdit size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn"
                              style={{
                                height: '32px',
                                width: '32px',
                                padding: 0,
                                background: '#FFFDF9',
                                border: '1px solid #ffdad6',
                                color: '#D7261E',
                              }}
                              title="Delete feedback"
                              onClick={() => handleDeleteFeedback(fb._id)}
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Collapsible Comments Section */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '0.5rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px dashed var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}>
                        {/* Existing comments list */}
                        {fb.comments && fb.comments.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {fb.comments.map((cm, idx) => (
                              <div
                                key={idx}
                                style={{
                                  background: 'var(--color-paper)',
                                  padding: '0.6rem 0.85rem',
                                  borderRadius: '6px',
                                  border: '1px solid var(--color-border)',
                                  fontSize: '0.82rem',
                                }}
                              >
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  marginBottom: '0.25rem',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.7rem',
                                }}>
                                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {cm.isAnonymous ? 'Anonymous Student' : (cm.user?.name || 'Student')}
                                  </span>
                                  <span style={{ color: 'var(--text-muted)' }}>
                                    {cm.createdAt ? new Date(cm.createdAt).toLocaleDateString() : ''}
                                  </span>
                                </div>
                                <div style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
                                  {cm.text}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No comments yet. Be the first to share your perspective.
                          </div>
                        )}

                        {/* Add Comment Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ height: '38px', fontSize: '0.82rem' }}
                              placeholder="Write a constructive response or follow up..."
                              value={newCommentText[fb._id] || ''}
                              onChange={(e) => setNewCommentText({ ...newCommentText, [fb._id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddComment(fb._id);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ height: '38px', padding: '0 14px' }}
                              onClick={() => handleAddComment(fb._id)}
                            >
                              <IconSend size={14} />
                            </button>
                          </div>

                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={!!commentAnonymous[fb._id]}
                              onChange={(e) => setCommentAnonymous({ ...commentAnonymous, [fb._id]: e.target.checked })}
                              style={{ accentColor: '#1E6E6A', width: '14px', height: '14px' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Post comment anonymously
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          {/* RIGHT SIDEBAR (320px Sticky) */}
          <aside style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'sticky',
            top: '80px',
          }}>
            {/* Card 1: THIS WEEK PROGRESS */}
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              padding: '1.25rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1E6E6A',
                letterSpacing: '0.08em',
              }}>
                <span>CAMPUS RESOLUTION STATUS</span>
                <span>WEEKLY</span>
              </div>

              <div style={{ marginTop: '0.85rem' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {stats.total} posts · {stats.resolved} resolved
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginTop: '0.25rem',
                }}>
                  <span>Resolution rate</span>
                  <strong style={{ color: '#2E6B4E' }}>{stats.resolutionRate}%</strong>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--color-paper)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  display: 'flex',
                  border: '1px solid var(--color-border)',
                  marginTop: '0.65rem',
                }}>
                  <div style={{ width: `${stats.resolutionRate}%`, background: '#2E6B4E' }} />
                  <div style={{ width: `${stats.total > 0 ? (stats.review / stats.total) * 100 : 0}%`, background: '#A0660E' }} />
                </div>

                {/* Metrics Breakdown Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <div style={{ background: 'var(--color-paper)', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>OPEN</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{stats.open}</div>
                  </div>
                  <div style={{ background: '#FBF0D9', color: '#A0660E', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.65rem' }}>REVIEW</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{stats.review}</div>
                  </div>
                  <div style={{ background: '#E2EFE7', color: '#2E6B4E', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.65rem' }}>CLOSED</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{stats.resolved}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: TOP 3 MOST UPVOTED */}
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              padding: '1.25rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.08em',
              }}>
                <span>MOST UPVOTED ISSUES</span>
                <span style={{ color: '#1E6E6A' }}>TOP 3</span>
              </div>

              {stats.top3.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.75rem' }}>
                  No upvoted feedback yet.
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats.top3.map((issue, idx) => (
                    <li
                      key={issue._id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        paddingBottom: '0.5rem',
                        borderBottom: idx < stats.top3.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          lineHeight: 1.3,
                        }}>
                          {issue.title}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                        }}>
                          {issue.category} · {issue.status || 'Open'}
                        </div>
                      </div>

                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#DDEFED',
                        color: '#1E6E6A',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        ▲ {issue.upvotes?.length || 0}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Card 3: Campus Policy Note */}
            <div style={{
              background: 'var(--color-sunken)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              padding: '1rem',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
            }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                Campus Voice Guidelines
              </strong>
              Constructive ideas and specific infrastructure reports are shared directly with facility heads every Friday afternoon. Keep posts civil, respectful, and focused on solutions.
            </div>
          </aside>
        </div>

        {/* Submit / Edit Feedback Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingFeedback ? 'Edit Campus Feedback' : 'Submit Feedback to Campus Hub'}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="fb-title" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Summary / Issue Title *
              </label>
              <input
                id="fb-title"
                type="text"
                className="form-input"
                placeholder="e.g. Hot water timings in BH-2, Need more library power sockets"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="fb-category" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                id="fb-category"
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
              <label htmlFor="fb-description" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Detailed Description & Suggested Solution *
              </label>
              <textarea
                id="fb-description"
                rows="4"
                className="form-textarea"
                placeholder="State the location, specific timings, and practical suggestions to resolve this..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              background: 'var(--color-paper)',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
            }}>
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                style={{ accentColor: '#1E6E6A', width: '16px', height: '16px', marginTop: '2px' }}
              />
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  Submit Anonymously
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Your name and branch will be concealed as "Anonymous Student" on the public feed.
                </span>
              </div>
            </label>

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
              >
                {submitting ? 'Submitting...' : (editingFeedback ? 'Save Changes' : '+ Submit Feedback')}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
};

export default FeedbackPage;

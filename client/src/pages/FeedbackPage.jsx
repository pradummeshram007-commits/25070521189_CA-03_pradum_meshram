import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  IconFeedback,
  IconPlus,
  IconThumbsUp,
  IconTrash,
  IconEdit,
  IconUser,
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
      if (categoryFilter !== 'All') url += `category=${categoryFilter}&`;
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      if (sortOption) url += `sort=${sortOption}&`;

      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setFeedbacks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, statusFilter, sortOption, authFetch]);

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
        showToast('success', editingFeedback ? 'Feedback updated!' : 'Feedback posted!');
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
        showToast('success', `Status changed to ${newStatus}`);
      }
    } catch (err) {
      showToast('error', 'Error changing status.');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
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

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Feedback Hub</h1>
          <p className="page-subtitle">
            Voice suggestions, report campus issues, upvote student ideas, and track resolutions
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <IconPlus size={18} /> Submit Feedback
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📢 Public Campus Feed
        </button>
        <button
          className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          👤 My Submitted Feedback
        </button>
      </div>

      {/* Filters Bar */}
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
        <div style={{ flex: '1 1 180px' }}>
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

        <div style={{ flex: '1 1 160px' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <Loader message="Loading feedback posts..." />
      ) : feedbacks.length === 0 ? (
        <EmptyState
          icon={<IconFeedback size={32} />}
          title={activeTab === 'my' ? 'You have not submitted any feedback yet' : 'No feedback found'}
          description="Have an idea for campus improvement or a concern? Post it here!"
          actionLabel="Submit Feedback"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {feedbacks.map((fb) => {
            const isAuthor = fb.isOwner || (user?.role === 'admin');
            const showComments = !!expandedComments[fb._id];

            return (
              <div key={fb._id} className="card">
                <div className="card-body">
                  {/* Top Bar: Category & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge badge-warning">{fb.category}</span>
                      <span className={`badge ${fb.status === 'Resolved' ? 'badge-resolved' : fb.status === 'Under Review' ? 'badge-open' : 'badge-danger'}`}>
                        {fb.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                    {fb.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {fb.description}
                  </p>

                  {/* Author Line (Strict Anonymity Protected) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: fb.isAnonymous ? 'var(--accent-crimson)' : 'var(--text-muted)',
                    fontWeight: 500,
                    marginBottom: '1rem',
                  }}>
                    <IconUser size={15} />
                    <span>
                      {fb.isAnonymous ? 'Posted Anonymously (Identity Protected)' : `By ${fb.user?.name || 'Student'}`}
                    </span>
                  </div>

                  {/* Upvote & Action Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Upvote Button */}
                      <button
                        className={`btn btn-sm ${fb.hasUpvoted ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleToggleUpvote(fb._id)}
                      >
                        <IconThumbsUp size={15} />
                        <span>{fb.upvotesCount || 0} Upvotes</span>
                      </button>

                      {/* Comments Toggle */}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleComments(fb._id)}
                      >
                        💬 {fb.commentsCount || 0} Comments {showComments ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* Admin Status Changer */}
                    {user?.role === 'admin' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          ADMIN STATUS:
                        </span>
                        <select
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                          value={fb.status}
                          onChange={(e) => handleAdminStatusChange(fb._id, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    )}

                    {/* Author Edit / Delete */}
                    {isAuthor && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(fb)}
                          title="Edit Feedback"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteFeedback(fb._id)}
                          title="Delete Feedback"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Comments Section */}
                  {showComments && (
                    <div style={{
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px dashed var(--border-subtle)',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                    }}>
                      <h4 style={{ fontSize: '0.92rem', marginBottom: '0.75rem', color: 'var(--primary-navy)' }}>
                        Discussion ({fb.comments?.length || 0})
                      </h4>

                      {/* Existing comments */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
                        {fb.comments && fb.comments.length > 0 ? (
                          fb.comments.map((c, i) => (
                            <div
                              key={i}
                              style={{
                                background: '#fff',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                                <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                                  {c.isAnonymous ? 'Anonymous Student' : c.user?.name || 'Student'}
                                </span>
                                <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{c.text}</p>
                            </div>
                          ))
                        ) : (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No comments yet. Start the conversation!
                          </p>
                        )}
                      </div>

                      {/* Add Comment Input */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Add your comment..."
                            value={newCommentText[fb._id] || ''}
                            onChange={(e) => setNewCommentText({ ...newCommentText, [fb._id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(fb._id);
                            }}
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddComment(fb._id)}
                          >
                            Comment
                          </button>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={!!commentAnonymous[fb._id]}
                            onChange={(e) => setCommentAnonymous({ ...commentAnonymous, [fb._id]: e.target.checked })}
                          />
                          <span>Comment anonymously</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFeedback ? 'Edit Feedback' : 'Submit Campus Feedback'}
      >
        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="fbTitle">Feedback Title *</label>
            <input
              id="fbTitle"
              type="text"
              className="form-input"
              placeholder="e.g. Extend Library Hours During Midterms"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fbCategory">Category *</label>
            <select
              id="fbCategory"
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
            <label className="form-label" htmlFor="fbDesc">Description *</label>
            <textarea
              id="fbDesc"
              rows="4"
              className="form-textarea"
              placeholder="Explain the suggestion, problem, or feedback in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.65rem 0.85rem',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}>
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Post anonymously (Never shows your name or PRN to anyone)
              </span>
            </label>
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
              {submitting ? 'Submitting...' : (editingFeedback ? 'Save Changes' : 'Post Feedback')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeedbackPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import {
  IconEmergency,
  IconPhone,
  IconCopy,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
} from '../components/common/Icons';

export const EmergencyPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Admin Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    category: 'College',
    name: '',
    role: '',
    phone: '',
    isPlaceholder: true,
    notes: '',
  });

  const categories = ['College', 'Medical', 'Police', 'Fire', 'Helpline'];

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/emergency?';
      if (categoryFilter !== 'All') url += `category=${categoryFilter}&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setContacts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, search, authFetch]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleCopyPhone = (phone, name) => {
    // Strip note text if any for clean dialing
    const cleanNumber = phone.replace(/[^0-9+]/g, '');
    navigator.clipboard.writeText(cleanNumber || phone);
    showToast('success', `Copied ${name}'s contact number!`);
  };

  const handleOpenCreateModal = () => {
    setEditingContact(null);
    setFormData({
      category: 'College',
      name: '',
      role: '',
      phone: '',
      isPlaceholder: true,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      category: contact.category,
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      isPlaceholder: contact.isPlaceholder,
      notes: contact.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const url = editingContact ? `/api/emergency/${editingContact._id}` : '/api/emergency';
      const method = editingContact ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('success', editingContact ? 'Contact updated!' : 'Emergency contact added!');
        setIsModalOpen(false);
        fetchContacts();
      } else {
        showToast('error', data.message || 'Operation failed.');
      }
    } catch (err) {
      showToast('error', 'Error saving contact.');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this emergency contact?')) return;
    try {
      const res = await authFetch(`/api/emergency/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Emergency contact removed.');
        fetchContacts();
      }
    } catch (err) {
      showToast('error', 'Failed to delete contact.');
    }
  };

  // Group contacts by category
  const groupedContacts = categories.reduce((acc, cat) => {
    const list = contacts.filter((c) => c.category === cat);
    if (list.length > 0) acc[cat] = list;
    return acc;
  }, {});

  return (
    <div className="page-container">
      {/* Big 112 Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem 2rem',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.2)',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}>
            National Emergency Services
          </div>
          <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.7rem)', color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>
            112 : All-In-One Emergency
          </h1>
          <p style={{ color: '#fecaca', fontSize: '1rem', lineHeight: 1.5 }}>
            Immediate single-number national hotline connecting you to Police, Fire, Ambulance,
            and Disaster Management anywhere across India.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="tel:112"
            className="btn btn-lg"
            style={{
              background: '#ffffff',
              color: '#991b1b',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            <IconPhone size={20} /> Dial 112 Now
          </a>
        </div>
      </div>

      {/* Header and Admin Add Button */}
      <div className="page-header">
        <div>
          <h2 className="page-title">SIT Nagpur Emergency Contacts</h2>
          <p className="page-subtitle">
            College security, resident wardens, campus health room, and verified national helplines
          </p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <IconPlus size={18} /> Add Contact (Admin)
          </button>
        )}
      </div>

      {/* Search and Category Filter */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-subtle)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
      }}>
        <div style={{ flex: '2 1 240px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by contact name, department, or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
      </div>

      {/* Contacts List Grouped */}
      {loading ? (
        <Loader message="Loading emergency contacts..." />
      ) : Object.keys(groupedContacts).length === 0 ? (
        <div className="empty-state">
          <p style={{ color: 'var(--text-muted)' }}>No emergency contacts match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {Object.entries(groupedContacts).map(([groupName, contactList]) => (
            <div key={groupName}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
                borderBottom: '2px solid var(--border-subtle)',
                paddingBottom: '0.5rem',
              }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)' }}>
                  {groupName} Contacts ({contactList.length})
                </h3>
              </div>

              <div className="grid-cards">
                {contactList.map((c) => {
                  const cleanTel = c.phone.replace(/[^0-9+]/g, '');
                  return (
                    <div key={c._id} className="card">
                      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="badge badge-warning" style={{ marginBottom: '0.35rem' }}>
                              {c.category}
                            </span>
                            <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)' }}>
                              {c.name}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {c.role}
                            </p>
                          </div>
                          {c.isPlaceholder && (
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              background: '#fef3c7',
                              color: '#b45309',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px',
                            }}>
                              PLACEHOLDER
                            </span>
                          )}
                        </div>

                        {/* Phone Display */}
                        <div style={{
                          background: 'var(--bg-subtle)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--primary-navy)',
                          wordBreak: 'break-all',
                        }}>
                          {c.phone}
                        </div>

                        {c.notes && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {c.notes}
                          </p>
                        )}

                        {/* Actions */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.5rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border-subtle)',
                        }}>
                          <a
                            href={`tel:${cleanTel || c.phone}`}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1 }}
                          >
                            <IconPhone size={14} /> Call
                          </a>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleCopyPhone(c.phone, c.name)}
                            title="Copy number"
                          >
                            <IconCopy size={14} /> Copy
                          </button>

                          {/* Admin Edit / Delete */}
                          {user?.role === 'admin' && (
                            <>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleOpenEditModal(c)}
                                title="Edit"
                              >
                                <IconEdit size={14} />
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteContact(c._id)}
                                title="Delete"
                              >
                                <IconTrash size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact (Admin)'}
      >
        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contact / Office Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Campus Security Main Gate"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department / Role *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 24/7 Security Gate & Rapid Response"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. +91 712-000-0001 (PLACEHOLDER)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isPlaceholder}
                onChange={(e) => setFormData({ ...formData, isPlaceholder: e.target.checked })}
              />
              <span>Mark as PLACEHOLDER (for college dummy numbers)</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Internal Notes (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Nearest gate checkpoint"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
            <button type="submit" className="btn btn-primary">
              {editingContact ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyPage;

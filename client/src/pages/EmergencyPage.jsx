import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AppShell from '../components/common/AppShell';
import HubHeader from '../components/common/HubHeader';
import Chip from '../components/common/Chip';
import Modal from '../components/common/Modal';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import {
  IconEmergency,
  IconPhone,
  IconCopy,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconShield,
  IconAlertTriangle,
  IconCheck,
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
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', 'College', 'Medical', 'Police', 'Fire', 'Helpline'];

  const quickHotlines = [
    { title: 'Ambulance', desc: 'Emergency Medical Dispatch', number: '108', category: 'Medical' },
    { title: 'Police', desc: 'City Control Room', number: '100', category: 'Police' },
    { title: 'Fire Rescue', desc: 'Disaster & Fire Response', number: '101', category: 'Fire' },
    { title: 'Women Safety', desc: 'National Helpline Cell', number: '1091', category: 'Helpline' },
  ];

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/emergency?';
      if (categoryFilter !== 'All') url += `category=${categoryFilter}&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setContacts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Unable to fetch emergency contacts.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, search, authFetch, showToast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleCopyPhone = (phone, name) => {
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
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('error', 'Contact name and phone number are required.');
      return;
    }

    setSubmitting(true);
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
        showToast('success', editingContact ? 'Contact updated!' : 'Emergency contact published!');
        setIsModalOpen(false);
        fetchContacts();
      } else {
        showToast('error', data.message || 'Operation failed.');
      }
    } catch (err) {
      showToast('error', 'Error saving emergency contact.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this emergency directory entry?')) return;
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
  const groupedContacts = useMemo(() => {
    const groups = {};
    const relevantCats = categoryFilter === 'All'
      ? ['College', 'Medical', 'Police', 'Fire', 'Helpline']
      : [categoryFilter];

    relevantCats.forEach((cat) => {
      const list = contacts.filter((c) => c.category === cat);
      if (list.length > 0) groups[cat] = list;
    });
    return groups;
  }, [contacts, categoryFilter]);

  return (
    <AppShell pageTitle="Emergency Hub">
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Hub Header */}
        <HubHeader
          hubNumber="05"
          hubName="Emergency Hub"
          hubColor="#D7261E"
          hubTint="#FCE4E2"
          eyebrow="HUB 05 · CRISIS & CAMPUS SAFETY DESK"
          description="Verified helpline numbers, security desks, ambulance dispatch, and warden contacts with instant one-tap calling."
          actionLabel={user?.role === 'admin' ? '+ Add contact' : null}
          onAction={user?.role === 'admin' ? handleOpenCreateModal : null}
          actionIcon={<IconPlus size={16} />}
          subLedger={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
              }}>
                DIRECTORY STATUS: <strong style={{ color: '#D7261E' }}>24/7 ACTIVE DISPATCH</strong>
              </div>
              {user?.role === 'admin' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: '#EDE7DA',
                  border: '1px solid var(--color-border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}>
                  <IconShield size={12} color="#7B1E2E" />
                  <span>ADMIN PRIVILEGES ENABLED</span>
                </div>
              )}
            </div>
          }
        />

        {/* 2. Top Banner: All-in-One Emergency Dispatch (112) */}
        <section style={{
          background: '#D7261E',
          color: '#FFFDF9',
          borderRadius: 'var(--radius-card)',
          padding: '1.75rem 2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ maxWidth: '680px', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: 'rgba(255, 253, 249, 0.9)',
              marginBottom: '0.25rem',
            }}>
              <IconEmergency size={14} />
              <span>ALL-IN-ONE NATIONAL EMERGENCY DISPATCH</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '3.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0.25rem 0',
            }}>
              112
            </div>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: 'rgba(255, 253, 249, 0.95)',
              margin: 0,
            }}>
              Police, Fire, Medical, and Disaster Rescue dispatch. Toll-free, 24/7 coverage from any mobile network across India without prefix.
            </p>
          </div>

          <div style={{ zIndex: 2 }}>
            <a
              href="tel:112"
              className="btn"
              style={{
                height: '48px',
                padding: '0 28px',
                background: '#FFFDF9',
                color: '#D7261E',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              }}
            >
              <IconPhone size={20} color="#D7261E" />
              <span>Call 112 Now</span>
            </a>
          </div>
        </section>

        {/* 3. Quick Hotlines (Grid of 4) */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          {quickHotlines.map((hotline) => (
            <a
              key={hotline.number}
              href={`tel:${hotline.number}`}
              style={{
                background: '#FCE4E2',
                border: '1px solid #F3C2BE',
                borderRadius: '12px',
                padding: '1.25rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                transition: 'all 0.15s ease',
              }}
            >
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.2rem',
                }}>
                  {hotline.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {hotline.desc}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.85rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {hotline.number}
                </span>

                <span style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: '#FFFDF9',
                  border: '1px solid #F3C2BE',
                  color: '#D7261E',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <IconPhone size={13} color="#D7261E" />
                  <span>Call {hotline.number}</span>
                </span>
              </div>
            </a>
          ))}
        </section>

        {/* 4. Filter and Search Controls */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
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
                height: '42px',
                paddingLeft: '38px',
                background: 'var(--color-paper)',
                fontSize: '0.88rem',
              }}
              placeholder="Search contacts, wardens, security desks, clinics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Chips Ribbon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}>
            {categories.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <Chip
                  key={cat}
                  label={cat === 'All' ? 'All Contacts' : cat}
                  active={active}
                  hubColor="#D7261E"
                  onClick={() => setCategoryFilter(cat)}
                />
              );
            })}
          </div>
        </div>

        {/* 5. Grouped Directory List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="72px" count={5} />
          </div>
        ) : Object.keys(groupedContacts).length === 0 ? (
          <EmptyState
            icon={<IconEmergency size={36} />}
            title="No emergency contacts found"
            description="Clear your search query or check other category filters."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {Object.entries(groupedContacts).map(([cat, list]) => (
              <section key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Group Heading */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '0.4rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-secondary)',
                  }}>
                    GROUP · {cat.toUpperCase()} CONTACTS
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                  }}>
                    ({list.length} {list.length === 1 ? 'ENTRY' : 'ENTRIES'})
                  </span>
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {list.map((c) => (
                    <article
                      key={c._id}
                      className="card"
                      style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px', flex: '1 1 auto' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#FCE4E2',
                          color: '#D7261E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <IconEmergency size={20} color="#D7261E" />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                            }}>
                              {c.name}
                            </span>
                            {c.isPlaceholder && (
                              <span style={{
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: '#EDE7DA',
                                border: '1px dashed var(--color-border)',
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                              }}>
                                PLACEHOLDER
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                            {c.role} {c.notes ? `· ${c.notes}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Phone & Call CTA */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexShrink: 0,
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          letterSpacing: '0.02em',
                        }}>
                          {c.phone}
                        </span>

                        <a
                          href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                          className="btn"
                          style={{
                            height: '36px',
                            padding: '0 14px',
                            background: '#D7261E',
                            color: '#FFFDF9',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <IconPhone size={14} color="#FFFDF9" />
                          <span>Call</span>
                        </a>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ height: '36px', width: '36px', padding: 0 }}
                          title="Copy phone number"
                          onClick={() => handleCopyPhone(c.phone, c.name)}
                        >
                          <IconCopy size={15} />
                        </button>

                        {user?.role === 'admin' && (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ height: '36px', width: '36px', padding: 0 }}
                              title="Edit contact"
                              onClick={() => handleOpenEditModal(c)}
                            >
                              <IconEdit size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn"
                              style={{
                                height: '36px',
                                width: '36px',
                                padding: 0,
                                background: '#FFFDF9',
                                border: '1px solid #ffdad6',
                                color: '#D7261E',
                              }}
                              title="Delete contact"
                              onClick={() => handleDeleteContact(c._id)}
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Admin Contact Add / Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
          maxWidth="560px"
        >
          <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="contact-category" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Directory Category *
              </label>
              <select
                id="contact-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {['College', 'Medical', 'Police', 'Fire', 'Helpline'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Contact / Desk Name *
              </label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="e.g. Main Security Desk Gate 1, Hostel Warden Girls"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-role" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Role / Location *
              </label>
              <input
                id="contact-role"
                type="text"
                className="form-input"
                placeholder="e.g. Gate 1 Reception, Main Campus Entry"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-phone" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Phone Number / Extension *
              </label>
              <input
                id="contact-phone"
                type="text"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                placeholder="+91 712 2819201"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-notes" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Operating Notes (Optional)
              </label>
              <input
                id="contact-notes"
                type="text"
                className="form-input"
                placeholder="e.g. 24/7 Desk, After 18:00 on call"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isPlaceholder}
                onChange={(e) => setFormData({ ...formData, isPlaceholder: e.target.checked })}
                style={{ accentColor: '#D7261E', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Mark as placeholder/sample contact until official confirmation
              </span>
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
                {submitting ? 'Saving...' : (editingContact ? 'Save Changes' : '+ Add Contact')}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
};

export default EmergencyPage;

import React, { useState, useEffect } from 'react';
import { adminService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'stores') {
      fetchStores();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await adminService.getDashboardStats();
      setStats(result.stats);
    } catch (error) {
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllUsers();
      setUsers(result.users);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllStores();
      setStores(result.stores);
    } catch (error) {
      setError('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      try {
        await adminService.deleteStore(storeId);
        fetchStores();
      } catch (error) {
        alert('Failed to delete store');
      }
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">📊 Dashboard Overview</h2>
        <p className="text-secondary text-center">
          Real-time statistics and insights
        </p>
      </div>

      {stats && (
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
                <h3 className="card-title">Total Users</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)', margin: 0 }}>
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏪</div>
                <h3 className="card-title">Total Stores</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-color)', margin: 0 }}>
                  {stats.totalStores}
                </p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</div>
                <h3 className="card-title">Total Ratings</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning-color)', margin: 0 }}>
                  {stats.totalRatings}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">👥 User Management</h2>
        <p className="text-secondary text-center">
          Manage all registered users
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Users ({users.length})</h3>
        </div>
        <div className="card-body" style={{ padding: 0, overflow: 'auto' }}>
          {users.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--bg-light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Address</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="nav-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {user.address ? user.address.substring(0, 50) + (user.address.length > 50 ? '...' : '') : 'Not provided'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: user.role === 'admin' ? 'rgba(231, 76, 60, 0.1)' :
                          user.role === 'store_owner' ? 'rgba(52, 152, 219, 0.1)' :
                            'rgba(149, 165, 166, 0.1)',
                        color: user.role === 'admin' ? 'var(--danger-color)' :
                          user.role === 'store_owner' ? 'var(--primary-color)' :
                            'var(--text-secondary)'
                      }}>
                        {user.role === 'admin' ? '👑 Admin' :
                          user.role === 'store_owner' ? '🏪 Store Owner' :
                            '👤 User'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-danger btn-small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center" style={{ padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <h3 className="text-secondary">No users found</h3>
              <p className="text-muted">No users have registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStores = () => (
    <div className="stores-section">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">🏪 Store Management</h2>
        <p className="text-secondary text-center">
          Manage all registered stores
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Stores ({stores.length})</h3>
        </div>
        <div className="card-body" style={{ padding: 0, overflow: 'auto' }}>
          {stores.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--bg-light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Store</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Contact</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>Rating</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Owner</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <strong>{store.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ID: {store.id}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{store.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {store.address ? store.address.substring(0, 50) + (store.address.length > 50 ? '...' : '') : 'Not provided'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div>
                        <strong>{store.average_rating ? Number(store.average_rating).toFixed(1) : 'N/A'}</strong> ⭐
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {store.total_ratings} rating{store.total_ratings !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {store.owner_name || 'No owner assigned'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteStore(store.id)}
                        className="btn btn-danger btn-small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center" style={{ padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
              <h3 className="text-secondary">No stores found</h3>
              <p className="text-muted">No stores have been registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        padding: '0.5rem',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`btn ${activeTab === 'stores' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          🏪 Stores
        </button>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="message message-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'stores' && renderStores()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

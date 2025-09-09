import React, { useState, useEffect } from 'react';
import { storeService, ratingService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    sortBy: 'name',
    sortOrder: 'ASC',
  });

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const result = await storeService.getAllStores(filters);
      setStores(result.stores);
    } catch (error) {
      setError('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await ratingService.submitRating(storeId, rating);
      fetchStores(); // Refresh to get updated ratings
    } catch (error) {
      alert('Failed to submit rating');
    }
  };

  const handleRatingUpdate = async (storeId, rating) => {
    try {
      await ratingService.updateRating(storeId, rating);
      fetchStores(); // Refresh to get updated ratings
    } catch (error) {
      alert('Failed to update rating');
    }
  };

  const StarRating = ({ storeId, currentRating, averageRating, onSubmit, onUpdate }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleClick = (rating) => {
      if (currentRating) {
        onUpdate(storeId, rating);
      } else {
        onSubmit(storeId, rating);
      }
    };

    return (
      <div className="star-rating" style={{ marginTop: '1rem' }}>
        <div className="average-rating" style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <strong>Average Rating:</strong> {averageRating ? Number(averageRating).toFixed(1) : 'No ratings'} ⭐
        </div>
        <div className="user-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Your rating: </span>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="star"
                style={{
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease',
                  filter: star <= (hoveredRating || currentRating) ? 'grayscale(0)' : 'grayscale(1)',
                  transform: hoveredRating === star ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleClick(star)}
              >
                ⭐
              </span>
            ))}
          </div>
          {currentRating && (
            <span className="current-rating" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              (Current: {currentRating})
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="container">
      <div className="message message-error">
        <strong>Error:</strong> {error}
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">🏪 Store Directory</h1>
        <p className="text-secondary text-center">
          Discover and rate stores in your area
        </p>
      </div>

      {/* Filters Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">🔍 Search & Filter</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Store Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search by store name..."
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-input"
                  value={filters.address}
                  onChange={handleFilterChange}
                  placeholder="Search by address..."
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="sortBy" className="form-label">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  className="form-select"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="name">Name</option>
                  <option value="address">Address</option>
                  <option value="average_rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="sortOrder" className="form-label">
                  Order
                </label>
                <select
                  id="sortOrder"
                  name="sortOrder"
                  className="form-select"
                  value={filters.sortOrder}
                  onChange={handleFilterChange}
                >
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {stores.length > 0 ? (
        <div className="row">
          {stores.map((store) => (
            <div key={store.id} className="col" style={{ marginBottom: '1.5rem' }}>
              <div className="card h-full">
                <div className="card-header">
                  <h3 className="card-title">{store.name}</h3>
                </div>
                <div className="card-body">
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>
                      <strong>📍 Address:</strong>
                    </p>
                    <p className="text-secondary" style={{ marginLeft: '1rem' }}>
                      {store.address}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>
                      <strong>📧 Contact:</strong>
                    </p>
                    <p className="text-secondary" style={{ marginLeft: '1rem' }}>
                      {store.email}
                    </p>
                  </div>

                  <StarRating
                    storeId={store.id}
                    currentRating={store.user_rating}
                    averageRating={store.average_rating}
                    onSubmit={handleRatingSubmit}
                    onUpdate={handleRatingUpdate}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 className="text-secondary">No stores found</h3>
          <p className="text-muted">
            Try adjusting your search criteria to find stores.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stores;

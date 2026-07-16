import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = ({ setCurrentPage }) => {
  const { user, updateProfile, logout } = useAuth();
  
  // Addresses and Orders state
  const [addresses, setAddresses] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [isAddressesLoading, setIsAddressesLoading] = useState(true);

  // Editing profile details form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  // Adding new address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  });

  // Feedback states
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // Sync profileForm with user prop on change
  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Fetch Saved Addresses and Orders Count
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch addresses
    try {
      const res = await fetch('http://localhost:5000/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setIsAddressesLoading(false);
    }

    // Fetch orders count
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrdersCount(data.orders.length);
      }
    } catch (err) {
      console.error('Error fetching orders count:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Profile Info
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setProfileError('');
    setProfileSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const { name, email, password, confirmPassword } = profileForm;
    if (!name || !email) {
      setProfileError('Name and Email are required.');
      return;
    }

    if (password && password !== confirmPassword) {
      setProfileError('Passwords do not match.');
      return;
    }

    setIsSubmittingProfile(true);
    const res = await updateProfile(name, email, password || undefined);
    setIsSubmittingProfile(false);

    if (res.success) {
      setProfileSuccess('Profile updated successfully!');
      setIsEditingProfile(false);
      setProfileForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } else {
      setProfileError(res.message || 'Failed to update profile.');
    }
  };

  // Add Address
  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    setAddressError('');
    setAddressSuccess('');
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressError('');
    setAddressSuccess('');

    const { fullName, phone, streetAddress, city, state, pinCode } = addressForm;
    if (!fullName || !phone || !streetAddress || !city || !state || !pinCode) {
      setAddressError('Please fill in all address fields.');
      return;
    }

    if (phone.length < 10) {
      setAddressError('Phone number must be at least 10 digits.');
      return;
    }

    setIsSubmittingAddress(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });
      const data = await res.json();
      
      if (data.success) {
        setAddresses([data.address, ...addresses]);
        setAddressSuccess('Address saved successfully!');
        setShowAddressForm(false);
        setAddressForm({
          fullName: user?.name || '',
          phone: '',
          streetAddress: '',
          city: '',
          state: '',
          pinCode: '',
          country: 'India',
        });
      } else {
        setAddressError(data.message || 'Failed to save address.');
      }
    } catch (err) {
      console.error(err);
      setAddressError('Server error saving address.');
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(addresses.filter(a => a._id !== addressId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
  };

  return (
    <div className="profile-page">
      <div className="mesh-gradient bg-glow-1"></div>
      <div className="mesh-gradient bg-glow-2"></div>

      <header className="profile-header fade-in">
        <button className="btn-back" onClick={() => setCurrentPage('collections')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Shop
        </button>
        <h1 className="profile-title">Account Dashboard</h1>
      </header>

      <div className="profile-grid fade-in">
        {/* Left column: Profile card */}
        <div className="profile-sidebar-col">
          <div className="profile-info-card glass-panel">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            
            {!isEditingProfile ? (
              <div className="profile-details-view">
                <h2 className="user-profile-name">{user?.name}</h2>
                <p className="user-profile-email">{user?.email}</p>
                <div className="user-status-metrics">
                  <div className="stat-metric">
                    <span className="metric-num">{ordersCount}</span>
                    <span className="metric-label">Orders Placed</span>
                  </div>
                  <div className="stat-metric-divider"></div>
                  <div className="stat-metric">
                    <span className="metric-num">👤</span>
                    <span className="metric-label">Premium Member</span>
                  </div>
                </div>
                
                <div className="profile-card-actions">
                  <button className="btn-primary-glow w-100" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </button>
                  <button className="btn-logout-secondary w-100" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="profile-edit-form">
                {profileError && <p className="form-error-msg">{profileError}</p>}
                {profileSuccess && <p className="form-success-msg">{profileSuccess}</p>}

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password (Optional)</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Min. 6 characters"
                    value={profileForm.password}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={profileForm.confirmPassword}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="profile-form-buttons">
                  <button type="submit" className="btn-primary-glow" disabled={isSubmittingProfile}>
                    {isSubmittingProfile ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileError('');
                      setProfileSuccess('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right column: Address Management */}
        <div className="profile-main-col glass-panel">
          <div className="address-section-header">
            <h2 className="main-section-title">Saved Shipping Addresses</h2>
            {!showAddressForm && (
              <button className="btn-add-address-pill" onClick={() => setShowAddressForm(true)}>
                + Add Address
              </button>
            )}
          </div>

          {addressError && <p className="form-error-msg m-bottom">{addressError}</p>}
          {addressSuccess && <p className="form-success-msg m-bottom">{addressSuccess}</p>}

          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className="new-address-form-profile glass-panel fade-in">
              <h3 className="form-subtitle">New Address</h3>
              
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={addressForm.fullName} 
                    onChange={handleAddressChange}
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={addressForm.phone} 
                    onChange={handleAddressChange}
                    placeholder="10-digit number" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>PIN/ZIP Code</label>
                  <input 
                    type="text" 
                    name="pinCode" 
                    value={addressForm.pinCode} 
                    onChange={handleAddressChange}
                    placeholder="e.g. 400001" 
                    required 
                  />
                </div>
                <div className="form-group span-2">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    name="streetAddress" 
                    value={addressForm.streetAddress} 
                    onChange={handleAddressChange}
                    placeholder="Flat/House no., Building, Street name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={addressForm.city} 
                    onChange={handleAddressChange}
                    placeholder="City" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={addressForm.state} 
                    onChange={handleAddressChange}
                    placeholder="State" 
                    required 
                  />
                </div>
              </div>

              <div className="address-form-buttons">
                <button type="submit" className="btn-primary-glow" disabled={isSubmittingAddress}>
                  {isSubmittingAddress ? 'Saving...' : 'Save Address'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => {
                    setShowAddressForm(false);
                    setAddressError('');
                    setAddressSuccess('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {isAddressesLoading ? (
            <div className="profile-loading">
              <div className="spinner-loader"></div>
              <p>Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="empty-addresses-profile">
              <p>You have no saved addresses. Add a new address above to speed up checkout.</p>
            </div>
          ) : (
            <div className="profile-addresses-list">
              {addresses.map((addr) => (
                <div key={addr._id} className="profile-address-row glass-panel">
                  <div className="addr-row-details">
                    <div className="addr-row-name">
                      <strong>{addr.fullName}</strong>
                      {addr.isDefault && <span className="default-pill">Default</span>}
                    </div>
                    <p className="addr-row-text">
                      {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pinCode}, {addr.country}
                    </p>
                    <p className="addr-row-phone">📞 {addr.phone}</p>
                  </div>
                  <button className="btn-delete-addr" onClick={() => handleDeleteAddress(addr._id)} aria-label="Delete address">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

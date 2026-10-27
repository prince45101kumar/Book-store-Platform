import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_BOOKS, CATEGORIES, INITIAL_ORDERS } from './data/initialData';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bookstore_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth Form State
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('customer');
  const [authError, setAuthError] = useState('');

  // Catalog State
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('bookstore_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All Books');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Cart & Wishlist
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('bookstore_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('bookstore_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders & Live Tracking
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bookstore_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentView, setCurrentView] = useState('catalog');
  const [selectedBook, setSelectedBook] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Checkout State
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: 'Prince Kumar',
    phone: '9876543210',
    pincode: '244901',
    locality: 'Civil Lines',
    address: 'H.No 42, University Enclave',
    city: 'Rampur',
    state: 'Uttar Pradesh'
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Admin New Book Form
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'Computer Science',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    publisher: '',
    pages: '',
    isbn: '',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
  });

  // Storage sync
  useEffect(() => {
    if (user) localStorage.setItem('bookstore_user', JSON.stringify(user));
    else localStorage.removeItem('bookstore_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bookstore_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bookstore_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) {
      setAuthError('Kripya Email aur Password dono bharein.');
      return;
    }
    const loggedUser = {
      name: authEmail.includes('admin') ? 'Store Administrator' : (authName || 'Prince Kumar'),
      email: authEmail,
      role: authEmail.includes('admin') ? 'admin' : authRole,
      memberSince: 'Oct 2026',
      walletBalance: 450
    };
    setUser(loggedUser);
    showToast(`Swagat hai, ${loggedUser.name}!`);
    if (loggedUser.role === 'admin') setCurrentView('admin');
  };

  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      const adminUser = {
        name: 'Executive Admin',
        email: 'admin@bookstore.io',
        role: 'admin',
        memberSince: 'Jan 2026',
        walletBalance: 15000
      };
      setUser(adminUser);
      setCurrentView('admin');
      showToast('Admin Console me logged in!');
    } else {
      const customerUser = {
        name: 'Prince Kumar',
        email: 'prince.cs@university.edu',
        role: 'customer',
        memberSince: 'Oct 2026',
        walletBalance: 450
      };
      setUser(customerUser);
      setCurrentView('catalog');
      showToast('Student Profile (Prince Kumar) active!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('catalog');
    showToast('Logged out successfully.');
  };

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...book, qty: 1 }];
    });
    showToast(`"${book.title.slice(0, 20)}..." Bag me add ho gaya.`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item remove ho gaya.');
  };

  const toggleWishlist = (bookId) => {
    setWishlist((prev) => {
      if (prev.includes(bookId)) {
        showToast('Wishlist se remove hua.');
        return prev.filter((id) => id !== bookId);
      } else {
        showToast('Wishlist me save ho gaya!');
        return [...prev, bookId];
      }
    });
  };

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'STUDENT50' || code === 'BOOK50') {
      setAppliedDiscount(50);
      showToast('50% Student Discount Applied!');
    } else if (code === 'PRINCE10') {
      setAppliedDiscount(10);
      showToast('10% Instant Discount Applied!');
    } else {
      showToast('Invalid Coupon. Try: STUDENT50');
    }
  };

  const cartSummary = useMemo(() => {
    const totalOriginal = cart.reduce((sum, item) => sum + item.originalPrice * item.qty, 0);
    const totalSelling = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const catalogDiscount = totalOriginal - totalSelling;
    const extraDiscount = Math.round((totalSelling * appliedDiscount) / 100);
    const finalAmount = totalSelling - extraDiscount;
    const deliveryFee = finalAmount > 499 || finalAmount === 0 ? 0 : 50;

    return {
      itemsCount: cart.reduce((sum, item) => sum + item.qty, 0),
      totalOriginal,
      totalSelling,
      catalogDiscount,
      extraDiscount,
      deliveryFee,
      totalPayable: finalAmount + deliveryFee
    };
  }, [cart, appliedDiscount]);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      trackingStep: 1,
      carrier: "Express Logistics",
      awbNumber: "EXP-" + Math.floor(1000000 + Math.random() * 9000000),
      currentLocation: "National Central Fulfillment Node",
      estimatedDelivery: "Delivery in 48 Hours",
      items: [...cart],
      amount: cartSummary.totalPayable,
      paymentMethod: paymentMethod.toUpperCase(),
      address: deliveryAddress,
      status: "Processing & Packaging"
    };

    setOrders((prev) => [newOrder, ...prev]);
    setBooks((prev) =>
      prev.map((b) => {
        const cartItem = cart.find((c) => c.id === b.id);
        if (cartItem) {
          return { ...b, stock: Math.max(0, b.stock - cartItem.qty) };
        }
        return b;
      })
    );

    setCart([]);
    setAppliedDiscount(0);
    setCouponCode('');
    setSelectedOrder(newOrder);
    setCurrentView('tracking');
    showToast("Order confirm ho gaya!");
  };

  const handleUpdateOrderStatus = (orderId, newStep) => {
    const statusLabels = [
      "Order Placed",
      "Packed at Fulfillment Hub",
      "In Transit",
      "Out for Courier Delivery",
      "Delivered Safely"
    ];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updated = {
            ...o,
            trackingStep: newStep,
            status: statusLabels[newStep],
            currentLocation: newStep === 4 ? "Delivered to Customer" : (newStep === 3 ? "Local Courier Rider" : (newStep === 2 ? "Regional Transit Center" : o.currentLocation))
          };
          if (selectedOrder && selectedOrder.orderId === orderId) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );
    showToast("Status updated: " + statusLabels[newStep]);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.price) {
      showToast('Zaroori details bharein.');
      return;
    }
    const createdBook = {
      id: "BK-" + Date.now().toString().slice(-4),
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      price: Number(newBook.price),
      originalPrice: Number(newBook.originalPrice || newBook.price * 1.4),
      discount: Math.round(((newBook.originalPrice - newBook.price) / (newBook.originalPrice || 1)) * 100) + "% off",
      rating: 4.9,
      reviewsCount: 1,
      assured: true,
      stock: Number(newBook.stock || 15),
      image: newBook.image,
      description: newBook.description || 'Academic curriculum essential edition.',
      publisher: newBook.publisher || 'Oxford University Press',
      pages: Number(newBook.pages || 400),
      isbn: newBook.isbn || "978-3-16-148410-0",
      language: 'English'
    };

    setBooks([createdBook, ...books]);
    setNewBook({
      title: '',
      author: '',
      category: 'Computer Science',
      price: '',
      originalPrice: '',
      stock: '',
      description: '',
      publisher: '',
      pages: '',
      isbn: '',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    });
    showToast('Nayi Book catalog me add ho gayi!');
  };

  const handleDeleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast('Book delete ho gayi.');
  };

  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => {
        const matchesCategory = selectedCategory === 'All Books' || b.category === selectedCategory;
        const matchesSearch =
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount;
      });
  }, [books, selectedCategory, searchQuery, sortBy]);

  const trackingStages = [
    { title: "Confirmed", desc: "Digital verification complete" },
    { title: "Processed", desc: "Inspected at warehouse" },
    { title: "Dispatched", desc: "Express vehicle departed" },
    { title: "Out for Delivery", desc: "Agent arriving shortly" },
    { title: "Delivered", desc: "Handover signed" }
  ];

  // =========================================================
  // AUTHENTICATION SCREEN: SLATE MODERN GLASS-CARD (NOT FLIPKART)
  // =========================================================
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, #1e1e2f 0%, #0d0e15 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#f8fafc'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '920px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Left Hero */}
          <div style={{
            padding: '48px 40px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', letterSpacing: '0.5px' }}>v2.0 ACADEMIC ENGINE</span>
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '16px' }}>
                Curated Books for Modern Learners.
              </h1>
              <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6 }}>
                Direct-from-publisher academic texts, computer science handbooks, and live transit intelligence.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px', marginTop: '30px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#818cf8', marginBottom: '12px' }}>
                ⚡ Presentation Fast-Track:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => handleDemoLogin('customer')}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    color: '#fff',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '13px',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  Student Portal (Prince Kumar)
                </button>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  Administrator Console
                </button>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              {authMode === 'login' ? 'Sign in to Account' : 'Register Profile'}
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
              {authMode === 'login' ? 'Enter campus credentials to view reading shelf.' : 'Sign up to start building your academic cart.'}
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {authMode === 'signup' && (
                <div>
                  <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Prince Kumar"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px' }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500', display: 'block', marginBottom: '6px' }}>College Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px' }}
                />
              </div>

              {authError && (
                <div style={{ color: '#f87171', fontSize: '13px', padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '15px',
                  marginTop: '10px',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)'
                }}
              >
                {authMode === 'login' ? 'Authenticate Profile' : 'Complete Setup'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <span
                  onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
                  style={{ fontSize: '13px', color: '#a5b4fc', cursor: 'pointer', fontWeight: '500' }}
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already registered? Sign in'}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN APP: MODERN SLATE THEME (NO FLIPKART CLONE)
  // =========================================================
  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#f8fafc',
          padding: '14px 22px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ color: '#4ade80' }}>●</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. MODERN SLEEK APP HEADER */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          
          {/* Brand */}
          <div
            onClick={() => setCurrentView('catalog')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
              B
            </div>
            <div>
              <span style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '-0.3px', color: '#fff' }}>BookStore</span>
              <span style={{ fontSize: '11px', color: '#818cf8', marginLeft: '6px', fontWeight: '600' }}>ACADEMIC</span>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search library by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') setCurrentView('catalog');
              }}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '11px 40px 11px 18px',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
            <span style={{ position: 'absolute', right: '14px', top: '11px', color: '#64748b' }}>🔍</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setCurrentView('dashboard')}
              style={{
                background: currentView === 'dashboard' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: currentView === 'dashboard' ? '1px solid #6366f1' : '1px solid transparent',
                color: '#e2e8f0',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              📊 Student Hub
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                style={{
                  background: currentView === 'admin' ? '#4f46e5' : 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                ⚙️ Admin
              </button>
            )}

            <button
              onClick={() => setCurrentView('orders')}
              style={{
                background: currentView === 'orders' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: '#e2e8f0',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Orders</span>
              {orders.length > 0 && (
                <span style={{ background: '#6366f1', color: '#fff', fontSize: '11px', padding: '1px 6px', borderRadius: '10px' }}>
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('cart')}
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <span>Cart</span>
              {cartSummary.itemsCount > 0 && (
                <span style={{ background: '#fff', color: '#4f46e5', fontSize: '11px', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {cartSummary.itemsCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94a3b8',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '13px'
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* 2. CATEGORY PILLS */}
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', gap: '10px', overflowX: 'auto' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                if (currentView !== 'catalog') setCurrentView('catalog');
              }}
              style={{
                padding: '7px 16px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                background: selectedCategory === cat ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#fff' : '#94a3b8',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN BODY VIEWS */}
      <main style={{ maxWidth: '1280px', margin: '24px auto', padding: '0 24px', flex: 1, width: '100%' }}>
        
        {/* VIEW: CATALOG */}
        {currentView === 'catalog' && (
          <div>
            {/* Minimalist Academic Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '36px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', letterSpacing: '0.8px' }}>SEMESTER 2026 EDITION</span>
                <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', color: '#f8fafc' }}>
                  Engineering, Math & Core Computing Library
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
                  Use code <span style={{ color: '#a5b4fc', fontWeight: 'bold' }}>STUDENT50</span> for 50% discount on standard curricula.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                >
                  <option value="popular">Most Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform 0.2s, border-color 0.2s'
                  }}
                >
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px'
                    }}
                  >
                    {wishlist.includes(book.id) ? '❤️' : '🤍'}
                  </button>

                  <div
                    onClick={() => { setSelectedBook(book); setCurrentView('details'); }}
                    style={{ height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '16px' }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: '600', textTransform: 'uppercase' }}>
                      {book.category}
                    </span>
                    <h3
                      onClick={() => { setSelectedBook(book); setCurrentView('details'); }}
                      style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#f8fafc',
                        margin: '6px 0',
                        cursor: 'pointer',
                        lineHeight: 1.4,
                        height: '42px',
                        overflow: 'hidden'
                      }}
                    >
                      {book.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                      {book.author}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>₹{book.price}</span>
                        <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>₹{book.originalPrice}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '600' }}>{book.discount}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => addToCart(book)}
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        padding: '10px 0',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        addToCart(book);
                        setCurrentView('checkout');
                      }}
                      style={{
                        flex: 1,
                        background: '#6366f1',
                        color: '#fff',
                        padding: '10px 0',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DETAILS */}
        {currentView === 'details' && selectedBook && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '36px',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            gap: '40px'
          }}>
            <div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={selectedBook.image} alt={selectedBook.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => addToCart(selectedBook)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '14px', borderRadius: '10px', fontWeight: '600', fontSize: '14px' }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => { addToCart(selectedBook); setCurrentView('checkout'); }}
                  style={{ flex: 1, background: '#6366f1', color: '#fff', padding: '14px', borderRadius: '10px', fontWeight: '600', fontSize: '14px' }}
                >
                  Instant Checkout
                </button>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '600', textTransform: 'uppercase' }}>{selectedBook.category}</span>
              <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', margin: '8px 0 12px 0' }}>{selectedBook.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '20px' }}>Author: {selectedBook.author} | Publisher: {selectedBook.publisher}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '32px', fontWeight: '800', color: '#fff' }}>₹{selectedBook.price}</span>
                <span style={{ fontSize: '18px', color: '#64748b', textDecoration: 'line-through' }}>₹{selectedBook.originalPrice}</span>
                <span style={{ fontSize: '14px', color: '#4ade80', fontWeight: '600' }}>Save {selectedBook.discount}</span>
              </div>

              <div style={{ margin: '24px 0' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#e2e8f0' }}>Book Synopsis & Curriculum Overview</h4>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{selectedBook.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px', fontSize: '13px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
                <span style={{ color: '#64748b' }}>Standard ISBN</span>
                <span>{selectedBook.isbn}</span>
                <span style={{ color: '#64748b' }}>Total Pages</span>
                <span>{selectedBook.pages}</span>
                <span style={{ color: '#64748b' }}>Language</span>
                <span>{selectedBook.language}</span>
              </div>

              <button
                onClick={() => setCurrentView('catalog')}
                style={{ marginTop: '24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
              >
                ← Back to Browse
              </button>
            </div>
          </div>
        )}

        {/* VIEW: CART */}
        {currentView === 'cart' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                Your Reading Bag ({cartSummary.itemsCount})
              </h2>

              {cart.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '16px' }}>Your book cart is currently empty.</p>
                  <button
                    onClick={() => setCurrentView('catalog')}
                    style={{ background: '#6366f1', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '13px' }}
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
                      <img src={item.image} alt={item.title} style={{ width: '70px', height: '95px', objectFit: 'contain', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{item.title}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{item.author}</p>
                        <span style={{ fontSize: '16px', fontWeight: '700' }}>₹{item.price * item.qty}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => updateCartQty(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}>+</button>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', color: '#f87171', fontSize: '12px', marginLeft: '12px' }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', height: 'fit-content' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Fee Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#fff' }}>₹{cartSummary.totalSelling}</span>
                  </div>
                  {cartSummary.extraDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                      <span>Student Coupon</span>
                      <span>- ₹{cartSummary.extraDiscount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span style={{ color: '#fff' }}>{cartSummary.deliveryFee === 0 ? 'Complimentary' : `₹${cartSummary.deliveryFee}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                    <span>Total</span>
                    <span>₹{cartSummary.totalPayable}</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon (STUDENT50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '13px' }}
                  />
                  <button onClick={applyCoupon} style={{ background: '#6366f1', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                    Apply
                  </button>
                </div>

                <button
                  onClick={() => setCurrentView('checkout')}
                  style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', padding: '14px', borderRadius: '10px', fontWeight: '600', fontSize: '15px' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: CHECKOUT */}
        {currentView === 'checkout' && (
          <div style={{ maxWidth: '780px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Delivery Address & Payment Node</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Recipient</label>
                <input
                  type="text"
                  value={deliveryAddress.name}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', marginTop: '6px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Contact Number</label>
                <input
                  type="text"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', marginTop: '6px' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Full Campus / Residential Address</label>
                <textarea
                  rows={2}
                  value={deliveryAddress.address}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', marginTop: '6px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>City</label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', marginTop: '6px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>Pincode</label>
                <input
                  type="text"
                  value={deliveryAddress.pincode}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', marginTop: '6px' }}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>Payment Mode</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: paymentMethod === 'upi' ? 'rgba(99, 102, 241, 0.15)' : '#1e293b', border: '1px solid #334155', cursor: 'pointer' }}>
                <input type="radio" name="pay" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                <div>
                  <strong>UPI / Direct Gateway (GPay, PhonePe, Paytm)</strong>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Instant verification without gateway surcharge</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: paymentMethod === 'card' ? 'rgba(99, 102, 241, 0.15)' : '#1e293b', border: '1px solid #334155', cursor: 'pointer' }}>
                <input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <div>
                  <strong>Credit / Debit / Net Banking</strong>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Encrypted AES-256 standard payment</p>
                </div>
              </label>
            </div>

            <button
              onClick={handlePlaceOrder}
              style={{ width: '100%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '16px' }}
            >
              Confirm & Authorize Payment (₹{cartSummary.totalPayable})
            </button>
          </div>
        )}

        {/* VIEW: LIVE ORDER TRACKING */}
        {currentView === 'tracking' && selectedOrder && (
          <div style={{ maxWidth: '860px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '600' }}>TRANSIT INTELLIGENCE</span>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>Tracking: {selectedOrder.orderId}</h2>
              </div>
              <button
                onClick={() => setShowInvoiceModal(true)}
                style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
              >
                Tax Invoice
              </button>
            </div>

            {/* Hub Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0', background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Courier Network</span>
                <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>{selectedOrder.carrier}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Current Node</span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#38bdf8', marginTop: '4px' }}>{selectedOrder.currentLocation}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Estimated Arrival</span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80', marginTop: '4px' }}>{selectedOrder.estimatedDelivery}</p>
              </div>
            </div>

            {/* Stepper */}
            <div style={{ margin: '40px 0 20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '18px', left: '30px', right: '30px', height: '3px', background: '#334155', zIndex: 1 }}>
                  <div style={{ height: '100%', background: '#6366f1', width: (selectedOrder.trackingStep / (trackingStages.length - 1)) * 100 + "%", transition: 'width 0.4s' }}></div>
                </div>

                {trackingStages.map((stage, idx) => {
                  const done = idx <= selectedOrder.trackingStep;
                  return (
                    <div key={stage.title} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '130px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: done ? '#6366f1' : '#1e293b',
                        border: '2px solid',
                        borderColor: done ? '#818cf8' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#fff'
                      }}>
                        {done ? '✓' : idx + 1}
                      </div>
                      <h4 style={{ fontSize: '13px', color: done ? '#fff' : '#64748b', marginTop: '10px' }}>{stage.title}</h4>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{stage.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Simulation Controller */}
            {user.role === 'admin' && (
              <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc' }}>VIVA DEMO: UPDATE TRACKING STEP</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {trackingStages.map((stg, i) => (
                    <button
                      key={stg.title}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, i)}
                      style={{
                        background: selectedOrder.trackingStep === i ? '#6366f1' : '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    >
                      {i + 1}. {stg.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ORDERS */}
        {currentView === 'orders' && (
          <div style={{ maxWidth: '900px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Order Records & Tracking History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div key={order.orderId} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                    <div>
                      <strong style={{ color: '#818cf8' }}>{order.orderId}</strong>
                      <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '10px' }}>{order.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => { setSelectedOrder(order); setCurrentView('tracking'); }}
                        style={{ background: '#6366f1', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}
                      >
                        Live Tracking
                      </button>
                      <button
                        onClick={() => { setSelectedOrder(order); setShowInvoiceModal(true); }}
                        style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}
                      >
                        Invoice
                      </button>
                    </div>
                  </div>

                  {order.items.map((it) => (
                    <div key={it.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '8px' }}>
                      <img src={it.image} alt={it.title} style={{ width: '40px', height: '55px', objectFit: 'contain', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '500' }}>{it.title}</h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Qty: {it.qty}</span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '700' }}>{user.name}</h2>
                  <p style={{ color: '#64748b', fontSize: '14px' }}>{user.email} | Student ID: BC2024043</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ background: '#1e293b', padding: '12px 24px', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>STORE WALLET</span>
                  <h3 style={{ fontSize: '20px', color: '#818cf8', marginTop: '4px' }}>₹{user.walletBalance || 450}</h3>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>TOTAL BOOKS ACQUIRED</span>
                <h3 style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px' }}>
                  {orders.reduce((acc, o) => acc + o.items.reduce((s, it) => s + it.qty, 0), 0)}
                </h3>
              </div>
              <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>LIFETIME SPEND</span>
                <h3 style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: '#4ade80' }}>
                  ₹{orders.reduce((acc, o) => acc + o.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>IN TRANSIT SHIPMENTS</span>
                <h3 style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: '#38bdf8' }}>
                  {orders.filter((o) => o.trackingStep < 4).length}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ADMIN */}
        {currentView === 'admin' && user.role === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Add Catalog Title</h3>
              <form onSubmit={handleAddBook} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <input
                  type="text"
                  required
                  placeholder="Book Title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                />
                <input
                  type="text"
                  required
                  placeholder="Author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                />
                <select
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Finance">Finance</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Fiction">Fiction</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Selling Price (₹)"
                  value={newBook.price}
                  onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                  style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newBook.stock}
                  onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                  style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                />
                <button
                  type="submit"
                  style={{ background: '#6366f1', color: '#fff', borderRadius: '10px', fontWeight: '600' }}
                >
                  Insert Book Title
                </button>
              </form>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Warehouse Inventory</h3>
              <table style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '12px' }}>Title</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Price</th>
                    <th style={{ padding: '12px' }}>Stock</th>
                    <th style={{ padding: '12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px' }}>{b.title}</td>
                      <td style={{ padding: '12px' }}>{b.category}</td>
                      <td style={{ padding: '12px' }}>₹{b.price}</td>
                      <td style={{ padding: '12px', color: b.stock < 10 ? '#f87171' : '#4ade80' }}>{b.stock} units</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleDeleteBook(b.id)} style={{ color: '#f87171', background: 'transparent' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* 4. INVOICE MODAL */}
      {showInvoiceModal && selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '36px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#818cf8' }}>BookStore Academic Hub</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Digital Invoice #{selectedOrder.orderId}</p>
              </div>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>{selectedOrder.date}</span>
            </div>

            <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>
              <p>Recipient: {selectedOrder.address.name}</p>
              <p>{selectedOrder.address.address}, {selectedOrder.address.city} - {selectedOrder.address.pincode}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '16px', fontSize: '16px', fontWeight: '700' }}>
              <span>Total Paid</span>
              <span style={{ color: '#4ade80' }}>₹{selectedOrder.amount}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => window.print()} style={{ flex: 1, background: '#6366f1', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: '600' }}>Print</button>
              <button onClick={() => setShowInvoiceModal(false)} style={{ flex: 1, background: '#334155', color: '#fff', padding: '10px', borderRadius: '8px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '40px' }}>
        BookStore Academic Platform • Designed & Developed by Prince Kumar (BCA)
      </footer>
    </div>
  );
}
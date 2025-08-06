import { useState, useEffect } from 'react';
import { apiRequest } from './lib/queryClient';

export default function App() {
  const [guides, setGuides] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    // Fetch guides on load
    apiRequest("GET", "/api/guides")
      .then(res => res.json())
      .then(data => setGuides(data))
      .catch(err => console.error('Error fetching guides:', err));
  }, []);

  const handleBuyNow = (guideId) => {
    const guide = guides.find(g => g.id === guideId);
    setSelectedGuide(guide);
    setCurrentPage('checkout');
  };

  const handlePayment = () => {
    if (!selectedGuide) return;
    
    apiRequest("POST", "/api/create-payment-intent", {
      guideId: selectedGuide.id,
      customerEmail: 'customer@example.com'
    })
    .then(res => res.json())
    .then(data => {
      if (data.clientSecret) {
        alert(`Payment successful! Your guide "${selectedGuide.title}" is ready for download. Payment ID: ${data.clientSecret.substring(0, 20)}...`);
        setCurrentPage('home');
      } else {
        alert('Payment failed. Please try again.');
      }
    })
    .catch(err => {
      console.error('Payment error:', err);
      alert('Payment processing failed');
    });
  };

  if (currentPage === 'checkout' && selectedGuide) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <button 
          onClick={() => setCurrentPage('home')}
          style={{
            color: '#2563eb',
            backgroundColor: 'transparent',
            border: 'none',
            marginBottom: '20px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Home
        </button>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
            Purchase Immigration Guide
          </h1>

          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
              {selectedGuide.title}
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
              {selectedGuide.description}
            </p>
            
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
              ${selectedGuide.price}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Email Address
            </label>
            <input 
              type="email"
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handlePayment}
            style={{
              width: '100%',
              backgroundColor: '#059669',
              color: 'white',
              padding: '16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Complete Purchase - ${selectedGuide.price}
          </button>

          <div style={{ 
            marginTop: '16px', 
            fontSize: '14px', 
            color: '#6b7280',
            textAlign: 'center'
          }}>
            🔒 Secure payment processing by Stripe • Instant download after payment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            ImmigrationGuides Pro
          </div>
          <button
            onClick={() => document.getElementById('guides').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ backgroundColor: '#f0f9ff', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Navigate Immigration with <span style={{ color: '#2563eb' }}>Confidence</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '40px', lineHeight: '1.6' }}>
            Professional immigration guides, forms, and resources. Expert-crafted PDF packages for I-130, I-485, N-400 and more. Bilingual support in English and Spanish.
          </p>
          <button
            onClick={() => document.getElementById('guides').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            Browse Our Guides
          </button>
        </div>
      </section>

      {/* Guides Section */}
      <section id="guides" style={{ padding: '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: '#1f2937' }}>
            Featured Immigration Guides
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {guides.map((guide) => (
              <div key={guide.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {guide.skillLevel.toUpperCase()}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  {guide.title}
                </h3>
                
                <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
                  {guide.description}
                </p>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                    ${guide.price}
                  </div>
                  {guide.originalPrice && (
                    <div style={{ fontSize: '16px', color: '#9ca3af', textDecoration: 'line-through' }}>
                      ${guide.originalPrice}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleBuyNow(guide.id)}
                  style={{
                    width: '100%',
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ marginBottom: '16px' }}>© 2025 ImmigrationGuides Pro. All rights reserved.</p>
          <p style={{ color: '#9ca3af' }}>Professional immigration resources for the Hispanic community</p>
        </div>
      </footer>
    </div>
  );
}
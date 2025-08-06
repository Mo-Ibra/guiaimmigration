import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/queryClient';

export default function SimpleCheckout() {
  const [guideId, setGuideId] = useState<string | null>(null);
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get guide ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("guideId");
    setGuideId(id);

    if (id) {
      console.log('Fetching guide with ID:', id);
      // Fetch guide data
      apiRequest("GET", `/api/guides/${id}`)
        .then(res => {
          console.log('API Response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Guide data received:', data);
          setGuide(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching guide:', err);
          setLoading(false);
        });
    } else {
      console.log('No guide ID found in URL');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!guideId || !guide) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Guide Not Found</h1>
        <button 
          onClick={() => window.location.href = "/"}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    // Create payment intent
    apiRequest("POST", "/api/create-payment-intent", {
      guideId: parseInt(guideId),
      customerEmail: 'customer@example.com'
    })
    .then(res => res.json())
    .then(data => {
      if (data.clientSecret) {
        alert(`Payment processing would continue with Stripe. Client Secret: ${data.clientSecret.substring(0, 20)}...`);
      } else {
        alert('Payment processing error');
      }
    })
    .catch(err => {
      console.error('Payment error:', err);
      alert('Payment processing failed');
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button 
        onClick={() => window.location.href = "/"}
        style={{
          color: '#2563eb',
          backgroundColor: 'transparent',
          border: 'none',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        ← Back to Guides
      </button>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Purchase Guide
        </h1>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {guide.title}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            {guide.description}
          </p>
          
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            ${guide.price}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
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
              fontSize: '16px'
            }}
          />
        </div>

        <button
          onClick={handlePayment}
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '16px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Complete Purchase - ${guide.price}
        </button>

        <div style={{ 
          marginTop: '16px', 
          fontSize: '14px', 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Secure payment processing by Stripe
        </div>
      </div>
    </div>
  );
}
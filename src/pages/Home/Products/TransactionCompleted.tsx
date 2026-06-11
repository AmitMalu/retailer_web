import React from 'react';
import { Card, Container, Center } from '@mantine/core';
import { decryptData } from '@/Utils/helper';
import theme from '@/theme/ThemeConfig';
import { useBranding } from '@/Config/branding';

const CheckCircleIcon = ({ color = "#10b981", size = 48 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M8 12l2 2 4-4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TransactionCompleted: React.FC = () => {
  let loginData = null;
  const branding = useBranding();

  try {
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
      const parsedRoot = JSON.parse(persistRoot);
      const apiResponseData = JSON.parse(parsedRoot.apiResponse || '{}');

      if (apiResponseData.responses?.loginData) {
        loginData = decryptData(apiResponseData.responses.loginData);
      }
    }
  } catch (e) {
    console.error('Failed to get loginData from localStorage:', e);
    loginData = null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container size="sm" px="md">
        <Center>
          <Card
            shadow="xl"
            padding="xl"
            radius="md"
            withBorder
            style={{ width: '100%', maxWidth: '450px' }}
          >
            <div style={{ textAlign: 'center' }}>
              {/* Logo Section */}
              <div style={{ marginBottom: '24px' }}>
                <img
                  src={branding?.logo ?? loginData.logoUrl ?? ""}
                  alt={branding?.companyName ?? "Logo"}
                  style={{
                    height: 120,
                    objectFit: "contain"
                  }}
                />
              </div>

              {/* Success Icon */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                width: '60px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                margin: '0 auto 24px'
              }}>
                <CheckCircleIcon color={theme.palette.primary.main} size={40} />
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#111827',
                marginBottom: '12px'
              }}>
                Transaction Completed
              </h2>

              {/* Description */}
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                marginBottom: '32px'
              }}>
                Your transaction has been processed
              </p>

              {/* Action Button */}
              <button
                onClick={() => window.close()}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }}
              >
                Close
              </button>

              {/* Support Text */}
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginTop: '24px'
              }}>
                If you have any questions, please contact our support team.
              </p>
            </div>
          </Card>
        </Center>
      </Container>
    </div>
  );
};

export default TransactionCompleted;

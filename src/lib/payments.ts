// ===========================================
// Payment Gateway Integration
// South Africa Focus: PayFast, Payflex, PayJustNow
// ===========================================

import { generateOrderNumber } from '@/lib/utils';

// ===========================================
// Types
// ===========================================

interface PaymentConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  baseUrl: string;
}

interface PaymentRequest {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  error?: string;
}

// ===========================================
// PayFast Integration
// Visa, Mastercard, Instant EFT
// ===========================================

export class PayFastGateway {
  private config: PaymentConfig;

  constructor(config?: Partial<PaymentConfig>) {
    this.config = {
      merchantId: config?.merchantId || process.env.PAYFAST_MERCHANT_ID || '',
      merchantKey: config?.merchantKey || process.env.PAYFAST_MERCHANT_KEY || '',
      passphrase: config?.passphrase || process.env.PAYFAST_PASSPHRASE || '',
      baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://www.payfast.co.za/eng/process'
        : 'https://sandbox.payfast.co.za/eng/process',
    };
  }

  // Generate payment signature
  private generateSignature(data: Record<string, string>): string {
    const crypto = require('crypto');
    const sortedData = Object.keys(data)
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');
    
    const signatureString = sortedData + (this.config.passphrase ? `&passphrase=${this.config.passphrase}` : '');
    return crypto.createHash('md5').update(signatureString).digest('hex');
  }

  // Create payment request
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentData: Record<string, string> = {
        merchant_id: this.config.merchantId,
        merchant_key: this.config.merchantKey,
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        notify_url: request.notifyUrl,
        name_first: request.customerName.split(' ')[0] || '',
        name_last: request.customerName.split(' ').slice(1).join(' ') || '',
        email_address: request.customerEmail,
        m_payment_id: request.orderId,
        amount: request.amount.toFixed(2),
        item_name: `Order ${request.orderId}`,
        item_description: `Payment for order ${request.orderId}`,
      };

      // Generate signature
      paymentData.signature = this.generateSignature(paymentData);

      // Build redirect URL
      const queryString = Object.entries(paymentData)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      return {
        success: true,
        paymentId: request.orderId,
        redirectUrl: `${this.config.baseUrl}?${queryString}`,
      };
    } catch (error) {
      console.error('PayFast payment creation error:', error);
      return {
        success: false,
        error: 'Failed to create payment',
      };
    }
  }

  // Verify webhook notification
  verifyWebhook(data: Record<string, string>): boolean {
    const receivedSignature = data.signature;
    const calculatedSignature = this.generateSignature(data);
    return receivedSignature === calculatedSignature;
  }
}

// ===========================================
// Payflex Integration
// Buy Now Pay Later (4 interest-free installments)
// ===========================================

export class PayflexGateway {
  private apiKey: string;
  private apiSecret: string;
  private merchantId: string;
  private baseUrl: string;

  constructor(config?: { apiKey?: string; apiSecret?: string; merchantId?: string }) {
    this.apiKey = config?.apiKey || process.env.PAYFLEX_API_KEY || '';
    this.apiSecret = config?.apiSecret || process.env.PAYFLEX_API_SECRET || '';
    this.merchantId = config?.merchantId || process.env.PAYFLEX_MERCHANT_ID || '';
    this.baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.payflex.co.za/v1'
      : 'https://sandbox-api.payflex.co.za/v1';
  }

  // Create Payflex order
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          merchantId: this.merchantId,
          amount: request.amount,
          currency: 'ZAR',
          merchantReference: request.orderId,
          customer: {
            email: request.customerEmail,
            firstName: request.customerName.split(' ')[0],
            lastName: request.customerName.split(' ').slice(1).join(' '),
          },
          redirectUrls: {
            success: request.returnUrl,
            cancel: request.cancelUrl,
            callback: request.notifyUrl,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payflex request failed');
      }

      return {
        success: true,
        paymentId: data.orderId,
        redirectUrl: data.redirectUrl,
      };
    } catch (error) {
      console.error('Payflex payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create Payflex payment',
      };
    }
  }

  // Verify payment status
  async verifyPayment(orderId: string): Promise<{ status: string; paid: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();

      return {
        status: data.status,
        paid: data.status === 'APPROVED',
      };
    } catch (error) {
      console.error('Payflex verification error:', error);
      return {
        status: 'UNKNOWN',
        paid: false,
      };
    }
  }
}

// ===========================================
// PayJustNow Integration
// Buy Now Pay Later
// ===========================================

export class PayJustNowGateway {
  private apiKey: string;
  private apiSecret: string;
  private merchantId: string;
  private baseUrl: string;

  constructor(config?: { apiKey?: string; apiSecret?: string; merchantId?: string }) {
    this.apiKey = config?.apiKey || process.env.PAYJUSTNOW_API_KEY || '';
    this.apiSecret = config?.apiSecret || process.env.PAYJUSTNOW_API_SECRET || '';
    this.merchantId = config?.merchantId || process.env.PAYJUSTNOW_MERCHANT_ID || '';
    this.baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.payjustnow.co.za/v1'
      : 'https://sandbox-api.payjustnow.co.za/v1';
  }

  // Create PayJustNow transaction
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          merchantId: this.merchantId,
          amount: request.amount,
          currency: 'ZAR',
          reference: request.orderId,
          customer: {
            email: request.customerEmail,
            name: request.customerName,
          },
          urls: {
            success: request.returnUrl,
            cancel: request.cancelUrl,
            notify: request.notifyUrl,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'PayJustNow request failed');
      }

      return {
        success: true,
        paymentId: data.transactionId,
        redirectUrl: data.redirectUrl,
      };
    } catch (error) {
      console.error('PayJustNow payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create PayJustNow payment',
      };
    }
  }
}

// ===========================================
// Payment Gateway Factory
// ===========================================

export type PaymentGatewayType = 'payfast' | 'payflex' | 'payjustnow';

export function getPaymentGateway(type: PaymentGatewayType) {
  switch (type) {
    case 'payfast':
      return new PayFastGateway();
    case 'payflex':
      return new PayflexGateway();
    case 'payjustnow':
      return new PayJustNowGateway();
    default:
      throw new Error(`Unknown payment gateway: ${type}`);
  }
}

// ===========================================
// Payment Processing Helper
// ===========================================

export async function processPayment(
  gateway: PaymentGatewayType,
  orderDetails: {
    orderId: string;
    amount: number;
    customerEmail: string;
    customerName: string;
  }
): Promise<PaymentResponse> {
  const paymentGateway = getPaymentGateway(gateway);
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return paymentGateway.createPayment({
    amount: orderDetails.amount,
    orderId: orderDetails.orderId,
    customerEmail: orderDetails.customerEmail,
    customerName: orderDetails.customerName,
    returnUrl: `${baseUrl}/checkout/success?order=${orderDetails.orderId}`,
    cancelUrl: `${baseUrl}/checkout/cancelled?order=${orderDetails.orderId}`,
    notifyUrl: `${baseUrl}/api/webhooks/payment/${gateway}`,
  });
}

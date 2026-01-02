import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import Safepay from '@sfpy/node-core';
import { Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private sessionToken: string;
  private readonly merchantSecretKey = "d7d5f338d7654f4abe87551897f7b5f471deaba0ca71da2a3725dcae20ce8086";
  private readonly merchantPublicKey = "sec_a839e636-315b-4b41-89f7-fbda4ae43819";
  private customerToken: string;
  
  private trackerToken: string;

  private readonly baseUrl = 'https://sandbox.api.getsafepay.com';

  // Authenticate with SafePay, store session token
  async authenticate(companyEmail: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/v1/company/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        Email: companyEmail, 
        Password: password,
        Client: 'ecommerce-platform'
      }),
    });
    const data: any = await response.json();
    console.log('data in authenticate:', data)
    if (!data.data?.token) throw new Error('Authentication failed');
    this.sessionToken = data.data.token;
    console.log('this.sessionToken in authenticate:', this.sessionToken)

    return data.data;
  }

  // Create tracker for a new payment
  async createTracker(dto: any) {
    console.log('this.sessionToken in createTracker:', this.sessionToken)
    console.log('dto in createTracker:', dto)
    if (!this.sessionToken) throw new Error('Not authenticated');
    const response = await fetch(`${this.baseUrl}/order/payments/v3/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.sessionToken}`,
      },
      body: JSON.stringify({
        amount: dto.amount,
        currency: dto.currency,
        intent: dto.intent,
        payment_method_kind: dto.payment_method_kind || 'card',
        merchant_api_key: this.merchantPublicKey,
      }),
    });
    const data: any = await response.json();
    console.log('data in createTracker:', data)
    this.trackerToken = data.data.tracker.token;
    console.log('this.trackerToken in createTracker:', this.trackerToken)

    return data.data;
  }

  async createCustomer(dto: any) {
    console.log('this.sessionToken in createCustomer:', this.sessionToken)
    if (!this.sessionToken) throw new Error('Not authenticated');

    const response = await fetch(
      `${this.baseUrl}/user/customers/v1/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${this.sessionToken}`,
          'X-SFPY-MERCHANT-SECRET': this.merchantSecretKey,
        },
        body: JSON.stringify(dto),
      },
    );
    const data: any = await response.json();
    console.log('data in createCustomer:', data)
    this.customerToken = data.data.token;
    return data.data;
  }

  // capture context jwt (transient token / gateway payload)
  async capture(dto: any) {
    console.log('this.sessionToken in capture:', this.sessionToken)
    if (!this.sessionToken) throw new Error('Not authenticated');

    const response = await fetch(
      `${this.baseUrl}/order/payments/v3/${this.trackerToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${this.sessionToken}`,
          'X-SFPY-MERCHANT-SECRET': this.merchantSecretKey,
        },
        body: JSON.stringify({
          "action": "GENERATE_CAPTURE_CONTEXT",
          "origin": "https://unsmelling-kash-weevilly.ngrok-free.dev"
        }),
      },
    );
    const data: any = await response.json();
    console.log('data in capture:', data)

    return data.data;
  }

  // get a checkout url to redirect the customer
  async redirect() {
    try {
      const safepay = new Safepay(this.merchantSecretKey, { authType: 'secret', host: 'https://sandbox.api.getsafepay.com' });
      // console.log('safepay in redirect:', safepay);
      const checkoutUrl =safepay.checkout.createCheckoutUrl({
        tracker: this.trackerToken,
        tbt: this.sessionToken,
        env: 'sandbox',
        source: 'hosted',
        user_id: this.customerToken,
        redirect_url: 'https://mywebsite.com/order/success',
        cancel_url: 'https://mywebsite.com/order/cancel'
      });
      return checkoutUrl
    } catch (err) {
      console.log(err);
    }
  }

  // Submit action (transient token / gateway payload)
  async submitAction(dto: any) {
    console.log('this.sessionToken in submitAction:', this.sessionToken)
    if (!this.sessionToken) throw new Error('Not authenticated');

    const response = await fetch(
      `${this.baseUrl}/order/payments/v3/${dto.trackerToken}/actions/${dto.actionToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.sessionToken}`,
        },
        body: JSON.stringify({
          transient_token: dto.transientToken,
          ...dto.additionalData,
        }),
      },
    );
    const data: any = await response.json();
    console.log('data in submitAction:', data)

    return data.data;
  }

  // Poll tracker status
  async pollTracker(trackerToken: string) {
    if (!this.sessionToken) throw new Error('Not authenticated');
    const response = await fetch(`${this.baseUrl}/order/payments/v3/${trackerToken}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.sessionToken}`,
      },
    });
    const data: any = await response.json();
    return data.data;
  }
}

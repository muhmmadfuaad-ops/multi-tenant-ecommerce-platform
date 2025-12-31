// payments.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private baseUrl: string;
  private merchantId: string;
  private password: string;
  private integritySalt: string;
  private returnUrl: string;

  constructor() {
    // Hardcoded sandbox values
    this.baseUrl =
      'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Purchase/InitiateAuthentication';
    this.merchantId = 'MC536332';
    this.password = 't5t5yeg0y1';
    this.integritySalt = 's28s9us04v';
    this.returnUrl = 'http://localhost:3000/payments/callback';
  }

  /**
   * Initiate payment by building payload and sending to JazzCash
   */
  async initiatePayment(
    amount: number,
    billReference: string,
    description: string,
  ) {

    // previous txnDateTime and txnExpiry calculation
    const txnRefNo = `T${Date.now()}`;
    const txnDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[-:T]/g, '');
    const txnExpiry = txnDateTime; // For sandbox, same as txnDateTime

    // new txnDateTime and txnExpiry calculation
    const txnDateTime_updated = new Date();
    const txnExpiry_updated = new Date(txnDateTime_updated.getTime() + 15 * 60 * 1000); // +15 minutes

    const pp_TxnDateTime = txnDateTime_updated.toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const pp_TxnExpiryDateTime = txnExpiry_updated.toISOString().slice(0, 19).replace(/[-:T]/g, '');


    // const payload: Record<string, any> = {
    //   pp_Amount: amount.toString(),
    //   pp_BillReference: billReference,
    //   pp_CustomerCardNumber: 5123456789012346,
    //   pp_Description: description,
    //   pp_IsRegisteredCustomer: 'Yes',
    //   pp_Language: 'EN',
    //   pp_MerchantID: this.merchantId,
    //   pp_Password: this.password,
    //   pp_ReturnURL: this.returnUrl,
    //   pp_ShouldTokenizeCardNumber: 'Yes',
    //   pp_TxnCurrency: 'PKR',
    //   pp_TxnDateTime: txnDateTime,
    //   pp_TxnExpiryDateTime: txnExpiry,
    //   pp_TxnRefNo: txnRefNo,
    //   pp_TxnType: 'MPAY',
    //   pp_Version: '2.0',
    // };

    // this payload was taken from JazzCash sandbox and it has static secureHash (calculated through their method)
    const payload1: Record<string, any> = {
      pp_Version: "1.1",
      pp_TxnType: "MPAY",
      pp_TxnRefNo: "T20251229144901",
      pp_MerchantID: "MC536332",
      pp_Password: "t5t5yeg0y1",
      pp_Amount: "5000",
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: "20251229144901",
      pp_TxnExpiryDateTime: "20251229144901",
      pp_BillReference: "billRef",
      pp_Description: "Description of transaction",
      pp_CustomerCardNumber: "5123450000000008",
      pp_UsageMode: "API",
      pp_SecureHash: "82075149B2BFE56DF4616BEE8AA0F780A542F44A64C6FCD26731B93A0223FB2D"
    }

    // this payload accepts some fields dynamically from the request and calculates secureHash accordingly. its using version 1.1
    const payload2: Record<string, any> = {
      "pp_Version": "1.1",
      "pp_TxnType": "MPAY",
      "pp_TxnRefNo": txnRefNo,
      "pp_MerchantID": this.merchantId,
      "pp_Password": this.password,
      "pp_Amount": amount.toString(),
      "pp_TxnCurrency": "PKR",
      "pp_TxnDateTime": pp_TxnDateTime,
      "pp_TxnExpiryDateTime": pp_TxnExpiryDateTime,
      "pp_BillReference": billReference,
      "pp_Description": description,
      "pp_CustomerCardNumber": "5123450000000008",
      "pp_UsageMode": "API"
      // pp_IsRegisteredCustomer: 'Yes',
      // pp_Language: 'EN',
      // pp_ReturnURL: this.returnUrl,
      // pp_ShouldTokenizeCardNumber: 'Yes',
    };

    // Generate secure hash
    payload2.pp_SecureHash = this.generateSecureHash(payload2);

    // this payload accepts some fields dynamically from the request and calculates secureHash accordingly. its using version 2.0
    const payload3: Record<string, any> = {
      "pp_Version": "2.0",
      "pp_IsRegisteredCustomer": "Yes",
      "pp_ShouldTokenizeCardNumber": "Yes",
      "pp_TxnType": "MPAY",
      "pp_TxnRefNo": txnRefNo,
      "pp_MerchantID": this.merchantId,
      "pp_Password": this.password,
      "pp_Amount": amount.toString(),
      "pp_TxnCurrency": "PKR",
      "pp_TxnDateTime": txnDateTime,
      "pp_TxnExpiryDateTime": txnExpiry,
      "pp_BillReference": billReference,
      "pp_Description": description,
      "pp_CustomerCardNumber": 5123450000000008,
      "pp_UsageMode": "API",
    };

    // Generate secure hash
    payload3.pp_SecureHash = this.generateSecureHash(payload3);

    


    try {
      console.log('payload in axios request:', payload2);
      const response = await axios.post(this.baseUrl, payload2);
      console.log('response.data:', response.data);
      return response.data; // JazzCash response
    } catch (err) {
      console.error('JazzCash API error:', err.response?.data || err.message);
      throw err;
    }
  }

  /**
   * Generate HMAC SHA256 secure hash for JazzCash
   */
  // private generateSecureHash(payload: Record<string, any>): string {
  //   console.log('payload in generateSecureHash:', payload);
  //   console.log('integritySalt in generateSecureHash:', this.integritySalt);
  //
  //   const sortedKeys = Object.keys(payload).sort();
  //   const dataString = sortedKeys.map((k) => `${k}=${payload[k]}`).join('&');
  //   console.log('dataString:', dataString);
  //   const hash = crypto
  //     .createHmac('sha256', this.integritySalt)
  //     .update(dataString)
  //     .digest('hex')
  //     .toUpperCase();
  //
  //   // const hash = CryptoJS.SHA256(this.integritySalt + dataString)
  //   //   .toString(CryptoJS.enc.Hex)
  //   //   .toUpperCase();
  //
  //   return hash;
  // }

  // private generateSecureHash(payload: Record<string, any>): string {
  //   const sortedKeys = Object.keys(payload)
  //     .filter((k) => payload[k] !== undefined && payload[k] !== '')
  //     .sort();

  //   const dataString = sortedKeys.map((k) => `${k}=${payload[k]}`).join('&');

  //   const hmac = crypto
  //     .createHmac('sha256', this.integritySalt)
  //     .update(dataString)
  //     .digest('hex')
  //     .toUpperCase();

  //   return hmac;
  // }

  private generateSecureHash(payload: Record<string, any>): string {
  const integritySalt = this.integritySalt;

  const sortedKeys = Object.keys(payload)
    .filter(
      (k) =>
        k.startsWith('pp_') &&
        k !== 'pp_SecureHash' &&
        payload[k] !== undefined &&
        payload[k] !== '',
    )
    .sort();

    console.log('sortedKeys:', sortedKeys)
  let finalString = integritySalt + '&';

  sortedKeys.forEach((key) => {
    finalString += payload[key] + '&';
  });

    console.log('finalString:', finalString)

  finalString = finalString.slice(0, -1); // remove trailing &
    console.log('finalString after slice:', finalString)


  const hash = crypto
    .createHmac('sha256', integritySalt)
    .update(finalString)
    .digest('hex')
    .toUpperCase();

    console.log('hash:', hash)

  return hash;
}


  /**
   * Verify secure hash from callback
   */
  verifyCallback(payload: Record<string, any>): boolean {
    const hash = payload.pp_SecureHash;
    if (!hash) return false;

    const payloadCopy = { ...payload };
    delete payloadCopy.pp_SecureHash;

    const expectedHash = this.generateSecureHash(payloadCopy);
    return expectedHash === hash;
  }
}

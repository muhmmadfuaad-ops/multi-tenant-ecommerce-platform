// import axios from 'axios';
// import crypto from 'crypto';

// async initiatePayment(
//   amount: number,
//   billReference: string,
//   description: string,
// ) {
//   const txnRefNo = `T${Date.now()}`;
//   const txnDateTime = new Date()
//     .toISOString()
//     .slice(0, 19)
//     .replace(/[-:T]/g, '');
//   const txnExpiry = txnDateTime; // For sandbox, same as txnDateTime

//   const payload: Record<string, any> = {
//     pp_Version: '1.1',
//     pp_TxnType: 'MPAY',
//     pp_TxnRefNo: txnRefNo,
//     pp_MerchantID: this.merchantId,
//     pp_Password: this.password,
//     pp_Amount: amount.toString(),
//     pp_TxnCurrency: 'PKR',
//     pp_TxnDateTime: txnDateTime,
//     pp_TxnExpiryDateTime: txnExpiry,
//     pp_BillReference: billReference,
//     pp_Description: description,
//     pp_CustomerCardNumber: 5123450000000008,
//     pp_UsageMode: 'API',
//   };

//   // Generate secure hash
//   payload.pp_SecureHash = this.generateSecureHash(payload);

//   try {
//     console.log('payload:', payload);
//     const response = await axios.post(this.baseUrl, payload);
//     console.log('response.data:', response.data);
//     return response.data; // JazzCash response
//   } catch (err) {
//     console.error('JazzCash API error:', err.response?.data || err.message);
//     throw err;
//   }
// }

// private generateSecureHash(payload: Record<string, any>): string {
//   const sortedKeys = Object.keys(payload)
//     .filter((k) => payload[k] !== undefined && payload[k] !== '')
//     .sort();

//   const dataString = sortedKeys.map((k) => `${k}=${payload[k]}`).join('&');
//   const hash1 = crypto
//     .createHash('sha256')
//     .update(this.integritySalt + dataString)
//     .digest('hex')
//     .toUpperCase();

//   const hash2 = crypto.createHash('sha256').update(dataString).digest('hex');

//   const key = new Buffer('hi', 'hex');
//   const hash4 = crypto
//     .createHmac('sha256', key)
//     .update(dataString)
//     .digest('hex');

//   const hash5 = crypto.createHash('sha256').update(dataString).digest('hex');

//   console.log('hash1:', hash1);
//   console.log('hash2:', hash2);
//   console.log('hash4:', hash4);
//   console.log('hash5:', hash5);

//   return hash1;
// }

// // this payload was taken from JazzCash sandbox and it has static secureHash (calculated through their method)

// // const payload: Record<string, any> = {
// //   pp_Version: '1.1',
// //   pp_TxnType: 'MPAY',
// //   pp_TxnRefNo: 'T20251227020241',
// //   pp_MerchantID: 'MC536332',
// //   pp_Password: 't5t5yeg0y1',
// //   pp_Amount: '5000',
// //   pp_TxnCurrency: 'PKR',
// //   pp_TxnDateTime: '20251227020241',
// //   pp_TxnExpiryDateTime: '20251227020241',
// //   pp_BillReference: 'billRef',
// //   pp_Description: 'Description of transaction',
// //   pp_CustomerCardNumber: '5123450000000008',
// //   pp_UsageMode: 'API',
// //   pp_SecureHash:
// //     '53BA3FB67B5B1628E47A2E26E14767205A7CBABC89B69BFCD4A22114C48DFC2B',
// // };
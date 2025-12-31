const crypto = require('crypto');

const integritySalt = 's28s9us04v';
const payload = {
  pp_Version: '1.1',
  pp_TxnType: 'MPAY',
  pp_TxnRefNo: 'T1766795254903',
  pp_MerchantID: 'MC536332',
  pp_Password: 't5t5yeg0y1',
  pp_Amount: '5000',
  pp_TxnCurrency: 'PKR',
  pp_TxnDateTime: '20251227002734',
  pp_TxnExpiryDateTime: '20251227002734',
  pp_BillReference: 'billRef123',
  pp_Description: 'Order #123',
  pp_CustomerCardNumber: 5123450000000008,
  pp_UsageMode: 'API',
  pp_SecureHash: '6D31952A2CDAF8AE6CBC3250931C18A5C326091151D3E43ABEC6D3BEE135AA82',
};

const payloadCopy = { ...payload };
delete payloadCopy.pp_SecureHash;

const sortedKeys = Object.keys(payloadCopy)
  .filter((k) => payloadCopy[k] !== undefined && payloadCopy[k] !== '')
  .sort();

const dataString = sortedKeys.map((k) => `${k}=${payloadCopy[k]}`).join('&');

const hmac = crypto
  .createHmac('sha256', integritySalt)
  .update(dataString)
  .digest('hex')
  .toUpperCase();

console.log('dataString=');
console.log(dataString);
console.log('\ncomputed pp_SecureHash=');
console.log(hmac);

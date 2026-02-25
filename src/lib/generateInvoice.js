import html2pdf from 'html2pdf.js';

export const generateInvoicePDF = (orderData, invoiceNumber) => {
  const currentDate = new Date().toLocaleDateString('en-IN');
  
  const cartTotal = orderData.items.reduce((sum, item) => {
    const price = typeof item.discount === 'number' 
      ? item.discount * item.quantity 
      : parseFloat(item.discount?.replace('₹', '') || 0) * item.quantity;
    return sum + price;
  }, 0);

  const shippingFee = 100;
  const packingFee = cartTotal > 5000 ? 0 : 50;
  const totalAmount = cartTotal + shippingFee + packingFee;

  const itemsHTML = orderData.items.map((item, index) => {
    const price = typeof item.discount === 'number'
      ? item.discount
      : parseFloat(item.discount?.replace('₹', '') || 0);
    const amount = (price * item.quantity).toFixed(2);
    
    return `
      <tr style="border: 1px solid #000;">
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
        <td style="border: 1px solid #000; padding: 8px;">${item.name}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹ ${price.toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.discountPercent || '50%'}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹ ${(price / 2).toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantity}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: right;">₹ ${amount}</td>
      </tr>
    `;
  }).join('');

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .invoice-container {
          border: 3px solid #000;
          max-width: 900px;
          margin: 0 auto;
          background: white;
        }
        .header {
          border-bottom: 2px solid #000;
          padding: 15px;
          text-align: center;
        }
        .header h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .company-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          border-bottom: 1px solid #000;
          min-height: 80px;
        }
        .company-details {
          padding: 15px;
          border-right: 1px solid #000;
        }
        .company-details h3 {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .company-details p {
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 2px;
        }
        .bill-info {
          padding: 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
        .bill-info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .bill-info-label {
          font-weight: bold;
        }
        .customer-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #000;
        }
        .customer-details {
          padding: 15px;
          border-right: 1px solid #000;
        }
        .customer-details h3 {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .customer-details p {
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 2px;
        }
        .transporter-section {
          padding: 15px;
        }
        .transporter-section h3 {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .items-table thead {
          background-color: #f5f5f5;
        }
        .items-table th {
          border: 1px solid #000;
          padding: 10px;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }
        .items-table td {
          border: 1px solid #000;
          padding: 8px;
          font-size: 12px;
        }
        .total-row {
          border: 1px solid #000;
        }
        .total-row td {
          padding: 10px;
          text-align: right;
          font-weight: bold;
        }
        .summary-section {
          padding: 15px;
          border-bottom: 1px solid #000;
        }
        .summary-row {
          display: grid;
          grid-template-columns: auto 1fr;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .summary-label {
          font-weight: bold;
          text-align: right;
          padding-right: 20px;
        }
        .summary-value {
          text-align: right;
        }
        .payment-section {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 1px solid #000;
          min-height: 120px;
        }
        .payment-box {
          padding: 15px;
          border-right: 1px solid #000;
          font-size: 11px;
        }
        .payment-box:last-child {
          border-right: none;
        }
        .payment-box h4 {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .payment-box p {
          margin-bottom: 3px;
          line-height: 1.3;
        }
        .declaration-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 15px;
        }
        .declaration {
          padding-right: 20px;
        }
        .declaration h3 {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .signature-section {
          text-align: right;
          padding-right: 20px;
        }
        .signature-section p {
          font-size: 12px;
          font-weight: bold;
        }
        .amount-in-words {
          padding: 8px 15px;
          border-bottom: 1px solid #000;
          font-size: 12px;
          background-color: #f9f9f9;
        }
        @page {
          size: A4;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <h1>BILL</h1>
        </div>

        <!-- Company and Bill Info Section -->
        <div class="company-section">
          <div class="company-details">
            <h3>PK crackers</h3>
            <p>Madathuparti, Sattur main road siyakasi626128</p>
            <p>Gmail: info@pkcrackers.com</p>
            <p>Mob: 9384858859</p>
          </div>
          <div class="bill-info">
            <div class="bill-info-row">
              <span class="bill-info-label">Bill No:</span>
              <span>${invoiceNumber}</span>
            </div>
            <div class="bill-info-row">
              <span class="bill-info-label">Date:</span>
              <span>${currentDate}</span>
            </div>
            <div class="bill-info-row">
              <span class="bill-info-label">Payment:</span>
              <span>Unpaid</span>
            </div>
          </div>
        </div>

        <!-- Customer Section -->
        <div class="customer-section">
          <div class="customer-details">
            <h3>Billed To:</h3>
            <p><strong>${orderData.customerName}</strong></p>
            <p>${orderData.address}</p>
            <p>Mob: ${orderData.phone}</p>
            <p>Email: ${orderData.email}</p>
          </div>
          <div class="transporter-section">
            <h3>Transporter Name:</h3>
            <p></p>
            <h3 style="margin-top: 15px;">LR No.</h3>
            <p></p>
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>Product Rate</th>
              <th>Discount</th>
              <th>Discount Rate</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            <tr class="total-row">
              <td colspan="5" style="text-align: right;">Total</td>
              <td style="text-align: center;">${orderData.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
              <td style="text-align: right;">₹ ${cartTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Amount in Words -->
        <div class="amount-in-words">
          in rupees amount in words format
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-row">
            <span class="summary-label">Packing and Forwarding Charges:</span>
            <span class="summary-value">₹ ${packingFee.toFixed(2)}</span>
          </div>
          <div class="summary-row" style="border-top: 1px solid #000; padding-top: 10px; margin-top: 10px;">
            <span class="summary-label"><strong>Total Amount</strong></span>
            <span class="summary-value"><strong>₹ ${totalAmount.toFixed(2)}</strong></span>
          </div>
        </div>

        <!-- Payment Section -->
        <div class="payment-section">
          <div class="payment-box">
            <h4>A/C Name: PK TRADERS</h4>
            <p>Bank Name: BBBB</p>
            <p>Current A/C No: 123456789123</p>
          </div>
          <div class="payment-box">
            <h4>Name: xxxx</h4>
            <p>G-Pay No: 9354200000</p>
          </div>
          <div class="payment-box">
            <h4>UPI Name: xxxx</h4>
            <p>UPI ID: cnjncdjdk</p>
            <div style="margin-top: 20px; text-align: center;">
              <div style="width: 60px; height: 60px; border: 1px solid #000; display: inline-block;"></div>
            </div>
          </div>
        </div>

        <!-- Declaration -->
        <div class="declaration-section">
          <div class="declaration">
            <h3>Declaration</h3>
          </div>
          <div class="signature-section">
            <p>for PK crackers</p>
            <p>Authorised Signatory</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const opt = {
    margin: 5,
    filename: `Invoice-${invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: 'avoid-all' }
  };

  html2pdf().set(opt).from(invoiceHTML).save();
};

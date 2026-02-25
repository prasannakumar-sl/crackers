'use client';

import React from 'react';

// Utility to convert number to words
function amountToWords(amount) {
  const num = Math.floor(amount);
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

  function convert(n) {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    return n.toString();
  }

  if (num === 0) return "Zero";
  const result = convert(num);
  return result.charAt(0).toUpperCase() + result.slice(1) + " only";
}

export default function InvoicePrint({ orderData, company, containerRef }) {
  if (!orderData) return null;

  const { order, items } = orderData;
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = parseFloat(order.total_amount);

  return (
    <div ref={containerRef} className="invoice-print-container">
      <div className="invoice-outer-border">
        <h2 className="main-title">BILL</h2>
        
        {/* Header Section */}
        <div className="header-section">
          <div className="company-info">
            <div className="logo-box">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F59dca2fe43f0459b9386969f352d866f%2F820bedae531b4989ac72e5578deb9000?format=webp&width=100" alt="logo" className="logo-img" />
            </div>
            <div className="details-box">
              <h1 className="company-name">{company?.company_name || 'Cobra Crackers'}</h1>
              <p>{company?.address || '4/1434-27,sattur main road, Thayilpatti, Sivakasi - 626189.'}</p>
              <p>Gmail: {company?.email || 'cobracrackers33@gmail.com'}</p>
              <p>Website: {company?.website || 'www.cobracrackers.in'}</p>
              <p>Mob: {company?.phone_number || '96778 33372, 93425 93442'}</p>
            </div>
          </div>
          <div className="bill-info">
            <div className="row"><span className="label">Bill No:</span> <span className="value">{order.invoice_number || `CC/${order.id}`}</span></div>
            <div className="row"><span className="label">Date:</span> <span className="value">{new Date(order.created_at).toLocaleDateString('en-GB')}</span></div>
            <div className="row"><span className="label">Payment:</span> <span className="value font-bold">{order.payment_status || 'UnPaid'}</span></div>
          </div>
        </div>

        {/* Billed To / Transporter Section */}
        <div className="client-grid">
          <div className="billed-to">
            <div className="label-top">Billed To:</div>
            <div className="client-name">{order.customer_name}</div>
            <div>{order.address}</div>
            <div>Mob: {order.phone}</div>
            <div>Email: {order.email}</div>
          </div>
          <div className="transporter">
            <div className="t-row"><span className="t-label">Transporter Name:</span></div>
            <div className="t-row mt-auto"><span className="t-label">LR No.</span></div>
          </div>
        </div>

        {/* Items Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th className="w-10">S.No</th>
              <th className="w-40 text-left">Item Name</th>
              <th className="w-15">Product Rate</th>
              <th className="w-10">Discount</th>
              <th className="w-10">Discount Rate</th>
              <th className="w-5">Quantity</th>
              <th className="w-10 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const rate = parseFloat(item.price);
              const discPercent = parseFloat(item.discount) || 0;
              const discRate = rate * (discPercent / 100);
              const discountedPrice = rate - discRate;
              const amount = discountedPrice * item.quantity;
              
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-left font-bold">{item.product_name}</td>
                  <td className="text-center">₹ {rate.toFixed(0)}</td>
                  <td className="text-center">{discPercent}%</td>
                  <td className="text-center">₹ {discRate.toFixed(0)}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">₹ {Math.round(amount)}</td>
                </tr>
              );
            })}
            {/* Pad empty rows to maintain height if needed */}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="5" className="text-right font-bold">Total</td>
              <td className="text-center font-bold">{totalQty}</td>
              <td className="text-right font-bold">₹ {subTotal.toFixed(1)}</td>
            </tr>
            <tr>
              <td colSpan="6" className="text-right">Packing and Forwarding Charges</td>
              <td className="text-right">₹ 0</td>
            </tr>
            <tr className="grand-total">
              <td colSpan="6" className="text-right font-bold">Total Amount</td>
              <td className="text-right font-bold">₹ {subTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Amount in Words */}
        <div className="words-section">
          INR {amountToWords(subTotal)}
        </div>

        {/* Footer Grid */}
        <div className="footer-info-grid">
          <div className="bank-box">
            <p className="font-bold">A/C Name: COBRA TRADERS</p>
            <p>Bank Name: State Bank of India</p>
            <p>Current A/C No: 41813993341</p>
            <p>Branch : Sivakasi</p>
            <p>IFSC: SBIN 0000975</p>
          </div>
          <div className="gpay-box">
            <p className="font-bold">Name: Soundharya</p>
            <p>G-Pay No: 9344746164</p>
          </div>
          <div className="upi-box">
            <p className="font-bold">UPI Name: Harisudhan</p>
            <p>UPI ID: 9677833372@paytm</p>
          </div>
        </div>

        {/* Declaration and Signature */}
        <div className="bottom-grid">
          <div className="declaration">
            <div className="label-top">Declaration</div>
          </div>
          <div className="signature">
            <div className="for-company">for {company?.company_name || 'Cobra Crackers'}</div>
            <div className="sign-label">Authorised Signatory</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .invoice-print-container {
          background: white;
          width: 800px;
          margin: 0 auto;
          color: black;
          font-family: Arial, sans-serif;
          font-size: 11px;
          padding: 20px;
        }

        .invoice-outer-border {
          border: 1px solid #000;
        }

        .main-title {
          text-align: center;
          border-bottom: 1px solid #000;
          margin: 0;
          padding: 5px;
          font-size: 14px;
          font-weight: bold;
        }

        .header-section {
          display: grid;
          grid-template-columns: 1fr 250px;
          border-bottom: 1px solid #000;
        }

        .company-info {
          display: flex;
          border-right: 1px solid #000;
          padding: 10px;
          gap: 15px;
        }

        .logo-box {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .details-box h1 {
          font-size: 16px;
          margin: 0 0 5px 0;
          font-weight: bold;
        }

        .details-box p {
          margin: 2px 0;
          line-height: 1.2;
        }

        .bill-info {
          padding: 10px;
        }

        .bill-info .row {
          display: flex;
          margin-bottom: 8px;
        }

        .bill-info .label {
          width: 70px;
        }

        .client-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #000;
          min-height: 80px;
        }

        .billed-to {
          padding: 8px;
          border-right: 1px solid #000;
        }

        .transporter {
          padding: 8px;
          display: flex;
          flex-direction: column;
        }

        .label-top {
          font-weight: bold;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .client-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 3px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
        }

        .items-table th, .items-table td {
          border: 1px solid #000;
          padding: 5px 8px;
        }

        .items-table th {
          background: #fff;
          font-weight: bold;
          text-align: center;
        }

        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }

        .w-10 { width: 10%; }
        .w-40 { width: 40%; }
        .w-15 { width: 15%; }
        .w-5 { width: 5%; }

        .total-row {
          background: #fff;
        }

        .grand-total {
          background: #fff;
        }

        .words-section {
          padding: 8px;
          border-bottom: 1px solid #000;
          text-transform: lowercase;
        }

        .footer-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 1px solid #000;
        }

        .bank-box, .gpay-box, .upi-box {
          padding: 8px;
          border-right: 1px solid #000;
        }

        .upi-box {
          border-right: none;
        }

        .footer-info-grid p {
          margin: 3px 0;
          font-size: 10px;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 250px;
          min-height: 100px;
        }

        .declaration {
          padding: 8px;
          border-right: 1px solid #000;
        }

        .signature {
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }

        .for-company {
          font-weight: bold;
        }

        .sign-label {
          font-weight: bold;
        }

        .t-row {
          margin-bottom: 5px;
        }

        .mt-auto { margin-top: auto; }
      `}</style>
    </div>
  );
}

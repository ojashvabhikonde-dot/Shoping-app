const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Ensure temp_emails directory exists for local development preview
const tempEmailsDir = path.join(__dirname, '../temp_emails');
if (!fs.existsSync(tempEmailsDir)) {
  fs.mkdirSync(tempEmailsDir, { recursive: true });
}

// Helper to save email HTML to a local file for easy previewing during development
const saveEmailPreview = (fileName, htmlContent) => {
  try {
    const filePath = path.join(tempEmailsDir, fileName);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`[Email Preview Saved]: file://${filePath.replace(/\\/g, '/')}`);
  } catch (error) {
    console.error('Failed to save email preview:', error);
  }
};

// Formatter for currency (Rupees ₹)
const formatCurrency = (val) => {
  return `₹${Number(val).toLocaleString('en-IN')}`;
};

// Parser to clean up and extract floats from price strings like "₹19,900" or raw numbers
const parsePriceString = (priceVal) => {
  if (!priceVal) return 0;
  if (typeof priceVal === 'number') return priceVal;
  const numericStr = String(priceVal).replace(/[₹,]/g, '').trim();
  return parseFloat(numericStr) || 0;
};

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    // Production / Configured SMTP transporter
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass }
    });
    console.log('Nodemailer configured with SMTP credentials.');
  } else {
    // Development fallback to Ethereal Email test account
    try {
      console.log('No SMTP credentials in .env. Attempting to configure Ethereal Email test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`Nodemailer configured with Ethereal Email test account (User: ${testAccount.user}).`);
      
      // Override sendMail to also display Ethereal live preview URL
      const originalSendMail = transporter.sendMail.bind(transporter);
      transporter.sendMail = async (options) => {
        const info = await originalSendMail(options);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`[Ethereal Live Preview URL]: ${previewUrl}`);
        return info;
      };
    } catch (err) {
      console.warn('Ethereal test account setup failed. Falling back to simple console log mockup.', err.message);
      // Dummy console logger transporter
      transporter = {
        sendMail: async (options) => {
          console.log('--- Email Console Mock Send ---');
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log('------------------------');
          return { messageId: 'mock-' + Date.now() };
        }
      };
    }
  }
  return transporter;
};

// Common Premium styling for HTML Emails
const emailStyle = `
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #0b0f19;
    color: #f1f5f9;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }
  .container {
    max-width: 600px;
    margin: 30px auto;
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  }
  .header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
    padding: 35px 24px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    color: #ffffff;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .content {
    padding: 32px 24px;
  }
  .content p {
    font-size: 15px;
    line-height: 1.6;
    color: #9ca3af;
  }
  .highlight-box {
    background: #1f2937;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin: 24px 0;
  }
  .highlight-title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 12px;
  }
  .btn {
    display: inline-block;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: #ffffff !important;
    text-decoration: none;
    padding: 12px 28px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
    margin-top: 8px;
  }
  .footer {
    background: #0f172a;
    padding: 24px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 12px;
    color: #6b7280;
  }
  .grid {
    display: table;
    width: 100%;
    margin-top: 20px;
  }
  .grid-row {
    display: table-row;
  }
  .grid-col {
    display: table-cell;
    padding: 10px;
    vertical-align: top;
    font-size: 14px;
  }
  .item-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  .item-table th {
    text-align: left;
    padding: 12px 8px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    color: #e5e7eb;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .item-table td {
    padding: 16px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #d1d5db;
    font-size: 14px;
  }
  .item-img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .price-details {
    width: 100%;
    margin-top: 15px;
  }
  .price-row {
    display: table;
    width: 100%;
    font-size: 14px;
    margin-bottom: 6px;
    color: #9ca3af;
  }
  .price-label {
    display: table-cell;
    text-align: left;
  }
  .price-val {
    display: table-cell;
    text-align: right;
    font-weight: 500;
  }
  .price-total {
    font-size: 18px;
    font-weight: 700;
    color: #38bdf8;
    margin-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 10px;
  }
  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    font-weight: 600;
    font-size: 12px;
    border-radius: 9999px;
  }
  .status-processing {
    background-color: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }
  .status-shipped {
    background-color: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
  }
  .status-delivered {
    background-color: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
  .status-cancelled {
    background-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
`;

/**
 * Sends a welcome email to the newly registered user
 * @param {object} user - User document containing name and email
 */
const sendWelcomeEmail = async (user) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Shoping App! 🌟</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Thank you for registering an account on Shoping App! We are thrilled to have you join our community.</p>
          <p>Explore the latest trends, discover exclusive tech and audio gear, and enjoy special promotional discounts tailored just for you.</p>
          
          <div class="highlight-box" style="text-align: center;">
            <p style="margin: 0; font-size: 16px; color: #ffffff;">Your account email:</p>
            <strong style="font-size: 18px; color: #818cf8; display: block; margin: 8px 0 16px 0;">${user.email}</strong>
            <a href="${frontendUrl}" class="btn">Start Shopping Now</a>
          </div>

          <p>If you have any questions or need support, reply directly to this email. We're here to help!</p>
          <p>Best regards,<br>The Shoping App Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Shoping App. All rights reserved.</p>
          <p>You received this email because you registered on our platform.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Save local preview for development tracking
  saveEmailPreview(`signup-${user.email}-${Date.now()}.html`, html);

  try {
    const client = await getTransporter();
    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Shoping App" <noreply@shopingapp.com>',
      to: user.email,
      subject: `Welcome to Shoping App, ${user.name}! 🌟`,
      html
    };
    await client.sendMail(mailOptions);
    console.log(`Signup welcome email sent successfully to ${user.email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

/**
 * Sends an order confirmation email when a user places an order
 * @param {object} user - User document
 * @param {object} order - Order document
 */
const sendOrderConfirmation = async (user, order) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const shortId = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  const orderDateStr = new Date(order.orderDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemsRows = order.items.map(item => {
    const itemUnitPrice = parsePriceString(item.salePrice || item.price);
    const itemSubtotal = itemUnitPrice * item.quantity;
    return `
      <tr>
        <td style="width: 60px;">
          <img src="${item.image}" alt="${item.name}" class="item-img" />
        </td>
        <td>
          <div style="font-weight: 600; color: #ffffff;">${item.name}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${item.category}</div>
        </td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatCurrency(itemUnitPrice)}</td>
        <td style="text-align: right; font-weight: 600; color: #ffffff;">${formatCurrency(itemSubtotal)}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Placed Successfully! 🎉</h1>
          <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.8); font-size: 15px;">Order ID: #${shortId}</p>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Your order has been registered successfully on Shoping App! We are processing your items and will notify you when they are shipped.</p>
          
          <div class="highlight-box">
            <h3 class="highlight-title">Order Information</h3>
            <div class="grid">
              <div class="grid-row">
                <div class="grid-col" style="width: 50%;">
                  <strong>Date Placed:</strong><br>
                  ${orderDateStr}
                </div>
                <div class="grid-col" style="width: 50%;">
                  <strong>Payment Method:</strong><br>
                  ${order.paymentMethod} (${order.paymentStatus})
                </div>
              </div>
            </div>
          </div>

          <h3 style="color: #ffffff; font-size: 16px; margin: 24px 0 12px 0;">Items Ordered</h3>
          <table class="item-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="grid" style="margin-top: 24px;">
            <div class="grid-row">
              <div class="grid-col" style="width: 50%;">
                <h3 style="color: #ffffff; font-size: 15px; margin: 0 0 8px 0;">Shipping Address</h3>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
                  <strong>${order.shippingAddress.fullName}</strong><br>
                  ${order.shippingAddress.streetAddress}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}<br>
                  Phone: ${order.shippingAddress.phone}
                </p>
              </div>
              <div class="grid-col" style="width: 50%;">
                <h3 style="color: #ffffff; font-size: 15px; margin: 0 0 8px 0;">Pricing Summary</h3>
                <div class="price-details">
                  <div class="price-row">
                    <span class="price-label">Subtotal:</span>
                    <span class="price-val">${formatCurrency(order.totalAmount)}</span>
                  </div>
                  ${order.discountAmount > 0 ? `
                    <div class="price-row" style="color: #ef4444;">
                      <span class="price-label">Discount:</span>
                      <span class="price-val">-${formatCurrency(order.discountAmount)}</span>
                    </div>
                  ` : ''}
                  <div class="price-row">
                    <span class="price-label">Shipping:</span>
                    <span class="price-val">${order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}</span>
                  </div>
                  <div class="price-row price-total">
                    <span class="price-label">Total Amount:</span>
                    <span class="price-val">${formatCurrency(order.finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${frontendUrl}" class="btn">Track Order Details</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Shoping App. All rights reserved.</p>
          <p>If you did not make this purchase, please contact support immediately.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Save local preview
  saveEmailPreview(`order-confirmation-${order._id}-${Date.now()}.html`, html);

  try {
    const client = await getTransporter();
    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Shoping App" <noreply@shopingapp.com>',
      to: user.email,
      subject: `Your Order #${shortId} is Registered! 📦`,
      html
    };
    await client.sendMail(mailOptions);
    console.log(`Order placement confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

/**
 * Sends an email to update the user on status changes
 * @param {object} user - User document
 * @param {object} order - Order document
 */
const sendOrderStatusUpdate = async (user, order) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const shortId = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  
  let statusMessage = '';
  let statusClass = '';
  
  switch (order.status) {
    case 'Processing':
      statusMessage = 'Your order is currently being processed by our team. We will notify you once it ships.';
      statusClass = 'status-processing';
      break;
    case 'Shipped':
      statusMessage = 'Good news! Your order has been shipped and is on its way to your destination. 🚚';
      statusClass = 'status-shipped';
      break;
    case 'Delivered':
      statusMessage = 'Deliver success! Your order has been successfully delivered. 🎉 We hope you love your new purchase!';
      statusClass = 'status-delivered';
      break;
    case 'Cancelled':
      statusMessage = 'Your order has been cancelled. ❌ If this was a mistake, or if you require a refund, please contact support.';
      statusClass = 'status-cancelled';
      break;
    default:
      statusMessage = `Your order status has been updated to: ${order.status}`;
      statusClass = 'status-processing';
  }

  const itemsRows = order.items.map(item => {
    const itemSubtotal = parsePriceString(item.salePrice || item.price) * item.quantity;
    return `
      <tr>
        <td style="width: 50px;">
          <img src="${item.image}" alt="${item.name}" class="item-img" style="width: 40px; height: 40px;" />
        </td>
        <td>
          <div style="font-weight: 600; color: #ffffff; font-size: 13px;">${item.name}</div>
        </td>
        <td style="text-align: center; font-size: 13px;">${item.quantity}</td>
        <td style="text-align: right; font-size: 13px; font-weight: 600; color: #ffffff;">${formatCurrency(itemSubtotal)}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Update: ${order.status}!</h1>
          <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.8); font-size: 15px;">Order ID: #${shortId}</p>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          
          <div class="highlight-box" style="border-left: 4px solid #6366f1;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #9ca3af; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Current Tracking Status</p>
            <span class="status-badge ${statusClass}">${order.status}</span>
            <p style="margin: 12px 0 0 0; color: #f1f5f9; font-size: 15px; line-height: 1.5;">${statusMessage}</p>
          </div>

          <h3 style="color: #ffffff; font-size: 16px; margin: 24px 0 12px 0;">Order Summary</h3>
          <table class="item-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="grid" style="margin-top: 24px;">
            <div class="grid-row">
              <div class="grid-col" style="width: 50%;">
                <h3 style="color: #ffffff; font-size: 14px; margin: 0 0 8px 0;">Delivery Address</h3>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
                  <strong>${order.shippingAddress.fullName}</strong><br>
                  ${order.shippingAddress.streetAddress}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}
                </p>
              </div>
              <div class="grid-col" style="width: 50%; text-align: right;">
                <h3 style="color: #ffffff; font-size: 14px; margin: 0 0 8px 0; text-align: right;">Grand Total</h3>
                <strong style="font-size: 20px; color: #38bdf8;">${formatCurrency(order.finalTotal)}</strong>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">Payment Method: ${order.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${frontendUrl}" class="btn">Track Order Live</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Shoping App. All rights reserved.</p>
          <p>You received this update because your order status was changed in our system.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Save local preview
  saveEmailPreview(`order-status-update-${order._id}-${order.status}-${Date.now()}.html`, html);

  try {
    const client = await getTransporter();
    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Shoping App" <noreply@shopingapp.com>',
      to: user.email,
      subject: `Order #${shortId} Status: ${order.status}! 🚚`,
      html
    };
    await client.sendMail(mailOptions);
    console.log(`Order status update email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate
};

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Rest of your application code
// Create reusable transporter using environment variables
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Add this line for SSL/TLS connection (required for port 465)
  auth: {
    user: "mystorehelp004@gmail.com",
    pass: "bghi hvqs effj hpbp",
  },
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version
 * @param {string} options.html - HTML version
 * @returns {Promise} - Email sending result
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send order confirmation email
 * @param {Object} order - Order details
 * @param {Object} user - User details
 */
export const sendOrderConfirmation = async (order, user) => {
  const subject = `Order Confirmation - Order #${order._id}`;
  
  // Create plain text version
  const text = `
    Thank you for your order, ${user.name}!
    
    Order #: ${order._id}
    Order Date: ${new Date(order.createdAt).toLocaleDateString()}
    Total: $${order.totalPrice}
    
    Your items will be shipped to:
    ${order.shippingAddress.address},
    ${order.shippingAddress.city}, ${order.shippingAddress.postalCode},
    ${order.shippingAddress.country}
    
    Thank you for shopping with us!
  `;
  
  // Create HTML version
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for your order, ${user.name}!</h2>
      
      <p><strong>Order #:</strong> ${order._id}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total:</strong> $${order.totalPrice}</p>
      
      <h3>Order Items:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Qty</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems.map(item => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${item.qty}</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h3>Shipping Address:</h3>
      <p>
        ${order.shippingAddress.address},<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode},<br>
        ${order.shippingAddress.country}
      </p>
      
      <p>Thank you for shopping with us!</p>
    </div>
  `;
  
  await sendEmail({
    to: user.email,
    subject,
    text,
    html
  });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Frontend URL for password reset
 */
export const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    const subject = 'Password Reset Request';
    
    const resetLink = `${resetUrl}/${resetToken}`;
    
    const text = `
      You requested a password reset. Please use the following link to reset your password:
      
      ${resetLink}
      
      This link is valid for 1 hour.
      
      If you didn't request this, please ignore this email.
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        
        <p>You requested a password reset. Please click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetLink}</p>
        
        <p>This link is valid for 1 hour.</p>
        
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
    
    await sendEmail({
      to: email,
      subject,
      text,
      html
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export default {
  sendEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail
};

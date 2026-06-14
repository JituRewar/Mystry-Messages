/**
 * Generates a clean, professional, and responsive HTML email template for OTP verification.
 * Styles are inlined to ensure maximum compatibility across email clients (Gmail, Outlook, Apple Mail, etc.).
 * 
 * @param username - The recipient's username
 * @param verificationCode - The 6-digit one-time passcode (OTP)
 * @returns HTML template string
 */
export function getVerificationEmailTemplate(username: string, verificationCode: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verification Code - Mystery Message</title>
  <style>
    /* Reset styles */
    body, p, h1, h2, h3 {
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding: 40px 20px;
    }
    .email-container {
      max-width: 550px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    .header {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      text-align: center;
      padding: 40px 20px;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .header p {
      font-size: 15px;
      opacity: 0.9;
    }
    .body {
      padding: 40px 30px;
    }
    .body h2 {
      font-size: 20px;
      color: #111827;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .body p {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .otp-container {
      background-color: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 32px 0;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #2563eb;
      margin: 0;
      font-family: 'Courier New', Courier, monospace;
    }
    .otp-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #64748b;
      margin-top: 8px;
      font-weight: 600;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #f3f4f6;
      font-size: 13px;
      color: #9ca3af;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>

  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Mystery Message</h1>
      <p>Secure Anonymous Feedback & Messaging</p>
    </div>

    <!-- Body -->
    <div class="body">
      <h2>Hello, ${username}!</h2>
      <p>Thank you for signing up for Mystery Message. To complete your account registration, please use the 6-digit verification code below. This code is active for <strong>1 hour</strong>.</p>
      
      <!-- Verification Code Box -->
      <div class="otp-container">
        <div class="otp-code">${verificationCode}</div>
        <div class="otp-label">One-Time Verification Passcode</div>
      </div>

      <p>If you did not initiate this request, please ignore this email or contact support if you have any questions.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>This is an automated system email, please do not reply directly.</p>
      <p style="margin-top: 8px;">&copy; 2026 Mystery Message. All rights reserved.</p>
    </div>
  </div>

</body>
</html>
  `.trim();
}

Mystery Messages is a modern full-stack web application built with Next.js that enables users to collect anonymous feedback, opinions, and messages from anyone via a personalized public link.

The platform focuses on privacy, simplicity, and user control. After creating an account, users receive a unique public profile URL that can be shared with friends, colleagues, or social media audiences. Visitors can send anonymous messages without creating an account, while registered users can manage incoming messages from a secure dashboard.

Key Features
🔐 Secure user authentication and authorization
✉️ Email verification using OTP
👤 Personalized public profile links
🎭 Anonymous message submission
📥 User dashboard to manage received messages
🔄 Toggle message acceptance on/off
📋 Copy public profile URL with one click
📱 Fully responsive and modern UI
🗑️ Message management and deletion
⚡ Fast performance with Next.js App Router
🛡️ Input validation and secure API routes
Tech Stack
Frontend: Next.js 15, React, TypeScript, Tailwind CSS, ShadCN UI
Backend: Next.js Server Actions & API Routes
Database: MongoDB & Mongoose
Authentication: NextAuth/Auth.js
Email Service: Gmail SMTP (Development) / Resend (Production)
Validation: Zod
Deployment: Vercel
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

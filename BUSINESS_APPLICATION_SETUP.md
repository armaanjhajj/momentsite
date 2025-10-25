# Business Application Form Setup

## Overview
The business verification application form is now set up at `/businesses/apply`. When users submit the form, it sends an email to `support@havemoments.com` with the business details.

## Setup Instructions

### 1. Sign up for Resend (Recommended)
Resend is a modern email API service that's perfect for transactional emails.

1. Go to [resend.com](https://resend.com) and sign up
2. Get your API key from the dashboard
3. Add it to your `.env.local` file:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

### 2. Verify Your Domain (Optional but Recommended)
By default, emails will be sent from `onboarding@resend.dev`. To use your own domain:

1. Add your domain in the Resend dashboard
2. Add the DNS records they provide
3. Update the `from` field in `/src/app/api/business-application/route.ts`:
   ```typescript
   from: 'Business Applications <applications@yourdomain.com>',
   ```

### 3. Test the Form
1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/businesses/apply`
3. Fill out the form and submit
4. Check `support@havemoments.com` for the email

## Alternative: Use Gmail SMTP (Not Recommended for Production)

If you prefer to use Gmail instead of Resend, you'll need to:

1. Install nodemailer: `npm install nodemailer`
2. Set up an App Password in your Gmail account
3. Modify the API route to use nodemailer instead of Resend

**Note:** Gmail has limitations:
- 500 emails per day limit
- Emails show "sent via gmail.com"
- Less reliable for production use

## Form Fields
The application form collects:
- **Business Name** (required)
- **Location** (required)
- **Business Description** (required)
- **Additional Message** (optional)

## Email Format
Emails are sent with:
- **To:** support@havemoments.com
- **Subject:** "New Business Verification Application: [Business Name]"
- **Body:** Formatted HTML with all form details

## Pricing
Resend offers:
- **Free tier:** 3,000 emails/month
- **Pro tier:** $20/month for 50,000 emails/month

This should be more than enough for business applications.


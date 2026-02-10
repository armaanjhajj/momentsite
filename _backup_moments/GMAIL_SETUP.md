# Gmail SMTP Setup Instructions

## Important: Generate a Gmail App Password

Gmail requires an **App Password** for SMTP access (not your regular Gmail password).

### Steps to Generate Gmail App Password:

1. **Go to your Google Account**: [myaccount.google.com](https://myaccount.google.com)

2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process

3. **Generate an App Password**:
   - Go to: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Or: Security → 2-Step Verification → App passwords (at the bottom)
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

4. **Add the App Password to `.env.local`**:
   ```
   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   ```
   (Remove spaces from the password)

## Current Configuration

Your `.env.local` file should now have:

```env
# Gmail SMTP Configuration
GMAIL_USER=makemomentsapp@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here  # Replace this!

# Business application recipient email
BUSINESS_EMAIL_RECIPIENT=support@havemoments.com
```

## Testing

After adding your App Password:

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Test the form:
   ```bash
   curl -X POST http://localhost:3000/api/business-application \
     -H "Content-Type: application/json" \
     -d '{
       "businessName":"Test Cafe",
       "location":"123 Main St",
       "description":"Testing Gmail SMTP",
       "message":"This is a test"
     }'
   ```

3. Check `support@havemoments.com` for the email

## Gmail Limits

- **500 emails per day** for regular Gmail accounts
- **2,000 emails per day** for Google Workspace accounts
- Emails will show "sent via gmail.com" in the email header

## Troubleshooting

If you get authentication errors:
1. Make sure 2-Step Verification is enabled
2. Generate a fresh App Password
3. Remove any spaces from the App Password
4. Make sure you're using the App Password, not your regular Gmail password


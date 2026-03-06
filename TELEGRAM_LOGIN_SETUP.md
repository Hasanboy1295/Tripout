# Telegram Login Integration Setup

## Overview
Telegram login has been integrated into the login page using the `react-telegram-auth` package.

## Installation
The package has already been installed:
```bash
yarn add react-telegram-auth
```

## Files Modified
1. **pages/account/join.tsx** - Added Telegram login button and handler
2. **scss/pc/account/join.scss** - Added styling for Telegram login button

## Setup Instructions

### 1. Create a Telegram Bot
- Go to [@BotFather](https://t.me/BotFather) on Telegram
- Create a new bot using `/newbot` command
- Copy your bot token

### 2. Set Up Domain Authentication
- Follow Telegram's domain authentication process
- Add your domain to the bot's allowed domains
- Get your BOT_NAME (the username you set for the bot)

### 3. Update Configuration
In `pages/account/join.tsx`, replace `YOUR_TELEGRAM_BOT_NAME` with your actual bot name:

```tsx
<TelegramLoginButton
  dataOnauth={handleTelegramLogin}
  botName="your_bot_username"  // Replace this with your actual bot username
/>
```

### 4. Backend Integration
The `handleTelegramLogin` function currently logs the data. You need to:

1. Send the Telegram auth data to your backend:
```tsx
const handleTelegramLogin = (data: any) => {
  // Send to your backend API
  // data contains: id, first_name, last_name, username, photo_url, auth_date, hash
};
```

2. In your NestJS backend, create an endpoint to:
   - Verify the Telegram authentication using the hash
   - Create or update the member with Telegram auth type
   - Return JWT token

### 5. Environment Variables
Add to your `.env.local` or `.env.development`:
```
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your_bot_username
```

## Features
- Telegram login button appears only on the login view (not signup)
- Button is centered below the regular login button
- Styled to match the existing design
- Full user authentication data is captured from Telegram

## Security Considerations
- Always verify the hash on the backend using your bot token
- Use HTTPS for secure transmission
- Store user data securely
- Follow Telegram's security best practices

## Styling
The Telegram button styling is located in:
- `scss/pc/account/join.scss` under `.telegram-login-box`
- Customizable via SCSS variables

## Testing
1. Run your development server: `yarn run dev`
2. Navigate to the login page (`/account/join`)
3. Click "Or sign in with" section to see the Telegram button
4. Test the Telegram login flow

## Troubleshooting
- If the button doesn't appear, check that the `botName` is correct
- Ensure your domain is whitelisted in Telegram bot settings
- Check browser console for any errors
- Verify the package is properly installed: `yarn list react-telegram-auth`

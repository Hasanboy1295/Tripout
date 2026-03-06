# ⚡ 2-MINUTE TELEGRAM LOGIN SETUP

## Step 1: Create Bot (1 minute)
1. Open Telegram on your phone/computer
2. Search: `@BotFather`
3. Click "START"
4. Send: `/newbot`
5. Bot asks "What name?": Type `Nestar Auth`
6. Bot asks "Username?": Type `nestar_login_bot`
7. ✅ DONE! Copy the username (you already have it)

## Step 2: Set Domain (30 seconds)
1. Still in @BotFather chat
2. Send: `/setdomain`
3. Select: `@nestar_login_bot`
4. Send: `localhost`
5. ✅ DONE!

## Step 3: Test (30 seconds)
```bash
cd "/Users/khan/Desktop/nestar folders/nestar-next-develop"
yarn run dev
```

Go to: http://localhost:3000/account/join

You'll see: **"Log in as [Your Telegram Name]"** button

Click it → Telegram opens → Click "Login" → You're logged in! 🎉

---

## That's It!
- No coding needed
- No configuration files
- Just 2 minutes in Telegram
- Then it works like picture 3!

---

## Already Have a Bot?
Just change line 121 in `join.tsx` from:
```
botName="nestar_login_bot"
```
To:
```
botName="YOUR_BOT_USERNAME"
```


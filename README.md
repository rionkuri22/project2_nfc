## Overview
A dynamic networking tool that replaces traditional business cards with a customizable digital alternative

Steps to use:
1. Select exactly which contact details I want to share eg) Linkedin, phone number
2. (Optional) Add a custom "Pre-drafted Message" like "I met you (Rion Kurihara) at [Event] so that when the recipient opens my link, their app (like WhatsApp or iMessage) gets populated with the message
3. Present my physical NFC card or the system-generated QR code to the recipient. This automatically launches my profile directly in the native app

## Key Features
- Deep links that bypass any openings on safari etc. and go straight to the app
- QR code that can make this product accessible without NFC card and with phones that don't support NFC reading

## How to run it locally
- Access to the app: https://project2-nfc.vercel.app/ to recreate experience of being me= the person that shares their contact info
- Download NFC Tools app on phone and write the above url to an NFC 
- Or Use QR code to make up for lack of NFC card and simulate the exprience of the "tap"

## How secrets are handled
- DATABASE_URL is stored in Vercel environment variables and also in .env file
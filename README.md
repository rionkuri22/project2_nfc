## Overview
WhichMe is a dynamic networking tool that replaces traditional business cards with a customizable digital alternative

Steps to use:
1. Open the app and selet the specific contact method you want to share eg) Linkedin, phone number
2. (Optional) Input context like "Apex social" to create a pre-drafted message like "I met you (Rion Kurihara) at [Event]". When the recipient opens your link, their Whatsapp or iMessages will be pre-populated with this message.
3. Present your physical NFC card or the system-generated QR code to the recipient. 

## Key Features
- Uses native app deep linking to bypass browsers and open everything in the native app. This means no logins, no clinking on links etc.
- The QR code rebuilds itself in real-time as you type context. There is no need to regenerate.
- Designed for a physical NFC card, but includes a dynamic QR code UI to ensure the product remains 100% accessible even for phones that do not support NFC reading.

## How to run it locally
- Access to the app: https://project2-nfc.vercel.app/ to recreate experience of being me= the person that shares their contact info
- Download the "NFC Tools" app on phone and write the URL above to a physical NFC 
- Alternatively, use the on-screen QR code to simulate the exprience of the "tap".

## How secrets are handled
- DATABASE_URL is stored in Vercel environment variables and also in .env file
- No APIs are used 
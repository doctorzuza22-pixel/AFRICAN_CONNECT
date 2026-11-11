# AFRICAN CONNECT 🌍

**Connecting African Communities**  
One Africa. One Connection. Endless Possibilities.

## Repository status

This repository currently contains an early Expo / React Native / TypeScript Android application prototype. It is **not a finished messaging platform or production service**.

## Implemented in the current prototype

- Messaging-first interface with Chats, Calls, Communities, Discover and Profile navigation.
- Sample conversation inbox and sample message history.
- Local-only message composition and display inside the selected sample conversation.
- Search across sample conversation names.
- Visible back arrows and Android hardware-back handling for the prototype's secondary screens.
- Demo business directory with country preference and local-first sorting.
- Placeholder entry screens for marketplace, health and services.
- GitHub Actions workflow for an Android release APK build.
- TypeScript check before Android project generation.

## Not implemented / not live

The current app does not yet provide:
- User registration, login, password reset, identity or age verification.
- Server-backed contacts, one-to-one messaging, group messaging or message delivery between devices.
- Message persistence across app restarts, read receipts, typing status, presence or push notifications.
- Voice/video calling, voice notes, photo/video/file sharing or end-to-end encryption.
- Live communities, moderation, blocking, reporting or child/teen safety controls.
- Real merchant accounts, persistent listings, product inventory, checkout, orders, refunds or payments.
- Real health providers, appointments, medical records or healthcare services.
- Live travel, jobs, music, property, vehicle or financial-service integrations.
- Admin/reviewer console, production audit logs or real business verification.
- The supplied original African Connect logo and final launcher/adaptive icons.

Sample people, messages and listings are demonstration data. A message typed in this build stays in local app memory and is not delivered to another person. Do not use this build to submit personal identity, health or payment information.

## Build

Requires Node.js 22 and Java 17 for the configured Android workflow.

```bash
npm install
npm run typecheck
npx expo prebuild --platform android --no-install
cd android
./gradlew assembleRelease
```

GitHub Actions runs the TypeScript check and creates an Android release APK artifact on pushes to `main`.

## Security and integrations

Production messaging requires a secured backend, authenticated accounts, access control, abuse prevention, privacy controls, operational monitoring and security testing. Payments, identity verification, healthcare, music and other partner services require authorised providers, credentials, agreements and country-specific compliance review.

Never commit API secrets, passwords or identity documents. Do not collect identity or health data until the relevant secure service and retention policy are implemented.

## Planned delivery sequence

1. Stabilise and test the Android client and navigation.
2. Receive and install the approved original logo and launcher assets.
3. Select and configure the production backend and authentication.
4. Implement persistent accounts, contacts, direct/group messaging and notifications.
5. Implement privacy, reporting, blocking, moderation and child/teen protections before public messaging launch.
6. Implement merchant onboarding, seller verification review, catalogue, orders and payment-provider integration.
7. Add healthcare and other services only through appropriate providers and agreements.
8. Add iOS distribution, localisation, accessibility and production operations.

A successful APK build confirms that the code compiled and packaged. It does not by itself prove the app is production-ready or tested on a physical device.

# AFRICAN CONNECT 🌍

**Connecting African Communities**  
One account. One Africa. Endless possibilities.

African Connect is a mobile-first African community and commerce platform designed to bring social connection, business discovery, shopping and partner services into one experience.

## Current milestone
The repository contains the first cross-platform application foundation using **Expo + React Native + TypeScript**. The same app code is intended to support Android, iOS and web.

### Current preview features
- Country preference selector: South Africa, Ghana and Zimbabwe
- Home dashboard with platform modules
- Sample social feed and local interaction state
- Searchable demo business directory
- Demo product catalogue and local demo cart
- Explore areas for services, music, health, cars and property
- Profile and identity-verification preview
- Safety and privacy messaging

All listings and interactions are demo-only. No real accounts, messages, orders, payments, identity checks or partner integrations are active.

## Run locally
Requires Node.js 20.19+ or 22.x.

```bash
npm install
npx expo start
```

For Android development:
```bash
npx expo run:android
```

For web:
```bash
npx expo start --web
```

## Android APK
GitHub Actions is configured to generate a debug APK from the Expo Android project. A debug APK is for installation/testing, not a signed production release.

## Security and partnerships
National ID data must only be handled through authorised identity-verification partners with informed user consent. Never commit identity documents, passwords, API keys or production secrets.

Payments, wallets, health services, retailer catalogues, music rights, vehicle/property checks and other regulated services require suitable providers, agreements and compliance review.

## Roadmap
1. Validate the app foundation and Android build.
2. Add real authentication, backend and secure data model.
3. Implement social accounts, messaging and moderation.
4. Add merchant onboarding, verified partner workflows and real marketplace orders.
5. Integrate identity verification and payment partners.
6. Expand country coverage, services and iOS distribution.

---
Early development build. Demo content is clearly labelled and is not an offer to sell goods or services.
# Supabase setup — African Connect

This repository is being prepared for a Supabase-backed messaging foundation. The app is **not connected to a live Supabase project yet**.

## 1. Create the project
1. Create a Supabase project on the free tier.
2. Choose a strong database password and keep it private.
3. In the project dashboard, open **SQL Editor** and run the migration at `supabase/migrations/0001_messaging_foundation.sql`.
4. In **Project Settings → API**, copy the Project URL and the publishable/anon client key.

## 2. Configure app secrets
Add these GitHub Actions repository secrets:
- `EXPO_PUBLIC_SUPABASE_URL` — the Supabase Project URL.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — the publishable/anon client key.

These are client-side public credentials and are protected by database Row Level Security. Never put a Supabase service-role key in the mobile app, GitHub source, or chat.

## 3. What the first migration creates
- Profiles linked to Supabase Auth users.
- Direct and group conversations.
- Conversation membership and read timestamps.
- Persistent text messages.
- Row Level Security policies for profile ownership and conversation membership.
- An atomic `create_conversation` database function.
- Realtime publication for message inserts.

## 4. Before public launch
This is a first backend foundation, not a complete production messaging system. The app still needs auth screens and session handling, realtime client subscriptions, message pagination, attachment storage, push notifications, blocking/reporting/moderation, rate limits, account deletion, privacy controls, teen protections, and security testing. Do not collect identity documents or sensitive personal data until the relevant secure flows and legal requirements have been reviewed.

## 5. Important security note
Run the SQL migration in a fresh Supabase project and verify the resulting policies before adding real users. Test cross-account access (a user outside a conversation must not read its messages or membership). The app must use only the publishable/anon key; Row Level Security is the boundary protecting user data.

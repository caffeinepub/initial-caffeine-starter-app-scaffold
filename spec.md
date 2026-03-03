# Specification

## Summary
**Goal:** Fix multiple bugs in the Hindu Dharma App: Admin Panel Katha creation errors, add MP3 upload support for Kathas, fix Community Posts visibility, and fix Text-to-Speech in the production/PWA app.

**Planned changes:**
- Fix the Admin Panel Katha creation form so it submits correctly without errors, ensuring the backend Motoko actor properly accepts and persists all Katha fields
- Add an MP3 file upload field to the Admin Panel Katha creation/edit form; store the audio blob in the backend associated with the Katha record
- Add a "सुनें" (Listen) audio player button on the public Katha detail page that plays the uploaded MP3 when available, with play/pause controls; hidden if no MP3 is uploaded
- Fix Community Posts so all logged-in users can view and create posts in a feed-style layout (YouTube-style cards showing author, content, media); unauthenticated users see a login prompt instead
- Fix Text-to-Speech (TTS) in the production/installed PWA by ensuring speech synthesis voices are loaded before speaking, adding a user-gesture warm-up, and adding a retry/resume mechanism for background/foreground switches

**User-visible outcome:** Admins can add Kathas with optional MP3 uploads without errors; users can listen to Kathas via an audio player; logged-in users can view and create community posts in a social feed; and TTS narration works reliably in the installed app.

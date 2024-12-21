# Manana Expo Project

An **Expo/React Native** application for organizing and participating in parties, with features like text and image posts, camera integration, autocomplete participant selection, and more.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [CahierDesCharges](#CahierDesCharges)

## Overview

This project, called **Manana**, is a mobile (and potentially web) application built on Expo. It allows users to:

- Create parties with a name, location, date, and time.
- Add participants via an **autocomplete** selection of known users.
- Post text or images to a party feed.
- Capture new images using the **expo-camera** API.
- Display full-size images in a modal viewer.
- …and more features you can expand on.

## Features

- **Create and Manage Parties**: 
  - Title, location, date/time pickers using React Native date-time components.
  - Toggle for private vs. public party.
- **Autocomplete Participants**: 
  - Fetch user list from a mock/fake provider (`getUsers()`) and filter suggestions in real time.
  - Let user select multiple participants, shown as “chips”.
- **Posts**:
  - Text posts (with integrated bottom sheet).
  - Image posts (captured via a custom camera component or from local library).
  - Display posts in an organized feed using a scrollable layout.
- **Camera**:
  - Built with `expo-camera`.
  - Captures images, allows optional caption, and updates the feed with newly added images.








## CahierDesCharges
Festive Events Social App

A social network built to archive and share festive events—parties, festivals, and more! The application supports photos, videos, notes, along with interactive features like bingos, bets, and built-in party games such as Je n’ai jamais (“Never Have I Ever”), Action ou Vérité (“Truth or Dare”), and Devine qui je suis.
Table of Contents

    Overview
    Key Features
    User Types
        Super Admin
        Admin
        Participant
    Business Model
    User Stories
    Planned Evolutions

Overview

This application is designed as a cross-platform tool (Android, iOS, and Web) for organizing, managing, and archiving festive events. Each event (or “soirée”) can be made public or private. Participants can share media (photos, videos, notes), participate in bingos and bets about in-event happenings, and play mini-games directly in the app.

The core premise is to make parties more interactive and memorable by:

    Enabling participants to share live content (photos/videos/notes).
    Offering gamified elements like bingo cards and paris (betting on possible occurrences during the party).
    Providing built-in party games to encourage group engagement.

Key Features

    Event Creation & Management
        Public or private events.
        Admin can edit event info (title, date, location, theme, etc.).
        Admin can finalize an event after it ends.

    Participants & Invitations
        Admin invites users from their friends list or shares an invitation link with outsiders (valid up to a certain time).
        Participants can accept or refuse invitations, and leave the event at any point—even after closure.

    Media Sharing
        Photos, videos, and notes posted during the event.
        Each participant can delete their own content, including anything embarrassing.

    Bingos & Bets
        Predefined or randomly generated bingos with squares to check off as certain actions occur.
        Interactive bets (paris) about event outcomes.

    Built-in Mini-Games
        Je n’ai jamais (Never Have I Ever).
        Action ou Vérité (Truth or Dare).
        Devine qui je suis (Guess Who I Am).
        Access these in-app to keep the party entertaining.

    Multi-Day Events
        (Planned) Festivals or multi-day parties with separate daily sessions.

    Video Summaries
        (Planned) Automatic creation of highlight reels from photos/videos/notes.

    Internal Messaging
        (Planned) Direct messaging between participants.

    User Profile “Card”
        (Planned) Stats per user: number of events attended, photos shared, average rating, etc.

    Shareable Event Link

    (Planned) A web-accessible link summarizing highlights from each event.

User Types
Super Admin

    Global access to all events.
    Can delete or modify any event.
    Typically the development team or system owners.

Admin

    Organizes the party, sets title/description, date, location, and can invite participants.
    Manages or delegates bingos and bets setup and tracking.
    Closes the event when it finishes.

Participant

    Accepts or declines event invitations.
    Posts photos/videos/notes; can also delete their own content.
    Plays bingos, bets, and mini-games.
    May leave a party at any time.

Business Model

The application follows a freemium model:

    Basic Access
        Everyone can create one party for free.
        Additional parties require a premium subscription (price TBD based on average cost per user/party).

    Microtransactions
        Users may pay small fees (~1€) for special features:
            Randomly generated bingo cards.
            Access to certain integrated games.

    Commission on Bets
        A small percentage of winnings from bets (paris) is taken by the platform.

    Rewarded Ads
        Minimal banner ads; instead, short ad views are used to unlock games or features (netting ~0.006€ per impression), preserving user experience quality.

User Stories
Utilisateur (General User)

    Create an account, sign in with Google/iCloud, recover password.
    View legal notices (iOS requirement).
    Add/remove friends, update profile photo.
    Access integrated games.
    Add payment info (CB).

Admin

    Create a party, invite friends (in-app or via share link).
    Remove participants, set up bingos and bets.
    Update results for bets as events occur.
    Delegate bingo/bets management to a participant.
    Close/finalize a party.

Participant

    Accept or refuse invites.
    Post or delete photos, videos, notes.
    Participate in bets.
    Leave a party anytime.

Planned Evolutions

    Multi-day events
        Support for festivals or parties spanning multiple days/sessions.

    Automated Video Summaries
        Combine shared media into highlights reels.

    Illustrated Bingos & Bets
        Option to attach images for each bingo square or bet scenario.

    Internal Messaging
        Direct chat feature among participants.

    Personalized Profile Stats
        A “card” showing user’s event attendance, posted photos, average party rating, etc.

    Shareable Web Recap
        Public link that shows an event summary and highlights.

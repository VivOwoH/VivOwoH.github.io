---
layout: page
title: Concussion Action Plan App
description: Cross-platform mobile healthcare app with offline-first architecture
img: assets/img/project/expo_thumbnail.png
importance: 3
category: work
related_publications: false
---

## Overview

Cross-platform mobile application for managing concussion recovery through symptom tracking, progress monitoring, and report generation. Built with offline-first architecture for healthcare environments with unreliable connectivity.

**Platform**: Android (iOS-compatible codebase)  
**Tech Stack**: React Native, Expo, JavaScript, SQLite, Jest, Detox  

---

## Core Functionality

- **Patient Management**: Multi-profile system with filtering and organization
- **Daily Symptom Tracking**: Severity ratings with historical comparison and progress visualization
- **Report Generation**: PDF exports with symptom progression analytics
- **Offline-First**: Full functionality without network connectivity via SQLite

---

## Technical Stack

**Mobile Framework:**
- React Native with Expo for cross-platform development
- React Navigation for screen routing
- NativeBase UI components

**Data & Storage:**
- SQLite for local database (offline-first architecture)
- Persistent storage for patient records and symptoms
- Efficient querying for report generation

**Build & Testing:**
- EAS Build (Expo Application Services)
- Gradle 8.0.1 + Java 17 for Android builds
- Jest for unit testing with code coverage
- Detox for end-to-end testing on Android emulators

---

## Technical Implementation

### 1. Database Query Optimization

**Challenge**: Report fetching scaled poorly - looping through all records instead of direct queries caused significant slowdown.

**Solution Implemented**: ID-based filtering with iteration through database records.

**Lesson Learned**: Database query optimization critical for mobile apps; proper indexing and direct queries essential for performance.

### 2. Cross-Platform Component Handling

**Challenge**: React Native's `ProgressBarAndroid` is platform-specific and deprecated.

**Approach**: Used platform-specific implementations while maintaining codebase compatibility.

**Takeaway**: Cross-platform frameworks require careful component selection and fallback strategies.

### 3. PDF Generation from Structured Data

Implemented report generation system that converts SQLite symptom data into exportable PDF documents with proper formatting and data visualization.

### 4. Offline-First Architecture

Designed complete local storage solution using SQLite ensuring:
- Full app functionality without network
- Data persistence across sessions  
- Efficient query patterns for filtering and reporting

---

## Testing Strategy

**Unit Testing (Jest):**
- Automated code coverage reports
- Component and function mocking
- Database operation testing

**E2E Testing (Detox):**
- Automated user flow testing on Pixel 7 emulator
- Screenshot capture on test failures
- Configuration for Android API 31 (Android 12.0)

**Test Infrastructure:**
```bash
npm run test        # Unit tests with coverage
npm run e2e-android # End-to-end tests
```

---

## Key Learnings

**Mobile Development:**
- React Native cross-platform architecture and limitations
- Expo build system and EAS deployment
- Platform-specific API handling (Android vs iOS)

**Database Design:**
- SQLite implementation for mobile apps
- Query optimization for performance
- Offline-first data architecture patterns

**Testing:**
- Unit testing with Jest and mocking strategies
- E2E testing with Detox framework
- Automated testing in mobile development

**Build Systems:**
- Gradle configuration for Android
- EAS Build for app binary generation
- Dependency management in JavaScript ecosystem

---
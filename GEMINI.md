# MULTIPLE AGENTS ARE WORKING ON THIS PROJECT AND YOU ARE ONE OF THEM

# GEMINI.MD: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

* **Primary Goal:** FitnessBuddy is a comprehensive social fitness application designed to help users achieve their fitness goals through personalized workout plans, progress tracking, community engagement, and social features.
* **Business Domain:** Social Fitness, Health & Wellness

## 2. Core Technologies & Stack

* **Languages:** TypeScript
* **Frameworks & Runtimes:** Node.js, Express.js, React, Next.js
* **Databases:** MongoDB
* **Key Libraries/Dependencies:** Mongoose, Passport, JWT, React, Next.js, TailwindCSS
* **Package Manager(s):** npm

## 3. Architectural Patterns

* **Overall Architecture:** The project follows a client-server architecture. The frontend is a Next.js application, and the backend is a separate Express.js server.
* **Directory Structure Philosophy:**
    * `/frontend`: Contains the Next.js frontend application.
    * `/backend`: Contains the Express.js backend server.
    * `/docs`: Contains project documentation.

## 4. Coding Conventions & Style Guide

* **Formatting:** Prettier is used for code formatting. 2 spaces for indentation.
* **Naming Conventions:**
    * `variables`, `functions`: camelCase (`myVariable`)
    * `classes`, `components`: PascalCase (`MyClass`)
    * `files`: kebab-case (`my-component.js`)
* **API Design:** RESTful principles. Endpoints are plural nouns. Uses standard HTTP verbs (GET, POST, PUT, DELETE). JSON for request/response bodies.
* **Error Handling:** Uses a centralized error handling middleware in the backend.

## 5. Key Files & Entrypoints

* **Backend Entrypoint:** `backend/src/app.ts`
* **Frontend Entrypoint:** `frontend/app/page.tsx`
* **Configuration:**
    * `backend/.env`: Backend environment variables.
    * `frontend/.env.local`: Frontend environment variables.

## 6. Development & Testing Workflow

* **Local Development Environment:**
    * Run the backend: `cd backend && npm install && npm run dev`
    * Run the frontend: `cd frontend && npm install && npm run dev`
* **Testing:**
    * Backend tests are run with Jest and Supertest: `cd backend && npx jest`

## 7. Specific Instructions for AI Collaboration

* **Contribution Guidelines:** All pull requests must be submitted against the `main` branch and require a code review.
* **Security:** Be mindful of security. Do not hardcode secrets or keys. Ensure any changes to authentication logic are secure and vetted.
* **Dependencies:** When adding a new dependency, use `npm install` and update the `package.json` file.
* **Commit Messages:** Follow the Conventional Commits specification (e.g., `feat:`, `fix:`, `docs:`).

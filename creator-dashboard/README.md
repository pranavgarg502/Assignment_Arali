# Mini Creator Dashboard

This project is a Mini Creator Dashboard built using **Next.js (App Router)**, **TypeScript**, and **shadcn/ui**.

It demonstrates manual implementation of sorting, filtering, derived metrics, and unit testing without using external table or sorting libraries.

The focus was on clean architecture, deterministic behavior, and scalability awareness.

---

## 🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- shadcn/ui (100% UI components)
- Jest (Unit Testing)

---

## 🛠 Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2. Navigate into the project:

```bash
cd creator-dashboard
```

3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

5. Run unit tests:

```bash
npm test
```

The app runs on:

```
http://localhost:3000
```

## 🔄 Sorting Implementation

Sorting is implemented manually without external libraries.

Supported fields:
- Followers
- Revenue

Features:
- Ascending / Descending toggle
- Stable and deterministic sorting
- Tie-breaking logic

### Stable Sorting

If two creators have equal values (e.g., same followers), a tie-breaker is applied using alphabetical comparison of names.

Example:

If:
- Karan → 9800 followers
- Neha → 9800 followers

They are sorted alphabetically to ensure consistent ordering.

This guarantees deterministic results and prevents unstable UI behavior.

### Immutability

Before sorting, the array is copied:

```ts
[...data]
```

This prevents mutation of the original dataset and ensures:
- No side effects
- Pure function behavior
- Reliable unit tests

---

## 🔍 Filtering Logic

Filtering supports:

- Case-insensitive name search
- "Active only" toggle
- Combined filtering

Both filters are applied together using logical AND:

```ts
matchesSearch && matchesActive
```

If no creators match the filters, a proper empty state message is displayed.

---


## 📈 Scaling to 10,000 Creators

If this dashboard needed to support 10k creators, I would:

### 1. Use Memoization (Already Implemented)

Sorting and filtering are wrapped in `useMemo` to avoid unnecessary recalculations.

---

### 2. Add Pagination or Virtualization

Rendering thousands of rows is inefficient.

Possible improvements:
- Pagination
- Virtualized rendering (windowing)

This reduces DOM load and improves performance.

---

### 3. Move Sorting & Filtering to Backend

For large datasets, operations should be handled server-side.

Benefits:
- Reduced client computation
- Smaller payloads
- Better scalability

---

### 4. Add Database Indexes (Backend)

Indexes on:
- followers
- revenue
- active
- name
- signup_date

Would significantly improve query performance.

---


### 5. Debouncing Search Input

To avoid excessive API calls while typing, I would debounce the search input so that filtering only triggers after the user pauses typing.


--- 
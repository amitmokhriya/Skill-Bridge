# 🎓 SkillBridge – Curriculum-to-Industry Skill Gap Analytics Platform

> **A Full-Stack Academic Curriculum Quality & Accreditation Analytics Platform for University Department of Computer Science & Engineering.**

[![Live Demo](https://img.shields.io/badge/Live_Deployment-https%3A%2F%2Fskillbridge--6d9cf.web.app-2563eb?style=for-the-badge&logo=firebase&logoColor=white)](https://skillbridge-6d9cf.web.app)

[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Plan](https://img.shields.io/badge/Firebase_Plan-Spark_Free_Tier-success)](https://firebase.google.com/pricing)
[![Export](https://img.shields.io/badge/Architecture-Static_Export_SPA-indigo)](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

## 🌐 Live Production Deployment

* **Public Web URL:** **[https://skillbridge-6d9cf.web.app](https://skillbridge-6d9cf.web.app)**
* **Hosting Platform:** Firebase Hosting (Google CDN)
* **Authentication:** Google Single Sign-On (SSO) via Firebase Auth
* **Database:** Cloud Firestore with Per-Faculty Workspace Isolation
* **Department Scope:** Dept. of Computer Science & Engineering • B.Tech CSE (Regulation R22)
* **Compliance Standards:** Outcome-Based Education (OBE), NBA Tier-I SAR Criterion 2, NAAC Sub-criterion 1.1

---

---

## 📌 Executive Summary

**SkillBridge** bridges the chasm between what university students learn academically and what the contemporary technology industry demands from graduates. 

By conducting a mathematical cross-comparison between granular academic course topics and importance-weighted industry competencies, the platform computes:
1. **Weighted Syllabus Coverage Percentage** across target industry profiles.
2. **Deficit Skill Gaps** across core, high-priority, and secondary competencies.
3. **Curriculum Blind Spots** (critical industry skills with zero academic coverage).
4. **Actionable Remediation Recommendations** formatted for institutional review boards (NAAC, NBA, and ABET accreditation).

---

## 🛠️ Technology Stack & Zero-Cost Architecture

The system is engineered specifically to operate **100% on the Firebase Spark (Free) Plan** with zero server costs, zero paid APIs, and zero backend maintenance overhead.

| Layer | Technologies Used | Architecture Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** | Client-side reactive SPA with modern component tree |
| **Language & Styling** | **JavaScript (ES6+)** + **Tailwind CSS** | Ultra-clean Linear/Stripe/Vercel inspired UI with Dark/Light theme |
| **Data Visualizations** | **Recharts** + **Lucide React** | Interactive SVG charts (Radar, Bar, Donut, Progress gauges) |
| **Authentication** | **Firebase Authentication** | Real Google Sign-In with popup + redirect fallback |
| **Database** | **Cloud Firestore** | Client-side Firebase Web SDK with isolated user workspaces |
| **Production Build** | **Next.js Static Export (`output: 'export'`)** | Builds into `out/` directory, compatible with Firebase Hosting |
| **Hosting & CDN** | **Firebase Hosting (Spark Plan)** | Global CDN edge caching with zero server runtime dependency |

---

## 📐 Mathematical Skill Gap Calculation Engine

The platform implements an analytical model to evaluate curriculum alignment:

### 1. Best Topic Mapping Resolution
For each industry skill $S_i$, the system evaluates all linked academic topics and assigns the highest recorded coverage level:
$$\text{Coverage}(S_i) = \max_{j} \left( \text{TopicCoverage}_{i,j} \right)$$

*Standard Curriculum Coverage Benchmarks:*
- **Not Covered:** $0\%$
- **Beginner:** $25\%$
- **Intermediate:** $60\%$
- **Advanced:** $100\%$
- *Unmapped Skill Default:* $0\%$

### 2. Weighted Role Coverage Formula
Given a target industry role with $n$ technical skills, each carrying an importance weight $w_i \in [1, 5]$:
$$\text{Weighted Coverage} = \frac{\sum_{i=1}^{n} (w_i \times \text{Coverage}(S_i))}{\sum_{i=1}^{n} w_i}$$

### 3. Net Curriculum Skill Gap
$$\text{Skill Gap} = 100\% - \text{Weighted Coverage}$$

### 4. High-Priority Remediation Filter
A competency is flagged as an **Urgent Curriculum Blindspot** if:
$$w_i \ge 4 \quad \text{AND} \quad \text{Coverage}(S_i) < 60\%$$

---

## 📂 Complete Project Directory Structure

```
skillbridge/
├── app/
│   ├── layout.js                 # Root layout with ThemeProvider & AuthProvider
│   ├── globals.css               # Tailwind directives & print media styles
│   ├── page.js                   # High-conversion Landing Page with Hero & Metrics
│   ├── login/
│   │   └── page.js               # Faculty & Evaluator Google SSO Portal (onAuthStateChanged)
│   ├── dashboard/
│   │   └── page.js               # Analytics command center with Recharts visualizations
│   ├── curriculum/
│   │   └── page.js               # Full CRUD for Programs, Subjects, and Topics
│   ├── industry-roles/
│   │   └── page.js               # Industry Job Roles benchmark profiles
│   ├── industry-skills/
│   │   └── page.js               # Technical Competencies matrix with 1-5 weights
│   ├── skill-mapping/
│   │   └── page.js               # Topic-to-Skill linkage engine with coverage levels
│   ├── gap-analysis/
│   │   └── page.js               # Mathematical gap audit engine & BoS recommendations
│   ├── reports/
│   │   └── page.js               # Exportable accreditation dossiers (CSV & Print)
│   ├── settings/
│   │   └── page.js               # Dark/Light theme, profile, and workspace reset
│   └── profile/
│       └── page.js               # Google faculty identity & workspace counters
├── components/
│   ├── common/
│   │   ├── Badge.js              # Multi-variant badge chips
│   │   ├── ConfigAlert.js        # Helpful banner if Firebase config is missing
│   │   ├── EmptyState.js         # Beautiful zero-data visual states
│   │   ├── Modal.js              # Accessible modal dialog with backdrop
│   │   ├── Skeleton.js           # Loading skeleton placeholders
│   │   ├── StatCard.js           # Metric card with icons, trends, and borders
│   │   ├── ThemeToggle.js        # Smooth dark/light mode toggle button
│   │   └── Toast.js              # Toast notification system
│   └── layout/
│       ├── AppLayout.js          # Authenticated frame with Sidebar & Header
│       ├── DashboardHeader.js    # Sticky top header with search & user avatar
│       ├── ProtectedRoute.js     # Client route guard checking Google Auth
│       └── Sidebar.js            # Linear-style navigation sidebar
├── context/
│   ├── AuthContext.js            # Firebase Auth Google provider & user session
│   └── ThemeContext.js           # Persistent dark/light theme state
├── hooks/
│   ├── useAuth.js                # Convenience hook for AuthContext
│   └── useFirestore.js           # Real-time CRUD operations, seed sync, & stats
├── lib/
│   ├── calculations.js           # Pure mathematical engine for gap formulas
│   ├── firebase.js               # Firebase App, Auth, and Firestore singleton
│   ├── firestore.js              # Isolated subcollection CRUD helpers
│   ├── seedData.js               # Complete B.Tech CSE sample benchmarks
│   └── utils.js                  # Tailwind class merger & formatting utils
├── public/                       # Static public assets
├── .env.local.example            # Template for Firebase web configuration
├── .firebaserc                   # Firebase project binding
├── firebase.json                 # Firebase Hosting (`out/`) & Firestore rules config
├── firestore.rules               # Strict user-workspace security rules
├── firestore.indexes.json        # Firestore composite indexes definition
├── next.config.js                # Static export configuration (`output: 'export'`)
├── package.json                  # Dependencies & npm scripts
├── postcss.config.js             # PostCSS Tailwind plugins
└── tailwind.config.js            # Custom brand palette & typography
```

---

## 🔒 Cloud Firestore Database Schema & Isolation

Each faculty user operates within an **isolated workspace** strictly governed by `firestore.rules`. No user can access or mutate another faculty member's curriculum data.

```
users/{uid}                                    # Faculty Profile Document
  ├── programs/{programId}                     # Academic Programs (e.g. B.Tech CSE)
  ├── subjects/{subjectId}                     # Course Subjects (e.g. CS201 Data Structures)
  ├── topics/{topicId}                         # Granular Topics (e.g. Binary Trees, React Hooks)
  ├── industryRoles/{roleId}                   # Industry Profiles (e.g. Frontend Developer)
  ├── industrySkills/{skillId}                 # Industry Skills (e.g. React.js, Weight: 5)
  ├── skillMappings/{mappingId}                # Curriculum-to-Skill Links (Intermediate: 60%)
  └── appMeta/workspace                        # Idempotent seed metadata flag
```

### Firestore Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /{allSubcollections=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /{document=**} {
      allow read, write: false;
    }
  }
}
```

---

## 🚀 Quick Start & Local Development

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "Skill Bridge"
npm install
```

### 2. Configure Firebase Credentials
1. Visit the [Firebase Console](https://console.firebase.google.com/) and create a project (e.g., `skillbridge-analytics`).
2. In the Firebase Console, go to **Build > Authentication** and enable **Google Sign-In**.
3. In **Build > Firestore Database**, click **Create Database** (Start in Production mode, select your preferred location).
4. Go to **Project Settings > General > Your Apps**, click the Web icon `</>`, and register a web app.
5. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
6. Fill in your keys in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skillbridge-analytics.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skillbridge-analytics
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skillbridge-analytics.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **💡 Live Deployment:** The production instance is hosted on Firebase Spark Tier at **[https://skillbridge-6d9cf.web.app](https://skillbridge-6d9cf.web.app)** with Cloud Firestore persistence and Google SSO.

---

## 📦 Production Build & Firebase Hosting Deployment

### 1. Generate Next.js Static Export
```bash
npm run build
```
This builds all 14 pages into the static `out/` directory with `trailingSlash: true` and unoptimized images.

### 2. Login to Firebase CLI
```bash
npx firebase login
```

### 3. Associate Firebase Project
```bash
npx firebase use --add
# Select skillbridge-6d9cf
```

### 4. Deploy Firestore Security Rules
```bash
npx firebase deploy --only firestore:rules
```

### 5. Deploy to Firebase Hosting (Spark Plan)
```bash
npx firebase deploy --only hosting
```
Once complete, the Firebase CLI outputs your public production URL:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/skillbridge-6d9cf/overview
Hosting URL: https://skillbridge-6d9cf.web.app
```

---

## 📋 Comprehensive Benchmark Dataset Included

SkillBridge automatically seeds new faculty workspaces with realistic Computer Science curriculum data:

### Core Academic Subjects (B.Tech Computer Science & Engineering)
1. **Data Structures and Algorithms (CS201)** - Trees, Graphs, Sorting, Dynamic Programming.
2. **Database Management Systems (CS202)** - Relational Algebra, SQL, Normalization, ACID, Indexing.
3. **Operating Systems (CS203)** - CPU Scheduling, Concurrency, Mutex/Semaphores, Memory Paging.
4. **Computer Networks (CS301)** - OSI/TCP-IP, Routing, Sockets, HTTP/HTTPS Protocols.
5. **Software Engineering (CS302)** - SDLC, Agile/Scrum, SOLID Design Patterns, Unit Testing.
6. **Web Development (CS303)** - HTML5/CSS3, JavaScript ES6+, React Hooks, REST API Integration.
7. **Artificial Intelligence (CS401)** - Search Agents, Logic, Bayesian Networks, Heuristics.
8. **Machine Learning (CS402)** - Supervised Regression, Random Forests, Deep Learning, Evaluation.

### Benchmark Industry Roles & Tracked Competencies
- **Frontend Developer** *(React.js, Modern ES6+, Responsive Design, TypeScript, State Management, Next.js)*
- **Backend Developer** *(Node.js, PostgreSQL/SQL, REST API Design, JWT/OAuth, Docker, Automated Testing)*
- **Full Stack Developer** *(End-to-End TypeScript, React, Server Architecture, ORMs, Git Workflows, CI/CD)*
- **Data Analyst** *(SQL Aggregations, Python/Pandas, Tableau/Power BI, Statistical Hypothesis Testing)*
- **Software Engineer** *(Data Structures & Algorithms, Clean Architecture, Concurrency, Networking)*

---

## 📄 License & Academic Attribution
Developed as an open-source college capstone project for curriculum enhancement and quality assurance in higher education. Free for educational and institutional research use under the MIT License.

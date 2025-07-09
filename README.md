# 💻 CS Student Dashboard - Complete Academic & Career Management System

A comprehensive Notion template for Computer Science students to manage their entire academic journey, practical skills development, and career preparation.

## 🎯 **Core Focus Areas**

### 📚 **Foundational Coursework Management**
- Course tracking with syllabus and deadline management
- Assignment scheduling with priority and difficulty rating
- Grade calculation and GPA tracking
- Study material organization and note-taking

### ⏰ **Daily Assignment Tracking & Study Time Management**
- Daily/weekly study scheduling with time blocks
- Pomodoro session tracking and productivity metrics
- Assignment progress monitoring with time estimates
- Study habit analytics and improvement tracking

### 💪 **Practical Skills Practice**
- Coding problem tracking (LeetCode, HackerRank, Codewars)
- Technology skill progression mapping
- Hands-on project-based learning
- Code challenge streaks and performance metrics

### 🎤 **Interview Preparation & Career Enhancement**
- Technical interview question bank
- Behavioral interview practice
- Mock interview scheduling and feedback
- Company research and application tracking
- Salary negotiation preparation

### 🏆 **Certification Opportunities**
- Professional certification roadmaps
- Study plan creation and progress tracking
- Exam scheduling and preparation materials
- Certificate achievement gallery

### 🚀 **Portfolio Project Tracker** (Focus on Completion)
- Project ideation and planning
- Development milestone tracking
- Deployment and showcase management
- Project completion rate analytics
- GitHub integration and code quality metrics

## ✨ **Key Features**

- **Interconnected Databases** - All systems work together seamlessly
- **Progress Analytics** - Visual dashboards showing your growth
- **Automation** - Smart formulas and rollups reduce manual work
- **Mobile-Friendly** - Access your dashboard from anywhere
- **Customizable** - Adapt the system to your learning style
- **Goal-Oriented** - Focus on completing projects and achieving milestones

## 🛠️ **What Gets Created**

1. **📊 Master Dashboard** - Central hub with all key metrics
2. **📚 Courses Database** - Complete academic tracking
3. **📝 Assignments Database** - Task management with priorities
4. **⏰ Study Sessions Database** - Time tracking and productivity
5. **💻 Coding Practice Database** - Problem-solving progress
6. **🎯 Skills Database** - Technology competency mapping
7. **📋 Interview Prep Database** - Technical and behavioral questions
8. **🏢 Career Tracker Database** - Job applications and networking
9. **🏆 Certifications Database** - Professional development
10. **🚀 Projects Database** - Portfolio management with completion focus
11. **📖 Resources Database** - Learning materials and documentation
12. **🎓 Goals Database** - Academic and career objectives

## 1️⃣ Phase 1: Template Setup

```bash
# Install dependencies
npm install

# Set up your environment
cp .env.example .env
# Add your NOTION_TOKEN and NOTION_PARENT_PAGE_ID

# Create the complete dashboard
node create-cs-dashboard.js
```

This creates a comprehensive system that grows with you throughout your CS education and early career!

## 2️⃣ Phase 2: Optional Link-Preview Integration

Enhance your dashboard with live link previews for coding resources by implementing a lightweight OAuth 2.0 flow and unfurl endpoint:

**Endpoints:**
- `GET /notion/authorize` — Initiate OAuth with GitHub, LeetCode, or Codecademy.
- `POST /notion/token` — Exchange authorization code for an access token.
- `POST /unfurl` — Callback to unfurl URLs in Notion and return structured preview data:
  ```json
  {
    "title": "Repo Name",
    "description": "Repository description",
    "image": "https://.../preview.png",
    "stats": { "stars": 123, "forks": 45 },
    "url": "https://github.com/..."
  }
  ```
  
These endpoints can be served from a simple Node.js server if you choose to enable live previews in your template.

**Setup & Run the Server**
```bash
# Install new dependencies
npm install
# Start the link-preview server
npm start
```

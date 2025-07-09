# Academic Management Dashboard

A comprehensive, full-stack web application for managing academic coursework, skills development, and goal tracking. Built with Flask, Tailwind CSS, Alpine.js, and Notion API integration.

## 🎯 Features

### Core Functionality
- **Dashboard Overview**: Real-time statistics and progress tracking
- **Assignment Management**: Create, track, and manage coursework with due dates
- **Skills Tracking**: Monitor skill development and proficiency levels
- **Goal Setting**: Set and track academic and personal goals
- **Portfolio Showcase**: Display and organize completed projects
- **Calendar Integration**: View upcoming deadlines and events
- **Analytics**: Visualize progress with charts and metrics

### Technical Features
- **Notion Integration**: Real-time sync with Notion databases
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS
- **Interactive Components**: Alpine.js for dynamic user interactions
- **Modular Architecture**: Clean, maintainable code structure
- **RESTful API**: Full CRUD operations for all data
- **Custom Icon System**: Self-hosted icons (no external CDN dependencies)
- **Toast Notifications**: User-friendly feedback system
- **Keyboard Shortcuts**: Power-user productivity features

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Notion account with API access
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd academic_dashboard
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your Notion token and database IDs
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open in browser**
   Navigate to `http://localhost:5000`

## ⚙️ Configuration

### Notion Setup

1. **Create Notion Integration**
   - Go to [Notion Developers](https://developers.notion.com/)
   - Create a new integration
   - Copy the integration token

2. **Set up Databases**
   - Use the provided `notion_init.py` script to automatically create databases
   - Or manually create databases with the required properties

3. **Update Environment Variables**
   ```bash
   NOTION_TOKEN=your_integration_token_here
   NOTION_COURSES_DB=database_id_here
   NOTION_ASSIGNMENTS_DB=database_id_here
   # ... add all database IDs
   ```

### Color Scheme
The application uses a cohesive granite/turquoise/cream color palette:
- **Granite**: Primary text and dark elements
- **Turquoise**: Accent color and interactive elements  
- **Cream/Off-white**: Background and light elements

## 📁 Project Structure

```
academic_dashboard/
├── app.py                 # Flask application entry point
├── requirements.txt       # Python dependencies
├── .env.example          # Environment configuration template
├── static/
│   ├── css/
│   │   └── styles.css    # Custom styles with Tailwind
│   └── js/
│       └── app.js        # JavaScript utilities and components
├── templates/
│   ├── base.html         # Base template with navigation
│   ├── dashboard.html    # Main dashboard page
│   ├── assignments.html  # Assignment management
│   ├── skills.html       # Skills tracking (to be created)
│   ├── goals.html        # Goal management (to be created)
│   ├── portfolio.html    # Portfolio showcase (to be created)
│   ├── calendar.html     # Calendar view (to be created)
│   └── analytics.html    # Analytics dashboard (to be created)
└── README.md             # This file
```

## 🛠️ API Endpoints

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/{id}` - Update assignment
- `DELETE /api/assignments/{id}` - Delete assignment

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 Customization

### Adding New Features
1. Create new template in `templates/`
2. Add route in `app.py`
3. Create corresponding API endpoints
4. Update navigation in `base.html`

### Styling
- Modify `static/css/styles.css` for custom styles
- Use Tailwind utility classes for rapid styling
- Update color scheme in CSS custom properties

### JavaScript Components
- Add new Alpine.js components in templates
- Extend `static/js/app.js` for shared functionality
- Use the provided utility functions for consistency

## 🔧 Development

### Running in Development Mode
```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Adding Dependencies
```bash
pip install package_name
pip freeze > requirements.txt
```

### Database Schema
The application uses Notion databases with the following structure:

#### Assignments
- Name (Title)
- Course (Select)
- Due Date (Date)
- Status (Select): Not Started, In Progress, Completed, Overdue
- Priority (Select): Low, Medium, High, Urgent
- Type (Select): Essay, Problem Set, Quiz, Exam, etc.
- Progress (Number): 0-100

#### Skills
- Name (Title)
- Category (Select)
- Proficiency (Select): Beginner, Intermediate, Advanced, Expert
- Progress (Number): 0-100
- Priority (Select)
- Tags (Multi-select)

#### Goals
- Goal (Title)
- Type (Select): Academic, Personal, Career
- Status (Select): Active, Completed, On Hold
- Priority (Select)
- Target Date (Date)
- Progress (Number): 0-100
- Category (Select)

## 📝 To-Do

### High Priority
- [ ] Complete skills management page
- [ ] Complete goals management page
- [ ] Complete portfolio showcase page
- [ ] Complete calendar view page
- [ ] Complete analytics dashboard

### Medium Priority
- [ ] User authentication system
- [ ] File upload functionality
- [ ] Email notifications
- [ ] Calendar integration (Google/Outlook)
- [ ] Mobile app (PWA)

### Low Priority
- [ ] Dark mode toggle
- [ ] Export functionality (PDF/CSV)
- [ ] Backup/restore system
- [ ] Multi-language support
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Notion API** for database integration
- **Tailwind CSS** for utility-first styling
- **Alpine.js** for reactive components
- **Chart.js** for data visualization
- **Flask** for the backend framework

## 📞 Support

For support, please open an issue on the GitHub repository or contact the development team.

---

**Built with ❤️ for academic success**

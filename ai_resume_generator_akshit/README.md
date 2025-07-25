# AI Resume and Cover Letter Generator

A modern web application that uses artificial intelligence to generate personalized and professional resumes and cover letters. The application analyzes user skills, experience, and job descriptions to create ATS-friendly documents tailored to specific job opportunities.

## Features

- **AI-Powered Content Generation**: Uses OpenAI GPT models to create personalized resume summaries and cover letters
- **ATS-Friendly Formatting**: Ensures documents pass Applicant Tracking Systems
- **Modern Web Interface**: Clean, responsive design with smooth animations
- **PDF Generation**: Download resumes as professional PDF documents
- **Real-time Preview**: See your generated content before downloading
- **Multi-section Forms**: Comprehensive forms for personal info, skills, experience, and education
- **Copy to Clipboard**: Easy sharing and editing of generated content

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **AI Integration**: OpenAI GPT API
- **PDF Generation**: ReportLab
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome

## Usage

### Resume Generation

1. **Personal Information**: Fill in your basic contact details and target job role
2. **Skills**: List your technical and soft skills (comma-separated)
3. **Work Experience**: Add your professional experience with descriptions
4. **Education**: Include your educational background
5. **Job Description**: Paste the target job description for AI optimization
6. **Generate**: Click "Generate Resume" to create your personalized resume
7. **Download**: Save your resume as a PDF or copy the text

### Cover Letter Generation

1. **Job Information**: Enter company name, position, and job description
2. **Personal Information**: Provide your contact details and current role
3. **Achievements**: List key accomplishments relevant to the role
4. **Company Interest**: Explain why you're interested in the specific company
5. **Generate**: Click "Generate Cover Letter" to create your personalized letter
6. **Download**: Save as text file or copy to clipboard

## API Configuration

To use the full AI capabilities, you need an OpenAI API key:

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Add it to your `.env` file
4. Uncomment the OpenAI initialization lines in `app.py`

**Note**: The application includes mock responses for demonstration purposes when no API key is configured.

## Project Structure

```
ai_resume_generator/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── .env                  # Environment variables (create this)
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Styling and responsive design
    └── js/
        └── script.js     # Frontend JavaScript functionality
```

## Features in Detail

### AI-Powered Resume Summary
- Analyzes your skills and experience
- Incorporates keywords from job descriptions
- Creates ATS-optimized professional summaries
- Highlights relevant achievements and strengths

### Cover Letter Personalization
- Tailors content to specific companies and roles
- Demonstrates enthusiasm and cultural fit
- Incorporates your achievements and skills
- Creates compelling calls to action

### Modern UI/UX
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive tab-based navigation
- Real-time form validation
- Professional color scheme and typography

### PDF Generation
- Clean, professional resume formatting
- Proper spacing and typography
- Download-ready documents
- Consistent styling across sections

## Customization

### Styling
- Modify `static/css/style.css` to change colors, fonts, or layout
- CSS custom properties make theming easy
- Responsive breakpoints included for mobile optimization

### AI Prompts
- Customize prompts in `app.py` to change AI behavior
- Adjust temperature and max_tokens for different writing styles
- Add industry-specific prompt variations

### Form Fields
- Add or remove form fields in `templates/index.html`
- Update JavaScript handlers in `static/js/script.js`
- Modify data collection functions for new fields

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized CSS and JavaScript
- Efficient API calls
- Responsive images and icons
- Fast loading times

## Security

- Environment variable protection for API keys
- Input validation and sanitization
- CSRF protection (can be enhanced with Flask-WTF)
- No persistent data storage (privacy-focused)

from flask import Flask, render_template, request, jsonify, send_file
import openai
import os
from datetime import datetime
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import io

app = Flask(__name__)

# Configure OpenAI API (you'll need to set your API key)
# openai.api_key = os.getenv('OPENAI_API_KEY')

class ResumeGenerator:
    def __init__(self):
        self.client = None
        # Uncomment the line below when you have an OpenAI API key
        # self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def generate_resume_summary(self, user_data, job_description):
        """Generate ATS-friendly resume summary using AI"""
        try:
            # Mock response for demonstration (replace with actual OpenAI call when API key is available)
            if not self.client:
                return self._mock_resume_summary(user_data)
            
            prompt = f"""
            Create an ATS-friendly professional summary for a resume based on the following information:
            
            Personal Info: {user_data.get('personal_info', {})}
            Skills: {user_data.get('skills', {})}
            Experience: {user_data.get('experience', [])}
            Education: {user_data.get('education', [])}
            Job Description: {job_description}
            
            Generate a 3-4 sentence professional summary that:
            1. Highlights relevant skills and experience
            2. Uses keywords from the job description
            3. Is ATS-friendly
            4. Shows value proposition
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating resume summary: {e}")
            return self._mock_resume_summary(user_data)
    
    def generate_cover_letter(self, user_data, job_data):
        """Generate personalized cover letter using AI"""
        try:
            # Mock response for demonstration (replace with actual OpenAI call when API key is available)
            if not self.client:
                return self._mock_cover_letter(user_data, job_data)
            
            prompt = f"""
            Write a professional cover letter based on the following information:
            
            Applicant Info: {user_data.get('personal_info', {})}
            Skills: {user_data.get('skills', {})}
            Experience: {user_data.get('experience', [])}
            Education: {user_data.get('education', [])}
            
            Job Info:
            Company: {job_data.get('company', '')}
            Position: {job_data.get('position', '')}
            Description: {job_data.get('description', '')}
            
            Create a compelling cover letter that:
            1. Shows enthusiasm for the specific role and company
            2. Highlights relevant skills and achievements
            3. Demonstrates cultural fit
            4. Includes a strong call to action
            5. Is professional and engaging
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating cover letter: {e}")
            return self._mock_cover_letter(user_data, job_data)
    
    def _mock_resume_summary(self, user_data):
        """Mock resume summary for demonstration"""
        name = user_data.get('personal_info', {}).get('name', 'Professional')
        role = user_data.get('personal_info', {}).get('target_role', 'Software Developer')
        
        return f"Experienced {role} with a proven track record of delivering high-quality solutions. Skilled in modern technologies and frameworks with strong problem-solving abilities. Passionate about creating efficient, scalable applications and collaborating with cross-functional teams. Committed to continuous learning and staying current with industry best practices."
    
    def _mock_cover_letter(self, user_data, job_data):
        """Mock cover letter for demonstration"""
        name = user_data.get('personal_info', {}).get('name', 'Your Name')
        company = job_data.get('company', 'the company')
        position = job_data.get('position', 'this position')
        
        return f"""Dear Hiring Manager,

I am writing to express my strong interest in the {position} position at {company}. With my background in software development and passion for innovative technology solutions, I am excited about the opportunity to contribute to your team.

Throughout my career, I have developed expertise in various programming languages and frameworks, consistently delivering projects that exceed expectations. My experience in collaborative environments has taught me the importance of clear communication and teamwork in achieving project goals.

I am particularly drawn to {company} because of its reputation for innovation and commitment to excellence. I believe my technical skills, combined with my dedication to continuous learning, make me an ideal candidate for this role.

I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to your team's success. Thank you for considering my application.

Sincerely,
{name}"""

# Initialize the resume generator
resume_generator = ResumeGenerator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_resume', methods=['POST'])
def generate_resume():
    try:
        data = request.json
        user_data = data.get('user_data', {})
        job_description = data.get('job_description', '')
        
        # Generate AI-powered resume summary
        summary = resume_generator.generate_resume_summary(user_data, job_description)
        
        # Create complete resume data
        resume_data = {
            'personal_info': user_data.get('personal_info', {}),
            'summary': summary,
            'skills': user_data.get('skills', {}),
            'experience': user_data.get('experience', []),
            'education': user_data.get('education', []),
            'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return jsonify({
            'success': True,
            'resume_data': resume_data
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/generate_cover_letter', methods=['POST'])
def generate_cover_letter():
    try:
        data = request.json
        user_data = data.get('user_data', {})
        job_data = data.get('job_data', {})
        
        # Generate AI-powered cover letter
        cover_letter = resume_generator.generate_cover_letter(user_data, job_data)
        
        return jsonify({
            'success': True,
            'cover_letter': cover_letter,
            'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/download_resume_pdf', methods=['POST'])
def download_resume_pdf():
    try:
        data = request.json
        resume_data = data.get('resume_data', {})
        
        # Create PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch)
        
        # Get styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=12,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            spaceAfter=6,
            spaceBefore=12
        )
        
        # Build PDF content
        story = []
        
        # Personal Info
        personal_info = resume_data.get('personal_info', {})
        name = personal_info.get('name', 'Your Name')
        
        story.append(Paragraph(name, title_style))
        
        contact_info = []
        if personal_info.get('email'):
            contact_info.append(personal_info['email'])
        if personal_info.get('phone'):
            contact_info.append(personal_info['phone'])
        if personal_info.get('location'):
            contact_info.append(personal_info['location'])
        
        if contact_info:
            story.append(Paragraph(' | '.join(contact_info), styles['Normal']))
        
        story.append(Spacer(1, 12))
        
        # Summary
        if resume_data.get('summary'):
            story.append(Paragraph('PROFESSIONAL SUMMARY', heading_style))
            story.append(Paragraph(resume_data['summary'], styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Skills
        skills = resume_data.get('skills', {})
        if skills:
            story.append(Paragraph('SKILLS', heading_style))
            if skills.get('technical'):
                story.append(Paragraph(f"<b>Technical Skills:</b> {', '.join(skills['technical'])}", styles['Normal']))
            if skills.get('soft'):
                story.append(Paragraph(f"<b>Soft Skills:</b> {', '.join(skills['soft'])}", styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Experience
        experience = resume_data.get('experience', [])
        if experience:
            story.append(Paragraph('WORK EXPERIENCE', heading_style))
            for exp in experience:
                job_title = f"<b>{exp.get('position', '')}</b> at {exp.get('company', '')}"
                story.append(Paragraph(job_title, styles['Normal']))
                if exp.get('duration'):
                    story.append(Paragraph(exp['duration'], styles['Normal']))
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], styles['Normal']))
                story.append(Spacer(1, 6))
        
        # Education
        education = resume_data.get('education', [])
        if education:
            story.append(Paragraph('EDUCATION', heading_style))
            for edu in education:
                degree_info = f"<b>{edu.get('degree', '')}</b>"
                if edu.get('institution'):
                    degree_info += f" - {edu['institution']}"
                story.append(Paragraph(degree_info, styles['Normal']))
                if edu.get('year'):
                    story.append(Paragraph(edu['year'], styles['Normal']))
                story.append(Spacer(1, 6))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"{name.replace(' ', '_')}_Resume.pdf",
            mimetype='application/pdf'
        )
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)

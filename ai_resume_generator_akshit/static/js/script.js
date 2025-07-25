// Global variables
let currentTab = 'resume';
let generatedResumeData = null;
let generatedCoverLetter = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupTabNavigation();
    setupFormHandlers();
    setupScrollToTop();
    setupSmoothScrolling();
    setupNavHighlight();
}

// Tab Navigation
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            currentTab = tabId;
        });
    });
}

// Form Handlers
function setupFormHandlers() {
    // Resume Form
    const resumeForm = document.getElementById('resumeForm');
    if (resumeForm) {
        resumeForm.addEventListener('submit', handleResumeSubmit);
    }

    // Cover Letter Form
    const coverLetterForm = document.getElementById('coverLetterForm');
    if (coverLetterForm) {
        coverLetterForm.addEventListener('submit', handleCoverLetterSubmit);
    }
}

// Handle Resume Form Submission
async function handleResumeSubmit(e) {
    e.preventDefault();
    
    showLoading();
    
    try {
        const formData = collectResumeFormData();
        const response = await fetch('/generate_resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        hideLoading();

        if (result.success) {
            generatedResumeData = result.resume_data;
            displayResumeResults(result.resume_data);
            showModal('Generated Resume');
        } else {
            showError('Error generating resume: ' + result.error);
        }
    } catch (error) {
        hideLoading();
        showError('Network error: ' + error.message);
    }
}

// Handle Cover Letter Form Submission
async function handleCoverLetterSubmit(e) {
    e.preventDefault();
    
    showLoading();
    
    try {
        const formData = collectCoverLetterFormData();
        const response = await fetch('/generate_cover_letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        hideLoading();

        if (result.success) {
            generatedCoverLetter = result.cover_letter;
            displayCoverLetterResults(result.cover_letter);
            showModal('Generated Cover Letter');
        } else {
            showError('Error generating cover letter: ' + result.error);
        }
    } catch (error) {
        hideLoading();
        showError('Network error: ' + error.message);
    }
}

// Collect Resume Form Data
function collectResumeFormData() {
    const form = document.getElementById('resumeForm');
    const formData = new FormData(form);
    
    // Personal Information
    const personalInfo = {
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        linkedin: formData.get('linkedin'),
        target_role: formData.get('targetRole')
    };

    // Skills
    const skills = {
        technical: formData.get('technicalSkills') ? 
            formData.get('technicalSkills').split(',').map(skill => skill.trim()) : [],
        soft: formData.get('softSkills') ? 
            formData.get('softSkills').split(',').map(skill => skill.trim()) : []
    };

    // Experience
    const experience = [];
    const jobTitles = formData.getAll('jobTitle[]');
    const companies = formData.getAll('company[]');
    const durations = formData.getAll('duration[]');
    const descriptions = formData.getAll('jobDescription[]');

    for (let i = 0; i < jobTitles.length; i++) {
        if (jobTitles[i] && companies[i]) {
            experience.push({
                position: jobTitles[i],
                company: companies[i],
                duration: durations[i] || '',
                description: descriptions[i] || ''
            });
        }
    }

    // Education
    const education = [];
    const degrees = formData.getAll('degree[]');
    const institutions = formData.getAll('institution[]');
    const years = formData.getAll('graduationYear[]');
    const gpas = formData.getAll('gpa[]');

    for (let i = 0; i < degrees.length; i++) {
        if (degrees[i] && institutions[i]) {
            education.push({
                degree: degrees[i],
                institution: institutions[i],
                year: years[i] || '',
                gpa: gpas[i] || ''
            });
        }
    }

    return {
        user_data: {
            personal_info: personalInfo,
            skills: skills,
            experience: experience,
            education: education
        },
        job_description: formData.get('jobDescription')
    };
}

// Collect Cover Letter Form Data
function collectCoverLetterFormData() {
    const form = document.getElementById('coverLetterForm');
    const formData = new FormData(form);
    
    const userData = {
        personal_info: {
            name: formData.get('fullNameCL'),
            email: formData.get('emailCL'),
            phone: formData.get('phoneCL'),
            current_role: formData.get('currentRole')
        },
        key_achievements: formData.get('keyAchievements'),
        why_company: formData.get('whyCompany')
    };

    const jobData = {
        company: formData.get('companyName'),
        position: formData.get('positionTitle'),
        hiring_manager: formData.get('hiringManager'),
        description: formData.get('jobDescriptionCL')
    };

    return {
        user_data: userData,
        job_data: jobData
    };
}

// Display Resume Results
function displayResumeResults(resumeData) {
    const container = document.getElementById('resumeResults');
    const personalInfo = resumeData.personal_info || {};
    const skills = resumeData.skills || {};
    
    let html = `
        <div class="resume-preview">
            <div class="resume-header">
                <h2>${personalInfo.name || 'Your Name'}</h2>
                <div class="contact-info">
                    ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
                    ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
                    ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
                    ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
                </div>
            </div>
            
            ${resumeData.summary ? `
                <div class="resume-section">
                    <h3>PROFESSIONAL SUMMARY</h3>
                    <p>${resumeData.summary}</p>
                </div>
            ` : ''}
            
            ${skills.technical && skills.technical.length ? `
                <div class="resume-section">
                    <h3>TECHNICAL SKILLS</h3>
                    <p>${skills.technical.join(', ')}</p>
                </div>
            ` : ''}
            
            ${skills.soft && skills.soft.length ? `
                <div class="resume-section">
                    <h3>SOFT SKILLS</h3>
                    <p>${skills.soft.join(', ')}</p>
                </div>
            ` : ''}
            
            ${resumeData.experience && resumeData.experience.length ? `
                <div class="resume-section">
                    <h3>WORK EXPERIENCE</h3>
                    ${resumeData.experience.map(exp => `
                        <div class="experience-item">
                            <div class="job-header">
                                <strong>${exp.position}</strong> - ${exp.company}
                                ${exp.duration ? `<span class="duration">${exp.duration}</span>` : ''}
                            </div>
                            ${exp.description ? `<p>${exp.description}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${resumeData.education && resumeData.education.length ? `
                <div class="resume-section">
                    <h3>EDUCATION</h3>
                    ${resumeData.education.map(edu => `
                        <div class="education-item">
                            <strong>${edu.degree}</strong> - ${edu.institution}
                            ${edu.year ? `<span class="year">${edu.year}</span>` : ''}
                            ${edu.gpa ? `<span class="gpa">GPA: ${edu.gpa}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    container.innerHTML = html;
    
    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.onclick = () => downloadResumePDF();
}

// Display Cover Letter Results
function displayCoverLetterResults(coverLetter) {
    const container = document.getElementById('coverLetterResults');
    
    container.innerHTML = `
        <div class="cover-letter-preview">
            <pre>${coverLetter}</pre>
        </div>
    `;
    
    // Setup download button (for future PDF generation)
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.onclick = () => downloadCoverLetterPDF();
}

// Download Resume PDF
async function downloadResumePDF() {
    if (!generatedResumeData) {
        showError('No resume data available for download');
        return;
    }

    try {
        const response = await fetch('/download_resume_pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_data: generatedResumeData
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${generatedResumeData.personal_info.name || 'Resume'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            showError('Error downloading PDF');
        }
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

// Download Cover Letter PDF (placeholder)
function downloadCoverLetterPDF() {
    if (!generatedCoverLetter) {
        showError('No cover letter data available for download');
        return;
    }
    
    // Create a simple text file download for now
    const blob = new Blob([generatedCoverLetter], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Cover_Letter.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Copy to Clipboard
function copyToClipboard() {
    let textToCopy = '';
    
    if (currentTab === 'resume' && generatedResumeData) {
        // Create text version of resume
        const personalInfo = generatedResumeData.personal_info || {};
        textToCopy = `${personalInfo.name || 'Your Name'}\n`;
        textToCopy += `${personalInfo.email || ''} | ${personalInfo.phone || ''} | ${personalInfo.location || ''}\n\n`;
        
        if (generatedResumeData.summary) {
            textToCopy += `PROFESSIONAL SUMMARY\n${generatedResumeData.summary}\n\n`;
        }
        
        // Add other sections...
    } else if (currentTab === 'cover-letter' && generatedCoverLetter) {
        textToCopy = generatedCoverLetter;
    }
    
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showSuccess('Content copied to clipboard!');
        }).catch(() => {
            showError('Failed to copy content');
        });
    }
}

// Add Experience
function addExperience() {
    const container = document.getElementById('experienceContainer');
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    
    experienceItem.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" name="jobTitle[]" required>
            </div>
            <div class="form-group">
                <label>Company *</label>
                <input type="text" name="company[]" required>
            </div>
            <div class="form-group">
                <label>Duration *</label>
                <input type="text" name="duration[]" placeholder="e.g., Jan 2020 - Present" required>
            </div>
            <div class="form-group full-width">
                <label>Job Description</label>
                <textarea name="jobDescription[]" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeExperience(this)">
            <i class="fas fa-times"></i>
            Remove
        </button>
    `;
    
    container.appendChild(experienceItem);
}

// Remove Experience
function removeExperience(button) {
    const experienceItem = button.closest('.experience-item');
    experienceItem.remove();
}

// Add Education
function addEducation() {
    const container = document.getElementById('educationContainer');
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    
    educationItem.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Degree *</label>
                <input type="text" name="degree[]" placeholder="e.g., Bachelor of Science in Computer Science" required>
            </div>
            <div class="form-group">
                <label>Institution *</label>
                <input type="text" name="institution[]" required>
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" name="graduationYear[]" placeholder="e.g., 2020">
            </div>
            <div class="form-group">
                <label>GPA (optional)</label>
                <input type="text" name="gpa[]" placeholder="e.g., 3.8/4.0">
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeEducation(this)">
            <i class="fas fa-times"></i>
            Remove
        </button>
    `;
    
    container.appendChild(educationItem);
}

// Remove Education
function removeEducation(button) {
    const educationItem = button.closest('.education-item');
    educationItem.remove();
}

// Modal Functions
function showModal(title) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('resultsModal').style.display = 'block';
    
    // Show appropriate results container
    if (currentTab === 'resume') {
        document.getElementById('resumeResults').style.display = 'block';
        document.getElementById('coverLetterResults').style.display = 'none';
    } else {
        document.getElementById('resumeResults').style.display = 'none';
        document.getElementById('coverLetterResults').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('resultsModal').style.display = 'none';
}

// Loading Functions
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Notification Functions
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    
    // Insert at the top of the current tab content
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.insertBefore(notification, activeTab.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to Generator
function scrollToGenerator() {
    document.getElementById('generator').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Navigation Highlight
function setupNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll to Top Button
function setupScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('resultsModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Copy with Ctrl+C when modal is open
    if (e.ctrlKey && e.key === 'c' && document.getElementById('resultsModal').style.display === 'block') {
        e.preventDefault();
        copyToClipboard();
    }
});

// Form validation enhancement
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#28a745';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showError('Please fill in all required fields');
            }
        });
    });
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', setupFormValidation);

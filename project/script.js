// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// FAQ toggle functionality
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consultingForm');
    const successMessage = document.getElementById('successMessage');
    
    // Initialize Vanilla Tilt for feature cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
        });
    }
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default to handle validation first
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            follower_count: document.getElementById('followers').value,
            preferred_call_time: document.getElementById('callTime').value,
            main_goals: document.getElementById('goals').value.trim()
        };
        
        // Validation
        const errors = [];
        
        if (!formData.name) {
            errors.push('Name is required');
        }
        
        if (!formData.email) {
            errors.push('Email is required');
        } else if (!emailRegex.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!formData.callTime) {
            errors.push('Preferred call time is required');
        } else {
            // Check if call time is in the future
            const callDate = new Date(formData.callTime);
            const now = new Date();
            if (callDate <= now) {
                errors.push('Please select a future date and time for your call');
            }
        }
        
        if (!formData.main_goals) {
            errors.push('Goals are required');
        }
        
        // Display errors or submit
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }
        
        // If validation passes, submit the form
        const formElement = e.target;
        const submitData = new FormData(formElement);
        
        // Submit to Formspree
        fetch(formElement.action, {
            method: 'POST',
            body: submitData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // Show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                alert('There was an error submitting your form. Please try again.');
            }
        }).catch(error => {
            console.error('Form submission error:', error);
            alert('There was an error submitting your form. Please try again.');
        });
    });
    
    // Add real-time validation for call time
    const callTimeInput = document.getElementById('callTime');
    callTimeInput.addEventListener('change', function() {
        const callTime = this.value;
        if (callTime) {
            const callDate = new Date(callTime);
            const now = new Date();
            if (callDate <= now) {
                this.style.borderColor = 'var(--clr-error)';
                showFieldError(this, 'Please select a future date and time');
            } else {
                this.style.borderColor = 'var(--clr-border)';
                hideFieldError(this);
            }
        }
    });
    
    // Add real-time validation for required fields
    const requiredFields = ['name', 'email', 'callTime', 'goals'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = 'var(--clr-error)';
                } else {
                    this.style.borderColor = 'var(--clr-border)';
                }
            });
        }
    });
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !emailRegex.test(email)) {
            this.style.borderColor = 'var(--clr-error)';
        } else {
            this.style.borderColor = 'var(--clr-border)';
        }
    });
    
    // Set minimum date/time for call scheduling
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const minDateTime = tomorrow.toISOString().slice(0, 16);
    callTimeInput.min = minDateTime;
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Dynamic typing effect for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
});

// Utility function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add loading states to buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = 'Loading...';
    button.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

// Enhanced form validation with real-time feedback
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let message = '';
    
    switch(fieldType) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            break;
        case 'datetime-local':
            if (value) {
                const selectedDate = new Date(value);
                const now = new Date();
                if (selectedDate <= now) {
                    isValid = false;
                    message = 'Please select a future date and time';
                }
            }
            break;
    }
    
    // Visual feedback
    if (!isValid) {
        field.style.borderColor = 'var(--clr-error)';
        showFieldError(field, message);
    } else {
        field.style.borderColor = 'var(--clr-border)';
        hideFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.style.color = 'var(--clr-error)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-xs)';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function hideFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close FAQ with Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[src*="asset-"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);
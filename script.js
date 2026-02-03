// Email validation and form handling
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const notifyBtn = document.getElementById('notifyBtn');
    const formHint = document.getElementById('formHint');
    const btnText = notifyBtn.querySelector('.btn-text');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Handle form submission
    notifyBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Validate email
        if (!email) {
            showError('Please enter your email address');
            return;
        }

        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Simulate successful submission
        submitEmail(email);
    });

    // Handle Enter key in email input
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            notifyBtn.click();
        }
    });

    // Clear error state on input
    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '';
        formHint.textContent = "We'll let you know when we launch.";
        formHint.classList.remove('success');
    });

    function showError(message) {
        emailInput.style.borderColor = '#ef4444';
        formHint.textContent = message;
        formHint.style.color = '#ef4444';

        // Shake animation
        emailInput.style.animation = 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
        setTimeout(() => {
            emailInput.style.animation = '';
        }, 400);
    }

    function submitEmail(email) {
        // Disable button during submission
        notifyBtn.disabled = true;
        notifyBtn.style.opacity = '0.7';
        btnText.textContent = 'Submitting...';

        // Simulate API call
        setTimeout(() => {
            // Success state
            notifyBtn.classList.add('success');
            btnText.textContent = 'You\'re on the list!';
            formHint.textContent = 'Thanks! We\'ll notify you at launch.';
            formHint.classList.add('success');

            // Clear input
            emailInput.value = '';
            emailInput.style.borderColor = 'var(--color-success)';

            // Reset button after delay
            setTimeout(() => {
                notifyBtn.disabled = false;
                notifyBtn.style.opacity = '1';
                notifyBtn.classList.remove('success');
                btnText.textContent = 'Get notified';
                emailInput.style.borderColor = '';
            }, 3000);

            // Log submission (in production, send to backend)
            console.log('Email submitted:', email);
        }, 1000);
    }
});

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(style);

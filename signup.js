document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const successModal = document.getElementById('successModal');

    // Password visibility toggle
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                button.classList.remove('fa-eye');
                button.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                button.classList.remove('fa-eye-slash');
                button.classList.add('fa-eye');
            }
        });
    });

    // Input validation
    const validateInput = (input, errorMessage) => {
        const errorText = input.closest('.input-group').querySelector('.error-text');
        let isValid = true;

        switch (input.id) {
            case 'fullName':
                isValid = input.value.trim().length >= 2;
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
                break;
            case 'phone':
                isValid = /^\+?[\d\s-]{10,}$/.test(input.value.trim());
                break;
            case 'password':
                isValid = input.value.length >= 8;
                break;
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                isValid = input.value === password;
                break;
        }

        if (!isValid) {
            input.closest('.input-field').style.boxShadow = '0 0 0 2px #e74c3c';
            errorText.style.display = 'block';
            errorText.textContent = errorMessage;
        } else {
            input.closest('.input-field').style.boxShadow = '0 0 0 2px #2ecc71';
            errorText.style.display = 'none';
        }

        return isValid;
    };

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const terms = document.getElementById('terms');

        // Validate all inputs
        const isNameValid = validateInput(fullName, 'Please enter your full name');
        const isEmailValid = validateInput(email, 'Please enter a valid email address');
        const isPhoneValid = validateInput(phone, 'Please enter a valid phone number');
        const isPasswordValid = validateInput(password, 'Password must be at least 8 characters');
        const isConfirmPasswordValid = validateInput(confirmPassword, 'Passwords do not match');

        if (!terms.checked) {
            terms.closest('.terms').style.color = '#e74c3c';
            return;
        }

        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: fullName.value,
                        email: email.value,
                        phone: phone.value,
                        password: password.value,
                        confirmPassword: confirmPassword.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success modal
                    successModal.style.display = 'flex';
                    
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Registration failed');
                }
            } catch (error) {
                alert(error.message);
            }
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input:not([type="checkbox"])');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) {
                validateInput(input, input.closest('.input-group').querySelector('.error-text').textContent);
            }
        });
    });

    // Terms checkbox styling
    const terms = document.getElementById('terms');
    terms.addEventListener('change', () => {
        terms.closest('.terms').style.color = terms.checked ? '#666' : '#e74c3c';
    });

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Implement social login functionality here
            alert('Social login coming soon!');
        });
    });
}); 
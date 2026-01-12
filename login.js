document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.sign-in-form');

    // Login Form Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('loginError');
        const successElement = document.getElementById('loginSuccess');
        
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Show success message
            successElement.textContent = 'Login successful! Redirecting...';
            successElement.style.display = 'block';
            errorElement.style.display = 'none';

            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Redirect after successful login
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);

        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
            successElement.style.display = 'none';
        }
    });

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-icon');
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Social login coming soon!');
        });
    });
}); 
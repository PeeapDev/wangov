// Tab switching
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginTab').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-white text-gray-900 shadow-sm';
    document.getElementById('registerTab').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900';
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginTab').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900';
    document.getElementById('registerTab').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-white text-gray-900 shadow-sm';
}

// Login type switching
document.addEventListener('DOMContentLoaded', function() {
    const loginTypeRadios = document.querySelectorAll('input[name="loginType"]');
    const emailField = document.getElementById('emailField');
    const ninField = document.getElementById('ninField');

    loginTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'email') {
                emailField.style.display = 'block';
                ninField.style.display = 'none';
                document.getElementById('email').required = true;
                document.getElementById('nin').required = false;
            } else {
                emailField.style.display = 'none';
                ninField.style.display = 'block';
                document.getElementById('email').required = false;
                document.getElementById('nin').required = true;
            }
        });
    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const button = document.getElementById('loginButton');
        const originalText = button.textContent;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
        `;

        try {
            const formData = new FormData(this);
            const loginType = formData.get('loginType');
            
            const data = {
                loginType: loginType,
                password: formData.get('password')
            };

            if (loginType === 'email') {
                data.email = formData.get('email');
            } else {
                data.nin = formData.get('nin');
            }

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                if (result.redirect) {
                    // OAuth redirect
                    showMessage('Authentication successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = result.redirect;
                    }, 1000);
                } else {
                    // Regular login success
                    showMessage('Login successful!', 'success');
                }
            } else {
                showMessage(result.error || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            // Restore button
            button.disabled = false;
            button.textContent = originalText;
        }
    });

    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const button = document.getElementById('registerButton');
        const originalText = button.textContent;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
        `;

        try {
            const formData = new FormData(this);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                nin: formData.get('nin'),
                password: formData.get('password')
            };

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showMessage(result.message, 'success');
                if (!result.requiresVerification) {
                    setTimeout(() => showLogin(), 2000);
                }
            } else {
                showMessage(result.error || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            // Restore button
            button.disabled = false;
            button.textContent = originalText;
        }
    });
});

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-alert');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-alert mb-4 p-3 rounded-lg border ${
        type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
    }`;
    messageDiv.innerHTML = `<p class="text-sm">${message}</p>`;

    // Insert at the top of the form
    const activeForm = document.getElementById('loginForm').style.display !== 'none' 
        ? document.getElementById('loginForm') 
        : document.getElementById('registerForm');
    
    activeForm.insertBefore(messageDiv, activeForm.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

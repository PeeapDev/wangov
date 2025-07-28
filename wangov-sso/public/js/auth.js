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

// Registration confirmation modal functions
function showRegisterConfirmation() {
    document.getElementById('registrationModal').style.display = 'flex';
}

function closeRegisterConfirmation() {
    document.getElementById('registrationModal').style.display = 'none';
    
    // Store the referrer URL to return to after cancellation
    const referrer = document.referrer || window.location.origin;
    
    // If this is part of an OAuth flow and there's a client_id in the URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('client_id')) {
        // Redirect back to the client application that initiated the flow
        window.location.href = referrer;
    }
}

function proceedToRegistration() {
    // Redirect to the government website registration page
    window.location.href = 'http://localhost:3003/register';
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
            
            // Log for debugging
            console.log('Login data:', { ...data, password: '***' });

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                showMessage('Authentication successful! Redirecting...', 'success');
                
                console.log('Login response:', result);
                
                // Handle OAuth redirection
                setTimeout(() => {
                    if (result.authCode && result.redirectUrl) {
                        // Construct the redirect URL with the authorization code
                        const redirectUrl = new URL(result.redirectUrl);
                        redirectUrl.searchParams.set('code', result.authCode);
                        redirectUrl.searchParams.set('state', result.state || new URLSearchParams(window.location.search).get('state'));
                        
                        console.log('Redirecting to:', redirectUrl.toString());
                        window.location.href = redirectUrl.toString();
                    } 
                    else if (result.redirectUrl) {
                        console.log('Redirecting to:', result.redirectUrl);
                        window.location.href = result.redirectUrl;
                    }
                    else {
                        console.log('No redirect URL found, constructing callback URL from referrer');
                        // Fallback to referrer URL if available
                        const referrer = document.referrer;
                        if (referrer && referrer !== window.location.href) {
                            // Extract the origin part of the referrer
                            try {
                                const referrerUrl = new URL(referrer);
                                const callbackUrl = `${referrerUrl.origin}/auth/callback?code=${result.authCode}&state=${new URLSearchParams(window.location.search).get('state')}`;
                                console.log('Fallback redirect to:', callbackUrl);
                                window.location.href = callbackUrl;
                            } catch (e) {
                                console.error('Failed to parse referrer URL', e);
                                showMessage('Login successful! You may now close this window and return to the application.', 'success');
                            }
                        } else {
                            showMessage('Login successful! You may now close this window and return to the application.', 'success');
                        }
                    }
                }, 1000);
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
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            // Client-side validation
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters long', 'error');
                return;
            }
            
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                nin: formData.get('nin'),
                password: password,
                confirmPassword: confirmPassword,
                birthDate: formData.get('birthDate'),
                placeOfBirth: formData.get('placeOfBirth')
            };

            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showMessage(result.message, 'success');
                
                // If OAuth flow, redirect back to the application
                if (result.authCode && result.redirectUrl) {
                    setTimeout(() => {
                        const redirectUrl = new URL(result.redirectUrl);
                        redirectUrl.searchParams.set('code', result.authCode);
                        redirectUrl.searchParams.set('state', new URLSearchParams(window.location.search).get('state'));
                        window.location.href = redirectUrl.toString();
                    }, 2000);
                } else {
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

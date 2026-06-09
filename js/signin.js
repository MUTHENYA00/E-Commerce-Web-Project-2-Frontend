document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');

  if (!loginForm || !signupForm || !showSignup || !showLogin) {
    return;
  }

  const toggleForms = (showSignupForm) => {
    signupForm.style.display = showSignupForm ? 'block' : 'none';
    loginForm.style.display = showSignupForm ? 'none' : 'block';
  };

  showSignup.addEventListener('click', (event) => {
    event.preventDefault();
    toggleForms(true);
  });

  showLogin.addEventListener('click', (event) => {
    event.preventDefault();
    toggleForms(false);
  });

  if (window.location.hash === '#signup') {
    toggleForms(true);
  }
});
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./db_config.js";

let isLoginMode = true;

const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const errorMsg = document.getElementById('auth-error-msg');
const toggleBtn = document.getElementById('auth-toggle-btn');
const togglePrompt = document.getElementById('auth-toggle-prompt');
const modalTitle = document.getElementById('auth-modal-title');
const modalSubtitle = document.getElementById('auth-modal-subtitle');
const submitBtnText = document.getElementById('auth-btn-text');
const submitBtn = document.getElementById('auth-submit-btn');
const authLoader = document.getElementById('auth-loader');
const navAuthBtn = document.getElementById('nav-auth-btn');
const navAuthIcon = document.getElementById('nav-auth-icon');
const navAuthTooltip = document.getElementById('nav-auth-tooltip');
const mobileAuthBtn = document.getElementById('mobile-auth-btn');
const mobileAuthIcon = document.getElementById('mobile-auth-icon');
const mobileAuthText = document.getElementById('mobile-auth-text');

toggleBtn?.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    errorMsg.classList.add('hidden');
    authForm.reset();

    if (isLoginMode) {
        modalTitle.textContent = "Welcome Back";
        modalSubtitle.textContent = "Sign in to your Zoga account";
        submitBtnText.textContent = "Sign In";
        togglePrompt.textContent = "New to Zoga?";
        toggleBtn.textContent = "Create Account";
    } else {
        modalTitle.textContent = "Join Zoga";
        modalSubtitle.textContent = "Create an account to track your orders";
        submitBtnText.textContent = "Sign Up";
        togglePrompt.textContent = "Already have an account?";
        toggleBtn.textContent = "Sign In";
    }
});

authForm?.addEventListener('submit', async event => {
    event.preventDefault();
    setLoading(true);
    errorMsg.classList.add('hidden');

    try {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        document.getElementById('auth-modal-close').click();
    } catch (error) {
        showError(getFriendlyErrorMessage(error.code));
    } finally {
        setLoading(false);
    }
});

async function handleAuthAction() {
    if (auth.currentUser) {
        await signOut(auth);
    } else {
        window.openAuthModal();
    }
}

navAuthBtn?.addEventListener('click', handleAuthAction);
mobileAuthBtn?.addEventListener('click', handleAuthAction);

onAuthStateChanged(auth, user => {
    const icon = user ? 'log-out' : 'log-in';
    if (navAuthIcon) navAuthIcon.setAttribute('data-lucide', user ? 'log-out' : 'user');
    if (navAuthTooltip) navAuthTooltip.textContent = user ? "Log Out" : "Login / Register";
    if (mobileAuthIcon) mobileAuthIcon.setAttribute('data-lucide', icon);
    if (mobileAuthText) mobileAuthText.textContent = user ? "Log Out" : "Log In";
    lucide.createIcons();
});

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtnText.style.display = isLoading ? 'none' : 'block';
    authLoader.style.display = isLoading ? 'block' : 'none';
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

function getFriendlyErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-credential': return "Invalid email or password.";
        case 'auth/email-already-in-use': return "An account with this email already exists.";
        case 'auth/weak-password': return "Password should be at least 6 characters.";
        case 'auth/network-request-failed': return "Network error. Please check your connection.";
        default: return "An error occurred. Please try again.";
    }
}

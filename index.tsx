import { calculateAge } from './utils/calculator';
import { CalculationResult } from './types';

// Initialize function to safely run logic only when called (e.g., after DOM load)
export const initApp = () => {
    // DOM Elements
    const dobInput = document.getElementById('dob-input') as HTMLInputElement;
    const tobInput = document.getElementById('tob-input') as HTMLInputElement;
    const form = document.getElementById('age-form') as HTMLFormElement;
    const resultContainer = document.getElementById('result-container') as HTMLElement;
    const introText = document.getElementById('intro-text') as HTMLElement;
    const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
    const iconSun = document.getElementById('icon-sun') as HTMLElement;
    const iconMoon = document.getElementById('icon-moon') as HTMLElement;
    const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement;
    const customMessageInput = document.getElementById('custom-message') as HTMLTextAreaElement;

    if (!dobInput || !form) return; // Guard clause

    // State
    let timerInterval: number | null = null;
    let currentDob: Date | null = null;
    let currentTob: string = "00:00";

    // Set max date to today
    if (dobInput) {
        dobInput.max = new Date().toISOString().split('T')[0];
    }

    // Dark Mode Logic
    const updateTheme = (isDark: boolean) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            iconSun?.classList.remove('hidden');
            iconMoon?.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            iconSun?.classList.add('hidden');
            iconMoon?.classList.remove('hidden');
        }
    };

    // Check system preference
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDarkMode = systemDark;
    updateTheme(isDarkMode);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            updateTheme(isDarkMode);
        });
    }

    // Helper to safely set text content
    const setText = (id: string, value: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    };

    // Helper: Show Feedback on Button
    const showFeedback = (btn: HTMLButtonElement, message: string = "Copied!") => {
        const originalContent = btn.innerHTML;
        // Prevent double-clicking causing visual glitch
        if (btn.getAttribute('data-feedback') === 'true') return;
        
        btn.setAttribute('data-feedback', 'true');
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${message}</span>
        `;
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.removeAttribute('data-feedback');
        }, 2000);
    };

    // Helper: Copy to Clipboard
    const copyToClipboard = (text: string, btnElement: HTMLButtonElement | null) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        textArea.setAttribute("readonly", ""); 
        
        document.body.appendChild(textArea);
        
        let success = false;
        try {
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, 99999); 
            success = document.execCommand('copy');
        } catch (err) {
            console.warn('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);

        if (success) {
            if (btnElement) showFeedback(btnElement, "Copied!");
        } else {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    if (btnElement) showFeedback(btnElement, "Copied!");
                }).catch(err => {
                    console.warn('Async: Could not copy text: ', err);
                });
            }
        }
    };

    // Calculate and Update UI
    const updateUI = (result: CalculationResult) => {
        setText('years-val', result.age.years.toString());
        setText('months-val', result.age.months.toString());
        setText('days-val', result.age.days.toString());
        setText('total-days-val', result.age.totalDays.toLocaleString());
        setText('total-hours-val', result.age.totalHours.toLocaleString());
        setText('total-mins-val', result.age.totalMinutes.toLocaleString());
        setText('total-secs-val', result.age.totalSeconds.toLocaleString());
        setText('nb-days', result.nextBirthday.days.toString());
        setText('nb-hours', result.nextBirthday.hours.toString());
        setText('nb-mins', result.nextBirthday.minutes.toString());
        setText('nb-secs', result.nextBirthday.seconds.toString());
        
        const nbDate = document.getElementById('nb-date');
        if (nbDate) {
            nbDate.textContent = result.nextBirthday.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }

        setText('zodiac-symbol', result.zodiac.symbol);
        setText('zodiac-name', result.zodiac.name);
        setText('born-day', result.dayOfBirth);
        setText('total-weeks', result.age.totalWeeks.toLocaleString());
        setText('total-months', result.age.totalMonths.toLocaleString());
    };

    const startTimer = () => {
        if (timerInterval) window.clearInterval(timerInterval);
        if (!currentDob) return;

        const result = calculateAge(new Date(currentDob), currentTob);
        updateUI(result);

        if (customMessageInput) {
            const defaultMsg = `I am exactly ${result.age.years} years, ${result.age.months} months, and ${result.age.days} days old.`;
            if (!customMessageInput.value || customMessageInput.value.startsWith("I am exactly")) {
                customMessageInput.value = defaultMsg;
            }
        }

        timerInterval = window.setInterval(() => {
            if (currentDob) {
                const res = calculateAge(new Date(currentDob), currentTob);
                updateUI(res);
            }
        }, 1000);
    };

    // Form Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!dobInput.value) return;

            currentDob = new Date(dobInput.value);
            currentTob = tobInput.value || "00:00";

            if (introText) introText.style.display = 'none';
            if (resultContainer) {
                resultContainer.classList.remove('hidden');
                resultContainer.classList.add('fade-in');
                setTimeout(() => {
                    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
            startTimer();
        });
    }

    // Copy Button Logic
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            let text = "";
            if (customMessageInput && customMessageInput.value) {
                text = customMessageInput.value;
            } else {
                const years = document.getElementById('years-val')?.textContent || '';
                const months = document.getElementById('months-val')?.textContent || '';
                const days = document.getElementById('days-val')?.textContent || '';
                text = `I am exactly ${years} years, ${months} months, and ${days} days old.`;
            }
            copyToClipboard(text, btnCopy);
        });
    }
}
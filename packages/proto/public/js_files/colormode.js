// colormode.js

(function () {
    const STORAGE_KEY = 'garden-color-mode';

    function applyMode(mode) {
        document.body.classList.remove('pink-mode', 'blue-mode', 'dark-mode');
        if (mode === 'pink') {
            document.body.classList.add('pink-mode');
        } else if (mode === 'blue') {
            document.body.classList.add('blue-mode');
        } else if (mode === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    function onSelectChange(event) {
        if (!(event && event.target && typeof event.target.value === 'string')) return;
        const selectedValue = event.target.value;
        // persist the selection so other pages can read it
        try {
            localStorage.setItem(STORAGE_KEY, selectedValue);
        } catch (e) {
            // localStorage may be unavailable (private mode), continue without crash
        }
        applyMode(selectedValue);
    }

    function init() {
        // Apply saved mode (if any) immediately so the page shows the last selection
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            // ignore
        }
        if (!saved) saved = 'default';
        applyMode(saved);

        // If the page has the color select, set its value and listen for changes
        const select = document.getElementById('color-mode-toggle');
        if (select) {
            try { select.value = saved; } catch (e) { /* ignore invalid value */ }
            select.addEventListener('change', onSelectChange);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

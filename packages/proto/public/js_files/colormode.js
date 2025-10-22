// pinkmode.js

(function () {
    function onToggleColorMode(event) {
        if (!(event && event.target && typeof event.target.value === 'string')) return;
        const selectedValue = event.target.value;
        document.body.classList.remove('pink-mode', 'blue-mode', 'dark-mode');
        if (selectedValue === 'pink') {
            document.body.classList.add('pink-mode');
        } else if (selectedValue === 'blue') {
            document.body.classList.add('blue-mode');
        } else if (selectedValue === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            document.body.addEventListener('change', onToggleColorMode);
        });
    } else {
        document.body.addEventListener('change', onToggleColorMode);
    }
})();

// Calculator Widget Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('calcOverlay');
    const display = document.getElementById('calcResult');
    const expression = document.getElementById('calcExpression');
    const historyContainer = document.getElementById('calcHistory');
    const closeBtn = document.getElementById('calcClose');
    const toggleHistoryBtn = document.getElementById('toggleHistory');

    let currentValue = '0';
    let previousValue = '';
    let operator = null;
    let shouldResetDisplay = false;
    let history = [];

    const STORAGE_KEY = 'et_calc_history';

    function init() {
        loadHistory();
        setupEventListeners();
    }

    function loadHistory() {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
            history = result[STORAGE_KEY] || [];
            renderHistory();
        });
    }

    function saveHistory() {
        chrome.storage.sync.set({ [STORAGE_KEY]: history.slice(0, 20) });
    }

    function renderHistory() {
        if (history.length === 0) {
            historyContainer.innerHTML = '<div style="text-align:center;color:#666;font-size:11px;padding:20px;">No history yet</div>';
            return;
        }

        historyContainer.innerHTML = history.map(item => `
            <div class="calc-history-item" data-expression="${encodeURIComponent(item.expr)}" data-result="${encodeURIComponent(item.result)}">
                <span class="calc-history-expr">${escapeHtml(item.expr)}</span>
                <span class="calc-history-result">${escapeHtml(item.result)}</span>
            </div>
        `).join('');

        historyContainer.querySelectorAll('.calc-history-item').forEach(item => {
            item.addEventListener('click', () => {
                currentValue = item.dataset.result;
                display.textContent = currentValue;
                shouldResetDisplay = true;
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateDisplay() {
        display.textContent = currentValue;
        
        if (operator && previousValue) {
            const opSymbol = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷'
            };
            expression.textContent = `${previousValue} ${opSymbol[operator] || ''}`;
        } else {
            expression.textContent = '';
        }
    }

    function handleNumber(value) {
        if (shouldResetDisplay) {
            currentValue = value === '.' ? '0.' : value;
            shouldResetDisplay = false;
        } else {
            if (value === '.' && currentValue.includes('.')) return;
            if (currentValue === '0' && value !== '.') {
                currentValue = value;
            } else {
                currentValue += value;
            }
        }
        updateDisplay();
    }

    function handleOperator(op) {
        if (operator && previousValue && !shouldResetDisplay) {
            calculate();
        }
        previousValue = currentValue;
        operator = op;
        shouldResetDisplay = true;
        updateDisplay();
    }

    function calculate() {
        if (!operator || !previousValue) return;

        const prev = parseFloat(previousValue);
        const curr = parseFloat(currentValue);
        let result;

        switch (operator) {
            case 'add':
                result = prev + curr;
                break;
            case 'subtract':
                result = prev - curr;
                break;
            case 'multiply':
                result = prev * curr;
                break;
            case 'divide':
                if (curr === 0) {
                    result = 'Error';
                } else {
                    result = prev / curr;
                }
                break;
        }

        // Format result
        if (result !== 'Error') {
            if (Number.isInteger(result)) {
                result = result.toString();
            } else {
                result = parseFloat(result.toFixed(8)).toString();
                if (result.length > 12) {
                    result = parseFloat(result.toFixed(6)).toString();
                }
            }
        }

        // Add to history
        const expr = `${previousValue} ${getOperatorSymbol(operator)} ${currentValue}`;
        history.unshift({ expr: expr, result: result });
        saveHistory();
        renderHistory();

        currentValue = result;
        previousValue = '';
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
    }

    function getOperatorSymbol(op) {
        const symbols = { 'add': '+', 'subtract': '−', 'multiply': '×', 'divide': '÷' };
        return symbols[op] || '';
    }

    function clear() {
        currentValue = '0';
        previousValue = '';
        operator = null;
        shouldResetDisplay = false;
        updateDisplay();
    }

    function negate() {
        if (currentValue === '0') return;
        if (currentValue.startsWith('-')) {
            currentValue = currentValue.slice(1);
        } else {
            currentValue = '-' + currentValue;
        }
        updateDisplay();
    }

    function percent() {
        currentValue = (parseFloat(currentValue) / 100).toString();
        updateDisplay();
    }

    function backspace() {
        if (currentValue.length === 1 || currentValue === '-0') {
            currentValue = '0';
        } else {
            currentValue = currentValue.slice(0, -1);
        }
        updateDisplay();
    }

    function setupEventListeners() {
        // Button clicks
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.value !== undefined) {
                    handleNumber(btn.dataset.value);
                } else if (btn.dataset.action) {
                    switch (btn.dataset.action) {
                        case 'clear':
                            clear();
                            break;
                        case 'negate':
                            negate();
                            break;
                        case 'percent':
                            percent();
                            break;
                        case 'backspace':
                            backspace();
                            break;
                        case 'add':
                        case 'subtract':
                        case 'multiply':
                        case 'divide':
                            handleOperator(btn.dataset.action);
                            break;
                        case 'equals':
                            calculate();
                            break;
                    }
                }
            });
        });

        // Close
        closeBtn.addEventListener('click', closeModal);

        // Toggle history
        toggleHistoryBtn.addEventListener('click', () => {
            historyContainer.classList.toggle('active');
            toggleHistoryBtn.textContent = historyContainer.classList.contains('active') ? 'HIDE' : 'HISTORY';
        });

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Keyboard support
        document.addEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        if (!overlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            calculate();
            return;
        }

        if (e.key === 'Backspace') {
            backspace();
            return;
        }

        if (e.key === '%') {
            percent();
            return;
        }

        if (e.key === '±' || e.key === 'n') {
            negate();
            return;
        }

        // Numbers and decimal
        if (/^[0-9.]$/.test(e.key)) {
            handleNumber(e.key);
            return;
        }

        // Operators
        switch (e.key) {
            case '+':
                handleOperator('add');
                break;
            case '-':
                handleOperator('subtract');
                break;
            case '*':
                handleOperator('multiply');
                break;
            case '/':
                e.preventDefault();
                handleOperator('divide');
                break;
        }
    }

    function openModal() {
        overlay.classList.add('active');
        display.focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
    }

    // Listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openCalculator') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.CalculatorWidget = { open: openModal, close: closeModal };
    init();
})();

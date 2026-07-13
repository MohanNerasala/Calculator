const display = document.getElementById('calc-display');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const scientificKeys = document.getElementById('scientific-keys');

let calcHistory = [];

function updateDisplay(value) {
    display.value = value;
}

function appendNumber(number) {
    if (display.value === '0' || display.value === 'Error') {
        updateDisplay(number);
    } else {
        updateDisplay(display.value + number);
    }
}

function appendOperator(operator) {
    if (display.value === '' || display.value === 'Error') return;
    const lastChar = display.value.slice(-1);
    
    if (['+', '-', '*', '/', '%', '^'].includes(lastChar)) {
        updateDisplay(display.value.slice(0, -1) + operator);
    } else {
        updateDisplay(display.value + operator);
    }
}

function appendFunction(fn) {
    if (display.value === '0' || display.value === 'Error') {
        updateDisplay(fn + '(');
    } else {
        updateDisplay(display.value + fn + '(');
    }
}

function clearDisplay() {
    updateDisplay('0');
}

function deleteLast() {
    if (display.value === 'Error') {
        clearDisplay();
        return;
    }
    const newValue = display.value.slice(0, -1);
    updateDisplay(newValue === '' ? '0' : newValue);
}

function calculate() {
    try {
        if (display.value === '' || display.value === 'Error') return;
        
        const originalExpression = display.value;
        let expression = display.value;
        
        // Replace visual operators with math operators
        expression = expression.replace(/÷/g, '/').replace(/×/g, '*');
        
        // Replace scientific functions and constants
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/√\(/g, 'Math.sqrt(');
        expression = expression.replace(/π/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');
        expression = expression.replace(/\^/g, '**');

        // Handle factorial (!) basic implementation for small numbers
        expression = expression.replace(/(\d+)!/g, (match, n) => {
            let res = 1;
            for (let i = 2; i <= parseInt(n); i++) res *= i;
            return res;
        });
        
        // Use Function constructor instead of eval for better security
        const result = new Function('return ' + expression)();
        
        // Handle floating point precision issues
        let cleanResult = Math.round(result * 100000000) / 100000000;
        
        if (!isFinite(cleanResult) || isNaN(cleanResult)) {
            updateDisplay('Error');
        } else {
            updateDisplay(cleanResult);
            addToHistory(originalExpression, cleanResult);
        }
    } catch (error) {
        updateDisplay('Error');
    }
}

// UI Toggles
function toggleHistory() {
    historyPanel.classList.toggle('visible');
    // Toggle active state on the button
    const historyBtn = document.querySelector('button[title="History"]');
    if (historyBtn) historyBtn.classList.toggle('active');
}

function toggleScientific() {
    const calc = document.querySelector('.calculator');
    calc.classList.toggle('show-sci');
    // Toggle active state on the button
    const scientificBtn = document.querySelector('button[title="Scientific Calculator"]');
    if (scientificBtn) scientificBtn.classList.toggle('active');
}

// History Management
function loadHistory() {
    const saved = localStorage.getItem('calcHistory');
    if (saved) {
        try {
            calcHistory = JSON.parse(saved);
        } catch (e) {
            calcHistory = [];
        }
    }
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('calcHistory', JSON.stringify(calcHistory));
}

function addToHistory(expr, res) {
    calcHistory.unshift({ expr, res });
    if (calcHistory.length > 20) calcHistory.pop(); // limit to 20 items
    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    calcHistory.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.onclick = () => {
            updateDisplay(item.expr);
            toggleHistory(); // close history on select
        };
        
        const exprDiv = document.createElement('div');
        exprDiv.className = 'history-expr';
        exprDiv.textContent = item.expr + ' =';
        
        const resDiv = document.createElement('div');
        resDiv.className = 'history-res';
        resDiv.textContent = item.res;
        
        div.appendChild(exprDiv);
        div.appendChild(resDiv);
        historyList.appendChild(div);
    });
}

function clearHistory() {
    calcHistory = [];
    saveHistory();
    renderHistory();
}

// ============ THEME TOGGLE ============
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('calcTheme', isDark ? 'dark' : 'light');
    document.getElementById('icon-sun').style.display  = isDark ? 'block' : 'none';
    document.getElementById('icon-moon').style.display = isDark ? 'none'  : 'block';
}

// Initialize history and theme on load
(function init() {
    // Load theme
    const savedTheme = localStorage.getItem('calcTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('icon-sun').style.display  = 'block';
        document.getElementById('icon-moon').style.display = 'none';
    }
    // Load history
    loadHistory();
})();

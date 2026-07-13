const display = document.getElementById('calc-display');

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
    
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        updateDisplay(display.value.slice(0, -1) + operator);
    } else {
        updateDisplay(display.value + operator);
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
        
        let expression = display.value;
        // Replace visual operators with math operators if needed
        expression = expression.replace(/÷/g, '/').replace(/×/g, '*');
        
        // Use Function constructor instead of eval for better security
        const result = new Function('return ' + expression)();
        
        // Handle floating point precision issues
        const cleanResult = Math.round(result * 100000000) / 100000000;
        
        if (!isFinite(cleanResult) || isNaN(cleanResult)) {
            updateDisplay('Error');
        } else {
            updateDisplay(cleanResult);
        }
    } catch (error) {
        updateDisplay('Error');
    }
}

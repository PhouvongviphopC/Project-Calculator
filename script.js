const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator-button[data-value]');
const historyDiv = document.createElement('div');
historyDiv.id = 'history-list';
historyDiv.style.display = 'none';
historyDiv.style.maxHeight = '150px';
historyDiv.style.overflowY = 'auto';
document.querySelector('.calculator').appendChild(historyDiv);

let currentInput = '';
let operator = '';
let firstOperand = '';
let waitingForSecondOperand = false;
let history = [];

function updateDisplay(value) {
  display.textContent = value || '0';
}

function updateHistory() {
  historyDiv.innerHTML = history.length
    ? history.map(item => `<div>${item}</div>`).reverse().join('')
    : '<div>No history yet.</div>';
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;

    if (value === undefined) return;

    // Handle number input
    if (/^[0-9]$/.test(value)) {
      if (waitingForSecondOperand) {
        currentInput = value;
        waitingForSecondOperand = false;
      } else {
        currentInput += value;
      }
      updateDisplay(currentInput);
      return;
    }

    // Handle decimal point
    if (value === '.') {
      if (!currentInput.includes('.')) {
        currentInput += currentInput ? '.' : '0.';
        updateDisplay(currentInput);
      }
      return;
    }

    // Handle operators
    if (['+', '-', '*', '/'].includes(value)) {
      if (currentInput === '') return;
      if (firstOperand && operator && !waitingForSecondOperand) {
        firstOperand = String(operate(Number(firstOperand), Number(currentInput), operator));
        updateDisplay(firstOperand);
      } else {
        firstOperand = currentInput;
      }
      operator = value;
      waitingForSecondOperand = true;
      return;
    }

    // Handle equals
    if (value === '=') {
      if (!operator || !firstOperand || currentInput === '') return;
      const result = operate(Number(firstOperand), Number(currentInput), operator);
      const historyEntry = `${firstOperand} ${operator} ${currentInput} = ${result}`;
      history.push(historyEntry);
      updateHistory();
      updateDisplay(result);
      currentInput = String(result);
      firstOperand = '';
      operator = '';
      waitingForSecondOperand = false;
      return;
    }
  });
});

// Utility buttons
document.getElementById('clear').addEventListener('click', () => {
  currentInput = '';
  operator = '';
  firstOperand = '';
  waitingForSecondOperand = false;
  updateDisplay(currentInput);
});

document.getElementById('delete').addEventListener('click', () => {
  if (!waitingForSecondOperand && currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  }
});

document.getElementById('history').addEventListener('click', () => {
  if (historyDiv.style.display === 'none') {
    updateHistory();
    historyDiv.style.display = 'block';
  } else {
    historyDiv.style.display = 'none';
  }
});

function operate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error';
    default: return b;
  }
}

// Initialize display and history
updateDisplay(currentInput);
updateHistory();
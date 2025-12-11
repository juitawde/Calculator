/**
 * MODERN CALCULATOR
 * A fully functional calculator with keyboard support
 * and error handling
 */

class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  // Clear all values and reset calculator
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  // Delete the last digit
  delete() {
    if (this.currentOperand === '0' || this.shouldResetScreen) return;
    
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  // Append a number to the current operand
  appendNumber(number) {
    // Reset screen after equals or error
    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
    }

    // Prevent multiple decimal points
    if (number === '.' && this.currentOperand.includes('.')) return;

    // Replace initial zero with new number (except for decimals)
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
  }

  // Choose an operation (+, -, ×, ÷)
  chooseOperation(operation) {
    // Don't do anything if there's an error
    if (this.currentOperand === 'Error') {
      this.clear();
      return;
    }

    // If there's already an operation, calculate it first
    if (this.operation !== undefined && !this.shouldResetScreen) {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand + ' ' + operation;
    this.shouldResetScreen = true;
  }

  // Perform the calculation
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // Check if inputs are valid numbers
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        // Handle division by zero
        if (current === 0) {
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operation = undefined;
          this.shouldResetScreen = true;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Round to avoid floating point errors
    computation = Math.round(computation * 100000000) / 100000000;

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
  }

  // Format numbers for display
  getDisplayNumber(number) {
    if (number === 'Error') return number;
    
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      // Add thousand separators
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // Update the display
  updateDisplay() {
    this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
    this.previousOperandElement.textContent = this.previousOperand;
  }
}

// ============================================
// INITIALIZE CALCULATOR
// ============================================
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// ============================================
// BUTTON EVENT LISTENERS
// ============================================
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const decimalButton = document.querySelector('[data-action="decimal"]');
const equalsButton = document.querySelector('[data-action="equals"]');

// Number buttons
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.textContent);
    calculator.updateDisplay();
  });
});

// Operator buttons
operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.textContent);
    calculator.updateDisplay();
  });
});

// Clear button
clearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

// Backspace button
backspaceButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

// Decimal button
decimalButton.addEventListener('click', () => {
  calculator.appendNumber('.');
  calculator.updateDisplay();
});

// Equals button
equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

// ============================================
// KEYBOARD SUPPORT
// ============================================
document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Numbers
  if (key >= '0' && key <= '9') {
    calculator.appendNumber(key);
    calculator.updateDisplay();
  }

  // Decimal point
  if (key === '.' || key === ',') {
    calculator.appendNumber('.');
    calculator.updateDisplay();
  }

  // Operations
  if (key === '+') {
    calculator.chooseOperation('+');
    calculator.updateDisplay();
  }
  if (key === '-') {
    calculator.chooseOperation('-');
    calculator.updateDisplay();
  }
  if (key === '*') {
    calculator.chooseOperation('×');
    calculator.updateDisplay();
  }
  if (key === '/') {
    event.preventDefault(); // Prevent browser search
    calculator.chooseOperation('÷');
    calculator.updateDisplay();
  }

  // Equals
  if (key === '=' || key === 'Enter') {
    event.preventDefault();
    calculator.compute();
    calculator.updateDisplay();
  }

  // Clear
  if (key === 'Escape' || key.toLowerCase() === 'c') {
    calculator.clear();
    calculator.updateDisplay();
  }

  // Backspace/Delete
  if (key === 'Backspace' || key === 'Delete') {
    calculator.delete();
    calculator.updateDisplay();
  }
});

// ============================================
// VISUAL FEEDBACK FOR KEYBOARD INPUT
// ============================================
document.addEventListener('keydown', (event) => {
  const key = event.key;
  let targetButton = null;

  // Find the corresponding button
  if (key >= '0' && key <= '9') {
    targetButton = document.querySelector(`[data-number="${key}"]`);
  } else if (key === '.') {
    targetButton = decimalButton;
  } else if (key === '+' || key === '-') {
    targetButton = document.querySelector(`[data-operator="${key}"]`);
  } else if (key === '*') {
    targetButton = document.querySelector(`[data-operator="×"]`);
  } else if (key === '/') {
    targetButton = document.querySelector(`[data-operator="÷"]`);
  } else if (key === '=' || key === 'Enter') {
    targetButton = equalsButton;
  } else if (key === 'Escape' || key.toLowerCase() === 'c') {
    targetButton = clearButton;
  } else if (key === 'Backspace' || key === 'Delete') {
    targetButton = backspaceButton;
  }

  // Add visual feedback
  if (targetButton) {
    targetButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
      targetButton.style.transform = '';
    }, 100);
  }
});

// Initial display update
calculator.updateDisplay();

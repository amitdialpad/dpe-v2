// js/keypad.js
class Keypad {
  constructor() {
    this.modal = null;
    this.output = null;
    this.currentInput = '';
    this.init();
  }

  init() {
    this.modal = document.getElementById('keypad-modal');
    this.output = document.getElementById('keypad-output');
    
    console.log('🔍 Keypad init - modal found:', !!this.modal);
    console.log('🔍 Keypad init - output found:', !!this.output);
    
    if (!this.modal) {
      console.warn('⚠️ Keypad modal not found!');
      return;
    }
    
    this.bindEvents();
  }

    show() {
    console.log('🔍 Keypad show() called');
    
    if (this.modal) {
      // Remove hidden class first
      this.modal.classList.remove('hidden');
      
      // Force a reflow, then add animation
      this.modal.offsetHeight;
      
      // Add show class for animation
      requestAnimationFrame(() => {
        this.modal.classList.add('show');
      });
      
      this.currentInput = '';
      this.updateDisplay();
    }
  }
  
  hide() {
    console.log('🔍 Keypad hide() called');
    
    if (this.modal) {
      // Remove show class for exit animation
      this.modal.classList.remove('show');
      
      // Hide after animation completes
      setTimeout(() => {
        this.modal.classList.add('hidden');
      }, 300);
      
      // Notify CallControls that keypad was closed
      if (window.callControls) {
        window.callControls.state.keypad.open = false;
        window.callControls.updateUI();
      }
    }
  }

  bindEvents() {
    if (!this.modal) return;

    // Keypad button clicks
    const keypadButtons = this.modal.querySelectorAll('.keypad-btn');
    keypadButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const digit = button.dataset.digit;
        this.handleDigitPress(digit);
      });
    });

    // Close button
    const closeBtn = document.getElementById('keypad-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
      });
    }

    // Backspace button
const backspaceBtn = this.modal.querySelector('.keypad-backspace');
if (backspaceBtn) {
  backspaceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    this.handleBackspace();
  });
}

    // Backdrop click to close
    const backdrop = this.modal.querySelector('.keypad-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.hide();
      });
    }
  }

  handleDigitPress(digit) {
    console.log('🔍 Digit pressed:', digit);
    this.currentInput += digit;
    this.updateDisplay();
  }

  handleBackspace() {
    console.log('🔍 Backspace pressed');
    this.currentInput = this.currentInput.slice(0, -1);
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.output) {
      this.output.textContent = this.currentInput;
    }
  }

  getValue() {
    return this.currentInput;
  }

  clear() {
    this.currentInput = '';
    this.updateDisplay();
  }
}
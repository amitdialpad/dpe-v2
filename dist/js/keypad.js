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
    
    // Debug logging
    console.log('🔍 Keypad init - modal found:', !!this.modal);
    console.log('🔍 Keypad init - output found:', !!this.output);
    
    if (!this.modal) {
      console.warn('⚠️ Keypad modal not found! Make sure DOM is loaded');
      return;
    }
    
    this.bindEvents();
  }

  show() {
    console.log('🔍 Keypad show() called');
    
    // Re-try finding modal if it wasn't found during init
    if (!this.modal) {
      this.modal = document.getElementById('keypad-modal');
      this.output = document.getElementById('keypad-output');
      console.log('🔍 Re-trying to find modal:', !!this.modal);
    }
    
    if (this.modal) {
      console.log('🔍 Showing keypad modal');
      this.modal.classList.remove('hidden');
      this.currentInput = '';
      this.updateDisplay();
    } else {
      console.error('❌ Keypad modal still not found!');
    }
  }

  hide() {
    console.log('🔍 Keypad hide() called');
    if (this.modal) {
      this.modal.classList.add('hidden');
      this.currentInput = '';
    }
  }

  addDigit(digit) {
    this.currentInput += digit;
    this.updateDisplay();
    console.log('Keypad input:', this.currentInput);
  }

  updateDisplay() {
    if (this.output) {
      this.output.textContent = this.currentInput || '';
    }
  }

  bindEvents() {
    if (!this.modal) return;
    
    // Close button
    const closeBtn = document.getElementById('keypad-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
      });
    }

    // Keypad buttons
    const keypadButtons = document.querySelectorAll('.keypad-btn');
    keypadButtons.forEach(button => {
      button.addEventListener('click', () => {
        const digit = button.dataset.digit;
        this.addDigit(digit);
      });
    });

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('keypad-backdrop')) {
        this.hide();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.hide();
      }
    });
  }
}
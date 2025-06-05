// js/vm-flow.js
class VMFlow {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    this.modal = document.getElementById('vm-success-modal');
    
    if (!this.modal) {
      console.error('❌ VMFlow: vm-success-modal not found!');
      return;
    }
    
    console.log('✅ VMFlow: Initialized');
    this.bindVMButtons();
  }

  bindVMButtons() {
    // Find all VM buttons
    const vmButtons = document.querySelectorAll('[data-control="vm"]');
    
    vmButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🔍 VM button clicked');
        this.handleVMClick();
      });
    });
    
    console.log(`✅ VMFlow: Bound ${vmButtons.length} VM buttons`);
  }

  handleVMClick() {
    console.log('🔍 VMFlow: Processing VM transfer');
    
    // Show success modal immediately
    this.showSuccess();
  }

  showSuccess() {
    if (!this.modal) return;
    
    console.log('🔍 VMFlow: Showing VM success modal');
    
    // Update success message
    const successText = this.modal.querySelector('#vm-success-text');
    if (successText) {
      successText.textContent = 'Your greeting, "Default" was left for Maria.';
    }
   
    
    // Show modal
    this.modal.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hideSuccess();
    }, 8000);
  }

  hideSuccess() {
    if (!this.modal) return;
    
    console.log('🔍 VMFlow: Hiding VM success modal');
    
    // Hide modal
    this.modal.classList.add('hidden');
    
    console.log('🔍 VMFlow: Returned to default view');
  }
}

// Initialize VM Flow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new VMFlow();
});
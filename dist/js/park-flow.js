// js/park-flow.js
class ParkFlow {
  constructor() {
    this.connectingModal = null;
    this.successModal = null;
    this.parkingTimeout = null;
    this.init();
  }

  init() {
    this.connectingModal = document.getElementById('park-connecting-modal');
    this.successModal = document.getElementById('park-success-modal');
    
    if (!this.connectingModal || !this.successModal) {
      console.error('❌ ParkFlow: Park modals not found!');
      return;
    }
    
    console.log('✅ ParkFlow: Initialized');
    this.bindParkButtons();
  }

  bindParkButtons() {
    // Find all Park buttons
    const parkButtons = document.querySelectorAll('[data-control="park"]');
    
    parkButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🔍 Park button clicked');
        this.handleParkClick();
      });
    });
    
    console.log(`✅ ParkFlow: Bound ${parkButtons.length} Park buttons`);
  }

  handleParkClick() {
    console.log('🔍 ParkFlow: Starting park process');
    
    // Show parking/loading modal
    this.showParking();
    
    // After 3 seconds, show success
    this.parkingTimeout = setTimeout(() => {
      this.showParkSuccess();
    }, 3000);
  }

  showParking() {
    if (!this.connectingModal) return;
    
    console.log('🔍 ParkFlow: Showing parking modal');
    
    // Show connecting modal
    this.connectingModal.classList.remove('hidden');
  }

  showParkSuccess() {
    if (!this.successModal) return;
    
    console.log('🔍 ParkFlow: Showing park success modal');
    
    // Hide connecting modal
    this.connectingModal.classList.add('hidden');
    
    // Update success message
    const successText = this.successModal.querySelector('#park-success-text');
    if (successText) {
      successText.textContent = '';
    }
    
    // Show success modal
    this.successModal.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hideParkSuccess();
    }, 3000);
  }

  hideParkSuccess() {
    if (!this.successModal) return;
    
    console.log('🔍 ParkFlow: Hiding park success modal');
    
    // Hide success modal
    this.successModal.classList.add('hidden');
    
    // Clear timeout
    if (this.parkingTimeout) {
      clearTimeout(this.parkingTimeout);
      this.parkingTimeout = null;
    }
    
    console.log('🔍 ParkFlow: Returned to default view');
  }
}

// Initialize Park Flow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ParkFlow();
});
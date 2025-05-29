// js/call-controls.js
class CallControls {
  constructor() {
    this.state = {
      mic: { muted: false, enabled: true },
      hold: { active: false, enabled: true },
      transfer: { active: false, enabled: true },
      record: { recording: false, enabled: true },
      keypad: { open: false, enabled: true },
      add: { active: false, enabled: true },
      share: { active: false, enabled: true },
      park: { active: false, enabled: true },
      vm: { active: false, enabled: true },
      more: { open: false, enabled: true }
    };
    
    this.transferFlow = null;
    this.init();
  }

  // Add these methods to your CallControls class
startHoldTimer() {
  this.holdStartTime = Date.now();
  this.holdTimerInterval = setInterval(() => {
    this.updateHoldTimer();
  }, 1000);
  
  // Show timer on all hold buttons
  this.showHoldTimer();
}

stopHoldTimer() {
  if (this.holdTimerInterval) {
    clearInterval(this.holdTimerInterval);
    this.holdTimerInterval = null;
  }
  
  // Hide timer on all hold buttons
  this.hideHoldTimer();
}

updateHoldTimer() {
  const elapsed = Math.floor((Date.now() - this.holdStartTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Update timer display on all hold buttons
  const holdButtons = document.querySelectorAll('[data-control="hold"]');
  holdButtons.forEach(button => {
    const timer = button.querySelector('.hold-timer');
    if (timer) {
      timer.textContent = timeString;
    }
  });
}

showHoldTimer() {
  const holdButtons = document.querySelectorAll('[data-control="hold"]');
  holdButtons.forEach(button => {
    // Create timer element if it doesn't exist
    let timer = button.querySelector('.hold-timer');
    if (!timer) {
      timer = document.createElement('div');
      timer.className = 'hold-timer';
      button.appendChild(timer);
    }
    timer.style.display = 'block';
    timer.textContent = '0:00';
  });
}

hideHoldTimer() {
  const holdButtons = document.querySelectorAll('[data-control="hold"]');
  holdButtons.forEach(button => {
    const timer = button.querySelector('.hold-timer');
    if (timer) {
      timer.style.display = 'none';
    }
  });
}

  init() {
    this.bindEvents();
    this.updateUI();
    console.log('Call Controls initialized');
  }

  // Control Methods
  toggleMic() {
    this.state.mic.muted = !this.state.mic.muted;
    this.updateUI();
    console.log(`Mic ${this.state.mic.muted ? 'muted' : 'unmuted'}`);
    
    // Update ALL mic buttons (both 3x3 grid AND compact controls)
    const micButtons = document.querySelectorAll('[data-control="mic"]');
    micButtons.forEach(button => {
      // Update CSS classes for red background
      if (this.state.mic.muted) {
        button.classList.add('muted');
      } else {
        button.classList.remove('muted');
      }
      
      // Update icon
      const img = button.querySelector('img');
      if (img) {
        if (this.state.mic.muted) {
          img.src = 'images/mic-muted.svg';
          img.alt = 'Unmute';
        } else {
          img.src = 'images/mic.svg';
          img.alt = 'Mute';
        }
      }
      
      // Update text
      const span = button.querySelector('span');
      if (span) {
        span.textContent = this.state.mic.muted ? 'Unmute' : 'Mute';
      }
    });
    
    this.onMicToggle(this.state.mic.muted);
  }
  toggleHold() {
  this.state.hold.active = !this.state.hold.active;
  this.updateUI();
  console.log(`Hold ${this.state.hold.active ? 'activated' : 'deactivated'}`);
  
  // Update ALL hold buttons (both 3x3 grid AND compact controls)
  const holdButtons = document.querySelectorAll('[data-control="hold"]');
  holdButtons.forEach(button => {
    // Update CSS classes for active state
    if (this.state.hold.active) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
    
    // Update icon
    const img = button.querySelector('img');
    if (img) {
      if (this.state.hold.active) {
        img.src = 'images/resume.svg'; // Path to your resume icon
        img.alt = 'Resume';
      } else {
        img.src = 'images/hold.svg'; // Path to your hold icon
        img.alt = 'Hold';
      }
    }
    
    // Update text
    const span = button.querySelector('span');
    if (span) {
      span.textContent = this.state.hold.active ? 'Resume' : 'Hold';
    }
  });
  
  // Handle hold timer
  if (this.state.hold.active) {
    this.startHoldTimer();
  } else {
    this.stopHoldTimer();
  }
  
  this.onHoldToggle(this.state.hold.active);
}
  toggleRecord() {
    this.state.record.recording = !this.state.record.recording;
    this.updateUI();
    console.log(`Recording ${this.state.record.recording ? 'started' : 'stopped'}`);
    
    // Add your actual recording logic here
    this.onRecordToggle(this.state.record.recording);
  }

  handleTransfer() {
    console.log('Opening transfer flow');
    if (!this.transferFlow) {
      this.transferFlow = new TransferFlow(this);
    }
    this.transferFlow.start();
  }

  handleKeypad() {
    this.state.keypad.open = !this.state.keypad.open;
    this.updateUI();
    console.log(`Keypad ${this.state.keypad.open ? 'opened' : 'closed'}`);
    
    // Add your keypad show/hide logic here
    this.onKeypadToggle(this.state.keypad.open);
  }

  handleAdd() {
    console.log('Add participant clicked');
    // Add your add participant logic here
    this.onAddParticipant();
  }

  handleShare() {
    this.state.share.active = !this.state.share.active;
    this.updateUI();
    console.log(`Screen share ${this.state.share.active ? 'started' : 'stopped'}`);
    
    // Add your screen share logic here
    this.onShareToggle(this.state.share.active);
  }

  handlePark() {
    console.log('Park call clicked');
    // Add your park call logic here
    this.onParkCall();
  }

  handleVM() {
    console.log('Voicemail clicked');
    // Add your voicemail logic here
    this.onVoicemail();
  }

  handleMore() {
    this.state.more.open = !this.state.more.open;
    const moreControls = document.getElementById('more-controls');
    
    if (this.state.more.open) {
      moreControls.classList.remove('hidden');
    } else {
      moreControls.classList.add('hidden');
    }
    
    this.updateUI();
    console.log(`More controls ${this.state.more.open ? 'opened' : 'closed'}`);
  }

  handleEndCall() {
    console.log('End call clicked');
    // Add your end call logic here
    if (confirm('Are you sure you want to end the call?')) {
      this.onEndCall();
    }
  }

  // UI Update Methods
  updateUI() {
    // Update all instances of each control
    this.updateControlButton('mic', this.state.mic);
    this.updateControlButton('hold', this.state.hold);
    this.updateControlButton('record', this.state.record);
    this.updateControlButton('keypad', this.state.keypad);
    this.updateControlButton('share', this.state.share);
    this.updateControlButton('more', this.state.more);
  }

  updateControlButton(control, state) {
    const buttons = document.querySelectorAll(`[data-control="${control}"]`);
    
    buttons.forEach(button => {
      // Remove all state classes first
      button.classList.remove('muted', 'active', 'recording', 'open');
      
      // Apply appropriate state classes
      switch (control) {
        case 'mic':
          if (state.muted) button.classList.add('muted');
          break;
        case 'hold':
          if (state.active) button.classList.add('active');
          break;
        case 'record':
          if (state.recording) button.classList.add('recording');
          break;
        case 'keypad':
          if (state.open) button.classList.add('active');
          break;
        case 'share':
          if (state.active) button.classList.add('active');
          break;
        case 'more':
          if (state.open) button.classList.add('active');
          break;
      }
      
      // Update button text if needed
      this.updateButtonText(button, control, state);
    });
  }

  updateButtonText(button, control, state) {
    const span = button.querySelector('span');
    if (!span) return;

    switch (control) {
      case 'mic':
        span.textContent = state.muted ? 'Unmute' : 'Mute';
        break;
      case 'hold':
        span.textContent = state.active ? 'Resume' : 'Hold';
        break;
      case 'record':
        span.textContent = state.recording ? 'Stop' : 'Record';
        break;
      case 'share':
        span.textContent = state.active ? 'Stop Share' : 'Share';
        break;
    }
  }

  // Event Binding
  bindEvents() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-control]');
      if (!button) return;

      const control = button.dataset.control;
      
      // Prevent default button behavior
      e.preventDefault();
      
      // Handle the control action
      switch (control) {
        case 'mic': this.toggleMic(); break;
        case 'hold': this.toggleHold(); break;
        case 'transfer': this.handleTransfer(); break;
        case 'record': this.toggleRecord(); break;
        case 'keypad': this.handleKeypad(); break;
        case 'add': this.handleAdd(); break;
        case 'share': this.handleShare(); break;
        case 'park': this.handlePark(); break;
        case 'vm': this.handleVM(); break;
        case 'more': this.handleMore(); break;
        case 'end-call': this.handleEndCall(); break;
        default:
          console.log(`Unknown control: ${control}`);
      }
    });
  }

  // Callback Methods (implement your actual logic here)
  onMicToggle(muted) {
    // Implement actual microphone mute/unmute logic
    console.log(`Implement mic ${muted ? 'mute' : 'unmute'} logic here`);
  }

  onHoldToggle(active) {
    // Implement actual hold/unhold logic
    console.log(`Implement ${active ? 'hold' : 'unhold'} logic here`);
  }

  onRecordToggle(recording) {
    // Implement actual recording start/stop logic
    console.log(`Implement ${recording ? 'start' : 'stop'} recording logic here`);
  }

  onKeypadToggle(open) {
    // Implement keypad show/hide logic
    console.log(`Implement keypad ${open ? 'show' : 'hide'} logic here`);
  }

  onShareToggle(active) {
    // Implement screen share start/stop logic
    console.log(`Implement ${active ? 'start' : 'stop'} screen share logic here`);
  }

  onAddParticipant() {
    // Implement add participant logic
    console.log('Implement add participant logic here');
  }

  onParkCall() {
    // Implement park call logic
    console.log('Implement park call logic here');
  }

  onVoicemail() {
    // Implement voicemail logic
    console.log('Implement voicemail logic here');
  }

  onEndCall() {
    // Implement end call logic
    console.log('Implement end call logic here');
    // Example: window.close() or redirect
  }
}

// Initialize Call Controls when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.callControls = new CallControls();
});
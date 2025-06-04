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

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    // Control button clicks
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const control = button.dataset.control;
        
        switch (control) {
          case 'mic':
            this.toggleMute();
            break;
          case 'hold':
            this.toggleHold();
            break;
          case 'transfer':
            this.handleTransfer();
            break;
          case 'record':
            this.toggleRecord();
            break;
          case 'keypad':
            this.handleKeypad();
            break;
          case 'add':
            this.handleAdd();
            break;
          case 'share':
            this.handleShare();
            break;
          case 'park':
            this.handlePark();
            break;
          case 'vm':
            this.handleVM();
            break;
          case 'more':
            this.handleMore();
            break;
          case 'end-call':
            this.handleEndCall();
            break;
        }
      });
    });

    // More button specific logic
    const moreBtn = document.getElementById('more-btn');
    const moreControls = document.getElementById('more-controls');
    
    if (moreBtn && moreControls) {
      moreBtn.addEventListener('click', () => {
        const isOpen = !moreControls.classList.contains('hidden');
        if (isOpen) {
          moreControls.classList.add('hidden');
        } else {
          moreControls.classList.remove('hidden');
        }
      });
    }
  }

  toggleMute() {
    this.state.mic.muted = !this.state.mic.muted;
    this.updateUI();
    console.log(`Microphone ${this.state.mic.muted ? 'muted' : 'unmuted'}`);
    
    // Update ALL mute buttons (both 3x3 grid AND compact controls)
    const muteButtons = document.querySelectorAll('[data-control="mic"]');
    muteButtons.forEach(button => {
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
    
    this.onMuteToggle(this.state.mic.muted);
  }

  toggleHold() {
    this.state.hold.active = !this.state.hold.active;
    this.updateUI();
    console.log(`Call ${this.state.hold.active ? 'held' : 'resumed'}`);
    
    // Update ALL hold buttons (both 3x3 grid AND compact controls)
    const holdButtons = document.querySelectorAll('[data-control="hold"]');
    holdButtons.forEach(button => {
      // Update CSS classes for hold state
      if (this.state.hold.active) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
      
      // Update icon
      const img = button.querySelector('img');
      if (img) {
        if (this.state.hold.active) {
          img.src = 'images/resume.svg';
          img.alt = 'Resume';
        } else {
          img.src = 'images/hold.svg';
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

startHoldTimer() {
  this.holdStartTime = Date.now();
  
  // Show the timer immediately with 0:00
  this.updateHoldTimer(); // Add this line - shows "0:00" immediately
  
  this.holdTimerInterval = setInterval(() => {
    this.updateHoldTimer();
  }, 1000);
  
  this.showHoldTimer();
}

  stopHoldTimer() {
    if (this.holdTimerInterval) {
      clearInterval(this.holdTimerInterval);
      this.holdTimerInterval = null;
    }
    
    this.hideHoldTimer();
    
    // Reset timer display after hiding
    setTimeout(() => {
      const holdTimers = document.querySelectorAll('.hold-timer');
      holdTimers.forEach(timer => {
        timer.textContent = '0:00';
      });
    }, 300);
  }

  updateHoldTimer() {
    const elapsed = Date.now() - this.holdStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const holdTimers = document.querySelectorAll('.hold-timer');
    holdTimers.forEach(timer => {
      timer.textContent = timeString;
    });
  }

  showHoldTimer() {
    const holdTimers = document.querySelectorAll('.hold-timer');
    holdTimers.forEach(timer => {
      timer.style.display = 'block';
      // Add smooth animation class
      setTimeout(() => {
        timer.classList.add('show');
      }, 10);
    });
  }

  hideHoldTimer() {
    const holdTimers = document.querySelectorAll('.hold-timer');
    holdTimers.forEach(timer => {
      timer.classList.remove('show');
      // Hide after animation completes
      setTimeout(() => {
        timer.style.display = 'none';
      }, 300);
    });
  }

  toggleRecord() {
    this.state.record.recording = !this.state.record.recording;
    this.updateUI();
    console.log(`Recording ${this.state.record.recording ? 'started' : 'stopped'}`);
    
    // Update ALL record buttons (both 3x3 grid AND compact controls)
    const recordButtons = document.querySelectorAll('[data-control="record"]');
    recordButtons.forEach(button => {
      // Update CSS classes for recording state
      if (this.state.record.recording) {
        button.classList.add('recording');
      } else {
        button.classList.remove('recording');
      }
      
      // Update icon
      const img = button.querySelector('img');
      if (img) {
        if (this.state.record.recording) {
          img.src = 'images/record-active.svg';
          img.alt = 'Stop Recording';
        } else {
          img.src = 'images/record.svg';
          img.alt = 'Record';
        }
      }
      
      // Update text
      const span = button.querySelector('span');
      if (span) {
        span.textContent = this.state.record.recording ? 'Stop' : 'Record';
      }
    });
    
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
  
  // Initialize keypad on first use
  if (!this.keypad) {
    console.log('🔍 Creating keypad instance');
    this.keypad = new Keypad();
  }
  
  // Show/hide keypad modal
  if (this.state.keypad.open) {
    this.keypad.show();
  } else {
    this.keypad.hide();
  }
  
  this.onKeypadToggle(this.state.keypad.open);
}

  handleAdd() {
    this.state.add.active = !this.state.add.active;
    this.updateUI();
    console.log(`Add ${this.state.add.active ? 'activated' : 'deactivated'}`);
    
    this.onAddToggle(this.state.add.active);
  }

  handleShare() {
    this.state.share.active = !this.state.share.active;
    this.updateUI();
    console.log(`Share ${this.state.share.active ? 'activated' : 'deactivated'}`);
    
    this.onShareToggle(this.state.share.active);
  }

  handlePark() {
    this.state.park.active = !this.state.park.active;
    this.updateUI();
    console.log(`Park ${this.state.park.active ? 'activated' : 'deactivated'}`);
    
    this.onParkToggle(this.state.park.active);
  }

  handleVM() {
    this.state.vm.active = !this.state.vm.active;
    this.updateUI();
    console.log(`VM ${this.state.vm.active ? 'activated' : 'deactivated'}`);
    
    this.onVMToggle(this.state.vm.active);
  }

  handleMore() {
    this.state.more.open = !this.state.more.open;
    this.updateUI();
    console.log(`More controls ${this.state.more.open ? 'opened' : 'closed'}`);
    
    this.onMoreToggle(this.state.more.open);
  }

  handleEndCall() {
    console.log('Ending call');
    this.onEndCall();
  }

  updateUI() {
    // Update button states
    Object.keys(this.state).forEach(control => {
      this.updateControlButton(control, this.state[control]);
    });
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
    }
  }

  // Event callbacks
  onMuteToggle(muted) {
    console.log('Mute toggled:', muted);
  }

  onHoldToggle(active) {
    console.log('Hold toggled:', active);
  }

  onRecordToggle(recording) {
    console.log('Record toggled:', recording);
  }

  onKeypadToggle(open) {
    console.log('Keypad toggled:', open);
  }

  onTransferToggle(active) {
    console.log('Transfer toggled:', active);
  }

  onAddToggle(active) {
    console.log('Add toggled:', active);
  }

  onShareToggle(active) {
    console.log('Share toggled:', active);
  }

  onParkToggle(active) {
    console.log('Park toggled:', active);
  }

  onVMToggle(active) {
    console.log('VM toggled:', active);
  }

  onMoreToggle(open) {
    console.log('More toggled:', open);
  }

  onEndCall() {
    console.log('End call triggered');
  }
}
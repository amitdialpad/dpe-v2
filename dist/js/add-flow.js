// js/add-flow.js
class AddFlow {
  constructor(callControls) {
    this.callControls = callControls;
    this.modal = null;
    this.groupCallModal = null;
    this.connectingModal = null;
    this.currentContact = null;
    this.isOpen = false;
    this.connectingTimeout = null;
    this.buttonsDisabled = false;
    this.init();
  }

  init() {
    // Use the separate add-contact-modal (NOT transfer modal)
    this.modal = document.getElementById('add-contact-modal');
    this.groupCallModal = document.getElementById('group-call-modal');
    
    if (!this.modal) {
      console.error('❌ AddFlow: add-contact-modal not found!');
      return;
    }
    
    console.log('✅ AddFlow: Initialized with separate Add modal');
  }

  start() {
    if (!this.modal) return;
    
    console.log('🔍 AddFlow: Starting...');
    this.showModal();
    this.bindEvents();
    this.isOpen = true;
  }

  close() {
    if (!this.modal) return;
    
    console.log('🔍 AddFlow: Closing...');
    this.hideModal();
    this.isOpen = false;
    
    // Reset call controls state
    this.callControls.state.add.active = false;
    this.callControls.updateUI();
  }

  showModal() {
    const modalContent = this.modal.querySelector('.add-modal-content');
    const backdrop = this.modal.querySelector('.transfer-backdrop');
    
    this.modal.classList.remove('hidden');
    this.modal.style.display = 'flex';
    
    // Set initial states
    backdrop.style.opacity = '0';
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(-30px) scale(0.95)';
    
    // Force reflow
    this.modal.offsetHeight;
    
    // Animate backdrop
    backdrop.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    backdrop.style.opacity = '1';
    
    // Animate content
    setTimeout(() => {
      modalContent.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      modalContent.style.opacity = '1';
      modalContent.style.transform = 'translateY(0) scale(1)';
    }, 100);
  }

  hideModal() {
    const modalContent = this.modal.querySelector('.add-modal-content');
    const backdrop = this.modal.querySelector('.transfer-backdrop');
    
    // Animate out
    modalContent.style.transition = 'all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(-30px) scale(0.95)';
    
    setTimeout(() => {
      backdrop.style.transition = 'opacity 0.3s ease-out';
      backdrop.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
      this.modal.classList.add('hidden');
      this.modal.style.display = 'none';
      
      // Reset styles
      modalContent.style.transition = '';
      backdrop.style.transition = '';
    }, 450);
  }

  bindEvents() {
    // Close button
    const closeBtn = this.modal.querySelector('#add-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }
    
    // Backdrop click
    const backdrop = this.modal.querySelector('.transfer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.close();
      });
    }
    
    // Search functionality
    const searchInput = this.modal.querySelector('#add-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchContacts(e.target.value);
      });
      
      searchInput.addEventListener('blur', (e) => {
        if (!e.target.value.trim()) {
          setTimeout(() => {
            this.showRecentContacts();
          }, 100);
        }
      });
    }
    
    // Bind contact clicks
    this.bindContactEvents();
    
    // Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  bindContactEvents() {
    // Recent contacts
    const recentContacts = this.modal.querySelectorAll('#add-recent-contacts .contact-item');
    recentContacts.forEach(contact => {
      contact.addEventListener('click', () => {
        console.log('🔍 Recent contact clicked:', contact.dataset.name);
        this.selectContact(contact);
      });
    });
  }

  searchContacts(query) {
    const recentSection = this.modal.querySelector('#add-recent-section');
    const searchSection = this.modal.querySelector('#add-search-section');
    const searchContacts = this.modal.querySelector('#add-search-contacts');
    const noResults = this.modal.querySelector('#add-no-results');
    
    if (!query.trim()) {
      this.showRecentContacts();
      return;
    }
    
    // Hide recent, show search
    recentSection.classList.add('hidden');
    searchSection.classList.remove('hidden');
    
    // Get contacts from database
    const database = this.modal.querySelectorAll('.add-contact-database .contact-item');
    const results = Array.from(database).filter(contact => {
      const name = contact.dataset.name.toLowerCase();
      const phone = contact.dataset.phone;
      const team = contact.dataset.team.toLowerCase();
      const searchTerm = query.toLowerCase();
      
      return name.includes(searchTerm) || 
             phone.includes(searchTerm) || 
             team.includes(searchTerm);
    });
    
    // Clear previous results
    searchContacts.innerHTML = '';
    
    if (results.length > 0) {
      noResults.classList.add('hidden');
      
      results.forEach(contact => {
        const clone = contact.cloneNode(true);
        clone.addEventListener('click', () => {
          console.log('🔍 Search result clicked:', clone.dataset.name);
          this.selectContact(clone);
        });
        searchContacts.appendChild(clone);
      });
    } else {
      noResults.classList.remove('hidden');
    }
  }

  showRecentContacts() {
    const recentSection = this.modal.querySelector('#add-recent-section');
    const searchSection = this.modal.querySelector('#add-search-section');
    
    recentSection.classList.remove('hidden');
    searchSection.classList.add('hidden');
  }

  selectContact(contactElement) {
    const contactData = {
      name: contactElement.dataset.name,
      phone: contactElement.dataset.phone,
      team: contactElement.dataset.team,
      status: contactElement.dataset.status,
      avatar: contactElement.querySelector('img')?.src
    };
    
    console.log('🔍 AddFlow: Selected contact:', contactData);
    
    // Store for later use
    this.currentContact = contactData;
    
    // Close add modal
    this.close();
    
    // Show group call confirmation
    setTimeout(() => {
      this.showGroupCallConfirmation(contactData);
    }, 500);
  }

  showGroupCallConfirmation(contactData) {
    if (!this.groupCallModal) return;
    
    console.log('🔍 AddFlow: Showing group call confirmation');
    
    // Populate contact data
    const avatar = this.groupCallModal.querySelector('#group-call-contact-avatar');
    const name = this.groupCallModal.querySelector('#group-call-contact-name');
    const phone = this.groupCallModal.querySelector('#group-call-contact-phone');
    const statusDot = this.groupCallModal.querySelector('#group-call-status-dot');
    const statusText = this.groupCallModal.querySelector('#group-call-status-text');
    
    if (avatar) avatar.src = contactData.avatar || 'images/avatar-default.png';
    if (name) name.textContent = contactData.name;
    if (phone) phone.textContent = contactData.phone;
    if (statusDot) statusDot.className = `status-dot ${contactData.status}`;
    if (statusText) statusText.textContent = `${contactData.status} • ${contactData.team}`;
    
    // Show modal
    this.groupCallModal.classList.remove('hidden');
    
    // Bind group call events
    this.bindGroupCallEvents();
  }

  bindGroupCallEvents() {
    // Close button
    const closeBtn = this.groupCallModal.querySelector('#group-call-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.groupCallModal.classList.add('hidden');
        this.callControls.state.add.active = false;
        this.callControls.updateUI();
      });
    }
    
    // Cancel button
    const cancelBtn = this.groupCallModal.querySelector('#group-call-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.groupCallModal.classList.add('hidden');
        this.callControls.state.add.active = false;
        this.callControls.updateUI();
      });
    }
    
    // Add to group call button - RESTORE FULL FUNCTIONALITY
    const addBtn = this.groupCallModal.querySelector('#add-to-group-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        console.log('🔍 Starting group call with:', this.currentContact);
        this.startGroupCall(this.currentContact);
      });
    }
  }

  // RESTORE THE COMPLETE GROUP CALL FUNCTIONALITY
  startGroupCall(contactData) {
    console.log('🔍 AddFlow: Starting group call');
    
    // Hide group call confirmation
    this.groupCallModal.classList.add('hidden');
    
    // Show connecting state
    this.showConnectingState(contactData);
    
    // Store timeout reference so we can cancel it
    this.connectingTimeout = setTimeout(() => {
      this.showGroupCallActive(contactData);
    }, 3000); // 3 seconds for testing
  }

  showConnectingState(contactData) {
    console.log('🔍 AddFlow: Showing connecting state for:', contactData);
    
    // Create connecting modal if it doesn't exist
    if (!this.connectingModal) {
      this.createConnectingModal();
    }
    
    // Show modal first
    this.connectingModal.classList.remove('hidden');
    
    // Wait for DOM to be ready, then populate data
    setTimeout(() => {
      const connectingName = this.connectingModal.querySelector('#connecting-name');
      const connectingPhone = this.connectingModal.querySelector('#connecting-phone');
      const connectingAvatar = this.connectingModal.querySelector('#connecting-avatar');
      
      console.log('🔍 Populating connecting data:', {
        name: contactData.name,
        phone: contactData.phone,
        avatar: contactData.avatar
      });
      
      if (connectingName) {
        connectingName.textContent = `Connecting to ${contactData.name}...`;
      }
      if (connectingPhone) {
        connectingPhone.textContent = contactData.phone;
      }
      if (connectingAvatar) {
        connectingAvatar.src = contactData.avatar || 'images/avatar-default.png';
      }
      
      // Bind close/cancel events
      this.bindConnectingEvents();
    }, 100);
  }

  showGroupCallActive(contactData) {
    console.log('🔍 AddFlow: Group call active');
    
    // Hide connecting modal
    if (this.connectingModal) {
      this.connectingModal.classList.add('hidden');
    }
    
    // Transform UI to group call state
    this.activateGroupCallUI(contactData);
  }

activateGroupCallUI(contactData) {
  // Update header to show group call
  const header = document.querySelector('.header');
  const avatar = header.querySelector('.avatar img');
  const name = header.querySelector('.name');
  const status = header.querySelector('.status span:last-child');
  
  // Create group avatars
  if (avatar) {
    const groupAvatars = document.createElement('div');
    groupAvatars.className = 'group-avatars';
    groupAvatars.innerHTML = `
      <img src="${avatar.src}" alt="Maria Reyes" class="avatar-main">
      <img src="${contactData.avatar}" alt="${contactData.name}" class="avatar-secondary">
    `;
    avatar.parentNode.replaceChild(groupAvatars, avatar);
  }
  
  if (name) name.textContent = `Maria Reyes, ${contactData.name}`;
  if (status) status.textContent = 'Group Call';
  
  // DISABLE ADD AND TRANSFER BUTTONS DURING GROUP CALL
  this.disableGroupCallButtons();
  
  // BIND END CALL BUTTON FOR GROUP CALL
  this.bindGroupCallEndButton();
  
  // Reset add button state
  this.callControls.state.add.active = false;
  this.callControls.updateUI();
  
  console.log('🔍 AddFlow: Group call UI activated');
}

// ADD THIS NEW METHOD (replace the previous version)
disableGroupCallButtons() {
  console.log('🔍 Disabling Add and Transfer buttons during group call');
  
  // Disable Add buttons
  const addButtons = document.querySelectorAll('[data-control="add"]');
  addButtons.forEach(button => {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
    button.setAttribute('title', 'Cannot add contacts during group call');
    
    // Override click behavior
    button.addEventListener('click', this.preventGroupCallAction, { capture: true });
  });
  
  // Disable Transfer buttons
  const transferButtons = document.querySelectorAll('[data-control="transfer"]');
  transferButtons.forEach(button => {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
    button.setAttribute('title', 'Cannot transfer during group call');
    
    // Override click behavior
    button.addEventListener('click', this.preventGroupCallAction, { capture: true });
  });
  
  // Store reference for later cleanup
  this.buttonsDisabled = true;
}

// ADD THIS NEW METHOD
preventGroupCallAction = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  const control = e.currentTarget.dataset.control;
  console.log(`🔍 ${control} blocked during group call`);
  
  // Optional: Show a toast or alert
  // alert(`Cannot ${control} contacts during group call`);
  
  return false;
}

enableGroupCallButtons() {
  if (!this.buttonsDisabled) return;
  
  console.log('🔍 Re-enabling Add and Transfer buttons');
  
  // Re-enable Add buttons
  const addButtons = document.querySelectorAll('[data-control="add"]');
  addButtons.forEach(button => {
    button.disabled = false;
    button.style.opacity = '';
    button.style.cursor = '';
    button.removeAttribute('title');
    
    // Remove override
    button.removeEventListener('click', this.preventGroupCallAction, { capture: true });
  });
  
  // Re-enable Transfer buttons
  const transferButtons = document.querySelectorAll('[data-control="transfer"]');
  transferButtons.forEach(button => {
    button.disabled = false;
    button.style.opacity = '';
    button.style.cursor = '';
    button.removeAttribute('title');
    
    // Remove override
    button.removeEventListener('click', this.preventGroupCallAction, { capture: true });
  });
  
  // UNBIND GROUP CALL END BUTTON
  this.unbindGroupCallEndButton();
  
  this.buttonsDisabled = false;
}

  createConnectingModal() {
    const modal = document.createElement('div');
    modal.id = 'connecting-modal';
    modal.className = 'connecting-modal hidden';
    modal.innerHTML = `
      <div class="transfer-backdrop"></div>
      <div class="connecting-content">
        <div class="connecting-header">
          <button class="connecting-close-btn" id="connecting-close-btn">
            <img src="images/transfer-close.svg" alt="Close">
          </button>
        </div>
        
        <div class="connecting-animation">
          <div class="connecting-spinner"></div>
        </div>
        
        <div class="connecting-info">
          <div class="connecting-avatar">
            <img src="" alt="Contact" id="connecting-avatar">
          </div>
          <h2 id="connecting-name">Connecting...</h2>
          <p id="connecting-phone"></p>
          <p class="connecting-status">Calling...</p>
        </div>
        
        <div class="connecting-actions">
          <button class="connecting-cancel-btn" id="connecting-cancel-btn">
            Cancel Call
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.connectingModal = modal;
    
    console.log('🔍 Created connecting modal with proper structure');
  }

  bindConnectingEvents() {
    if (!this.connectingModal) return;
    
    // Close button
    const closeBtn = this.connectingModal.querySelector('#connecting-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('🔍 Connecting close button clicked');
        this.cancelCall();
      });
    }
    
    // Cancel button
    const cancelBtn = this.connectingModal.querySelector('#connecting-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        console.log('🔍 Connecting cancel button clicked');
        this.cancelCall();
      });
    }
    
    // Backdrop click
    const backdrop = this.connectingModal.querySelector('.transfer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        console.log('🔍 Connecting backdrop clicked');
        this.cancelCall();
      });
    }
    
    // Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape' && !this.connectingModal.classList.contains('hidden')) {
        console.log('🔍 Connecting escape key pressed');
        this.cancelCall();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  cancelCall() {
    console.log('🔍 AddFlow: Cancelling call');
    
    // Hide connecting modal
    if (this.connectingModal) {
      this.connectingModal.classList.add('hidden');
    }
    
    // Reset add button state
    this.callControls.state.add.active = false;
    this.callControls.updateUI();
    
    // Clear any pending timeouts
    if (this.connectingTimeout) {
      clearTimeout(this.connectingTimeout);
      this.connectingTimeout = null;
    }
    
    console.log('🔍 Call cancelled, returned to default view');
  }

  // ADD THIS METHOD - End group call functionality
endGroupCall() {
  console.log('🔍 AddFlow: Ending group call');
  
  // Hide any open modals
  if (this.connectingModal) {
    this.connectingModal.classList.add('hidden');
  }
  if (this.groupCallModal) {
    this.groupCallModal.classList.add('hidden');
  }
  
  // Clear any pending timeouts
  if (this.connectingTimeout) {
    clearTimeout(this.connectingTimeout);
    this.connectingTimeout = null;
  }
  
  // Restore original header
  this.restoreOriginalHeader();
  
  // Re-enable buttons
  this.enableGroupCallButtons();
  
  // Reset call controls state
  this.callControls.state.add.active = false;
  this.callControls.updateUI();
  
  console.log('🔍 Group call ended, returned to default view');
}

// ADD THIS METHOD - Restore original header
restoreOriginalHeader() {
  const header = document.querySelector('.header');
  const groupAvatars = header.querySelector('.group-avatars');
  const name = header.querySelector('.name');
  const status = header.querySelector('.status span:last-child');
  
  // Restore single avatar if group avatars exist
  if (groupAvatars) {
    const originalAvatar = document.createElement('div');
    originalAvatar.className = 'avatar';
    originalAvatar.innerHTML = '<img src="images/avatar.png" alt="Maria Reyes">';
    groupAvatars.parentNode.replaceChild(originalAvatar, groupAvatars);
  }
  
  // Restore original name and status
  if (name) name.textContent = 'Maria Reyes';
  if (status) status.textContent = 'Credit Card Help Center';
  
  console.log('🔍 Header restored to original state');
}

// ADD THIS METHOD - Bind end call button during group call
bindGroupCallEndButton() {
  // Find the end call button
  const endCallBtn = document.querySelector('[data-control="end-call"]');
  const endCallBtnLarge = document.querySelector('.end-call-btn');
  
  if (endCallBtn) {
    endCallBtn.addEventListener('click', this.handleGroupCallEnd);
  }
  
  if (endCallBtnLarge) {
    endCallBtnLarge.addEventListener('click', this.handleGroupCallEnd);
  }
  
  console.log('🔍 End call buttons bound for group call');
}

// ADD THIS METHOD - Handle end call click
handleGroupCallEnd = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('🔍 End call clicked during group call');
  this.endGroupCall();
  
  return false;
}

// ADD THIS METHOD - Remove end call binding
unbindGroupCallEndButton() {
  const endCallBtn = document.querySelector('[data-control="end-call"]');
  const endCallBtnLarge = document.querySelector('.end-call-btn');
  
  if (endCallBtn) {
    endCallBtn.removeEventListener('click', this.handleGroupCallEnd);
  }
  
  if (endCallBtnLarge) {
    endCallBtnLarge.removeEventListener('click', this.handleGroupCallEnd);
  }
  
  console.log('🔍 End call buttons unbound from group call');
}
}
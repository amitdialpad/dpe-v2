// js/transfer-flow.js
class TransferFlow {
  constructor(callControls) {
    this.callControls = callControls;
    this.modal = null;
    this.modalContent = null;
    this.backdrop = null;
    this.completeModal = null;
    this.isOpen = false;
    this.searchInput = null;
    this.recentSection = null;
    this.searchSection = null;
    this.searchContactsContainer = null; // RENAMED to avoid conflict
    this.noResults = null;
    this.contactDatabase = [];
    this.init();
  }

  init() {
    this.modal = document.getElementById('transfer-modal');
    this.modalContent = this.modal?.querySelector('.transfer-modal-content');
    this.backdrop = this.modal?.querySelector('.transfer-backdrop');
    this.completeModal = document.getElementById('complete-transfer-modal');
    this.searchInput = document.getElementById('transfer-search-input');
    this.recentSection = document.getElementById('recent-section');
    this.searchSection = document.getElementById('search-section');
    this.searchContactsContainer = document.getElementById('search-contacts'); // RENAMED
    this.noResults = document.getElementById('no-results');
    
    this.loadContactDatabase();
    this.bindEvents();
  }

  loadContactDatabase() {
    // Load all contacts from the hidden database
    const databaseContacts = document.querySelectorAll('.contact-database .contact-item');
    this.contactDatabase = Array.from(databaseContacts).map(contact => ({
      element: contact.cloneNode(true),
      name: contact.dataset.name ? contact.dataset.name.toLowerCase() : '',
      phone: contact.dataset.phone || '',
      team: contact.dataset.team || '',
      status: contact.dataset.status || ''
    }));
    
    console.log('Loaded contact database:', this.contactDatabase.length, 'contacts');
  }

  start() {
    console.log('Opening transfer modal with beautiful animation');
    this.showModal();
  }

  showModal() {
    if (!this.modal || !this.modalContent || !this.backdrop) return;

    // Show modal immediately
    this.modal.classList.remove('hidden');
    this.modal.style.display = 'flex';
    
    // Set initial states
    this.backdrop.style.opacity = '0';
    this.modalContent.style.opacity = '0';
    this.modalContent.style.transform = 'translateY(-30px) scale(0.95)';
    
    // Force reflow
    this.modal.offsetHeight;
    
    // Animate backdrop
    this.backdrop.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.backdrop.style.opacity = '1';
    
    // Animate content with elegant spring effect
    setTimeout(() => {
      this.modalContent.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      this.modalContent.style.opacity = '1';
      this.modalContent.style.transform = 'translateY(0) scale(1)';
    }, 100);
    
    this.isOpen = true;
    
    // Focus on search input after animation completes
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.focus();
        this.searchInput.value = ''; // Clear any previous search
        this.showRecentContacts(); // Show recent by default
      }
    }, 700);
  }

  hideModal() {
    if (!this.modal || !this.modalContent || !this.backdrop) return;

    // Animate content out
    this.modalContent.style.transition = 'all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
    this.modalContent.style.opacity = '0';
    this.modalContent.style.transform = 'translateY(-30px) scale(0.95)';
    
    // Animate backdrop out
    setTimeout(() => {
      this.backdrop.style.transition = 'opacity 0.3s ease-out';
      this.backdrop.style.opacity = '0';
    }, 50);
    
    // Hide modal completely after animation
    setTimeout(() => {
      this.modal.classList.add('hidden');
      this.modal.style.display = 'none';
      
      // Reset styles for next time
      this.modalContent.style.transition = '';
      this.backdrop.style.transition = '';
      
      // Clear search
      if (this.searchInput) {
        this.searchInput.value = '';
      }
      this.showRecentContacts();
    }, 450);
    
    this.isOpen = false;
  }

  showRecentContacts() {
    // Add safety checks
    if (!this.recentSection || !this.searchSection || !this.noResults) {
      console.error('Required DOM elements not found for showRecentContacts');
      return;
    }
    
    this.recentSection.classList.remove('hidden');
    this.searchSection.classList.add('hidden');
    this.noResults.classList.add('hidden');
  }

  showSearchResults(results) {
    // Add safety checks
    if (!this.recentSection || !this.searchSection || !this.searchContactsContainer || !this.noResults) {
      console.error('Required DOM elements not found for showSearchResults');
      return;
    }

    this.recentSection.classList.add('hidden');
    this.searchSection.classList.remove('hidden');
    
    // Clear previous results
    this.searchContactsContainer.innerHTML = '';
    
    if (results.length === 0) {
      this.noResults.classList.remove('hidden');
    } else {
      this.noResults.classList.add('hidden');
      
      // Add search results with staggered animation
      results.forEach((contact, index) => {
        const contactElement = contact.element.cloneNode(true);
        contactElement.style.opacity = '0';
        contactElement.style.transform = 'translateY(10px)';
        this.searchContactsContainer.appendChild(contactElement);
        
        // Staggered animation
        setTimeout(() => {
          contactElement.style.transition = 'all 0.2s ease-out';
          contactElement.style.opacity = '1';
          contactElement.style.transform = 'translateY(0)';
        }, index * 50);
      });
    }
  }

  searchContacts(query) {
    // Add safety checks
    if (!this.recentSection || !this.searchSection || !this.searchContactsContainer) {
      console.error('Required DOM elements not found for search');
      return;
    }

    if (!query.trim()) {
      this.showRecentContacts();
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = this.contactDatabase.filter(contact => {
      return contact.name.includes(searchTerm) || 
             contact.phone.includes(searchTerm) ||
             contact.team.toLowerCase().includes(searchTerm);
    });

    console.log('Search results for "' + query + '":', results.length, 'found');
    this.showSearchResults(results);
  }

  selectContact(contactElement) {
    const contactName = contactElement.querySelector('.contact-name').textContent;
    const contactPhone = contactElement.querySelector('.phone-number').textContent;
    const statusDot = contactElement.querySelector('.status-dot');
    const statusText = contactElement.querySelector('.status-text')?.textContent || 'Available • Team';
    
    console.log(`Selected contact: ${contactName} - ${contactPhone}`);
    
    // Add visual feedback
    contactElement.style.transform = 'scale(0.98)';
    contactElement.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      contactElement.style.transform = 'scale(1)';
      this.showCompleteTransfer(contactName, contactPhone, statusDot ? statusDot.className : 'status-dot available', statusText, contactElement);
    }, 100);
  }

 showCompleteTransfer(name, phone, statusClass, statusText, contactElement) {
  if (!this.completeModal) return;
  
  // Update contact info FIRST (before any animation)
  const toName = document.getElementById('to-name');
  const toPhone = document.getElementById('to-phone');
  const toStatusText = document.getElementById('to-status-text');
  const toStatusDot = document.getElementById('to-status-dot');
  const toAvatar = document.getElementById('to-avatar');
  
  if (toName) toName.textContent = name;
  if (toPhone) toPhone.textContent = phone;
  if (toStatusText) toStatusText.textContent = statusText;
  if (toStatusDot) toStatusDot.className = statusClass;
  
  // Copy avatar image
  if (toAvatar && contactElement) {
    const sourceAvatar = contactElement.querySelector('.contact-avatar img');
    if (sourceAvatar) {
      toAvatar.src = sourceAvatar.src;
      toAvatar.alt = sourceAvatar.alt;
    }
  }
  
  // CRITICAL: Show complete modal FIRST, behind the current modal
  this.completeModal.classList.remove('hidden');
  this.completeModal.style.display = 'flex';
  this.completeModal.style.zIndex = '9998'; // Behind current modal temporarily
  
  const completeContent = this.completeModal.querySelector('.complete-transfer-content');
  const completeBackdrop = this.completeModal.querySelector('.transfer-backdrop');
  
  if (completeContent && completeBackdrop) {
    // Set complete modal ready but invisible
    completeBackdrop.style.opacity = '1';
    completeContent.style.opacity = '0';
    completeContent.style.transform = 'translateY(-30px) scale(0.95)';
    completeContent.style.transition = '';
  }
  
  // Force reflow to ensure complete modal is rendered
  this.completeModal.offsetHeight;
  
  // NOW fade out the first modal content ONLY (keep backdrop)
  this.modalContent.style.transition = 'opacity 0.2s ease-out';
  this.modalContent.style.opacity = '0';
  
  // After first modal content is hidden, bring complete modal to front and animate in
  setTimeout(() => {
    this.modal.classList.add('hidden'); // Hide first modal
    this.completeModal.style.zIndex = '10000'; // Bring complete modal to front
    
    // Reset first modal for next time
    this.modalContent.style.opacity = '';
    this.modalContent.style.transition = '';
    
    // Animate complete modal content in
    if (completeContent) {
      completeContent.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      completeContent.style.opacity = '1';
      completeContent.style.transform = 'translateY(0) scale(1)';
    }
  }, 200);
  
  // Bind complete transfer events
  this.bindCompleteTransferEvents();
}
  animateCompleteTransferIn() {
    const completeContent = this.completeModal.querySelector('.complete-transfer-content');
    const backdrop = this.completeModal.querySelector('.transfer-backdrop');
    
    if (!completeContent || !backdrop) return;

    // Show modal immediately
    this.completeModal.classList.remove('hidden');
    this.completeModal.style.display = 'flex';
    
    // Set initial states
    backdrop.style.opacity = '0';
    completeContent.style.opacity = '0';
    completeContent.style.transform = 'translateY(-30px) scale(0.95)';
    
    // Force reflow
    this.completeModal.offsetHeight;
    
    // Animate backdrop
    backdrop.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    backdrop.style.opacity = '1';
    
    // Animate content with elegant spring effect
    setTimeout(() => {
      completeContent.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      completeContent.style.opacity = '1';
      completeContent.style.transform = 'translateY(0) scale(1)';
    }, 100);
  }

  hideCompleteTransfer() {
    const completeContent = this.completeModal.querySelector('.complete-transfer-content');
    const backdrop = this.completeModal.querySelector('.transfer-backdrop');
    
    if (completeContent && backdrop) {
      // Animate out
      completeContent.style.transition = 'all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
      completeContent.style.opacity = '0';
      completeContent.style.transform = 'translateY(-30px) scale(0.95)';
      
      setTimeout(() => {
        backdrop.style.transition = 'opacity 0.3s ease-out';
        backdrop.style.opacity = '0';
      }, 50);
      
      // Hide modal after animation
      setTimeout(() => {
        this.completeModal.classList.add('hidden');
        this.completeModal.style.display = 'none';
        
        // Reset styles
        completeContent.style.transition = '';
        backdrop.style.transition = '';
      }, 450);
    } else {
      // Fallback without animation
      this.completeModal.classList.add('hidden');
    }
  }

  goBackToSearch() {
    const completeContent = this.completeModal.querySelector('.complete-transfer-content');
    const backdrop = this.completeModal.querySelector('.transfer-backdrop');
    
    if (completeContent && backdrop) {
      // Animate out
      completeContent.style.transition = 'all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
      completeContent.style.opacity = '0';
      completeContent.style.transform = 'translateY(-30px) scale(0.95)';
      
      setTimeout(() => {
        backdrop.style.transition = 'opacity 0.3s ease-out';
        backdrop.style.opacity = '0';
      }, 50);
      
      // Hide and show first modal after animation
      setTimeout(() => {
        this.completeModal.classList.add('hidden');
        this.completeModal.style.display = 'none';
        
        // Reset styles
        completeContent.style.transition = '';
        backdrop.style.transition = '';
        
        // Show first modal
        this.modal.classList.remove('hidden');
        this.modal.style.display = 'flex';
      }, 450);
    } else {
      // Fallback without animation
      this.completeModal.classList.add('hidden');
      this.modal.classList.remove('hidden');
    }
  }

  bindCompleteTransferEvents() {
    // Back button
    const backBtn = document.getElementById('complete-transfer-back');
    if (backBtn) {
      backBtn.onclick = () => {
        this.goBackToSearch();
      };
    }
    
    // Close button
    const closeBtn = document.getElementById('complete-transfer-close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.hideCompleteTransfer();
        this.hideModal();
      };
    }
    
    // Action buttons
    const transferNowBtn = document.getElementById('transfer-now-btn');
    if (transferNowBtn) {
      transferNowBtn.onclick = () => {
        this.executeTransfer('now');
      };
    }
    
    const askFirstBtn = document.getElementById('ask-first-btn');
    if (askFirstBtn) {
      askFirstBtn.onclick = () => {
        this.executeTransfer('ask');
      };
    }
    
    const transferVmBtn = document.getElementById('transfer-vm-btn');
    if (transferVmBtn) {
      transferVmBtn.onclick = () => {
        this.executeTransfer('vm');
      };
    }
  }

  executeTransfer(type) {
    const contactName = document.getElementById('to-name')?.textContent || 'Contact';
    
    switch(type) {
      case 'now':
        console.log(`Executing immediate transfer to ${contactName}`);
        alert(`Transferring call to ${contactName} now...`);
        break;
      case 'ask':
        console.log(`Asking ${contactName} first before transfer`);
        alert(`Calling ${contactName} to ask before transfer...`);
        break;
      case 'vm':
        console.log(`Transferring to ${contactName}'s voicemail`);
        alert(`Transferring to ${contactName}'s voicemail...`);
        break;
    }
    
    // Close modal after action
    this.hideCompleteTransfer();
    this.hideModal();
  }

  bindEvents() {
    // Close button
    const closeBtn = document.getElementById('transfer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideModal();
      });
    }

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.backdrop) {
          this.hideModal();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hideModal();
      }
    });

    // Search functionality with error handling
    if (this.searchInput) {
      console.log('Search input found, adding event listener');
      this.searchInput.addEventListener('input', (e) => {
        console.log('Search triggered:', e.target.value);
        this.searchContacts(e.target.value);
      });

      // Clear search when focus is lost and input is empty
      this.searchInput.addEventListener('blur', (e) => {
        if (!e.target.value.trim()) {
          setTimeout(() => {
            if (this.isOpen) {
              this.showRecentContacts();
            }
          }, 100);
        }
      });
    } else {
      console.log('Search input NOT found!');
    }

    // Contact selection (for both recent and search results)
    document.addEventListener('click', (e) => {
      const contactItem = e.target.closest('.contact-item');
      if (contactItem && this.isOpen && !contactItem.closest('.contact-database')) {
        this.selectContact(contactItem);
      }
    });
  }
}
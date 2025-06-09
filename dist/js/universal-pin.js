// js/universal-pin.js - CLEANED VERSION
class UniversalPin {
  constructor() {
    this.pinnedPanels = []; 
    this.panelStates = {
      transcript: false,
      playbook: false,
      livecoach: false,
      salesforce: false
    };
    this.init();
  }

  init() {
    console.log('🎯 Universal Pin System: Initialized');
    
    // Fix the layout issue immediately
    this.fixCallInterfaceLayout();
    
    this.addPinControlsToAllPanels();
    this.bindPinEvents();
    this.monitorPanelSwitching();
    
    // Add smooth transition styles
    this.addTransitionStyles();
  }

  fixCallInterfaceLayout() {
    const callInterface = document.querySelector('.call-interface');
    if (callInterface) {
      // Always use flex-start instead of space-between
      callInterface.style.justifyContent = 'flex-start';
      
      // Ensure the interface can grow and scroll naturally
      callInterface.style.minHeight = '100vh';
      callInterface.style.height = 'auto';
      
      console.log('✅ Fixed call-interface layout for natural scrolling');
    }
  }

  addTransitionStyles() {
    // Add CSS for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
      .panel-transitioning {
        transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
      }
      .panel {
        transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      }
      .pinned-panels-container .panel.pinned {
        transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);
  }

  addPinControlsToAllPanels() {
    // Add pin/close controls to playbook panel
    this.addControlsToPanel('playbook-panel', 'Playbook');
    
    // Add pin/close controls to livecoach panel  
    this.addControlsToPanel('livecoach-panel', 'Live Coach');
    
    // Add pin/close controls to salesforce panel
    this.addControlsToPanel('salesforce-panel', 'Salesforce');
    
    console.log('✅ Pin controls added to all panels');
  }

  addControlsToPanel(panelId, panelName) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    // Check if header already exists
    if (panel.querySelector('.panel-header')) return;

    // Create header with pin/close controls
    const headerHTML = `
      <div class="panel-header" data-panel="${panelId.replace('-panel', '')}">
        <div class="panel-title">
          <span>${panelName}</span>
        </div>
        <div class="panel-actions">
          <button class="panel-pin-btn" data-panel="${panelId.replace('-panel', '')}">
            📌
          </button>
          <button class="panel-close-btn" data-panel="${panelId.replace('-panel', '')}">
            ✕
          </button>
        </div>
      </div>
    `;

    // Insert header at the beginning of the panel
    panel.insertAdjacentHTML('afterbegin', headerHTML);
  }

  bindPinEvents() {
    // Handle transcript pin button specifically
    setTimeout(() => {
      const transcriptPinBtn = document.getElementById('transcript-pin-btn');
      if (transcriptPinBtn) {
        // Remove any existing listeners first
        transcriptPinBtn.replaceWith(transcriptPinBtn.cloneNode(true));
        
        // Re-get the element after replacement
        const newPinBtn = document.getElementById('transcript-pin-btn');
        newPinBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🎯 Transcript pin clicked directly');
          this.togglePin('transcript');
        });
      }
    }, 1000);

    // Handle other panels with event delegation
    document.addEventListener('click', (e) => {
      // Pin button handling
      const pinBtn = e.target.closest('.panel-pin-btn');
      if (pinBtn) {
        e.preventDefault();
        e.stopPropagation();
        const panelName = pinBtn.dataset.panel;
        console.log(`🎯 ${panelName} pin clicked in universal system`);
        this.togglePin(panelName);
        return;
      }

      // Close button handling
      const closeBtn = e.target.closest('.panel-close-btn');
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const panelName = closeBtn.dataset.panel;
        this.closePanel(panelName);
        return;
      }

      // Transcript close button (special case)
      if (e.target.id === 'transcript-close-btn' || e.target.closest('#transcript-close-btn')) {
        e.preventDefault();
        e.stopPropagation();
        this.closePanel('transcript');
        return;
      }
    });
  }

  monitorPanelSwitching() {
    const toolBtns = document.querySelectorAll('.tool-btn');
    
    toolBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.pinnedPanels.length > 0) {
          const panelName = btn.id.replace('-btn', '');
          
          // Don't interfere if clicking on a pinned panel's tab
          if (this.panelStates[panelName]) {
            e.preventDefault();
            return false;
          }
          
          // For unpinned panels, handle positioning
          setTimeout(() => {
            this.handlePanelSwitchWithPinned(panelName);
          }, 50);
        }
      });
    });
  }
  
  handlePanelSwitchWithPinned(panelName) {
    // Ensure pinned panels remain visible
    this.pinnedPanels.forEach(pinnedPanelName => {
      const pinnedPanel = document.getElementById(`${pinnedPanelName}-panel`);
      if (pinnedPanel) {
        pinnedPanel.classList.remove('hidden');
      }
    });
    
    // Ensure pinned container exists and is populated
    this.createPinnedContainer();
    
    // Position the new panel below pinned panels
    this.positionUnpinnedPanel(panelName);
  }
  
  positionUnpinnedPanel(panelName) {
    const panel = document.getElementById(`${panelName}-panel`);
    const pinnedContainer = document.getElementById('pinned-panels-container');
    
    if (panel && pinnedContainer) {
      // Remove from hidden state
      panel.classList.remove('hidden');
      
      // Position after pinned container
      pinnedContainer.insertAdjacentElement('afterend', panel);
      
      // Style it appropriately
      panel.style.height = 'auto';
      panel.style.maxHeight = '70vh';
      panel.style.marginTop = '1rem';
      panel.style.overflow = 'auto';
      
      console.log(`📱 ${panelName} positioned below pinned panels`);
      
      // Auto-scroll to show the new panel
      setTimeout(() => {
        panel.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 500);
    }
  }

  togglePin(panelName) {
    console.log(`🔄 togglePin called for: ${panelName}`);
    
    if (this.panelStates[panelName]) {
      this.unpinPanel(panelName);
    } else {
      this.pinPanel(panelName);
    }
  }

  pinPanel(panelName) {
    this.panelStates[panelName] = true;
    
    if (!this.pinnedPanels.includes(panelName)) {
      this.pinnedPanels.push(panelName);
    }
    
    const panel = document.getElementById(`${panelName}-panel`);
    const pinBtn = document.querySelector(`[data-panel="${panelName}"].panel-pin-btn`) || 
                   document.getElementById('transcript-pin-btn');
    
    if (panel) {
      // Add smooth transition
      panel.classList.add('panel-transitioning');
      panel.classList.add('pinned');
      
      // Remove transition class after animation
      setTimeout(() => {
        panel.classList.remove('panel-transitioning');
      }, 400);
    }
    
    if (pinBtn) {
      pinBtn.classList.add('pinned');
    }
    
    this.updateTabState(panelName, true);
    this.createPinnedContainer();
    this.showNotification(`${this.getPanelDisplayName(panelName)} pinned`);
    
    console.log(`📌 ${panelName} pinned. Total pinned: ${this.pinnedPanels.length}`);
  }

  unpinPanel(panelName) {
    console.log(`🔄 Unpinning ${panelName}...`);
    
    // Clean up our pin state
    this.panelStates[panelName] = false;
    this.pinnedPanels = this.pinnedPanels.filter(p => p !== panelName);
    
    const panel = document.getElementById(`${panelName}-panel`);
    const pinBtn = document.querySelector(`[data-panel="${panelName}"].panel-pin-btn`) || 
                   document.getElementById('transcript-pin-btn');
    
    if (panel) {
      // Add smooth transition
      panel.classList.add('panel-transitioning');
      panel.classList.remove('pinned');
      
      // Move panel back to its normal location
      const callInterface = document.querySelector('.call-interface');
      if (callInterface) {
        callInterface.appendChild(panel);
      }
      
      // Reset panel styles
      panel.style.height = '';
      panel.style.maxHeight = '';
      panel.style.order = '';
      
      // Remove transition class after animation
      setTimeout(() => {
        panel.classList.remove('panel-transitioning');
      }, 400);
    }
    
    if (pinBtn) {
      pinBtn.classList.remove('pinned');
    }
    
    // Clean up tab state
    this.updateTabState(panelName, false);
    
    // Update container after moving the panel
    this.updatePinnedContainer();
    
    // Show notification
    this.showNotification(`${this.getPanelDisplayName(panelName)} unpinned`);
    
    console.log(`📌 ${panelName} unpinned. Total pinned: ${this.pinnedPanels.length}`);
    
    if (this.pinnedPanels.length === 0) {
      console.log('✅ No more pinned panels - user can now close normally');
    }
  }

  createPinnedContainer() {
    const callInterface = document.querySelector('.call-interface');
    
    if (this.pinnedPanels.length === 0) return;
    
    // Ensure layout is always flex-start
    callInterface.style.justifyContent = 'flex-start';
    
    // Adjust margins
    const header = callInterface.querySelector('.header');
    const compactBar = callInterface.querySelector('.compact-bar');
    const moreControls = document.getElementById('more-controls');
    
    if (header) header.style.marginBottom = '1rem';
    if (compactBar) compactBar.style.margin = '0.5rem 0';
    if (moreControls) moreControls.style.margin = '0.5rem 0';
    
    let pinnedContainer = document.getElementById('pinned-panels-container');
    
    if (!pinnedContainer) {
      pinnedContainer = document.createElement('div');
      pinnedContainer.id = 'pinned-panels-container';
      pinnedContainer.className = 'pinned-panels-container';
      
      // Find insertion point
      const moreControls = document.getElementById('more-controls');
      if (moreControls) {
        moreControls.insertAdjacentElement('afterend', pinnedContainer);
      } else {
        const compactBar = document.querySelector('.compact-bar');
        if (compactBar) {
          compactBar.insertAdjacentElement('afterend', pinnedContainer);
        } else {
          const header = document.querySelector('.header');
          if (header) {
            header.insertAdjacentElement('afterend', pinnedContainer);
          }
        }
      }
      
      console.log('📍 Pinned container positioned correctly');
    }
    
    // Move pinned panels to container
    this.pinnedPanels.forEach((panelName, index) => {
      const panel = document.getElementById(`${panelName}-panel`);
      if (panel && panel.classList.contains('pinned')) {
        panel.classList.remove('hidden');
        panel.style.order = index;
        panel.style.height = '300px';
        panel.style.maxHeight = '300px';
        pinnedContainer.appendChild(panel);
      }
    });
    
    // Handle active unpinned panels
    const activeTab = document.querySelector('.tool-btn.active');
    if (activeTab) {
      const activePanelName = activeTab.id.replace('-btn', '');
      if (!this.panelStates[activePanelName]) {
        setTimeout(() => {
          const activePanel = document.getElementById(`${activePanelName}-panel`);
          if (activePanel) {
            activePanel.style.marginTop = '1rem';
          }
          this.positionUnpinnedPanel(activePanelName);
        }, 100);
      }
    }
  }

  updatePinnedContainer() {
    const pinnedContainer = document.getElementById('pinned-panels-container');
    const callInterface = document.querySelector('.call-interface');
    
    if (this.pinnedPanels.length === 0 && pinnedContainer) {
      // Remove container and reset layout
      pinnedContainer.remove();
      
      // Reset margins
      const header = callInterface.querySelector('.header');
      const compactBar = callInterface.querySelector('.compact-bar');
      const moreControls = document.getElementById('more-controls');
      
      if (header) header.style.marginBottom = '';
      if (compactBar) compactBar.style.margin = '';
      if (moreControls) moreControls.style.margin = '';
      
    } else if (pinnedContainer) {
      // Update container with remaining pinned panels
      this.createPinnedContainer();
    }
  }

  closePanel(panelName) {
    // If pinned, unpin first
    if (this.panelStates[panelName]) {
      this.unpinPanel(panelName);
    }
    
    // Handle closing based on pinned state
    if (this.pinnedPanels.length === 0) {
      const tabBtn = document.getElementById(`${panelName}-btn`);
      if (tabBtn && tabBtn.classList.contains('active')) {
        tabBtn.click();
      }
    } else {
      // Just hide this panel, keep pinned view
      const panel = document.getElementById(`${panelName}-panel`);
      if (panel) {
        panel.classList.add('hidden');
      }
      
      // Deactivate tab but don't go to grid view
      const tabBtn = document.getElementById(`${panelName}-btn`);
      if (tabBtn) {
        tabBtn.classList.remove('active');
      }
    }
  }

  updateTabState(panelName, isPinned) {
    const tabBtn = document.getElementById(`${panelName}-btn`);
    
    if (isPinned) {
      tabBtn.classList.add('pinned-disabled');
      
      // Add pin indicator
      if (!tabBtn.querySelector('.pin-indicator')) {
        tabBtn.insertAdjacentHTML('beforeend', '<span class="pin-indicator">📌</span>');
      }
    } else {
      tabBtn.classList.remove('pinned-disabled');
      
      // Remove pin indicator
      const indicator = tabBtn.querySelector('.pin-indicator');
      if (indicator) indicator.remove();
    }
  }

  getPanelDisplayName(panelName) {
    const names = {
      transcript: 'Transcript',
      playbook: 'Playbook', 
      livecoach: 'Live Coach',
      salesforce: 'Salesforce'
    };
    return names[panelName] || panelName;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(187, 166, 252, 0.9);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 15000;
      animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.universalPin = new UniversalPin();
});
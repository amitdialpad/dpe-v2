// js/universal-pin.js - CORRECTED VERSION
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
  }

  fixCallInterfaceLayout() {
    const callInterface = document.querySelector('.call-interface');
    if (callInterface) {
      // Always use flex-start instead of space-between
      callInterface.style.justifyContent = 'flex-start';
      console.log('✅ Fixed call-interface justify-content to flex-start');
    }
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
    // Use a more direct approach
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

    // Handle other panels
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('panel-pin-btn') || e.target.closest('.panel-pin-btn')) {
        const btn = e.target.classList.contains('panel-pin-btn') ? e.target : e.target.closest('.panel-pin-btn');
        const panelName = btn.dataset.panel;
        console.log(`🎯 ${panelName} pin clicked in universal system`);
        this.togglePin(panelName);
      }

      if (e.target.classList.contains('panel-close-btn') || e.target.closest('.panel-close-btn')) {
        const btn = e.target.classList.contains('panel-close-btn') ? e.target : e.target.closest('.panel-close-btn');
        const panelName = btn.dataset.panel;
        this.closePanel(panelName);
      }

      if (e.target.id === 'transcript-close-btn') {
        this.closePanel('transcript');
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
          
          // For unpinned panels, we need to override the normal behavior
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
      panel.style.maxHeight = 'calc(60vh - 100px)';
      panel.style.marginTop = '1rem';
      
      console.log(`📱 ${panelName} positioned below pinned panels`);
    }
  }

  togglePin(panelName) {
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
      panel.classList.add('pinned');
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
    this.panelStates[panelName] = false;
    this.pinnedPanels = this.pinnedPanels.filter(p => p !== panelName);
    
    const panel = document.getElementById(`${panelName}-panel`);
    const pinBtn = document.querySelector(`[data-panel="${panelName}"].panel-pin-btn`) || 
                   document.getElementById('transcript-pin-btn');
    
    if (panel) {
      panel.classList.remove('pinned');
      panel.classList.add('hidden'); // Close the panel
    }
    
    if (pinBtn) {
      pinBtn.classList.remove('pinned');
    }
    
    this.updateTabState(panelName, false);
    this.updatePinnedContainer();
    
    // Check if any panels are still pinned
    if (this.pinnedPanels.length === 0) {
      // No panels pinned, return to 3x3 grid
      this.returnToDefaultView();
    }
    
    this.showNotification(`${this.getPanelDisplayName(panelName)} unpinned`);
    
    console.log(`📌 ${panelName} unpinned. Total pinned: ${this.pinnedPanels.length}`);
  }

  createPinnedContainer() {
    const callInterface = document.querySelector('.call-interface');
    
    if (this.pinnedPanels.length === 0) return;
    
    // Ensure layout is always flex-start
    callInterface.style.justifyContent = 'flex-start';
    
    // Adjust margins directly
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
      
      // Find #more-controls and insert after it
      const moreControls = document.getElementById('more-controls');
      if (moreControls) {
        moreControls.insertAdjacentElement('afterend', pinnedContainer);
      } else {
        // Fallback: insert after compact-bar
        const compactBar = document.querySelector('.compact-bar');
        if (compactBar) {
          compactBar.insertAdjacentElement('afterend', pinnedContainer);
        } else {
          // Final fallback: insert after header
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
        panel.style.height = '200px';
        panel.style.maxHeight = '200px';
        pinnedContainer.appendChild(panel);
      }
    });
    
    // Also check for any active unpinned panels
    const activeTab = document.querySelector('.tool-btn.active');
    if (activeTab) {
      const activePanelName = activeTab.id.replace('-btn', '');
      if (!this.panelStates[activePanelName]) {
        setTimeout(() => {
          this.positionUnpinnedPanel(activePanelName);
        }, 100);
      }
    }
  }

  updatePinnedContainer() {
    const pinnedContainer = document.getElementById('pinned-panels-container');
    const callInterface = document.querySelector('.call-interface');
    
    if (this.pinnedPanels.length === 0 && pinnedContainer) {
      // No pinned panels left, remove container and reset layout
      pinnedContainer.remove();
      
      // DON'T reset justify-content - keep it as flex-start
      // callInterface.style.justifyContent = '';
      
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

  returnToDefaultView() {
    const callInterface = document.querySelector('.call-interface');
    
    // Remove classes to return to default layout
    callInterface.classList.remove('transcript-open');
    
    // DON'T reset justify-content - keep it as flex-start
    // callInterface.style.justifyContent = '';
    
    // Reset margins
    const header = callInterface.querySelector('.header');
    const compactBar = callInterface.querySelector('.compact-bar');
    const moreControls = document.getElementById('more-controls');
    
    if (header) header.style.marginBottom = '';
    if (compactBar) compactBar.style.margin = '';
    if (moreControls) moreControls.style.margin = '';
    
    // Hide all panels
    const allPanels = document.querySelectorAll('.panel');
    allPanels.forEach(panel => {
      panel.classList.add('hidden');
    });
    
    // Deactivate all tab buttons
    const allTabBtns = document.querySelectorAll('.tool-btn');
    allTabBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show default controls
    const defaultGrid = document.getElementById('default-grid');
    const controlsArea = document.querySelector('.controls-area');
    const endCallWrapper = document.querySelector('.end-call-wrapper');
    
    if (defaultGrid) defaultGrid.classList.remove('hidden');
    if (controlsArea) controlsArea.classList.remove('hidden'); 
    if (endCallWrapper) endCallWrapper.classList.remove('hidden');
    
    // Hide compact controls
    if (compactBar) compactBar.classList.add('hidden');
    if (moreControls) moreControls.classList.add('hidden');
    
    console.log('🏠 Returned to default 3x3 grid view');
  }

  closePanel(panelName) {
    // If pinned, unpin first
    if (this.panelStates[panelName]) {
      this.unpinPanel(panelName);
    }
    
    // Only close if no panels are pinned, otherwise just hide this panel
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
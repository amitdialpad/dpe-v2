document.addEventListener('DOMContentLoaded', () => {
  const callInterface = document.querySelector('.call-interface');
  const defaultGrid = document.getElementById('default-grid');
  const defaultEndCall = document.getElementById('default-end-call');
  const compactBar = document.getElementById('compact-bar');
  const controlsGrid = document.querySelector('.controls-grid');

  const transcriptPanel = document.querySelector('.transcript-panel');
  const playbookPanel = document.getElementById('playbook-panel');
  const livecoachPanel = document.getElementById('livecoach-panel');
  const salesforcePanel = document.getElementById('salesforce-panel');

  const moreBtn = document.getElementById('more-btn');
  const moreControls = document.getElementById('more-controls');

  const transcriptBtn = document.getElementById('transcript-btn');
  const playbookBtn = document.getElementById('playbook-btn');
  const livecoachBtn = document.getElementById('livecoach-btn');
  const salesforceBtn = document.getElementById('salesforce-btn');

  const allToolBtns = document.querySelectorAll('.tool-btn');
  const transcriptImg = document.querySelector('#transcript-btn img');

  let currentOpenPanel = null; // track which panel is open

  // 🔥 Initialize CallControls
  console.log('Initializing CallControls...');
  const callControls = new CallControls();
  window.callControls = callControls; // Make it globally accessible
  console.log('CallControls initialized:', callControls);

function resetAll() {
  // Hide all panels
  transcriptPanel.classList.add('hidden');
  playbookPanel.classList.add('hidden');
  livecoachPanel.classList.add('hidden');
  salesforcePanel.classList.add('hidden');
  
  // Reset call interface to default state
  callInterface.classList.remove('transcript-open');
  
  // Show default controls
  defaultGrid.classList.remove('hidden');
  defaultEndCall.classList.remove('hidden');
  compactBar.classList.add('hidden');
  
  // HIDE MORE CONTROLS when returning to default view
  moreControls.classList.add('hidden'); // ADD THIS LINE
  
  // Reset all tab buttons
  allToolBtns.forEach(btn => btn.classList.remove('active'));
  
  // Reset icons
  resetIconImages();
  
  // Hide any visible hold timers when switching views
  const holdTimers = document.querySelectorAll('.hold-timer');
  holdTimers.forEach(timer => {
    timer.classList.remove('show');
    timer.style.display = 'none';
  });
  
  // Clear current panel
  currentOpenPanel = null;
  
  // Re-show hold timer if call is currently on hold
  if (callControls && callControls.state.hold.active) {
    callControls.showHoldTimer();
  }
}

  function resetIconImages() {
    transcriptImg.src = 'images/ai_on_tab1.svg';
  }

  function showPanel(panel, button) {
    if (currentOpenPanel === panel) {
      // Same panel clicked - close it
      resetAll();
      return;
    }

    // Hide all panels first
    transcriptPanel.classList.add('hidden');
    playbookPanel.classList.add('hidden');
    livecoachPanel.classList.add('hidden');
    salesforcePanel.classList.add('hidden');
    
    // Reset all tab buttons
    allToolBtns.forEach(btn => btn.classList.remove('active'));
    
    // Reset call interface state
    callInterface.classList.remove('transcript-open');
    defaultGrid.classList.remove('hidden');
    defaultEndCall.classList.remove('hidden');
    compactBar.classList.add('hidden');
    
    // Reset icons
    resetIconImages();

    // Hide any visible hold timers when switching views
    const holdTimers = document.querySelectorAll('.hold-timer');
    holdTimers.forEach(timer => {
      timer.classList.remove('show');
      timer.style.display = 'none';
    });

    // Show the selected panel
    panel.classList.remove('hidden');
    button.classList.add('active');
    currentOpenPanel = panel;

    // Special handling for transcript panel
    if (panel === transcriptPanel) {
      callInterface.classList.add('transcript-open');
      defaultGrid.classList.add('hidden');
      defaultEndCall.classList.add('hidden');
      compactBar.classList.remove('hidden');
      transcriptImg.src = 'images/ai_on_tab1_white.svg';
    } else if (panel === playbookPanel || panel === livecoachPanel || panel === salesforcePanel) {
      // Same layout changes for other panels
      callInterface.classList.add('transcript-open');
      defaultGrid.classList.add('hidden');
      defaultEndCall.classList.add('hidden');
      compactBar.classList.remove('hidden');
    }

    // Re-show hold timer if call is currently on hold
    if (callControls && callControls.state.hold.active) {
      callControls.showHoldTimer();
    }
  }

  // Bottom tab navigation
  transcriptBtn.addEventListener('click', () => {
    showPanel(transcriptPanel, transcriptBtn);
  });

  playbookBtn.addEventListener('click', () => {
    showPanel(playbookPanel, playbookBtn);
  });

  livecoachBtn.addEventListener('click', () => {
    showPanel(livecoachPanel, livecoachBtn);
  });

  salesforceBtn.addEventListener('click', () => {
    showPanel(salesforcePanel, salesforceBtn);
  });

  // Initialize with everything reset
  resetAll();
});
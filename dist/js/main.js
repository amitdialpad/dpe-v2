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

  function resetAll() {
    transcriptPanel.classList.add('hidden');
    playbookPanel.classList.add('hidden');
    livecoachPanel.classList.add('hidden');
    salesforcePanel.classList.add('hidden');
    callInterface.classList.remove('transcript-open');
    defaultGrid.classList.remove('hidden');
    defaultEndCall.classList.remove('hidden');
    compactBar.classList.add('hidden');
    allToolBtns.forEach(btn => btn.classList.remove('active'));
    resetIconImages();
    currentOpenPanel = null;
  }

  function resetIconImages() {
    transcriptImg.src = '/dist/images/ai_on_tab1.svg';
  }

  function openPanel(panel, clickedBtn) {
    resetAll();
    panel.classList.remove('hidden');
    callInterface.classList.add('transcript-open');
    defaultGrid.classList.add('hidden');
    defaultEndCall.classList.add('hidden');
    compactBar.classList.remove('hidden');
    clickedBtn.classList.add('active');
    currentOpenPanel = panel;

    if (clickedBtn.id === 'transcript-btn') {
      transcriptImg.src = '/dist/images/ai_on_tab1_white.svg';
    }
  }

  transcriptBtn.addEventListener('click', () => {
    if (currentOpenPanel === transcriptPanel) {
      resetAll(); // close if already open
    } else {
      openPanel(transcriptPanel, transcriptBtn);
    }
  });

  playbookBtn.addEventListener('click', () => {
    if (currentOpenPanel === playbookPanel) {
      resetAll();
    } else {
      openPanel(playbookPanel, playbookBtn);
    }
  });

  livecoachBtn.addEventListener('click', () => {
    if (currentOpenPanel === livecoachPanel) {
      resetAll();
    } else {
      openPanel(livecoachPanel, livecoachBtn);
    }
  });

  salesforceBtn.addEventListener('click', () => {
    if (currentOpenPanel === salesforcePanel) {
      resetAll();
    } else {
      openPanel(salesforcePanel, salesforceBtn);
    }
  });

  moreBtn.addEventListener('click', () => {
    moreControls.classList.toggle('hidden');
  });
});

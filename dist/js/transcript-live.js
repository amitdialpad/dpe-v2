// js/transcript-live.js
class LiveTranscript {
  constructor() {
    this.isTranscribing = true;
    this.transcriptContainer = null;
    this.toggleSwitch = null;
    this.messageQueue = [];
    this.simulationInterval = null;
    this.init();
  }

  init() {
    this.transcriptContainer = document.querySelector('.transcript-content');
    this.toggleSwitch = document.getElementById('dt-toggle');
    
    if (!this.transcriptContainer) {
      console.warn('⚠️ LiveTranscript: Transcript container not found!');
      return;
    }
    
    this.bindToggleEvent();
    this.startTranscription();
    console.log('✅ LiveTranscript: Initialized');
  }

bindToggleEvent() {
  this.toggleSwitch = document.getElementById('dt-toggle');
  
  if (this.toggleSwitch) {
    console.log('✅ Toggle found and bound');
    
    this.toggleSwitch.addEventListener('change', (e) => {
      console.log('🔄 Toggle changed:', e.target.checked);
      
      if (!e.target.checked) {
        this.showWarningModal();
      } else {
        this.startTranscription();
      }
    });
  } else {
    console.warn('⚠️ Toggle not found');
  }
}

  showWarningModal() {
    // Create warning modal
    const modal = document.createElement('div');
    modal.className = 'transcript-warning-modal';
    modal.innerHTML = `
      <div class="warning-backdrop"></div>
      <div class="warning-content">
        <div class="warning-icon">⚠️</div>
        <h3>Turn off AI Transcription?</h3>
        <p>Turning off transcription will also disable other AI features like Live Coach suggestions and Playbook tracking.</p>
        <div class="warning-actions">
          <button class="warning-cancel-btn">Keep Transcription On</button>
          <button class="warning-confirm-btn">Turn Off AI</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Bind modal events
    const cancelBtn = modal.querySelector('.warning-cancel-btn');
    const confirmBtn = modal.querySelector('.warning-confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
      // Keep transcription on
      this.toggleSwitch.checked = true;
      this.removeWarningModal(modal);
    });
    
    confirmBtn.addEventListener('click', () => {
      // Turn off transcription
      this.stopTranscription();
      this.removeWarningModal(modal);
    });
  }

  removeWarningModal(modal) {
    modal.remove();
  }

  startTranscription() {
    this.isTranscribing = true;
    console.log('🎙️ Transcription started');
    
    // Clear existing content and add initial messages
    this.transcriptContainer.innerHTML = `
      <div class="msg">
        <strong>Agent (You)</strong>
        <p>Hello Maria! Thank you for calling. How can I help you today?</p>
      </div>
      <div class="msg">
        <strong>Maria Reyes</strong>
        <p>Hi! I'm having trouble with my recent order. It hasn't arrived yet and I'm getting worried.</p>
      </div>
    `;
    
    // Start simulating live transcript
    this.simulateLiveTranscript();
  }

  stopTranscription() {
    this.isTranscribing = false;
    console.log('🔇 Transcription stopped');
    
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    
    // Add "Transcription stopped" message
    this.addMessage('System', 'AI Transcription has been turned off', 'system');
  }

  simulateLiveTranscript() {
    // Sample conversation flow
    const conversationFlow = [
      { speaker: 'Agent (You)', text: 'I understand your concern. Let me look up your order details right away.', delay: 3000 },
      { speaker: 'Maria Reyes', text: 'Thank you. My order number is ORD-12345.', delay: 6000 },
      { speaker: 'Agent (You)', text: 'Perfect! I can see your order here. It looks like there was a shipping delay due to weather conditions.', delay: 9000 },
      { speaker: 'Maria Reyes', text: 'Oh no! When do you expect it to arrive?', delay: 12000 },
      { speaker: 'Agent (You)', text: 'Good news - it should arrive by tomorrow evening. I can also offer you expedited shipping for your next order at no charge.', delay: 15000 },
      { speaker: 'Maria Reyes', text: 'That would be great! I really appreciate your help.', delay: 18000 }
    ];

    conversationFlow.forEach((message, index) => {
      setTimeout(() => {
        if (this.isTranscribing) {
          this.addMessage(message.speaker, message.text);
        }
      }, message.delay);
    });
  }

addMessage(speaker, text, type = 'normal') {
  if (!this.isTranscribing && type !== 'system') return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `msg ${type}`;
  
  if (type === 'system') {
    messageDiv.innerHTML = `<p style="color: #888; font-style: italic;">${text}</p>`;
  } else {
    messageDiv.innerHTML = `
      <strong>${speaker}</strong>
      <p>${text}</p>
    `;
  }
  
  this.transcriptContainer.appendChild(messageDiv);
  
  // Force scroll to bottom with smooth behavior
  setTimeout(() => {
    this.transcriptContainer.scrollTo({
      top: this.transcriptContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LiveTranscript();
});
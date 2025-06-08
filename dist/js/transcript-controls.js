// js/transcript-controls.js - CLEANED VERSION
class TranscriptControls {
    constructor() {
      this.isPinned = false;
      this.init();
    }
  
    init() {
      setTimeout(() => {
        this.bindEvents();
      }, 500);
      console.log('✅ Transcript controls initialized');
    }
  
    bindEvents() {
      const pinBtn = document.getElementById('transcript-pin-btn');
      const closeBtn = document.getElementById('transcript-close-btn');
  
      if (pinBtn) {
        pinBtn.addEventListener('click', () => {
          console.log('📌 Pin clicked - will be handled by universal system');
          // Will be replaced by universal pin system
        });
      }
  
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          console.log('❌ Close clicked');
          this.closeTranscript();
        });
      }
    }
  
    closeTranscript() {
      const transcriptBtn = document.getElementById('transcript-btn');
      if (transcriptBtn && transcriptBtn.classList.contains('active')) {
        transcriptBtn.click();
      }
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
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => notification.remove(), 2000);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new TranscriptControls();
  });
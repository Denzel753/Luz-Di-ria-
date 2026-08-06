export const playNotificationSound = (soundType: string) => {
  if (!soundType || soundType === 'Silencioso') return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    
    // Master gain for softer overall volume
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
    
    const now = ctx.currentTime;

    if (soundType === 'Sino') {
      // Bell/Tibetan bowl sound
      const freqs = [
        { f: 432, g: 0.6, d: 3 }, // Fundamental (A4 detuned slightly for warmth)
        { f: 1296, g: 0.3, d: 2 }, // 3rd harmonic
        { f: 2160, g: 0.1, d: 1.5 } // 5th harmonic
      ];
      
      freqs.forEach(({ f, g, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        // Gentle attack, long decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(g, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + d);
        
        osc.start(now);
        osc.stop(now + d);
      });
      
    } else if (soundType === 'Harpa') {
      // Gentle Harp arpeggio
      const notes = [
        { f: 261.63, t: 0 },    // C4
        { f: 329.63, t: 0.15 }, // E4
        { f: 392.00, t: 0.3 },  // G4
        { f: 523.25, t: 0.45 }  // C5
      ];
      
      notes.forEach(({ f, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        
        // Lowpass filter to soften the triangle wave
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        const startTime = now + t;
        const duration = 2.5;
        
        // Pluck envelope
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
      
    } else if (soundType === 'Celeste') {
      // Ethereal/Celeste sound (high, twinkling)
      const notes = [
        { f: 1046.50, t: 0 },     // C6
        { f: 1318.51, t: 0.15 },  // E6
        { f: 1567.98, t: 0.3 }    // G6
      ];
      
      notes.forEach(({ f, t }) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator(); // detuned for chorus effect
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = f;
        osc2.frequency.value = f * 1.005; // slight detune
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);
        
        const startTime = now + t;
        const duration = 2;
        
        // Bell-like envelope
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
      });
      
    } else {
      // Default: Simple gentle chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 523.25; // C5
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      osc.start(now);
      osc.stop(now + 1.5);
    }
  } catch(e) {
    console.error("Audio playback failed", e);
  }
};

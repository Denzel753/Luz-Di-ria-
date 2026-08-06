const fs = require('fs');
let path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /onTestPopup=\{\(\) => \{[\s\S]*?navigator\.vibrate\(\[200, 100, 200\]\);\s*\} catch \(e\) \{\}\s*\}\s*\}\}/;

if (!code.includes('const handleTestPopup = useCallback')) {
  code = code.replace(
    /const handleOpenAbout = useCallback/,
    `const handleTestPopup = useCallback(() => {
    setIsSettingsOpen(false);
    setGiantPopupVerse(getNextRandomVerse("all", settingsRef.current));
    // Test flash
    if (settingsRef.current.flashLed) {
      let count = 0;
      const flashInterval = setInterval(() => {
        setIsFlashing((prev) => !prev);
        count++;
        if (count > 5) {
          clearInterval(flashInterval);
          setIsFlashing(false);
        }
      }, 150);
    }
    // Test sound and vibration
    try {
      const soundType = settingsRef.current.sound;
      if (soundType && soundType !== "Silencioso") {
        const AudioContext =
          window.AudioContext || (window).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const playTone = (
            freq: number,
            type: OscillatorType,
            duration: number,
            startTime: number,
          ) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(
              freq,
              ctx.currentTime + startTime,
            );
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
            gain.gain.linearRampToValueAtTime(
              0.5,
              ctx.currentTime + startTime + 0.05,
            );
            gain.gain.exponentialRampToValueAtTime(
              0.01,
              ctx.currentTime + startTime + duration,
            );
            osc.start(ctx.currentTime + startTime);
            osc.stop(ctx.currentTime + startTime + duration);
          };
          if (soundType === "Sino") {
            playTone(880, "sine", 1, 0);
            playTone(1108.73, "sine", 1, 0.2);
          } else if (soundType === "Harpa") {
            playTone(523.25, "triangle", 0.5, 0);
            playTone(659.25, "triangle", 0.5, 0.1);
            playTone(783.99, "triangle", 0.5, 0.2);
            playTone(1046.5, "triangle", 1, 0.3);
          } else if (soundType === "Celeste") {
            playTone(1046.5, "sine", 0.8, 0);
            playTone(1318.51, "sine", 0.8, 0.15);
            playTone(1567.98, "sine", 1.5, 0.3);
          } else {
            playTone(880, "sine", 0.5, 0);
          }
        }
      }
    } catch (e) {}
    if (settingsRef.current.vibrate && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch (e) {}
    }
  }, []);

  const handleOpenAbout = useCallback`
  );
}

code = code.replace(regex, 'onTestPopup={handleTestPopup}');

fs.writeFileSync(path, code);

// src/components/ui/AudioChimes.ts
// Web Audio API synthesized festive chimes and bells
// No external MP3 files needed; instant load and reliable across browsers.

class ChimeAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play a bell/chime note at a specific frequency
   */
  public playBell(freq: number, duration: number = 1.2, gainValue: number = 0.25) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Bell harmonics
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.76, now); // Metallic shimmer harmonic

      gain.gain.setValueAtTime(gainValue, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gain2.gain.setValueAtTime(gainValue * 0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.5);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio autoplay policy or device restrictions
    }
  }

  /**
   * Play a celebratory festive chime sequence (E5 - E5 - E5 / Jingle Bells chord)
   */
  public playJingleChime() {
    if (this.isMuted) return;
    const notes = [659.25, 659.25, 659.25, 659.25, 659.25, 659.25, 659.25, 783.99, 523.25, 587.33, 659.25];
    const timings = [0, 200, 400, 700, 900, 1100, 1400, 1600, 1850, 2050, 2300];

    timings.forEach((t, i) => {
      setTimeout(() => {
        this.playBell(notes[i], 0.7, 0.18);
      }, t);
    });
  }

  /**
   * Play a single magical twinkle chime
   */
  public playTwinkle() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBell(freq, 0.9, 0.15);
      }, idx * 110);
    });
  }

  /**
   * Play warm festive chord on wish creation
   */
  public playCelebrationChord() {
    if (this.isMuted) return;
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C Maj 7
    chord.forEach((freq, i) => {
      setTimeout(() => {
        this.playBell(freq, 1.8, 0.18);
      }, i * 90);
    });
  }
}

export const audioChimes = new ChimeAudioService();


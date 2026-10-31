// src/components/ui/AudioChimes.ts
// Web Audio API synthesized festive chimes and bells
// No external MP3 files needed; instant load and reliable across browsers.

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

class ChimeAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private themeTimers: number[] = [];
  private themeTimer: number | null = null;
  private themePlaying = false;

  /**
   * [frequency, offset ms, bell duration s] — the traditional carol in G major,
   * three "we wish you" phrases and the "and a happy new year" cadence.
   */
  private static readonly THEME: ReadonlyArray<readonly [number, number, number]> = [
    [293.66, 0, 0.8], [392.0, 400, 0.8], [392.0, 800, 0.8], [440.0, 1200, 0.8],
    [392.0, 1600, 0.8], [369.99, 2000, 0.8], [329.63, 2400, 1.6],
    [329.63, 3800, 0.8], [440.0, 4200, 0.8], [440.0, 4600, 0.8], [493.88, 5000, 0.8],
    [440.0, 5400, 0.8], [392.0, 5800, 0.8], [369.99, 6200, 1.6],
    [293.66, 7600, 0.8], [493.88, 8000, 0.8], [493.88, 8400, 0.8], [523.25, 8800, 0.8],
    [493.88, 9200, 0.8], [440.0, 9600, 0.8], [392.0, 10000, 1.4],
    [329.63, 11400, 0.8], [293.66, 11800, 0.8], [293.66, 12200, 0.8], [329.63, 12600, 0.8],
    [440.0, 13000, 0.8], [369.99, 13400, 0.8], [392.0, 13800, 2.4],
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
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
    if (!ctx || ctx.state !== 'running') return;

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

  /** True when the browser has already granted this page audio permission. */
  public isAudioReady(): boolean {
    const ctx = this.getContext();
    return !!ctx && ctx.state === 'running';
  }

  /**
   * Autoplay is gated behind a user gesture: calling this from the first tap or
   * keypress unlocks the bells. Resolves true once sound is actually flowing.
   */
  public async resumeAudio(): Promise<boolean> {
    const ctx = this.getContext();
    if (!ctx) return false;
    try {
      await ctx.resume();
    } catch {
      // Older engines reject resume() outside a gesture
    }
    return ctx.state === 'running';
  }

  /** Length of one full pass through the carol, in ms. */
  public getThemeDuration(): number {
    const last = ChimeAudioService.THEME[ChimeAudioService.THEME.length - 1];
    return last[1] + last[2] * 1000;
  }

  /** Schedule one pass; every timer is tracked so stopTheme() can cancel it. */
  private scheduleThemePass(): void {
    ChimeAudioService.THEME.forEach(([freq, offset, dur]) => {
      this.themeTimers.push(window.setTimeout(() => this.playBell(freq, dur, 0.22), offset));
    });
  }

  /**
   * Loop the carol. Browsers block the AudioContext until a gesture, so this is
   * only ever called after audio has been unlocked by a user gesture.
   */
  public startTheme(gapMs = 1800): void {
    if (typeof window === 'undefined' || this.themePlaying) return;
    this.themePlaying = true;
    const run = () => {
      this.themeTimers = [];
      this.scheduleThemePass();
      this.themeTimer = window.setTimeout(run, this.getThemeDuration() + gapMs);
    };
    run();
  }

  public stopTheme(): void {
    this.themePlaying = false;
    this.themeTimers.forEach((id) => window.clearTimeout(id));
    this.themeTimers = [];
    if (this.themeTimer !== null) {
      window.clearTimeout(this.themeTimer);
      this.themeTimer = null;
    }
  }

  public isThemePlaying(): boolean {
    return this.themePlaying;
  }

  /**
   * Play a single magical twinkle chime
   */
  public playTwinkle() {    if (this.isMuted) return;
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

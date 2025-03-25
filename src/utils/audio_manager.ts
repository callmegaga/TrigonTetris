import { ref } from 'vue';

export enum SoundEffect {
  CHEER = 'cheer',
  SHOOO = 'shoooo',
  JUMP = 'jump',
  ROTATE = 'rotate',
  MOVE = 'move',
  FLIP = 'flip'
}

interface AudioConfig {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

class AudioManager {
  private static instance: AudioManager;
  private audioMap: Map<SoundEffect, HTMLAudioElement> = new Map();
  private isMuted = ref(false);
  private masterVolume = ref(1.0);
  private isLoading = ref(false);
  private loadedCount = ref(0);
  private totalCount = ref(0);

  private constructor() {
    this.initializeAudio();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initializeAudio() {
    const audioConfigs: Record<SoundEffect, AudioConfig> = {
      [SoundEffect.CHEER]: { volume: 1.0, preload: true },
      [SoundEffect.SHOOO]: { volume: 1.0, preload: true },
      [SoundEffect.JUMP]: { volume: 0.8, preload: true },
      [SoundEffect.ROTATE]: { volume: 0.3, preload: true },
      [SoundEffect.MOVE]: { volume: 0.3, preload: true },
      [SoundEffect.FLIP]: { volume: 0.2, preload: true }
    };

    this.totalCount.value = Object.keys(audioConfigs).length;
    this.isLoading.value = true;

    Object.entries(audioConfigs).forEach(([effect, config]) => {
      const audio = new Audio(import.meta.env.BASE_URL + `/audio/${effect}.${effect === 'cheer' || effect === 'shoooo' ? 'mp3' : 'flac'}`);
      audio.volume = config.volume || 1.0;
      audio.loop = config.loop || false;

      if (config.preload) {
        audio.addEventListener('canplaythrough', () => {
          this.loadedCount.value++;
          if (this.loadedCount.value === this.totalCount.value) {
            this.isLoading.value = false;
          }
        });
      }

      this.audioMap.set(effect as SoundEffect, audio);
    });
  }

  public play(effect: SoundEffect): void {
    if (this.isMuted.value) return;

    const audio = this.audioMap.get(effect);
    if (audio) {
      // 克隆音频元素以支持重叠播放
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = audio.volume * this.masterVolume.value;
      
      audioClone.addEventListener('ended', () => {
        audioClone.remove();
      });

      audioClone.play().catch(error => {
        console.error(`Failed to play sound effect ${effect}:`, error);
        audioClone.remove();
      });
    }
  }

  public setMute(muted: boolean): void {
    this.isMuted.value = muted;
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume.value = Math.max(0, Math.min(1, volume));
  }

  public getMute(): boolean {
    return this.isMuted.value;
  }

  public getMasterVolume(): number {
    return this.masterVolume.value;
  }

  public getLoadingStatus(): { isLoading: boolean; loadedCount: number; totalCount: number } {
    return {
      isLoading: this.isLoading.value,
      loadedCount: this.loadedCount.value,
      totalCount: this.totalCount.value
    };
  }
}

export const audioManager = AudioManager.getInstance(); 
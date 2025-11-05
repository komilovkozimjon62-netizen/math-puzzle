export enum SoundType {
  Click = 'click',
  Merge = 'merge',
  Error = 'error',
  GameOver = 'gameOver',
  UIClick = 'uiClick',
  Background = 'background',
  Shuffle = 'shuffle',
}

const soundUrls: Record<SoundType, string> = {
  [SoundType.Click]: 'https://cdn.pixabay.com/audio/2022/03/15/audio_22d1596c4d.mp3',
  [SoundType.Merge]: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3b09232c7.mp3',
  [SoundType.Error]: 'https://cdn.pixabay.com/audio/2021/08/04/audio_a440c70562.mp3',
  [SoundType.GameOver]: 'https://cdn.pixabay.com/https://cdn.pixabay.com/download/audio/2025/06/01/audio_2160b193f5.mp3?filename=game-over-kid-voice-clip-352738.mp3',
  [SoundType.UIClick]: 'https://cdn.pixabay.com/audio/2022/11/17/audio_88f208c54c.mp3',
  [SoundType.Background]: 'https://cdn.pixabay.com/download/audio/2022/03/13/audio_1ae6a42fab.mp3?filename=tam-xa-mai-56766.mp3',
  [SoundType.Shuffle]: 'https://cdn.pixabay.com/audio/2022/02/08/audio_0c09e2376e.mp3'
};

/**
 * Plays a sound effect.
 * @param sound The type of sound to play.
 */
export const playSound = (sound: SoundType): void => {
  try {
    const audio = new Audio(soundUrls[sound]);
    // Set volume to be less intrusive
    audio.volume = 0.5;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Autoplay was prevented.
        console.error("Audio play was prevented: ", error);
      });
    }
  } catch (e) {
    console.error("Could not play sound", e);
  }
};

/**
 * Creates and plays looping background music.
 * @returns The audio element instance.
 */
export const startBackgroundMusic = (): HTMLAudioElement | null => {
  try {
    const audio = new Audio(soundUrls[SoundType.Background]);
    audio.loop = true;
    audio.volume = 0.3;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Background audio play was prevented: ", error);
      });
    }
    return audio;
  } catch (e) {
    console.error("Could not play background music", e);
    return null;
  }
};

/**
 * Stops the background music.
 * @param audio The audio element to stop.
 */
export const stopBackgroundMusic = (audio: HTMLAudioElement | null): void => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};
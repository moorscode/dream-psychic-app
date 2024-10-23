import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const useSounds = () => {
    const [abilitySound, setAbilitySound] = useState<Audio.Sound | null>(null);
    const [spellSound, setSpellSound] = useState<Audio.Sound | null>(null);
    const [powerSound, setPowerSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        loadSounds();
        return () => {
            unloadSounds();
        };
    }, []);

    const loadSounds = async () => {
        const abilityAudio = new Audio.Sound();
        const spellAudio = new Audio.Sound();
        const powerAudio = new Audio.Sound();

        try {
            await abilityAudio.loadAsync(require('../assets/ability-sound.mp3'));
            await spellAudio.loadAsync(require('../assets/spell-sound.mp3'));
            await powerAudio.loadAsync(require('../assets/power-sound.mp3'));

            setAbilitySound(abilityAudio);
            setSpellSound(spellAudio);
            setPowerSound(powerAudio);
        } catch (error) {
            console.error('Error loading sounds:', error);
        }
    };

    const unloadSounds = async () => {
        if (abilitySound) await abilitySound.unloadAsync();
        if (spellSound) await spellSound.unloadAsync();
        if (powerSound) await powerSound.unloadAsync();
    };

    const playSound = async (type: 'ability' | 'spell' | 'power') => {
        const sound = type === 'ability' ? abilitySound : type === 'spell' ? spellSound : powerSound;
        if (sound) {
            try {
                await sound.setPositionAsync(0);
                await sound.playAsync();
            } catch (error) {
                console.error('Error playing sound:', error);
            }
        }
    };

    return { playSound };
};

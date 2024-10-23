export interface Item {
    id: string;
    name: string;
    effect: string;
    requiredLevel: number;
    requirements?: string;
    type: 'ability' | 'spell' | 'power';
    cost?: number;
    level?: number;
    restoreAmount?: number;
    enabled: boolean;
}

export const initialItems: Item[] = [
    // Abilities
    {
        id: 'ability-lucid-dreaming',
        name: 'Lucid Dreaming',
        effect: 'You gain the ability to control your own dreams. While sleeping, you can shape the content of your dreams, potentially gaining insight or information. This ability allows you to make Intelligence or Wisdom checks in your dreams to recall knowledge or gain intuition about problems you\'re facing in the waking world.',
        requiredLevel: 1,
        type: 'ability',
        cost: 1,
        enabled: true,
        requirements: 'Must be asleep'
    },
    {
        id: 'ability-dream-scan',
        name: 'Dream Scan',
        effect: 'You can delve into the dreams of others, gleaning surface thoughts and emotions. By expending phrenic pool points, you can make a Wisdom check to interpret the symbolism in the target\'s dreams. Success might reveal the target\'s current emotional state, recent significant events, or pressing concerns.',
        requiredLevel: 3,
        type: 'ability',
        cost: 2,
        enabled: true,
        requirements: 'Target must be asleep and within 30 feet'
    },
    {
        id: 'ability-dream-travel',
        name: 'Dream Travel',
        effect: 'You can project your consciousness into the dreams of others. While in another\'s dream, you can interact with the dreamer and the dream environment. You can attempt to influence the dream\'s direction or extract deeper information from the dreamer\'s subconscious. Be warned: hostile actions in a dream might provoke psychic backlash.',
        requiredLevel: 5,
        type: 'ability',
        cost: 3,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    // Spells
    {
        id: 'spell-dream',
        name: 'Dream',
        effect: 'This spell allows you to enter a creature\'s dream and deliver a message. You can appear as an image of yourself or as any other image the target would recognize. The target remembers the dream perfectly upon waking. The message can be up to ten minutes long and is delivered instantaneously to the target\'s dream.',
        requiredLevel: 1,
        type: 'spell',
        level: 1,
        restoreAmount: 1,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    {
        id: 'spell-nightmare',
        name: 'Nightmare',
        effect: 'You send horrible visions to a sleeping target, preventing restful sleep. The target must make a Will save or wake up fatigued and unable to cast spells or use spell-like abilities for 24 hours. The nightmare also deals 1d10 points of damage. Only creatures with Intelligence scores of 6 or higher can be affected.',
        requiredLevel: 3,
        type: 'spell',
        level: 2,
        restoreAmount: 2,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    {
        id: 'spell-dream-council',
        name: 'Dream Council',
        effect: 'This advanced version of the dream spell allows you to communicate with multiple sleeping creatures simultaneously. You can deliver the same message to all targets or tailor individual messages. Each target remembers the dream upon waking. This spell is particularly useful for coordinating plans among scattered allies.',
        requiredLevel: 5,
        type: 'spell',
        level: 3,
        restoreAmount: 3,
        enabled: true,
        requirements: 'Targets must be asleep'
    },
    // Powers
    {
        id: 'power-mindscape',
        name: 'Mindscape',
        effect: 'You create a shared dream space that multiple creatures can inhabit. Within this space, participants can interact as if they were in the same physical location. The mindscape can be shaped according to your will, potentially recreating real locations or fantastical environments. This power is useful for secure long-distance communication or shared problem-solving.',
        requiredLevel: 1,
        type: 'power',
        level: 1,
        enabled: true,
        requirements: 'Targets must be willing and asleep'
    },
    {
        id: 'power-dreamshape',
        name: 'Dreamshape',
        effect: 'This power allows you to alter the content and environment of an existing dream. You can change the dream\'s setting, introduce or remove dream figures, and influence the overall tone of the dream. Skilled use of this power can be used to comfort allies, manipulate information in the target\'s subconscious, or even implant suggestions that persist after waking.',
        requiredLevel: 3,
        type: 'power',
        level: 2,
        enabled: true,
        requirements: 'Must be within an existing dream'
    },
    {
        id: 'power-dream-sight',
        name: 'Dream Sight',
        effect: 'You establish a sensory link with a sleeping creature, allowing you to see, hear, and potentially even feel what they are experiencing in their current location. This power can be used for remote reconnaissance, but be aware that particularly shocking or painful experiences felt by the target may resonate back to you, potentially causing psychic damage.',
        requiredLevel: 5,
        type: 'power',
        level: 3,
        enabled: true,
        requirements: 'Target must be asleep'
    }
];
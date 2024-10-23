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
        id: 'ability-dreamshaper',
        name: 'Dreamshaper',
        effect: 'Modify a dream spell to alter its effects or duration. This ability allows you to subtly change the nature of a dream you\'re influencing.',
        requiredLevel: 1,
        type: 'ability',
        cost: 1,
        enabled: true,
        requirements: 'Must be used in conjunction with a dream spell'
    },
    {
        id: 'ability-dream-tinkerer',
        name: 'Dream Tinkerer',
        effect: 'Significantly alter a dream spell, changing its fundamental nature or target. This ability allows for more drastic modifications to dreams.',
        requiredLevel: 3,
        type: 'ability',
        cost: 2,
        enabled: true,
        requirements: 'Must be used in conjunction with a dream spell'
    },
    {
        id: 'ability-dream-weaver',
        name: 'Dream Weaver',
        effect: 'Completely reshape a dream spell, potentially creating entirely new scenarios or affecting multiple dreamers simultaneously.',
        requiredLevel: 6,
        type: 'ability',
        cost: 3,
        enabled: true,
        requirements: 'Must be used in conjunction with a dream spell'
    },
    // Spells
    {
        id: 'spell-detect-psychic-significance',
        name: 'Detect Psychic Significance',
        effect: 'Sense the presence and strength of psychic auras in the immediate vicinity. This spell can reveal recent psychic activity or the presence of psychically active beings.',
        requiredLevel: 1,
        type: 'spell',
        level: 1,
        restoreAmount: 1,
        enabled: true,
        requirements: 'Requires a focus item, such as a small crystal or mirror'
    },
    {
        id: 'spell-dream-scan',
        name: 'Dream Scan',
        effect: 'Gain surface-level information from a sleeping creature\'s current dream. This spell allows you to glimpse fragments of the dream without disturbing the dreamer.',
        requiredLevel: 1,
        type: 'spell',
        level: 1,
        restoreAmount: 1,
        enabled: true,
        requirements: 'Target must be asleep and within 30 feet'
    },
    {
        id: 'spell-nightmare',
        name: 'Nightmare',
        effect: 'Induce a frightening or unsettling dream in a sleeping target. The nightmare can cause mental fatigue and potentially reveal the target\'s fears or anxieties.',
        requiredLevel: 3,
        type: 'spell',
        level: 2,
        restoreAmount: 2,
        enabled: true,
        requirements: 'Target must be asleep and within 60 feet'
    },
    {
        id: 'spell-dream-messenger',
        name: 'Dream Messenger',
        effect: 'Send a short message or vision to a sleeping creature. The message appears as part of the target\'s dream and can be remembered upon waking.',
        requiredLevel: 5,
        type: 'spell',
        level: 3,
        restoreAmount: 3,
        enabled: true,
        requirements: 'Must know the target\'s name and general location'
    },
    // Powers
    {
        id: 'power-lullaby',
        name: 'Lullaby',
        effect: 'Emit a soothing psychic melody that makes the target drowsy. This power can potentially put a target to sleep if they fail a willpower check.',
        requiredLevel: 1,
        type: 'power',
        level: 1,
        enabled: true,
        requirements: 'Target must be within line of sight and able to hear'
    },
    {
        id: 'power-sleep',
        name: 'Sleep',
        effect: 'Directly influence a target\'s mind to induce sleep. This power is more potent than Lullaby but requires more focus and energy.',
        requiredLevel: 3,
        type: 'power',
        level: 2,
        enabled: true,
        requirements: 'Target must be within 30 feet and not in combat'
    },
    {
        id: 'power-dream-link',
        name: 'Dream Link',
        effect: 'Establish a mental connection with a sleeping creature, allowing for two-way communication through dreams. This power enables more complex interactions within the dream state.',
        requiredLevel: 5,
        type: 'power',
        level: 3,
        enabled: true,
        requirements: 'Target must be asleep and you must have previously encountered them'
    },
    // Additional Spells
    {
        id: 'spell-dream-leech',
        name: 'Dream Leech',
        effect: 'Siphon psychic energy from a sleeping target\'s dreams. This spell allows you to restore your own phrenic pool by drawing power from the target\'s subconscious, potentially leaving them mentally fatigued.',
        requiredLevel: 7,
        type: 'spell',
        level: 4,
        restoreAmount: 4,
        enabled: true,
        requirements: 'Target must be asleep and within 30 feet. May have negative effects on the target.'
    },
    {
        id: 'spell-oneiromancy',
        name: 'Oneiromancy',
        effect: 'Interpret dreams to gain insight into future events or hidden truths. This powerful divination spell allows you to extract meaningful information from the chaotic realm of dreams.',
        requiredLevel: 9,
        type: 'spell',
        level: 5,
        restoreAmount: 5,
        enabled: true,
        requirements: 'Requires a personal item from the target and at least an hour of uninterrupted concentration.'
    },

    // Additional Powers
    {
        id: 'power-mind-heist',
        name: 'Mind Heist',
        effect: 'Infiltrate a sleeping target\'s mind to extract specific information or plant an idea. This advanced power allows for deep exploration of the target\'s subconscious and subtle manipulation of their thoughts.',
        requiredLevel: 7,
        type: 'power',
        level: 4,
        enabled: true,
        requirements: 'Target must be in a deep sleep. Requires intense concentration and carries risks of psychic backlash.'
    },
    {
        id: 'power-waking-dream',
        name: 'Waking Dream',
        effect: 'Induce a dream-like state in a conscious target, blurring the lines between reality and dreams. This power can be used to disorient enemies or to help allies access their subconscious while awake.',
        requiredLevel: 9,
        type: 'power',
        level: 5,
        enabled: true,
        requirements: 'Target must be within line of sight. Effect lasts for a short duration and can be resisted with a strong will.'
    }
];
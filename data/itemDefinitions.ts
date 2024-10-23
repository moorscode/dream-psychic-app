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
        effect: 'You can attempt to control your dreams. Make a Will save (DC 20) when you fall asleep. If successful, you can control the content of your dreams and potentially gain insight or information.',
        requiredLevel: 1,
        type: 'ability',
        cost: 1,
        enabled: true,
        requirements: 'Must be asleep'
    },
    {
        id: 'ability-dream-scan',
        name: 'Dream Scan',
        effect: 'You can scan the dreams of a sleeping creature within 30 feet. Make a Wisdom check (DC 15 + target\'s HD) to gain insight into their current emotional state or recent experiences.',
        requiredLevel: 3,
        type: 'ability',
        cost: 2,
        enabled: true,
        requirements: 'Target must be asleep and within 30 feet'
    },
    {
        id: 'ability-dreamshaper',
        name: 'Dreamshaper',
        effect: 'You can alter the content of a sleeping creature\'s dreams. Make a Will save (DC 20) to change the dream\'s setting, introduce or remove dream figures, or influence the overall tone.',
        requiredLevel: 5,
        type: 'ability',
        cost: 3,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    {
        id: 'ability-dream-travel',
        name: 'Dream Travel',
        effect: 'You can enter the dreams of others. While in another\'s dream, you can interact with the dreamer and the dream environment. Hostile actions may provoke psychic backlash.',
        requiredLevel: 7,
        type: 'ability',
        cost: 4,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    // Spells
    {
        id: 'spell-sleep',
        name: 'Sleep',
        effect: 'This spell causes a magical slumber to come upon 4 HD of creatures. Creatures with the fewest HD are affected first. Among creatures with equal HD, those who are closest to the spell\'s point of origin are affected first. Affected creatures fall into a natural sleep and can be awakened normally. Sleep does not affect unconscious creatures, constructs, or undead creatures.',
        requiredLevel: 1,
        type: 'spell',
        level: 1,
        restoreAmount: 1,
        enabled: true,
        requirements: 'Target must be within range (90 feet)'
    },
    {
        id: 'spell-dream',
        name: 'Dream',
        effect: 'You, or a messenger you touch, send a message to others in the form of a dream. At the beginning of the spell, you must name the recipient or identify them by some title that leaves no doubt as to identity. The messenger then enters a trance, appears in the intended recipient\'s dream, and delivers the message. The message can be up to twenty-five words long. The recipient recognizes you as the sender if they know you.',
        requiredLevel: 3,
        type: 'spell',
        level: 2,
        restoreAmount: 2,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    {
        id: 'spell-nightmare',
        name: 'Nightmare',
        effect: 'You send a hideous and unsettling phantasmal vision to a specific creature that you name or otherwise specifically designate. The nightmare prevents restful sleep and causes 1d10 points of damage. The subject is also fatigued and unable to regain arcane spells for the next 24 hours. The nightmare leaves the subject shaken for 1d4 × 10 minutes after waking. Dispel evil cast on the subject while you are casting the spell dispels the nightmare and stuns you for 10 minutes per caster level of the dispel evil.',
        requiredLevel: 5,
        type: 'spell',
        level: 3,
        restoreAmount: 3,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    {
        id: 'spell-dream-council',
        name: 'Dream Council',
        effect: 'As dream, but you can affect multiple creatures with the same message. You can include up to one creature per caster level in the dream council. All recipients receive the same message, which can be up to twenty-five words long. Each recipient recognizes you as the sender if they know you.',
        requiredLevel: 7,
        type: 'spell',
        level: 4,
        restoreAmount: 4,
        enabled: true,
        requirements: 'Targets must be asleep'
    },
    {
        id: 'spell-dream-leech',
        name: 'Dream Leech',
        effect: 'You invade the dreams of a sleeping creature and siphon their mental energy. Make a Will save (DC 15 + target\'s HD). If successful, you drain 1d4 temporary Wisdom from the target and gain a +2 bonus to all Intelligence-based skill checks for 1 hour per point drained. The target awakens feeling unrested and suffers a -2 penalty to Will saves for 24 hours.',
        requiredLevel: 6,
        type: 'spell',
        level: 3,
        restoreAmount: 3,
        enabled: true,
        requirements: 'Target must be asleep and within 30 feet'
    },
    {
        id: 'spell-oneiromancy',
        name: 'Oneiromancy',
        effect: 'You enter a trance-like state and gain prophetic visions from the realm of dreams. Make an Intelligence check (DC 20). If successful, you gain insight into a specific question or problem you focus on. The GM provides cryptic but helpful information. Critical success (DC 25+) provides clearer visions. This spell can only be cast once per week.',
        requiredLevel: 8,
        type: 'spell',
        level: 4,
        restoreAmount: 4,
        enabled: true,
        requirements: 'Must be in a quiet, undisturbed environment'
    },
    {
        id: 'spell-mind-heist',
        name: 'Mind Heist',
        effect: 'You project your consciousness into the mind of a sleeping creature to steal a specific memory or piece of information. Make an opposed Will save against the target. If successful, you can extract one memory or piece of information the target knows. Critical success allows you to take the information without the target realizing it\'s been stolen. Failure alerts the target and may cause psychic damage to you.',
        requiredLevel: 9,
        type: 'spell',
        level: 5,
        restoreAmount: 5,
        enabled: true,
        requirements: 'Target must be asleep and you must have some prior knowledge of the target'
    },
    // Powers
    {
        id: 'power-mindscape',
        name: 'Mindscape',
        effect: 'You create a shared dream space that you and one or more other creatures can enter. You can shape this space to your will.',
        requiredLevel: 1,
        type: 'power',
        level: 1,
        enabled: true,
        requirements: 'Targets must be willing and asleep'
    },
    {
        id: 'power-dream-shield',
        name: 'Dream Shield',
        effect: 'You create a barrier around your mind while you sleep, granting you a +4 bonus to Will saves against mind-affecting effects and dream manipulation.',
        requiredLevel: 3,
        type: 'power',
        level: 2,
        enabled: true,
        requirements: 'Must be asleep'
    },
    {
        id: 'power-oneiric-horror',
        name: 'Oneiric Horror',
        effect: 'You manifest a terrifying dream creature to attack your enemies. The creature has your BAB and saves, and deals 1d8 + your Wisdom modifier in damage.',
        requiredLevel: 5,
        type: 'power',
        level: 3,
        enabled: true,
        requirements: 'Must be in combat'
    },
    {
        id: 'power-dream-sight',
        name: 'Dream Sight',
        effect: 'You can see through the eyes of a sleeping creature, gaining visual information about its surroundings.',
        requiredLevel: 7,
        type: 'power',
        level: 4,
        enabled: true,
        requirements: 'Target must be asleep'
    },
    {
        id: 'power-waking-dream',
        name: 'Waking Dream',
        effect: 'You can briefly pull a conscious target into a dream-like state. The target must make a Will save (DC 10 + your caster level + your Wisdom modifier) or be confused for 1d4 rounds. On a successful save, the target is dazed for 1 round. This power can be used once per day per target.',
        requiredLevel: 9,
        type: 'power',
        level: 5,
        enabled: true,
        requirements: 'Target must be conscious and within line of sight'
    }
];
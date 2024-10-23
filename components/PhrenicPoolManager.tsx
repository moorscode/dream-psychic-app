import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhrenicPoolSpheres from './PhrenicPoolSpheres';
import ItemCard from './ItemCard';
import { useSounds } from '../hooks/useSounds';

interface Item {
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

const PhrenicPoolManager: React.FC = () => {
    const [level, setLevel] = useState(1);
    const [phrenicPool, setPhrenicPool] = useState(0);
    const [items, setItems] = useState<Item[]>([]);
    const [activatedSpells, setActivatedSpells] = useState<string[]>([]);
    const [isSpellManagementVisible, setIsSpellManagementVisible] = useState(false);
    const [showAllLevels, setShowAllLevels] = useState(false);

    const { playSound } = useSounds();

    const calculatePhrenicPool = useCallback((characterLevel: number) => {
        return Math.floor(characterLevel / 3) + 3;
    }, []);

    useEffect(() => {
        loadSavedData();
    }, []);

    useEffect(() => {
        saveData();
    }, [level, phrenicPool, activatedSpells]);

    const loadSavedData = async () => {
        try {
            const [savedLevel, savedPhrenicPool, savedActivatedSpells] = await Promise.all([
                AsyncStorage.getItem('level'),
                AsyncStorage.getItem('phrenicPool'),
                AsyncStorage.getItem('activatedSpells')
            ]);

            const newLevel = savedLevel ? Math.min(Math.max(parseInt(savedLevel, 10), 1), 20) : 1;
            setLevel(newLevel);

            if (savedPhrenicPool) {
                setPhrenicPool(Math.min(Math.max(parseInt(savedPhrenicPool, 10), 0), calculatePhrenicPool(newLevel)));
            } else {
                setPhrenicPool(calculatePhrenicPool(newLevel)); // Start with full phrenic pool if not saved
            }

            if (savedActivatedSpells) {
                setActivatedSpells(JSON.parse(savedActivatedSpells));
            }

            setItems(initialItems);
        } catch (error) {
            console.error('Error loading saved data:', error);
            setItems(initialItems);
            setPhrenicPool(calculatePhrenicPool(level)); // Start with full phrenic pool on error
        }
    };

    const initialItems: Item[] = [
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
        }
    ];

    const saveData = async () => {
        try {
            const data = {
                level: level.toString(),
                phrenicPool: phrenicPool.toString(),
                activatedSpells: JSON.stringify(activatedSpells)
            };
            await AsyncStorage.multiSet(Object.entries(data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const useAbility = useCallback((cost: number) => {
        if (phrenicPool >= cost) {
            setPhrenicPool(prev => prev - cost);
            playSound('ability');
        }
    }, [phrenicPool, playSound]);

    const castSpell = useCallback((spell: Item) => {
        if (level >= spell.requiredLevel) {
            setPhrenicPool(prev => Math.min(calculatePhrenicPool(level), prev + (spell.restoreAmount || 0)));
            playSound('spell');
            Alert.alert('Success!', `${spell.name} was cast successfully. Restored ${spell.restoreAmount} point(s) to the phrenic pool.`);
        } else {
            Alert.alert('Level Too Low', `You need to be at least level ${spell.requiredLevel} to cast ${spell.name}.`);
        }
    }, [level, calculatePhrenicPool, playSound]);

    const usePower = useCallback((power: Item) => {
        if (level >= power.requiredLevel) {
            playSound('power');
            Alert.alert('Power Used', `${power.name} (Level ${power.level})\n\nEffect: ${power.effect}`);
        } else {
            Alert.alert('Level Too Low', `You need to be at least level ${power.requiredLevel} to use ${power.name}.`);
        }
    }, [level, playSound]);

    const toggleItemEnabled = useCallback((id: string) => {
        setActivatedSpells(prevActivatedSpells => {
            if (prevActivatedSpells.includes(id)) {
                return prevActivatedSpells.filter(spellId => spellId !== id);
            } else {
                return [...prevActivatedSpells, id];
            }
        });
    }, []);

    const isItemAvailable = useCallback((item: Item) => {
        if (level < item.requiredLevel) return false;
        if (item.type === 'ability' && phrenicPool < (item.cost || 0)) return false;
        if ((item.type === 'spell' || item.type === 'power') && item.cost && phrenicPool < item.cost) return false;
        return true;
    }, [level, phrenicPool, showAllLevels]);

    const renderItems = useCallback(() => {
        return items
            .filter(item => item.type !== 'spell' || activatedSpells.includes(item.id))
            .filter(item => showAllLevels || item.requiredLevel <= level)
            .sort((a, b) => {
                if (a.requiredLevel !== b.requiredLevel) {
                    return a.requiredLevel - b.requiredLevel;
                }
                return (a.cost || 0) - (b.cost || 0);
            })
            .map(item => (
                <ItemCard
                    key={item.id}
                    item={item}
                    isAvailable={isItemAvailable(item)}
                    onUse={() => {
                        if (item.type === 'ability') useAbility(item.cost || 0);
                        else if (item.type === 'spell') castSpell(item);
                        else usePower(item);
                    }}
                    level={level}
                    phrenicPool={phrenicPool}
                />
            ));
    }, [items, activatedSpells, showAllLevels, level, isItemAvailable, useAbility, castSpell, usePower, phrenicPool]);

    const changeLevel = useCallback((increment: number) => {
        setLevel(prev => {
            const newLevel = Math.max(1, Math.min(20, prev + increment));
            setPhrenicPool(calculatePhrenicPool(newLevel));
            return newLevel;
        });
    }, [calculatePhrenicPool]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Phrenic Pool Manager</Text>
            <Text style={styles.subtitle}>Dream Discipline</Text>

            <View style={styles.levelContainer}>
                <TouchableOpacity onPress={() => changeLevel(-1)} style={styles.levelButton}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.levelText}>Level: {level}</Text>
                <TouchableOpacity onPress={() => changeLevel(1)} style={styles.levelButton}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.poolText}>Phrenic Pool: {phrenicPool}/{calculatePhrenicPool(level)}</Text>
            <PhrenicPoolSpheres total={calculatePhrenicPool(level)} used={calculatePhrenicPool(level) - phrenicPool} />

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Show All Levels:</Text>
                <Switch
                    value={showAllLevels}
                    onValueChange={setShowAllLevels}
                />
            </View>

            <TouchableOpacity
                style={styles.manageSpellsButton}
                onPress={() => setIsSpellManagementVisible(true)}
            >
                <Text style={styles.buttonText}>Manage Spells</Text>
            </TouchableOpacity>

            <View style={styles.cardContainer}>
                <Text style={styles.sectionTitle}>Abilities, Spells, and Powers:</Text>
                {renderItems()}
            </View>

            <TouchableOpacity style={styles.restoreButton} onPress={() => setPhrenicPool(calculatePhrenicPool(level))}>
                <Text style={styles.buttonText}>Restore Phrenic Pool</Text>
            </TouchableOpacity>

            <Modal
                visible={isSpellManagementVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsSpellManagementVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Manage Spells</Text>
                        <ScrollView style={styles.spellList}>
                            {items
                                .filter(item => item.type === 'spell')
                                .sort((a, b) => a.requiredLevel - b.requiredLevel)
                                .map(spell => (
                                    <View key={spell.id} style={styles.spellManagementItem}>
                                        <View style={styles.spellInfo}>
                                            <Text style={styles.spellName}>{spell.name}</Text>
                                            <Text style={styles.spellLevel}>Level: {spell.requiredLevel}</Text>
                                        </View>
                                        <Switch
                                            value={activatedSpells.includes(spell.id)}
                                            onValueChange={() => toggleItemEnabled(spell.id)}
                                        />
                                    </View>
                                ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setIsSpellManagementVisible(false)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    levelContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    levelButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#2980b9',
    },
    levelText: {
        fontSize: 18,
        marginHorizontal: 20,
    },
    poolText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cardContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        marginHorizontal: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    manageSpellsButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#45a049',
    },
    restoreButton: {
        backgroundColor: '#e74c3c',
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#c0392b',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    spellList: {
        maxHeight: '80%',
    },
    spellManagementItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 10,
    },
    spellInfo: {
        flex: 1,
    },
    spellName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    spellLevel: {
        fontSize: 14,
        color: '#666',
    },
    closeModalButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#d32f2f',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    toggleLabel: {
        marginRight: 10,
        fontSize: 16,
    },
});

export default PhrenicPoolManager;

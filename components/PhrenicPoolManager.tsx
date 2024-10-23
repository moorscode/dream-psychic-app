import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhrenicPoolSpheres from './PhrenicPoolSpheres';
import ItemCard from './ItemCard';
import { useSounds } from '../hooks/useSounds';
import { Item, initialItems } from '../data/itemDefinitions';

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

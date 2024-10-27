import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhrenicPoolSpheres from './PhrenicPoolSpheres';
import ItemCard from './ItemCard';
import { useSounds } from '../hooks/useSounds';
import { Item, initialItems } from '../data/itemDefinitions';
import { Snackbar } from 'react-native-paper';

const PhrenicPoolManager: React.FC = () => {
    const [state, setState] = useState({
        level: 1,
        phrenicPool: 0,
        items: initialItems,
        activatedSpells: [] as string[],
        isSpellManagementVisible: false,
        showAllLevels: false,
        activeAmplifications: [] as string[],
        snackbarVisible: false,
        snackbarMessage: '',
    });

    const { playSound } = useSounds();

    const calculatePhrenicPool = useCallback((characterLevel: number) => {
        return Math.floor(characterLevel / 3) + 3;
    }, []);

    useEffect(() => {
        loadSavedData();
    }, []);

    useEffect(() => {
        saveData();
    }, [state.level, state.phrenicPool, state.activatedSpells, state.activeAmplifications]);

    const loadSavedData = async () => {
        try {
            const [savedLevel, savedPhrenicPool, savedActivatedSpells, savedActiveAmplifications] = await Promise.all([
                AsyncStorage.getItem('level'),
                AsyncStorage.getItem('phrenicPool'),
                AsyncStorage.getItem('activatedSpells'),
                AsyncStorage.getItem('activeAmplifications')
            ]);

            const newLevel = savedLevel ? Math.min(Math.max(parseInt(savedLevel, 10), 1), 20) : 1;
            const newPhrenicPool = savedPhrenicPool
                ? Math.min(Math.max(parseInt(savedPhrenicPool, 10), 0), calculatePhrenicPool(newLevel))
                : calculatePhrenicPool(newLevel);

            setState(prev => ({
                ...prev,
                level: newLevel,
                phrenicPool: newPhrenicPool,
                activatedSpells: savedActivatedSpells ? JSON.parse(savedActivatedSpells) : [],
                activeAmplifications: savedActiveAmplifications ? JSON.parse(savedActiveAmplifications) : [],
            }));
        } catch (error) {
            console.error('Error loading saved data:', error);
            setState(prev => ({
                ...prev,
                phrenicPool: calculatePhrenicPool(prev.level)
            }));
        }
    };

    const saveData = async () => {
        try {
            const data = {
                level: state.level.toString(),
                phrenicPool: state.phrenicPool.toString(),
                activatedSpells: JSON.stringify(state.activatedSpells),
                activeAmplifications: JSON.stringify(state.activeAmplifications)
            };
            await AsyncStorage.multiSet(Object.entries(data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const useAbility = useCallback((cost: number) => {
        if (state.phrenicPool >= cost) {
            setState(prev => ({ ...prev, phrenicPool: prev.phrenicPool - cost }));
            playSound('ability');
        }
    }, [state.phrenicPool, playSound]);

    const castSpell = useCallback((spell: Item) => {
        if (state.level >= spell.requiredLevel) {
            const amplificationCost = state.activeAmplifications.length;
            if (state.phrenicPool >= amplificationCost) {
                setState(prev => ({
                    ...prev,
                    phrenicPool: Math.min(calculatePhrenicPool(prev.level), prev.phrenicPool + (spell.restoreAmount || 0) - amplificationCost),
                    activeAmplifications: [],
                    snackbarMessage: `Success! ${spell.name} was cast successfully. ${amplificationCost > 0 ? `Used ${amplificationCost} phrenic pool point(s) for amplifications. ` : ''}Restored ${spell.restoreAmount} point(s) to the phrenic pool.`,
                    snackbarVisible: true
                }));
                playSound('spell');
            } else {
                setState(prev => ({
                    ...prev,
                    snackbarMessage: `Not Enough Phrenic Pool: You need ${amplificationCost} phrenic pool point(s) to cast ${spell.name} with the active amplifications.`,
                    snackbarVisible: true
                }));
            }
        } else {
            setState(prev => ({
                ...prev,
                snackbarMessage: `Level Too Low: You need to be at least level ${spell.requiredLevel} to cast ${spell.name}.`,
                snackbarVisible: true
            }));
        }
    }, [state.level, state.phrenicPool, state.activeAmplifications, calculatePhrenicPool, playSound]);

    const usePower = useCallback((power: Item) => {
        if (state.level >= power.requiredLevel) {
            playSound('power');
            setState(prev => ({
                ...prev,
                snackbarMessage: `Power Used: ${power.name} (Level ${power.level})\n\nEffect: ${power.effect}`,
                snackbarVisible: true
            }));
        } else {
            setState(prev => ({
                ...prev,
                snackbarMessage: `Level Too Low: You need to be at least level ${power.requiredLevel} to use ${power.name}.`,
                snackbarVisible: true
            }));
        }
    }, [state.level, playSound]);

    const toggleItemEnabled = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            activatedSpells: prev.activatedSpells.includes(id)
                ? prev.activatedSpells.filter(spellId => spellId !== id)
                : [...prev.activatedSpells, id]
        }));
    }, []);

    const isItemAvailable = useCallback((item: Item) => {
        if (state.level < item.requiredLevel) return false;
        if (item.type === 'ability' && state.phrenicPool < (item.cost || 0)) return false;
        if (item.type === 'spell' && state.activeAmplifications.length > 0 && state.phrenicPool < state.activeAmplifications.length) return false;
        if (item.type === 'power' && item.cost && state.phrenicPool < item.cost) return false;
        return true;
    }, [state.level, state.phrenicPool, state.activeAmplifications]);

    const renderItems = useMemo(() => {
        return state.items
            .filter(item => item.type !== 'spell' || state.activatedSpells.includes(item.id))
            .filter(item => state.showAllLevels || item.requiredLevel <= state.level)
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
                    level={state.level}
                    phrenicPool={state.phrenicPool}
                    activeAmplifications={state.activeAmplifications}
                    toggleAmplification={toggleAmplification}
                />
            ));
    }, [state.items, state.activatedSpells, state.showAllLevels, state.level, state.phrenicPool, isItemAvailable, useAbility, castSpell, usePower]);

    const changeLevel = useCallback((increment: number) => {
        setState(prev => {
            const newLevel = Math.max(1, Math.min(20, prev.level + increment));
            return {
                ...prev,
                level: newLevel,
                phrenicPool: calculatePhrenicPool(newLevel)
            };
        });
    }, [calculatePhrenicPool]);

    const toggleAmplification = useCallback((amplificationId: string) => {
        setState(prev => ({
            ...prev,
            activeAmplifications: prev.activeAmplifications.includes(amplificationId)
                ? prev.activeAmplifications.filter(id => id !== amplificationId)
                : [...prev.activeAmplifications, amplificationId]
        }));
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Phrenic Pool Manager</Text>
            <Text style={styles.subtitle}>Dream Discipline</Text>

            <View style={styles.levelContainer}>
                <TouchableOpacity onPress={() => changeLevel(-1)} style={styles.levelButton}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.levelText}>Level: {state.level}</Text>
                <TouchableOpacity onPress={() => changeLevel(1)} style={styles.levelButton}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.poolText}>Phrenic Pool: {state.phrenicPool}/{calculatePhrenicPool(state.level)}</Text>
            <PhrenicPoolSpheres total={calculatePhrenicPool(state.level)} used={calculatePhrenicPool(state.level) - state.phrenicPool} />

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Show All Levels:</Text>
                <Switch
                    value={state.showAllLevels}
                    onValueChange={(value) => setState(prev => ({ ...prev, showAllLevels: value }))}
                />
            </View>

            <TouchableOpacity
                style={styles.manageSpellsButton}
                onPress={() => setState(prev => ({ ...prev, isSpellManagementVisible: true }))}
            >
                <Text style={styles.buttonText}>Manage Spells</Text>
            </TouchableOpacity>

            <View style={styles.cardContainer}>
                <Text style={styles.sectionTitle}>Abilities, Spells, and Powers:</Text>
                {renderItems}
            </View>

            <TouchableOpacity 
                style={styles.restoreButton} 
                onPress={() => setState(prev => ({ ...prev, phrenicPool: calculatePhrenicPool(prev.level), activeAmplifications: []}))}
            >
                <Text style={styles.buttonText}>Restore Phrenic Pool</Text>
            </TouchableOpacity>

            <Modal
                visible={state.isSpellManagementVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setState(prev => ({ ...prev, isSpellManagementVisible: false }))}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Manage Spells</Text>
                        <ScrollView style={styles.spellList}>
                            {state.items
                                .filter(item => item.type === 'spell')
                                .sort((a, b) => a.requiredLevel - b.requiredLevel)
                                .map(spell => (
                                    <View key={spell.id} style={styles.spellManagementItem}>
                                        <View style={styles.spellInfo}>
                                            <Text style={styles.spellName}>{spell.name}</Text>
                                            <Text style={styles.spellLevel}>Level: {spell.requiredLevel}</Text>
                                            <Text style={styles.spellDescription}>{spell.effect}</Text>
                                        </View>
                                        <Switch
                                            value={state.activatedSpells.includes(spell.id)}
                                            onValueChange={() => toggleItemEnabled(spell.id)}
                                        />
                                    </View>
                                ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setState(prev => ({ ...prev, isSpellManagementVisible: false }))}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Snackbar
                visible={state.snackbarVisible}
                onDismiss={() => setState(prev => ({ ...prev, snackbarVisible: false }))}
                duration={2000}
                style={styles.snackbar}
            >
                {state.snackbarMessage}
            </Snackbar>
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
    spellDescription: {
        fontSize: 14,
        marginTop: 5,
        color: '#333',
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
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default PhrenicPoolManager;

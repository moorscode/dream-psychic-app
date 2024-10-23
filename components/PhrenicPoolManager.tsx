import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch, Modal } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhrenicPoolSpheres from './PhrenicPoolSpheres';

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
  const [isSpellManagementVisible, setIsSpellManagementVisible] = useState(false);
  const [abilitySound, setAbilitySound] = useState<Audio.Sound | null>(null);
  const [spellSound, setSpellSound] = useState<Audio.Sound | null>(null);
  const [powerSound, setPowerSound] = useState<Audio.Sound | null>(null);
  const [showAllLevels, setShowAllLevels] = useState(false);

  useEffect(() => {
    loadSavedData();
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  useEffect(() => {
    saveData();
  }, [level, phrenicPool, items]);

  const loadSavedData = async () => {
    try {
      const savedLevel = await AsyncStorage.getItem('level');
      const savedPhrenicPool = await AsyncStorage.getItem('phrenicPool');
      const savedItems = await AsyncStorage.getItem('items');

      if (savedLevel) setLevel(parseInt(savedLevel, 10));
      if (savedPhrenicPool) setPhrenicPool(parseInt(savedPhrenicPool, 10));
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      } else {
        initializeItems();
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      initializeItems();
    }
  };

  const initializeItems = () => {
    const initialItems: Item[] = [
      // Add your initial items here
      { id: 'ability-1', name: 'Dreamshaper', effect: 'Modify dream spell', requiredLevel: 1, type: 'ability', cost: 1, enabled: true },
      { id: 'spell-1', name: 'Detect Psychic Significance', effect: 'Sense psychic auras', requiredLevel: 1, type: 'spell', level: 1, restoreAmount: 1, enabled: true },
      { id: 'power-1', name: 'Lullaby', effect: 'Makes target drowsy', requiredLevel: 1, type: 'power', level: 1, enabled: true },
      // ... add more items as needed
    ].sort((a, b) => a.requiredLevel - b.requiredLevel);
    
    setItems(initialItems);
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('level', level.toString());
      await AsyncStorage.setItem('phrenicPool', phrenicPool.toString());
      await AsyncStorage.setItem('items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

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

  const changeLevel = (increment: number) => {
    const newLevel = Math.max(1, Math.min(20, level + increment));
    setLevel(newLevel);
    setPhrenicPool(calculatePhrenicPool(newLevel));
  };

  const calculatePhrenicPool = (characterLevel: number) => {
        return Math.floor(characterLevel / 3) + 3;
  };

  const useAbility = (cost: number) => {
    if (phrenicPool >= cost) {
      setPhrenicPool(phrenicPool - cost);
      playSound('ability');
    }
  };

  const castSpell = (spell: Item) => {
    if (level >= spell.requiredLevel) {
      const success = Math.random() < 0.7; // 70% success rate
      if (success) {
        const newPool = Math.min(calculatePhrenicPool(level), phrenicPool + (spell.restoreAmount || 0));
        setPhrenicPool(newPool);
        playSound('spell');
        Alert.alert('Success!', `${spell.name} was cast successfully. Restored ${spell.restoreAmount} point(s) to the phrenic pool.`);
      } else {
        Alert.alert('Failure', `${spell.name} failed to cast. No points restored.`);
      }
    } else {
      Alert.alert('Level Too Low', `You need to be at least level ${spell.requiredLevel} to cast ${spell.name}.`);
    }
  };

  const usePower = (power: Item) => {
    if (level >= power.requiredLevel) {
      playSound('power');
      Alert.alert('Power Used', `${power.name} (Level ${power.level})\n\nEffect: ${power.effect}`);
    } else {
      Alert.alert('Level Too Low', `You need to be at least level ${power.requiredLevel} to use ${power.name}.`);
    }
  };

  const toggleItemEnabled = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const isItemAvailable = (item: Item) => {
    if (level < item.requiredLevel) return false;
    if (item.type === 'ability' && phrenicPool < (item.cost || 0)) return false;
    if (item.type === 'spell' && item.cost && phrenicPool < item.cost) return false;
    if (item.type === 'power' && item.cost && phrenicPool < item.cost) return false;
    return true;
  };

  const renderCard = (item: Item) => {
    const bgColor = item.type === 'ability' ? '#e6d2aa' : item.type === 'spell' ? '#b3d9ff' : '#ffb3ba';
    const isAvailable = isItemAvailable(item);

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.card,
          { backgroundColor: bgColor },
          !isAvailable && styles.inactiveCard
        ]}
        onPress={() => {
          if (isAvailable) {
            if (item.type === 'ability') useAbility(item.cost || 0);
            else if (item.type === 'spell') castSpell(item);
            else usePower(item);
          } else {
            if (level < item.requiredLevel) {
              Alert.alert('Level Too Low', `You need to be at least level ${item.requiredLevel} to use ${item.name}.`);
            } else if (item.cost && phrenicPool < item.cost) {
              Alert.alert('Insufficient Phrenic Pool', `You need ${item.cost} phrenic points to use ${item.name}. Current pool: ${phrenicPool}`);
            } else {
              Alert.alert('Not Available', `You can't use ${item.name} right now.`);
            }
          }
        }}
        disabled={!isAvailable}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardName, !isAvailable && styles.inactiveText]}>{item.name}</Text>
          <Text style={[styles.cardCost, !isAvailable && styles.inactiveText]}>
            {item.cost ? `Cost: ${item.cost}` : 
             item.type === 'spell' ? `Level: ${item.level}` : 
             `Level: ${item.level}`}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.cardType, !isAvailable && styles.inactiveText]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Text style={[styles.cardEffect, !isAvailable && styles.inactiveText]}>{item.effect}</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={[styles.cardRequirements, !isAvailable && styles.inactiveText]}>
            {item.requirements ? `Requirements: ${item.requirements}` : 'No special requirements'}
          </Text>
          <Text style={[styles.cardRequiredLevel, !isAvailable && styles.inactiveText]}>
            Required Level: {item.requiredLevel}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItems = () => {
    return items
      .filter(item => item.type !== 'spell' || item.enabled)
      .filter(item => showAllLevels || item.requiredLevel <= level)
      .reduce((acc: JSX.Element[], item, index, array) => {
        if (index === 0 || item.requiredLevel !== array[index - 1].requiredLevel) {
          acc.push(
            <Text key={`level-${item.requiredLevel}`} style={styles.levelHeader}>
              Level {item.requiredLevel}
            </Text>
          );
        }
        acc.push(renderCard(item));
        return acc;
      }, []);
  };

  const usedPhrenicPool = calculatePhrenicPool(level) - phrenicPool;

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
      <PhrenicPoolSpheres total={calculatePhrenicPool(level)} used={usedPhrenicPool} />

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
                      value={spell.enabled}
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
  card: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  inactiveCard: {
    opacity: 0.6,
    backgroundColor: '#d3d3d3',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardCost: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 5,
  },
  cardType: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  cardEffect: {
    fontSize: 12,
  },
  cardFooter: {
    marginTop: 5,
  },
  cardRequirements: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  cardRequiredLevel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#808080',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  levelHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  manageSpellsButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  restoreButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
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

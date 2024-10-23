import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

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

interface ItemCardProps {
    item: Item;
    isAvailable: boolean;
    onUse: () => void;
    level: number;
    phrenicPool: number;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isAvailable, onUse, level, phrenicPool }) => {
    const bgColor = item.type === 'ability' ? '#e6d2aa' : item.type === 'spell' ? '#b3d9ff' : '#ffb3ba';

    const handlePress = () => {
        if (isAvailable) {
            onUse();
        } else {
            if (level < item.requiredLevel) {
                Alert.alert('Level Too Low', `You need to be at least level ${item.requiredLevel} to use ${item.name}.`);
            } else if (item.cost && phrenicPool < item.cost) {
                Alert.alert('Insufficient Phrenic Pool', `You need ${item.cost} phrenic points to use ${item.name}. Current pool: ${phrenicPool}`);
            } else {
                Alert.alert('Not Available', `You can't use ${item.name} right now.`);
            }
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: bgColor },
                !isAvailable && styles.inactiveCard
            ]}
            onPress={handlePress}
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

const styles = StyleSheet.create({
    card: {
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
});

export default ItemCard;

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
    const bgColor = {
        ability: '#e6d2aa',
        spell: '#b3d9ff',
        power: '#ffb3ba'
    }[item.type];

    const handlePress = () => {
        if (isAvailable) {
            onUse();
        } else {
            const message = level < item.requiredLevel
                ? `You need to be at least level ${item.requiredLevel} to use ${item.name}.`
                : item.cost && phrenicPool < item.cost
                    ? `You need ${item.cost} phrenic points to use ${item.name}. Current pool: ${phrenicPool}`
                    : `You can't use ${item.name} right now.`;
            Alert.alert('Not Available', message);
        }
    };

    const cardStyle = [
        styles.card,
        { backgroundColor: bgColor },
        !isAvailable && styles.inactiveCard
    ];

    const textStyle = !isAvailable && styles.inactiveText;

    return (
        <TouchableOpacity
            style={cardStyle}
            onPress={handlePress}
            disabled={!isAvailable}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.cardName, textStyle]}>{item.name}</Text>
                <Text style={[styles.cardCost, textStyle]}>
                    {item.cost ? `Cost: ${item.cost}` : `Level: ${item.level}`}
                </Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={[styles.cardType, textStyle]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
                <Text style={[styles.cardEffect, textStyle]}>{item.effect}</Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={[styles.cardRequirements, textStyle]}>
                    {item.requirements ? `Requirements: ${item.requirements}` : 'No special requirements'}
                </Text>
                <Text style={[styles.cardRequiredLevel, textStyle]}>
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

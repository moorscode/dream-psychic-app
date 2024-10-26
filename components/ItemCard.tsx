import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Item } from '../data/itemDefinitions';

interface ItemCardProps {
    item: Item;
    isAvailable: boolean;
    onUse: () => void;
    level: number;
    phrenicPool: number;
    isActive?: boolean;
    toggleAmplification?: (id: string) => void;
    activeAmplifications?: string[];
}

const ItemCard: React.FC<ItemCardProps> = ({ 
    item, 
    isAvailable, 
    onUse, 
    level, 
    phrenicPool, 
    isActive, 
    toggleAmplification, 
    activeAmplifications 
}) => {
    const bgColor = useMemo(() => ({
        ability: '#e6d2aa',
        spell: '#b3d9ff',
        power: '#ffb3ba',
        amplification: '#d1c4e9'
    }[item.type]), [item.type]);

    const handlePress = () => {
        if (isAvailable) {
            item.type === 'amplification' && toggleAmplification ? toggleAmplification(item.id) : onUse();
        } else {
            const message = level < item.requiredLevel
                ? `You need to be at least level ${item.requiredLevel} to use ${item.name}.`
                : item.cost && phrenicPool < item.cost
                    ? `You need ${item.cost} phrenic points to use ${item.name}. Current pool: ${phrenicPool}`
                    : `You can't use ${item.name} right now.`;
            Alert.alert('Not Available', message);
        }
    };

    const cardStyle = useMemo(() => [
        styles.card,
        { backgroundColor: bgColor },
        !isAvailable && styles.inactiveCard,
        isActive && styles.activeCard,
        item.type === 'amplification' && isActive && styles.activeAmplificationCard
    ], [bgColor, isAvailable, isActive, item.type]);

    const textStyle = !isAvailable && styles.inactiveText;

    const showSpellCost = item.type === 'spell' && activeAmplifications && activeAmplifications.length > 0;

    return (
        <TouchableOpacity
            style={cardStyle}
            onPress={handlePress}
            disabled={!isAvailable && item.type !== 'amplification'}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.cardName, textStyle]}>{item.name}</Text>
                <Text style={[styles.cardCost, textStyle]}>
                    {showSpellCost 
                        ? `Cost: ${activeAmplifications!.length}`
                        : item.cost 
                            ? `Cost: ${item.cost}` 
                            : `Level: ${item.level}`
                    }
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
            {item.type === 'amplification' && (
                <Text style={[styles.amplificationStatus, textStyle, isActive && styles.activeAmplificationText]}>
                    {isActive ? 'Active' : 'Inactive'}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#000',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    inactiveCard: {
        opacity: 0.8,
        backgroundColor: '#d3d3d3',
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
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
    activeCard: {
        borderColor: '#4CAF50',
        borderWidth: 2,
    },
    activeAmplificationCard: {
        backgroundColor: '#a892d4',
    },
    amplificationStatus: {
        position: 'absolute',
        top: 5,
        right: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeAmplificationText: {
        color: '#ffffff',
    },
});

export default React.memo(ItemCard);

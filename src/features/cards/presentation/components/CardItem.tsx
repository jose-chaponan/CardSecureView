import React, { FC, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../../domain/entities/card.entity';

export interface CardItemProps {
  card: Card;
  onViewSensitive: (cardId: string) => void;
}

const BRAND_COLORS: Record<string, string> = {
  Visa: '#1A1F71',
  Mastercard: '#EB001B',
  AmericanExpress: '#257fd3',
};

const CardItem: FC<CardItemProps> = memo(({ card, onViewSensitive }) => {
  const brandColor = BRAND_COLORS[card.brand] ?? '#1A1A2E';

  return (
    <View style={styles.container}>
      <View style={[styles.cardHeader, { backgroundColor: brandColor }]}>
        <Text style={styles.brand}>{card.brand}</Text>
        <Text style={styles.alias}>{card.alias}</Text>
      </View>

      <View style={styles.body}>
        <Text
          style={styles.pan}
          accessibilityLabel={`Número de tarjeta ${card.maskedPan}`}
        >
          {card.maskedPan}
        </Text>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>TITULAR</Text>
            <Text style={styles.metaValue} accessibilityLabel={`Titular ${card.holder}`}>
              {card.holder}
            </Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.metaLabel}>VENCE</Text>
            <Text style={styles.metaValue} accessibilityLabel={`Fecha de vencimiento ${card.expiry}`}>
              {card.expiry}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onViewSensitive(card.cardId)}
          activeOpacity={0.8}
          accessibilityLabel={`Ver datos sensibles de tarjeta ${card.alias}`}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Ver datos sensibles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

CardItem.displayName = 'CardItem';

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  alias: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '500',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pan: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: 3,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaRight: {
    marginLeft: 32,
  },
  metaLabel: {
    fontSize: 10,
    color: '#8A8A8E',
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default CardItem;

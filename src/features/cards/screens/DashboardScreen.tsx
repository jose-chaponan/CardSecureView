import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../types/card.types';
import { useCards } from '../hooks/useCards';
import { useSecureToken } from '../hooks/useSecureToken';
import CardItem from '../components/CardItem';

const { CardSecureModule } = NativeModules;

const DashboardScreen: React.FC = () => {
  const { cards } = useCards();
  const { getSecureToken } = useSecureToken();

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(CardSecureModule);

    const openSub = eventEmitter.addListener('onSecureViewOpened', cardId => {
      console.log(`Vista segura abierta para: ${cardId}`);
    });

    const dataSub = eventEmitter.addListener('onCardDataShown', cardId => {
      console.log(`Datos mostrados para: ${cardId}`);
    });

    const errorSub = eventEmitter.addListener(
      'onValidationError',
      ({ code, message }) => {
        console.error(`Error de validación [${code}]: ${message}`);
      },
    );

    const closeSub = eventEmitter.addListener(
      'onSecureViewClosed',
      ({ cardId, reason }) => {
        console.log(`Vista segura cerrada para ${cardId}. Razón: ${reason}`);
      },
    );

    return () => {
      openSub.remove();
      dataSub.remove();
      errorSub.remove();
      closeSub.remove();
    };
  }, []);

  const handleViewSensitive = useCallback(
    async (cardId: string) => {
      try {
        const card = cards.find(c => c.cardId === cardId);
        if (!card) return;
        const token = await getSecureToken(cardId);
        await CardSecureModule.openSecureView(
          cardId,
          card.pan,
          card.cvv,
          card.expiry,
          card.holder,
          token,
        );
      } catch (error) {
        console.error('Error al abrir la vista segura:', error);
      }
    },
    [cards, getSecureToken],
  );

  const renderItem = useCallback(
    ({ item }: { item: Card }) => (
      <CardItem card={item} onViewSensitive={handleViewSensitive} />
    ),
    [handleViewSensitive],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <View style={styles.header}>
        <Text style={styles.headerGreeting}>Bienvenido</Text>
        <Text style={styles.headerTitle}>Mis tarjetas</Text>
      </View>
      <FlatList
        data={cards}
        keyExtractor={item => item.cardId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes tarjetas registradas.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerGreeting: {
    fontSize: 13,
    color: '#A0A0C0',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  listContent: {
    display: 'flex',
    gap: 10,
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
    color: '#8A8A8E',
  },
});

export default DashboardScreen;

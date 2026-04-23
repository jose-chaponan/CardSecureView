import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../types/card.types';
import { useCards } from '../hooks/useCards';
import { useSecureToken } from '../hooks/useSecureToken';
import CardItem from '../components/CardItem';

const DashboardScreen: React.FC = () => {
  const { cards } = useCards();
  const { getSecureToken } = useSecureToken();

  const handleViewSensitive = useCallback(async (cardId: string) => {
    const token = await getSecureToken(cardId);
    Alert.alert('Token generado', `Token: ${token}`, [{ text: 'Cerrar', style: 'cancel' }]);
  }, [getSecureToken]);

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
    paddingTop: 12,
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
    color: '#8A8A8E',
  },
});

export default DashboardScreen;

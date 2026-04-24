import React, { FC, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../domain/entities/card.entity';
import CardItem from '../components/CardItem';
import CardItemSkeleton from '../components/CardItemSkeleton';
import { generateUUID } from '../../../../shared/utils/uuid';
import { useDashboardScreen } from '../hooks/useDashboardScreen';

const SKELETON_COUNT = 3;

const DashboardScreen: FC = () => {
  const { cards, isLoading, openSecureView, logout } = useDashboardScreen();
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Card>) => (
      <CardItem card={item} onViewSensitive={openSecureView} />
    ),
    [openSecureView],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Bienvenido</Text>
          <Text style={styles.headerTitle}>Mis tarjetas</Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          style={styles.logoutBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.skeletonList}>
          {Array.from({ length: SKELETON_COUNT }).map(() => (
            <CardItemSkeleton key={generateUUID()} />
          ))}
        </View>
      ) : (
        <FlashList
          data={cards}
          keyExtractor={item => item.cardId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No tienes tarjetas registradas.
            </Text>
          }
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A5C',
  },
  logoutText: {
    color: '#A0A0C0',
    fontSize: 13,
    fontWeight: '600',
  },
  skeletonList: {
    flex: 1,
    paddingTop: 8,
  },
  listContent: {
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

import { Colors, Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },

  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    lineHeight: 20,
    fontSize: 15,
  },

  headerSubtitle: {
    marginTop: 1,
  },

  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },

  scrollContent: {
    paddingRight: Spacing.md,
    gap: Spacing.sm,
  },

  card: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 2,
  },

  discountText: {
    fontWeight: '700',
    fontSize: 10,
  },

  productName: {
    fontWeight: '600',
    lineHeight: 17,
    color: Colors.text,
  },

  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },

  storeName: {
    flex: 1,
    fontSize: 11,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: Spacing.xs,
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
  },

  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
});
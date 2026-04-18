import { LocationType } from '@/types';

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  SUPERMARKET: 'Supermercado',
  STORE: 'Local',
  PHARMACY: 'Farmacia',
  OTHER: 'Otro',
};

export const LOCATION_TYPES: LocationType[] = ['SUPERMARKET', 'STORE', 'PHARMACY', 'OTHER'];
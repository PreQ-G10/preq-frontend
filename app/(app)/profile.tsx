import BusinessProfileScreen from '@/components/organisms/BusinessProfileScreen';
import ProfileScreen from '@/components/organisms/ProfileScreen';
import { useAuth } from '@/context/authContext';

export default function ProfileRoute() {
  const { role } = useAuth();
  return role === 'BUSINESS' ? <BusinessProfileScreen /> : <ProfileScreen />;
}
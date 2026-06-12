import { Colors, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    child:{
        position: 'absolute',
        bottom: -8,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.white,
    },
    tooltip:{
        position: 'absolute',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: Spacing.md,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    titleIcon:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 4, 
        gap: 6 
    },
})
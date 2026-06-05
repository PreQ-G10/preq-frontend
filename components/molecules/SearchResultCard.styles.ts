import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    productRow: { 
      flexDirection: 'row',
      alignItems: 'center'
    },
    image: { 
      width: 48, 
      height: 48, 
      borderRadius: 6, 
      marginRight: 12 
    },
    imagePlaceholder: { 
      width: 48, 
      height: 48, 
      borderRadius: 6, 
      backgroundColor: Colors.gray100, 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginRight: 12 
    },
    productInfo: { 
      flex: 1 
    },
    rightColumn: { 
      alignItems: 'flex-end', 
      marginRight: 8 
    },
    priceRow: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 2 
    },
    priceText: { 
      fontWeight: '600' 
    },
    cartActions: { flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4, 
        marginLeft: 4, 
        marginTop: 4 
    },
    quantityControls: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 6 
    },
    quantityBtn: { width: 28, 
        height: 28, 
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: Colors.gray300, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    quantityText: { 
        minWidth: 16, 
        textAlign: 'center' 
    },
    addBtn: { width: 32, 
        height: 32, 
        borderRadius: 8, 
        backgroundColor: Colors.primary, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
});
import { Product } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ShoppingListCartItem {
  product: Pick<Product, 'id' | 'name' | 'brand' | 'quantity' | 'quantityType'>;
  quantity: number;
}

export interface ShoppingListEntry {
  productId: number;
  name: string;
  brand: string;
  quantity: number;
  quantityType: string;
  cartQuantity: number;
  addedQuantity: number;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  title: string;
  createdAt: string;
  totalItems: number;
  items: ShoppingListEntry[];
}

const SHOPPING_LISTS_STORAGE_KEY = 'preq:shopping-lists';

function isShoppingListItemComplete(item: ShoppingListEntry): boolean {
  return item.checked || item.addedQuantity >= item.cartQuantity;
}

function normalizeShoppingList(list: ShoppingList): ShoppingList {
  return {
    ...list,
    items: list.items.map((item) => ({
      ...item,
      addedQuantity: item.addedQuantity ?? 0,
      checked: item.checked ?? false,
    })),
  };
}

function normalizeStoredLists(storedLists: ShoppingList[]): ShoppingList[] {
  return storedLists.map((list) => {
    const normalizedList = normalizeShoppingList(list);

    return {
      ...normalizedList,
      items: normalizedList.items.map((item) => ({
        ...item,
        checked: isShoppingListItemComplete(item),
      })),
    };
  });
}

function buildShoppingListItems(items: ShoppingListCartItem[]): ShoppingListEntry[] {
  return items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    quantity: item.product.quantity,
    quantityType: item.product.quantityType,
    cartQuantity: item.quantity,
    addedQuantity: 0,
    checked: false,
  }));
}

function buildShoppingList(items: ShoppingListCartItem[]): ShoppingList {
  const createdAt = new Date().toISOString();

  return {
    id: `${Date.now()}`,
    title: 'Lista de compras',
    createdAt,
    totalItems: items.reduce((accumulator, item) => accumulator + item.quantity, 0),
    items: buildShoppingListItems(items),
  };
}

export async function loadShoppingLists(): Promise<ShoppingList[]> {
  const storedLists = await AsyncStorage.getItem(SHOPPING_LISTS_STORAGE_KEY);

  if (!storedLists) {
    return [];
  }

  try {
    return normalizeStoredLists(JSON.parse(storedLists) as ShoppingList[]);
  } catch {
    return [];
  }
}

export async function saveShoppingList(items: ShoppingListCartItem[]): Promise<ShoppingList> {
  const shoppingList = buildShoppingList(items);
  const storedLists = await loadShoppingLists();
  await AsyncStorage.setItem(
    SHOPPING_LISTS_STORAGE_KEY,
    JSON.stringify([shoppingList, ...storedLists])
  );
  return shoppingList;
}

export async function setShoppingListItemChecked(
  listId: string,
  productId: number,
  checked: boolean,
): Promise<ShoppingList[]> {
  const storedLists = await loadShoppingLists();
  const updatedLists = storedLists.map((list) => {
    if (list.id !== listId) {
      return list;
    }

    return {
      ...list,
      items: list.items.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        return {
          ...item,
          checked,
          addedQuantity: checked ? item.cartQuantity : 0,
        };
      }),
    };
  });

  const normalizedLists = normalizeStoredLists(updatedLists);
  await AsyncStorage.setItem(SHOPPING_LISTS_STORAGE_KEY, JSON.stringify(normalizedLists));
  return normalizedLists;
}

export async function addShoppingListItemQuantity(
  listId: string,
  productId: number,
  amount = 1,
): Promise<ShoppingList[]> {
  const storedLists = await loadShoppingLists();
  const updatedLists = storedLists.map((list) => {
    if (list.id !== listId) {
      return list;
    }

    return {
      ...list,
      items: list.items.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const nextAddedQuantity = Math.min(item.cartQuantity, item.addedQuantity + amount);

        return {
          ...item,
          addedQuantity: nextAddedQuantity,
          checked: nextAddedQuantity >= item.cartQuantity,
        };
      }),
    };
  });

  const normalizedLists = normalizeStoredLists(updatedLists);
  await AsyncStorage.setItem(SHOPPING_LISTS_STORAGE_KEY, JSON.stringify(normalizedLists));
  return normalizedLists;
}

export async function subtractShoppingListItemQuantity(
  listId: string,
  productId: number,
  amount = 1,
): Promise<ShoppingList[]> {
  const storedLists = await loadShoppingLists();
  const updatedLists = storedLists.map((list) => {
    if (list.id !== listId) {
      return list;
    }

    return {
      ...list,
      items: list.items.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const nextAddedQuantity = Math.max(0, item.addedQuantity - amount);

        return {
          ...item,
          addedQuantity: nextAddedQuantity,
          checked: nextAddedQuantity >= item.cartQuantity,
        };
      }),
    };
  });

  const normalizedLists = normalizeStoredLists(updatedLists);
  await AsyncStorage.setItem(SHOPPING_LISTS_STORAGE_KEY, JSON.stringify(normalizedLists));
  return normalizedLists;
}

export async function deleteShoppingList(listId: string): Promise<ShoppingList[]> {
  const storedLists = await loadShoppingLists();
  const updatedLists = storedLists.filter((list) => list.id !== listId);

  await AsyncStorage.setItem(SHOPPING_LISTS_STORAGE_KEY, JSON.stringify(updatedLists));
  return updatedLists;
}

export function formatShoppingListDate(dateIso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateIso));
}

import { renderHook } from '@testing-library/react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { collection, where, orderBy, onSnapshot } from 'firebase/firestore';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

describe('useChatMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty messages initially', () => {
    const mockUnsubscribe = jest.fn();
    (onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe);

    const { result } = renderHook(() =>
      useChatMessages('order123', 'client123', 'courier456')
    );

    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('should set up Firestore query with correct parameters', () => {
    const mockUnsubscribe = jest.fn();
    (onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe);

    renderHook(() => useChatMessages('order123', 'client123', 'courier456'));

    expect(collection).toHaveBeenCalled();
    expect(where).toHaveBeenCalledWith('orderId', '==', 'order123');
    expect(where).toHaveBeenCalledWith('clientId', '==', 'client123');
    expect(where).toHaveBeenCalledWith('courierId', '==', 'courier456');
    expect(orderBy).toHaveBeenCalledWith('timestamp', 'asc');
  });

  it('should cleanup subscription on unmount', () => {
    const mockUnsubscribe = jest.fn();
    (onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe);

    const { unmount } = renderHook(() =>
      useChatMessages('order123', 'client123', 'courier456')
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});

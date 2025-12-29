import {
  canEditOrder,
  canDeleteOrder,
  canFinalizeOrder,
  transitionToInLucru,
  transitionToFinalizata,
} from '@/utils/orderStatusHelpers';
import { OrderStatus } from '@/types';

describe('orderStatusHelpers', () => {
  describe('canEditOrder', () => {
    it('should allow editing for "noua" status', () => {
      expect(canEditOrder('noua' as OrderStatus)).toBe(true);
    });

    it('should not allow editing for "in_lucru" status', () => {
      expect(canEditOrder('in_lucru' as OrderStatus)).toBe(false);
    });

    it('should not allow editing for "livrata" status', () => {
      expect(canEditOrder('livrata' as OrderStatus)).toBe(false);
    });

    it('should not allow editing for "anulata" status', () => {
      expect(canEditOrder('anulata' as OrderStatus)).toBe(false);
    });
  });

  describe('canDeleteOrder', () => {
    it('should allow deleting for "noua" status', () => {
      expect(canDeleteOrder('noua' as OrderStatus)).toBe(true);
    });

    it('should not allow deleting for "in_lucru" status', () => {
      expect(canDeleteOrder('in_lucru' as OrderStatus)).toBe(false);
    });

    it('should not allow deleting for other statuses', () => {
      expect(canDeleteOrder('livrata' as OrderStatus)).toBe(false);
      expect(canDeleteOrder('anulata' as OrderStatus)).toBe(false);
    });
  });

  describe('canFinalizeOrder', () => {
    it('should allow finalizing for "in_lucru" status', () => {
      expect(canFinalizeOrder('in_lucru' as OrderStatus)).toBe(true);
    });

    it('should not allow finalizing for "noua" status', () => {
      expect(canFinalizeOrder('noua' as OrderStatus)).toBe(false);
    });

    it('should not allow finalizing for already completed statuses', () => {
      expect(canFinalizeOrder('livrata' as OrderStatus)).toBe(false);
      expect(canFinalizeOrder('anulata' as OrderStatus)).toBe(false);
    });
  });

  describe('transitionToInLucru', () => {
    it('should return true when transitioning from "noua"', () => {
      expect(transitionToInLucru('noua' as OrderStatus)).toBe(true);
    });

    it('should return false when already in "in_lucru"', () => {
      expect(transitionToInLucru('in_lucru' as OrderStatus)).toBe(false);
    });

    it('should return false for other statuses', () => {
      expect(transitionToInLucru('livrata' as OrderStatus)).toBe(false);
      expect(transitionToInLucru('anulata' as OrderStatus)).toBe(false);
    });
  });

  describe('transitionToFinalizata', () => {
    it('should return true when transitioning from "in_lucru"', () => {
      expect(transitionToFinalizata('in_lucru' as OrderStatus)).toBe(true);
    });

    it('should return false when already in "livrata"', () => {
      expect(transitionToFinalizata('livrata' as OrderStatus)).toBe(false);
    });

    it('should return false for other statuses', () => {
      expect(transitionToFinalizata('noua' as OrderStatus)).toBe(false);
      expect(transitionToFinalizata('anulata' as OrderStatus)).toBe(false);
    });
  });
});

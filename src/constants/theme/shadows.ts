import { StyleSheet } from 'react-native';

export const MorrowShadows = StyleSheet.create({
  subtle: {
    boxShadow: '0px 4px 16px rgba(74, 15, 58, 0.04)',
    elevation: 2,
  },
  card: {
    boxShadow: '0px 8px 24px rgba(74, 15, 58, 0.06)',
    elevation: 3,
  },
  dock: {
    boxShadow: '0px 8px 24px rgba(74, 15, 58, 0.08)',
    elevation: 6,
  },
  modal: {
    boxShadow: '0px 12px 32px rgba(74, 15, 58, 0.12)',
    elevation: 12,
  },
  glowBlue: {
    boxShadow: '0px 4px 20px rgba(74, 15, 58, 0.15)',
    elevation: 4,
  },
});

export const AliceBlueShadows = MorrowShadows;
export const MidnightShadows = MorrowShadows;
export const Shadows = MorrowShadows;


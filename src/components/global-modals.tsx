import React from 'react';
import { Platform } from 'react-native';

import { QRSnapshotHost } from '@/components/qr-snapshot-host';
import { ScannerModal } from '@/components/scanner-modal';
import { useModals } from '@/hooks/use-modals';

export const GlobalModals: React.FC = () => {
  const { scannerOpen, closeScanner } = useModals();
  return (
    <>
      {scannerOpen ? <ScannerModal visible onClose={closeScanner} /> : null}
      {Platform.OS === 'ios' ? <QRSnapshotHost /> : null}
    </>
  );
};

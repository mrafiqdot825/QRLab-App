import { FeatureDemoModal } from '@/components/feature-demo-modal';
import { ScannerModal } from '@/components/scanner-modal';
import { SettingsModal } from '@/components/settings-modal';
import { useModals } from '@/hooks/use-modals';
import React from 'react';

export const GlobalModals: React.FC = () => {
  const {
    scannerOpen,
    closeScanner,
    settingsOpen,
    closeSettings,
    featureDemoOpen,
    featureDemoInitialLoading,
    closeFeatureDemo,
  } = useModals();

  return (
    <>
      {scannerOpen && <ScannerModal visible={scannerOpen} onClose={closeScanner} />}
      {settingsOpen && <SettingsModal visible={settingsOpen} onClose={closeSettings} />}
      {featureDemoOpen && (
        <FeatureDemoModal
          visible={featureDemoOpen}
          onClose={closeFeatureDemo}
          isInitialLoading={featureDemoInitialLoading}
        />
      )}
    </>
  );
};

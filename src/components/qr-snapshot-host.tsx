import React, { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';

import { CustomStyledQRCode } from '@/components/ui/custom-styled-qr-code';
import { PREVIEW_QR_SIZE, QRLook, qrRenderProps } from '@/components/ui/qr-render-props';

/*
 * react-native-svg on iOS always draws toDataURL at the view's on-screen size,
 * so asking for a bigger image only adds white space. To export at full
 * resolution, this host briefly renders the code off-screen at export size and
 * captures that view. It renders nothing while idle.
 */

interface Job {
  id: number;
  value: string;
  look: QRLook;
  size: number;
  finish: (base64: string | null) => void;
}

const CAPTURE_TIMEOUT_MS = 5000;

let job: Job | null = null;
let nextId = 1;
let hosts = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getJob = () => job;

/**
 * Renders the code at roughly `pixels` square and returns it as base64 PNG.
 * Resolves null when no host is mounted, another capture is running, or the
 * capture fails, so callers can fall back to another method.
 */
export function captureQRSnapshot(value: string, look: QRLook, pixels: number): Promise<string | null> {
  if (hosts === 0 || job) return Promise.resolve(null);

  return new Promise((resolve) => {
    const id = nextId++;
    const timer = setTimeout(() => finish(null), CAPTURE_TIMEOUT_MS);
    function finish(base64: string | null) {
      clearTimeout(timer);
      if (job?.id === id) {
        job = null;
        emit();
      }
      resolve(base64);
    }
    job = { id, value, look, size: Math.ceil(pixels / PixelRatio.get()), finish };
    emit();
  });
}

export function QRSnapshotHost() {
  const current = useSyncExternalStore(subscribe, getJob, getJob);
  const svgRef = useRef<any>(null);

  useEffect(() => {
    hosts += 1;
    return () => {
      hosts -= 1;
    };
  }, []);

  const setRef = useCallback((ref: unknown) => {
    svgRef.current = ref;
  }, []);

  const handleLayout = useCallback(() => {
    const active = job;
    if (!active) return;
    requestAnimationFrame(() => {
      const svg = svgRef.current;
      if (!svg || typeof svg.toDataURL !== 'function') {
        active.finish(null);
        return;
      }
      svg.toDataURL((base64?: string) =>
        active.finish(base64 ? base64.replace(/^data:image\/png;base64,/, '') : null)
      );
    });
  }, []);

  if (!current) return null;

  return (
    <View
      key={current.id}
      pointerEvents="none"
      aria-hidden
      collapsable={false}
      onLayout={handleLayout}
      style={[styles.offscreen, { width: current.size, height: current.size }]}>
      <CustomStyledQRCode
        value={current.value}
        {...qrRenderProps(current.look, current.size, current.size / PREVIEW_QR_SIZE)}
        getRef={setRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  offscreen: {
    position: 'absolute',
    left: -10000,
    top: 0,
  },
});

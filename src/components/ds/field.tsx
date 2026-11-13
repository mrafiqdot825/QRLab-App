import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import type { IconName } from '@/components/ds/controls';
import { C, FONT } from '@/constants/design';

interface FieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon?: IconName;
  /** Rendered at the right edge of the input, e.g. a Paste chip or eye toggle. */
  trailing?: React.ReactNode;
}

/** Labelled text input. The border darkens while focused. */
export const Field = React.memo(function Field({
  label,
  icon,
  trailing,
  multiline,
  onFocus,
  onBlur,
  ...inputProps
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    (e) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );
  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    (e) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return (
    <View style={styles.wrap}>
      <AppText weight="semibold" size={13} color={C.muted}>
        {label}
      </AppText>
      <View style={[styles.box, multiline && styles.boxMultiline, focused ? styles.boxFocused : null]}>
        {icon ? (
          <Ionicons name={icon} size={18} color={C.muted} style={multiline ? styles.iconTop : undefined} />
        ) : null}
        <TextInput
          {...inputProps}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={C.inactive}
          selectionColor={C.brand}
          cursorColor={C.brand}
          style={[styles.input, multiline && styles.inputMultiline]}
        />
        {trailing}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  box: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    backgroundColor: C.white,
    paddingLeft: 14,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boxMultiline: {
    minHeight: 120,
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 14,
  },
  boxFocused: {
    borderColor: C.brand,
    borderWidth: 1.5,
  },
  iconTop: {
    marginTop: 1,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    fontFamily: FONT.regular,
    fontSize: 15,
    color: C.ink,
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: 'top',
    lineHeight: 21,
  },
});

import React from 'react';
import { Modal as RNModal, View, StyleSheet, Platform } from 'react-native';

// For web portal
let ReactDOM: any = null;
if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ReactDOM = require('react-dom');
}

interface LayeredModalProps {
  visible: boolean;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  presentationStyle?: string;
  statusBarTranslucent?: boolean;
  onRequestClose?: () => void;
  children?: React.ReactNode;
}

export default function LayeredModal(props: LayeredModalProps) {
  const { visible, children, onRequestClose } = props;

  if (Platform.OS === 'web') {
    if (!visible) return null;
    const el = (
      <div style={webStyles.overlay} onClick={onRequestClose}>
        <div style={webStyles.content} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
    return ReactDOM.createPortal(el, document.body);
  }

  // Native: use RN Modal
  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType={props.animationType || 'slide'}
      presentationStyle={props.presentationStyle as any}
      statusBarTranslucent={props.statusBarTranslucent}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>{children}</View>
      </View>
    </RNModal>
  );
}

const webStyles: { [k: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  }
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  }
});

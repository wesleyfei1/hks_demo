

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 160,
    paddingLeft: 16,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: 192,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    paddingVertical: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#ffffff',
  },
  checkboxSelected: {
    backgroundColor: '#6366f1',
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
  },
});


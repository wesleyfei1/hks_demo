import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  backButton: {
    padding: 8,
  },
  backButtonText: { color: '#6b7280' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  content: { flex: 1 },
  analysisText: { fontSize: 16, color: '#1f2937', lineHeight: 24 },
  editButton: { marginTop: 12, alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#6366f1', borderRadius: 8 },
  editButtonText: { color: '#fff', fontWeight: '600' },
  textInput: { minHeight: 200, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, textAlignVertical: 'top', fontSize: 16 },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  saveButton: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#10b981', borderRadius: 8, marginLeft: 8 },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#f3f4f6', borderRadius: 8, marginLeft: 8 },
  cancelButtonText: { color: '#374151', fontWeight: '600' }
  ,
  suggestionCard: { marginBottom: 12, borderWidth: 1, borderColor: '#eef2ff', padding: 10, borderRadius: 8 },
  suggestionTitle: { fontWeight: '600' },
  suggestionReason: { color: '#6b7280', marginBottom: 8 },
  thumb: { width: 120, height: 80, marginRight: 8, borderRadius: 6, backgroundColor: '#f3f4f6' },
  generateButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#6366f1', borderRadius: 8 }
});

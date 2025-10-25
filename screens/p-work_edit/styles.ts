

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  
  // 滚动视图
  scrollView: {
    flex: 1,
  },
  
  // 作品信息区域
  workInfoSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  // 文本编辑区域
  editorMain: {
    padding: 16,
  },
  editorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  editorHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  charCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  charCount: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  fullscreenToggleButton: {
    padding: 4,
  },
  
  // 文本编辑器
  textEditorContainer: {
    minHeight: 400,
  },
  textEditor: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    minHeight: 400,
  },
  
  // 插图占位符
  illustrationPlaceholder: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  illustrationContainer: {
    alignItems: 'center',
  },
  illustrationImageContainer: {
    width: '100%',
    height: 192,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationOverlayContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  illustrationOverlayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  illustrationTagContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  illustrationTag: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // 模态框通用样式
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  
  // 插图编辑模态框
  illustrationModalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  illustrationModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  illustrationModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  illustrationModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
  },
  illustrationModalOptions: {
    gap: 16,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  replaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  replaceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // 保存确认模态框
  saveConfirmModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  saveConfirmModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  saveConfirmIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveConfirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  saveConfirmMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  saveConfirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveAndLeaveButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveAndLeaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // 全屏模式
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fullscreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fullscreenHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  fullscreenCloseButton: {
    padding: 8,
    borderRadius: 20,
  },
  fullscreenContent: {
    flex: 1,
    padding: 24,
  },
  fullscreenTextInput: {
    flex: 1,
    fontSize: 18,
    color: '#1f2937',
    lineHeight: 28,
    textAlignVertical: 'top',
  },
  fullscreenFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  fullscreenCharCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  fullscreenSaveButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  fullscreenSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});


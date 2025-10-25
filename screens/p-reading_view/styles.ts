

import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
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
  
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  workInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  
  workTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  
  workAuthor: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    textAlign: 'center',
  },

  // 阅读进度条
  progressContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  readingTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },

  // 阅读区域
  readingMain: {
    flex: 1,
  },
  
  readingContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100, // 为底部控制栏留出空间
  },
  
  storyText: {
    fontSize: 16,
    lineHeight: 28.8,
    color: '#1f2937',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  
  illustrationContainer: {
    marginBottom: 32,
  },
  
  illustrationImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  illustrationCaption: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },

  // 底部控制栏
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        paddingBottom: 34, // iPhone底部安全区域
      },
      android: {
        paddingBottom: 12,
      },
    }),
  },
  
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  
  controlButtonText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  
  pageControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  pageButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 4,
  },
  
  pageNumberContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  
  pageNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // 模态框通用样式
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: screenHeight * 0.8,
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  
  modalCloseButtonLarge: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // 线索列表
  threadList: {
    marginBottom: 16,
  },
  
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  
  threadInfo: {
    flex: 1,
  },
  
  threadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  threadDescription: {
    fontSize: 14,
    color: '#6b7280',
  },

  // 图片预览模态框
  imageModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imageModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  
  imageModalContent: {
    position: 'relative',
    margin: 16,
    maxWidth: screenWidth - 32,
    maxHeight: screenHeight * 0.8,
  },
  
  enlargedImage: {
    width: screenWidth - 32,
    height: screenHeight * 0.6,
    borderRadius: 16,
  },
  
  imageModalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // 字体设置
  fontSettingsContainer: {
    marginBottom: 16,
  },
  
  fontSettingSection: {
    marginBottom: 24,
  },
  
  fontSettingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  fontSizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  
  fontSizeButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  
  fontSizeButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  
  fontSizeButtonTextActive: {
    color: '#ffffff',
  },
  
  lineSpacingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  lineSpacingButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  
  lineSpacingButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  
  lineSpacingButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  
  lineSpacingButtonTextActive: {
    color: '#ffffff',
  },
});


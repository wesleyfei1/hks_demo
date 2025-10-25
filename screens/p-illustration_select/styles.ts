

import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // 顶部导航栏
  header: {
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
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
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  
  // 滚动视图
  scrollView: {
    flex: 1,
  },
  
  // 断点提示
  breakpointIndicator: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  breakpointIndicatorGradient: {
    padding: 16,
  },
  breakpointIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakpointIndicatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  breakpointIndicatorText: {
    flex: 1,
  },
  breakpointIndicatorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  breakpointIndicatorSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  breakpointIndicatorProgress: {
    marginLeft: 8,
  },
  breakpointIndicatorProgressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366f1',
  },
  
  // 当前文本段落预览
  textPreviewSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
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
  textPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textPreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  currentParagraph: {
    marginBottom: 16,
  },
  currentParagraphText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
  },
  contextInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  contextInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  contextTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contextTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contextTagGreen: {
    backgroundColor: '#dcfce7',
  },
  contextTagBlue: {
    backgroundColor: '#dbeafe',
  },
  contextTagPurple: {
    backgroundColor: '#ede9fe',
  },
  contextTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
  },
  
  // 候选插图展示区
  illustrationSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
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
  illustrationSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  illustrationSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  illustrationScrollContainer: {
    marginBottom: 16,
  },
  illustrationScrollContent: {
    paddingRight: 16,
  },
  illustrationCard: {
    width: 192,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
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
  illustrationCardSelected: {
    borderColor: '#6366f1',
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  illustrationImageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  illustrationInfo: {
    padding: 12,
  },
  illustrationTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  selectIllustrationButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectIllustrationButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  
  // 滚动指示器
  scrollIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  scrollIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#d1d5db',
    borderRadius: 4,
  },
  scrollIndicatorActive: {
    backgroundColor: '#6366f1',
  },
  
  // 插图操作按钮
  illustrationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  regenerateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  abandonButton: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  abandonButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  
  // 底部操作区域
  bottomActions: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navigationButton: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navigationButtonDisabled: {
    opacity: 0.5,
  },
  navigationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  navigationButtonTextDisabled: {
    color: '#9ca3af',
  },
  
  // 加载遮罩
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: width * 0.8,
  },
  loadingSpinner: {
    width: 64,
    height: 64,
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderTopColor: '#6366f1',
    borderRadius: 32,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});


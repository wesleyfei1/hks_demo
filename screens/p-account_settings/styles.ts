

import { StyleSheet, Platform } from 'react-native';

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
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  headerPlaceholder: {
    width: 40,
  },
  
  // 主要内容区域
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  
  // 用户信息卡片
  userInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
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
  
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  userDetails: {
    flex: 1,
  },
  
  nickname: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  
  userId: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  // 设置列表
  settingsList: {
    gap: 16,
  },
  
  settingItem: {
    backgroundColor: '#ffffff',
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
  
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  blueIcon: {
    backgroundColor: '#dbeafe',
  },
  
  greenIcon: {
    backgroundColor: '#dcfce7',
  },
  
  purpleIcon: {
    backgroundColor: '#ede9fe',
  },
  
  orangeIcon: {
    backgroundColor: '#fed7aa',
  },
  
  redIcon: {
    backgroundColor: '#fecaca',
  },
  
  indigoIcon: {
    backgroundColor: '#e0e7ff',
  },
  
  grayIcon: {
    backgroundColor: '#f3f4f6',
  },
  
  settingTextContainer: {
    flex: 1,
  },
  
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // 高级选项
  advancedSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  
  // 弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: Platform.select({ web: 720, default: 400 }) as any,
    paddingHorizontal: 20,
    // On web limit modal height so header/search stay visible and list can scroll
    ...(Platform.select({ web: { height: '70vh' }, default: {} }) as any),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  // 输入框样式
  inputContainer: {
    marginBottom: 16,
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  inputHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  
  // 验证码输入框
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  codeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  
  codeButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  codeButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  
  codeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  
  codeButtonTextDisabled: {
    color: '#9ca3af',
  },
  
  // 按钮样式
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  confirmButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  
  // 高级选项样式
  advancedContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  
  advancedSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
  },
  
  advancedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  advancedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  advancedIcon: {
    marginRight: 12,
  },
  
  advancedItemText: {
    fontSize: 14,
    color: '#1f2937',
  },
  
  // 开关样式
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  
  toggleActive: {
    backgroundColor: '#6366f1',
  },
  
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  
  // API设置
  apiSettings: {
    paddingLeft: 28,
    gap: 12,
  },
  
  modelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  
  modelSelectorText: {
    fontSize: 16,
    color: '#1f2937',
  },

  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  modelItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  modelItemText: {
    fontSize: 14,
    color: '#1f2937',
  },

  // Scroll container used inside modal: header and search are fixed, list fills remaining space
  modelListScroll: Platform.select({
    web: {
      flex: 1,
      overflow: 'auto',
      width: '100%',
    },
    default: {
      flex: 1,
      maxHeight: 400,
    },
  }) as any,

  modalHeaderFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },

  searchWrapper: {
    marginBottom: 8,
  },
  // Advanced modal scroll container
  advancedModalScroll: Platform.select({
    web: {
      flex: 1,
      overflow: 'auto',
      width: '100%'
    },
    default: {
      flex: 1,
    }
  }) as any,
  
  // Toast样式
  toast: {
    position: 'absolute',
    top: 80,
    left: '50%',
    transform: [{ translateX: -100 }],
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
    minWidth: 200,
    alignItems: 'center',
  },
  
  toastText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
});


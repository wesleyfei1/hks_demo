

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },

  // 顶部导航栏
  header: {
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
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  titleIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // 滚动视图
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // 通知设置说明
  notificationInfoContainer: {
    marginBottom: 24,
  },
  
  notificationInfoGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  
  notificationInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  notificationInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  
  notificationInfoText: {
    flex: 1,
  },
  
  notificationInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  
  notificationInfoDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },

  // 设置列表
  settingsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
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
  
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  settingTextContainer: {
    flex: 1,
  },
  
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },

  // 底部隐私说明
  privacyContainer: {
    marginBottom: 24,
  },
  
  privacyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  
  privacyIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  
  privacyTextContainer: {
    flex: 1,
  },
  
  privacyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  privacyDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },

  // Toast 提示
  toastContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
    zIndex: 1000,
  },
  
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  
  toastIcon: {
    marginRight: 8,
  },
  
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});


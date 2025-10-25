

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

interface NotificationSettings {
  newMessage: boolean;
  workUpdate: boolean;
  activity: boolean;
  readingReminder: boolean;
  creativeInspiration: boolean;
  maintenance: boolean;
}

const NotificationSettingsScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newMessage: true,
    workUpdate: true,
    activity: false,
    readingReminder: true,
    creativeInspiration: false,
    maintenance: true,
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setIsLoading(true);
      const savedSettings = await AsyncStorage.getItem('@notification_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setNotificationSettings(parsedSettings);
      }
    } catch (error) {
      console.error('加载通知设置失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('@notification_settings', JSON.stringify(newSettings));
      showToastMessage('设置已保存');
    } catch (error) {
      console.error('保存通知设置失败:', error);
      showToastMessage('保存失败，请重试');
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleToggleChange = (key: keyof NotificationSettings, value: boolean) => {
    if (key === 'newMessage' && !value) {
      Alert.alert(
        '确认关闭',
        '关闭新消息通知将无法及时接收重要系统消息，确定要关闭吗？',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '确定',
            onPress: () => {
              const newSettings = { ...notificationSettings, [key]: value };
              setNotificationSettings(newSettings);
              saveNotificationSettings(newSettings);
            },
          },
        ]
      );
    } else {
      const newSettings = { ...notificationSettings, [key]: value };
      setNotificationSettings(newSettings);
      saveNotificationSettings(newSettings);
    }
  };

  const handleSettingItemLongPress = (title: string, description: string) => {
    showToastMessage(`${title}: ${description}`);
  };

  const renderSettingItem = (
    icon: string,
    iconColor: string,
    iconBgColor: string,
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    disabled = false
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onLongPress={() => handleSettingItemLongPress(title, description)}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemContent}>
        <View style={[styles.settingIconContainer, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={18} color={iconColor} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#cbd5e1', true: '#6366f1' }}
        thumbColor={value ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#cbd5e1"
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <FontAwesome6 name="bell" size={16} color="#6366f1" />
            </View>
            <Text style={styles.headerTitle}>通知设置</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通知设置说明 */}
        <View style={styles.notificationInfoContainer}>
          <LinearGradient
            colors={['#dbeafe', '#ede9fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.notificationInfoGradient}
          >
            <View style={styles.notificationInfoContent}>
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.notificationInfoIcon}
              >
                <FontAwesome6 name="circle-info" size={18} color="#ffffff" />
              </LinearGradient>
              <View style={styles.notificationInfoText}>
                <Text style={styles.notificationInfoTitle}>个性化通知</Text>
                <Text style={styles.notificationInfoDescription}>
                  根据您的偏好设置，我们会向您发送相关通知。您可以随时在此处调整通知选项。
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 通知设置列表 */}
        <View style={styles.settingsContainer}>
          {renderSettingItem(
            'comment-dots',
            '#2563eb',
            '#dbeafe',
            '新消息通知',
            '接收系统消息和重要通知',
            notificationSettings.newMessage,
            (value) => handleToggleChange('newMessage', value)
          )}
          
          {renderSettingItem(
            'arrows-rotate',
            '#059669',
            '#d1fae5',
            '作品更新通知',
            '当您的作品有新的AI插图生成完成时通知',
            notificationSettings.workUpdate,
            (value) => handleToggleChange('workUpdate', value)
          )}
          
          {renderSettingItem(
            'calendar-days',
            '#ea580c',
            '#fed7aa',
            '活动通知',
            '接收应用活动、优惠和新功能介绍',
            notificationSettings.activity,
            (value) => handleToggleChange('activity', value)
          )}
          
          {renderSettingItem(
            'book-open',
            '#7c3aed',
            '#e9d5ff',
            '阅读提醒',
            '定时提醒您继续阅读未完成的故事',
            notificationSettings.readingReminder,
            (value) => handleToggleChange('readingReminder', value)
          )}
          
          {renderSettingItem(
            'lightbulb',
            '#ec4899',
            '#fce7f3',
            '创作灵感',
            '定期收到写作技巧和创作灵感',
            notificationSettings.creativeInspiration,
            (value) => handleToggleChange('creativeInspiration', value)
          )}
          
          {renderSettingItem(
            'screwdriver-wrench',
            '#6b7280',
            '#f3f4f6',
            '系统维护通知',
            '系统维护和升级时的重要通知',
            notificationSettings.maintenance,
            () => {},
            true
          )}
        </View>

        {/* 底部说明 */}
        <View style={styles.privacyContainer}>
          <View style={styles.privacyContent}>
            <FontAwesome6 name="shield-halved" size={16} color="#9ca3af" style={styles.privacyIcon} />
            <View style={styles.privacyTextContainer}>
              <Text style={styles.privacyTitle}>隐私保护</Text>
              <Text style={styles.privacyDescription}>
                我们严格保护您的隐私，所有通知设置仅影响您接收的消息类型，不会收集额外的个人信息。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Toast 提示 */}
      {showToast && (
        <View style={styles.toastContainer}>
          <View style={styles.toast}>
            <FontAwesome6 name="circle-check" size={16} color="#ffffff" style={styles.toastIcon} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;


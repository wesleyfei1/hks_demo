

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

const SettingsScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleAccountSettingsPress = () => {
    router.push('/p-account_settings');
  };

  const handleNotificationSettingsPress = () => {
    router.push('/p-notification_settings');
  };

  const handleAboutUsPress = () => {
    router.push('/p-about_us');
  };

  const handleUserInfoPress = () => {
    router.push('/p-account_settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
            <View style={styles.titleIcon}>
              <FontAwesome6 name="gear" size={18} color="#6366f1" />
            </View>
            <Text style={styles.titleText}>设置</Text>
          </View>
        </View>
      </LinearGradient>

      {/* 设置内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 用户信息卡片 */}
          <TouchableOpacity
            style={styles.userInfoCard}
            onPress={handleUserInfoPress}
            activeOpacity={0.7}
          >
            <View style={styles.userInfoContent}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.userAvatar}
              >
                <FontAwesome6 name="user" size={24} color="#ffffff" />
              </LinearGradient>
              <View style={styles.userInfoText}>
                <Text style={styles.userName}>画叙创作者</Text>
                <Text style={styles.userWelcome}>欢迎使用画叙，开始你的创作之旅</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>

          {/* 设置选项列表 */}
          <View style={styles.settingsList}>
            {/* 账户设置 */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleAccountSettingsPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingItemContent}>
                <View style={styles.settingItemLeft}>
                  <View style={[styles.settingIcon, styles.blueIcon]}>
                    <FontAwesome6 name="user-gear" size={20} color="#2563eb" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>账户设置</Text>
                    <Text style={styles.settingSubtitle}>管理个人信息和账户安全</Text>
                  </View>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>

            {/* 通知设置 */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleNotificationSettingsPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingItemContent}>
                <View style={styles.settingItemLeft}>
                  <View style={[styles.settingIcon, styles.greenIcon]}>
                    <FontAwesome6 name="bell" size={20} color="#059669" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>通知设置</Text>
                    <Text style={styles.settingSubtitle}>管理应用通知和消息推送</Text>
                  </View>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>

            {/* 关于我们 */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleAboutUsPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingItemContent}>
                <View style={styles.settingItemLeft}>
                  <View style={[styles.settingIcon, styles.purpleIcon]}>
                    <FontAwesome6 name="circle-info" size={20} color="#7c3aed" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>关于我们</Text>
                    <Text style={styles.settingSubtitle}>应用版本信息和法律条款</Text>
                  </View>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 底部信息区域 */}
          <View style={styles.bottomInfo}>
            <View style={styles.bottomInfoCard}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bottomIcon}
              >
                <FontAwesome6 name="heart" size={24} color="#ffffff" />
              </LinearGradient>
              <Text style={styles.bottomTitle}>感谢使用画叙</Text>
              <Text style={styles.bottomDescription}>让文字插上想象的翅膀，创造无限可能</Text>
              <View style={styles.versionInfo}>
                <Text style={styles.versionText}>版本 1.0.0</Text>
                <Text style={styles.copyrightText}>© 2024 画叙团队 版权所有</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;


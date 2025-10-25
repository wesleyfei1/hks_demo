 
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

const AboutUsScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handlePrivacyPolicyPress = () => {
    // 在实际应用中，这里会打开隐私政策页面或内置浏览器
    Linking.openURL('https://example.com/privacy-policy').catch(() => {
      Alert.alert('错误', '无法打开链接');
    });
  };

  const handleUserAgreementPress = () => {
    // 在实际应用中，这里会打开用户协议页面或内置浏览器
    Linking.openURL('https://example.com/user-agreement').catch(() => {
      Alert.alert('错误', '无法打开链接');
    });
  };

  const handleCopyrightPress = () => {
    // 在实际应用中，这里会打开版权声明页面或内置浏览器
    Linking.openURL('https://example.com/copyright').catch(() => {
      Alert.alert('错误', '无法打开链接');
    });
  };

  const handleContactPress = () => {
    // 在实际应用中，这里可能会打开邮件客户端或联系表单
    Linking.openURL('mailto:contact@huaxu.app').catch(() => {
      Alert.alert('错误', '无法打开邮件客户端');
    });
  };

  const handleFeedbackPress = () => {
    // 在实际应用中，这里可能会打开反馈表单或跳转到反馈页面
    Linking.openURL('https://example.com/feedback').catch(() => {
      Alert.alert('错误', '无法打开链接');
    });
  };

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
          
          <Text style={styles.headerTitle}>关于我们</Text>
          
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 应用信息卡片 */}
          <View style={styles.appInfoCard}>
            {/* 应用Logo */}
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.appLogoContainer}
            >
              <FontAwesome6 name="palette" size={40} color="#ffffff" />
            </LinearGradient>
            
            {/* 应用名称 */}
            <Text style={styles.appName}>画叙</Text>
            
            {/* 应用描述 */}
            <Text style={styles.appDescription}>
              一款基于AI技术的智能插图生成应用，让文字故事自动转化为图文并茂的视觉叙事，为您的创作增添无限可能。
            </Text>
            
            {/* 版本信息 */}
            <View style={styles.versionInfo}>
              <View style={styles.versionContent}>
                <FontAwesome6 name="code-branch" size={16} color="#6366f1" />
                <Text style={styles.versionLabel}>版本</Text>
                <Text style={styles.appVersion}>1.0.0</Text>
              </View>
            </View>
          </View>

          {/* 功能特色 */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>核心特色</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIcon}
                >
                  <FontAwesome6 name="wand-magic-sparkles" size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.featureTitle}>AI智能生成</Text>
                <Text style={styles.featureDescription}>自动分析故事内容生成匹配插图</Text>
              </View>
              
              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['#10b981', '#06b6d4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIcon}
                >
                  <FontAwesome6 name="palette" size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.featureTitle}>风格多样</Text>
                <Text style={styles.featureDescription}>多种艺术风格任您选择</Text>
              </View>
              
              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['#f59e0b', '#ef4444']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIcon}
                >
                  <FontAwesome6 name="pen-to-square" size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.featureTitle}>便捷编辑</Text>
                <Text style={styles.featureDescription}>轻松调整插图位置和内容</Text>
              </View>
              
              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['#3b82f6', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIcon}
                >
                  <FontAwesome6 name="book-open" size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.featureTitle}>沉浸阅读</Text>
                <Text style={styles.featureDescription}>享受图文并茂的阅读体验</Text>
              </View>
            </View>
          </View>

          {/* 法律条款和信息 */}
          <View style={styles.legalSection}>
            <Text style={styles.sectionTitle}>法律条款</Text>
            
            {/* 隐私政策 */}
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handlePrivacyPolicyPress}
              activeOpacity={0.7}
            >
              <View style={styles.legalItemContent}>
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.legalIcon}
                >
                  <FontAwesome6 name="shield-halved" size={16} color="#ffffff" />
                </LinearGradient>
                <View style={styles.legalTextContainer}>
                  <Text style={styles.legalTitle}>隐私政策</Text>
                  <Text style={styles.legalDescription}>了解我们如何保护您的隐私</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            {/* 用户协议 */}
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handleUserAgreementPress}
              activeOpacity={0.7}
            >
              <View style={styles.legalItemContent}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.legalIcon}
                >
                  <FontAwesome6 name="file-contract" size={16} color="#ffffff" />
                </LinearGradient>
                <View style={styles.legalTextContainer}>
                  <Text style={styles.legalTitle}>用户协议</Text>
                  <Text style={styles.legalDescription}>查看使用条款和服务协议</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            {/* 版权声明 */}
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handleCopyrightPress}
              activeOpacity={0.7}
            >
              <View style={styles.legalItemContent}>
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.legalIcon}
                >
                  <FontAwesome6 name="copyright" size={16} color="#ffffff" />
                </LinearGradient>
                <View style={styles.legalTextContainer}>
                  <Text style={styles.legalTitle}>版权声明</Text>
                  <Text style={styles.legalDescription}>了解知识产权和版权信息</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            {/* 联系我们 */}
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handleContactPress}
              activeOpacity={0.7}
            >
              <View style={styles.legalItemContent}>
                <LinearGradient
                  colors={['#f97316', '#ea580c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.legalIcon}
                >
                  <FontAwesome6 name="envelope" size={16} color="#ffffff" />
                </LinearGradient>
                <View style={styles.legalTextContainer}>
                  <Text style={styles.legalTitle}>联系我们</Text>
                  <Text style={styles.legalDescription}>有问题或建议？联系我们</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>

            {/* 意见反馈 */}
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handleFeedbackPress}
              activeOpacity={0.7}
            >
              <View style={styles.legalItemContent}>
                <LinearGradient
                  colors={['#ec4899', '#db2777']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.legalIcon}
                >
                  <FontAwesome6 name="comment-dots" size={16} color="#ffffff" />
                </LinearGradient>
                <View style={styles.legalTextContainer}>
                  <Text style={styles.legalTitle}>意见反馈</Text>
                  <Text style={styles.legalDescription}>帮助我们改进产品</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* 底部信息 */}
          <View style={styles.footerInfo}>
            <Text style={styles.copyrightText}>© 2024 画叙团队</Text>
            <Text style={styles.sloganText}>让文字插上想象的翅膀</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;


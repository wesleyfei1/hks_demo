

import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface UserInfo {
  nickname: string;
  email: string;
  id: string;
  phone?: string;
}

interface AdvancedSettings {
  useAiApi: boolean;
  // 文本模型设置（保持原有字段）
  apiKey: string;
  apiUrl: string;
  model: string;
  // 图像模型设置（新增）
  imageApiKey?: string;
  imageApiUrl?: string;
  imageModel?: string;
}

const AccountSettingsScreen = () => {
  const router = useRouter();
  
  // 用户信息状态
  const [userInfo, setUserInfo] = useState<UserInfo>({
    nickname: '画叙创作者',
    email: 'user@example.com',
    id: '123456789',
  });

  // 弹窗状态
  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [isAdvancedModalVisible, setIsAdvancedModalVisible] = useState(false);
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  // 记录当前打开模型选择器是为文本模型还是图像模型
  const [modelTarget, setModelTarget] = useState<'text' | 'image'>('text');

  // 表单输入状态
  const [newNickname, setNewNickname] = useState(userInfo.nickname);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

  // 高级设置状态
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    useAiApi: false,
    apiKey: '',
    apiUrl: '',
    model: 'gpt-4',
    imageApiKey: '',
    imageApiUrl: '',
    imageModel: 'sd-xl-1.0',
  });

  // Load persisted advanced settings on mount
  useEffect(() => {
    const loadAdvancedSettings = async () => {
      try {
        const raw = await AsyncStorage.getItem('@advanced_settings');
        if (raw) {
          const parsed = JSON.parse(raw) as AdvancedSettings;
          setAdvancedSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        // ignore load errors, keep defaults
        console.warn('Failed to load advanced settings', err);
      }
    };

    loadAdvancedSettings();
  }, []);

  // Persist advanced settings whenever they change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem('@advanced_settings', JSON.stringify(advancedSettings));
      } catch (err) {
        console.warn('Failed to save advanced settings', err);
      }
    };

    save();
  }, [advancedSettings]);

  // Toast状态
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 倒计时状态
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const emailTimerRef = useRef<number | null>(null);
  const phoneTimerRef = useRef<number | null>(null);

  // Toast显示函数
  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 修改昵称
  const handleNicknamePress = () => {
    setNewNickname(userInfo.nickname);
    setIsNicknameModalVisible(true);
  };

  const handleConfirmNickname = () => {
    const trimmedNickname = newNickname.trim();
    
    if (!trimmedNickname || trimmedNickname.length < 2 || trimmedNickname.length > 20) {
      showToast('昵称长度应为2-20个字符');
      return;
    }
    
    setUserInfo(prev => ({ ...prev, nickname: trimmedNickname }));
    setIsNicknameModalVisible(false);
    setNewNickname('');
    showToast('昵称修改成功');
  };

  // 修改密码
  const handlePasswordPress = () => {
    setIsPasswordModalVisible(true);
  };

  const handleConfirmPassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('请填写完整信息');
      return;
    }
    
    if (newPassword.length < 6) {
      showToast('新密码长度不能少于6位');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showToast('两次输入的密码不一致');
      return;
    }
    
    setIsPasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('密码修改成功');
  };

  // 绑定邮箱
  const handleEmailPress = () => {
    setIsEmailModalVisible(true);
  };

  const handleSendEmailCode = () => {
    if (!newEmail.trim()) {
      showToast('请先输入邮箱地址');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      showToast('请输入正确的邮箱格式');
      return;
    }
    
    // 开始倒计时
    setEmailCountdown(60);
    emailTimerRef.current = setInterval(() => {
      setEmailCountdown(prev => {
        if (prev <= 1) {
          if (emailTimerRef.current) {
            clearInterval(emailTimerRef.current);
            emailTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    showToast('验证码已发送');
  };

  const handleConfirmEmail = () => {
    if (!newEmail.trim() || !emailCode.trim()) {
      showToast('请填写完整信息');
      return;
    }
    
    if (emailCode === '123456') {
      setUserInfo(prev => ({ ...prev, email: newEmail.trim() }));
      setIsEmailModalVisible(false);
      setNewEmail('');
      setEmailCode('');
      showToast('邮箱绑定成功');
    } else {
      showToast('验证码错误');
    }
  };

  // 绑定手机
  const handlePhonePress = () => {
    setIsPhoneModalVisible(true);
  };

  const handleSendPhoneCode = () => {
    if (!newPhone.trim()) {
      showToast('请先输入手机号码');
      return;
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(newPhone.trim())) {
      showToast('请输入正确的手机号码');
      return;
    }
    
    // 开始倒计时
    setPhoneCountdown(60);
    phoneTimerRef.current = setInterval(() => {
      setPhoneCountdown(prev => {
        if (prev <= 1) {
          if (phoneTimerRef.current) {
            clearInterval(phoneTimerRef.current);
            phoneTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    showToast('验证码已发送');
  };

  const handleConfirmPhone = () => {
    if (!newPhone.trim() || !phoneCode.trim()) {
      showToast('请填写完整信息');
      return;
    }
    
    if (phoneCode === '123456') {
      setUserInfo(prev => ({ ...prev, phone: newPhone.trim() }));
      setIsPhoneModalVisible(false);
      setNewPhone('');
      setPhoneCode('');
      showToast('手机绑定成功');
    } else {
      showToast('验证码错误');
    }
  };

  // 账户安全
  const handleAccountSecurityPress = () => {
    showToast('账户安全功能开发中');
  };

  // 数据管理
  const handleDataManagementPress = () => {
    showToast('数据管理功能开发中');
  };

  // 高级选项
  const handleAdvancedOptionsPress = () => {
    setIsAdvancedModalVisible(true);
  };

  const handleConfirmAdvanced = () => {
    setIsAdvancedModalVisible(false);
    showToast('高级选项已保存');
  };

  // Available models split by type: text models vs image models
  const AVAILABLE_TEXT_MODELS = [
    'Qwen/QwQ-32B','Qwen/Qwen2.5-72B-Instruct-128K','Qwen/Qwen2.5-72B-Instruct','Qwen/Qwen2.5-32B-Instruct','Qwen/Qwen2.5-14B-Instruct','Qwen/Qwen2.5-7B-Instruct','Qwen/Qwen3-30B-A3B-Instruct-2507','deepseek-ai/DeepSeek-V3','Pro/deepseek-ai/DeepSeek-V3.1','THUDM/glm-4-9b-chat','internlm/internlm2_5-7b-chat','zai-org/GLM-4.6','zai-org/GLM-4.5'
  ];

  const AVAILABLE_IMAGE_MODELS = [
    'sd-xl-1.0','stable-diffusion-xl','sdxl','sd-v1-4','dalle-2','dalle-3','midjourney-v6','lucid-claude-image','gpt-image-1'
  ];

  const activeModelList = modelTarget === 'image' ? AVAILABLE_IMAGE_MODELS : AVAILABLE_TEXT_MODELS;
  const filteredModels = activeModelList.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()));

  const handleSelectModel = (modelName: string) => {
    if (modelTarget === 'text') {
      setAdvancedSettings(prev => ({ ...prev, model: modelName }));
    } else {
      setAdvancedSettings(prev => ({ ...prev, imageModel: modelName }));
    }
    setIsModelModalVisible(false);
    showToast(`已选择模型: ${modelName}`);
  };

  const handleAiApiToggle = () => {
    setAdvancedSettings(prev => ({
      ...prev,
      useAiApi: !prev.useAiApi,
    }));
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (emailTimerRef.current) {
        clearInterval(emailTimerRef.current);
      }
      if (phoneTimerRef.current) {
        clearInterval(phoneTimerRef.current);
      }
    };
  }, []);

  // 格式化显示的邮箱和手机
  const getMaskedEmail = (email: string) => {
    return email.replace(/(.{1})(.*)(@.*)/, '$1****$3');
  };

  const getMaskedPhone = (phone?: string) => {
    if (!phone) return '未绑定';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
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
          
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>账户设置</Text>
          </View>
          
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      {/* 主要内容区域 */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <View style={styles.userInfoCard}>
          <View style={styles.userInfoContent}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>画</Text>
            </LinearGradient>
            
            <View style={styles.userDetails}>
              <Text style={styles.nickname}>{userInfo.nickname}</Text>
              <Text style={styles.email}>{userInfo.email}</Text>
              <Text style={styles.userId}>ID: {userInfo.id}</Text>
            </View>
            
            <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
          </View>
        </View>

        {/* 账户设置列表 */}
        <View style={styles.settingsList}>
          {/* 修改昵称 */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleNicknamePress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemContent}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, styles.blueIcon]}>
                  <FontAwesome6 name="user-pen" size={16} color="#2563eb" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>修改昵称</Text>
                  <Text style={styles.settingSubtitle}>当前昵称：{userInfo.nickname}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>

          {/* 修改密码 */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handlePasswordPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemContent}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, styles.greenIcon]}>
                  <FontAwesome6 name="key" size={16} color="#059669" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>修改密码</Text>
                  <Text style={styles.settingSubtitle}>定期更换密码，保护账户安全</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>

          {/* 绑定邮箱 */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemContent}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, styles.purpleIcon]}>
                  <FontAwesome6 name="envelope" size={16} color="#7c3aed" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>绑定邮箱</Text>
                  <Text style={styles.settingSubtitle}>已绑定：{getMaskedEmail(userInfo.email)}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>

          {/* 绑定手机 */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handlePhonePress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemContent}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, styles.orangeIcon]}>
                  <FontAwesome6 name="mobile-screen" size={16} color="#ea580c" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>绑定手机</Text>
                  <Text style={styles.settingSubtitle}>{getMaskedPhone(userInfo.phone)}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>

          {/* 账户安全 */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleAccountSecurityPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemContent}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, styles.redIcon]}>
                  <FontAwesome6 name="shield-halved" size={16} color="#dc2626" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>账户安全</Text>
                  <Text style={styles.settingSubtitle}>登录记录、设备管理</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>

          {/* 数据管理 */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleDataManagementPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemContent}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, styles.indigoIcon]}>
                  <FontAwesome6 name="database" size={16} color="#4f46e5" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>数据管理</Text>
                  <Text style={styles.settingSubtitle}>数据备份、导出与删除</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 高级选项 */}
        <View style={styles.advancedSection}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleAdvancedOptionsPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemContent}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, styles.grayIcon]}>
                  <FontAwesome6 name="gears" size={16} color="#6b7280" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>高级选项</Text>
                  <Text style={styles.settingSubtitle}>AI模型配置、API设置等</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 修改昵称弹窗 */}
      <Modal
        visible={isNicknameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsNicknameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>修改昵称</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>新昵称</Text>
              <TextInput
                style={styles.textInput}
                value={newNickname}
                onChangeText={setNewNickname}
                placeholder="请输入新昵称"
                maxLength={20}
                autoFocus={true}
              />
              <Text style={styles.inputHint}>昵称长度为2-20个字符</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsNicknameModalVisible(false);
                  setNewNickname('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmNickname}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>确认</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 模型选择弹窗 */}
      <>
        {/* Use LayeredModal so on web it portals to body and appears above other modals */}
        {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
        {(() => {
          const LayeredModal = require('../../components/LayeredModal').default;
          return (
            <LayeredModal visible={isModelModalVisible} animationType="slide" onRequestClose={() => setIsModelModalVisible(false)}>
              <View style={[styles.modalContent, { maxHeight: '70%' }]}> 
                      <View style={styles.modalHeaderFixed}>
                        <Text style={styles.modalTitle}>选择模型</Text>
                        <TouchableOpacity onPress={() => setIsModelModalVisible(false)}>
                          <FontAwesome6 name="xmark" size={18} color="#6b7280" />
                        </TouchableOpacity>
                      </View>

                      {/* 搜索固定区域 */}
                      <View style={[styles.inputContainer, styles.searchWrapper]}>
                        <TextInput
                          style={styles.textInput}
                          placeholder="搜索模型..."
                          value={modelSearch}
                          onChangeText={setModelSearch}
                        />
                      </View>

                      {/* 列表填满剩余高度并可滚动 */}
                      <View style={{ flex: 1 }}>
                        <ScrollView
                          style={styles.modelListScroll}
                          contentContainerStyle={{ paddingBottom: 16 }}
                          showsVerticalScrollIndicator={true}
                        >
                          {filteredModels.map((m) => (
                            <TouchableOpacity key={m} style={styles.modelItem} onPress={() => handleSelectModel(m)}>
                              <Text style={styles.modelItemText}>{m}</Text>
                            </TouchableOpacity>
                          ))}
                          {filteredModels.length === 0 && (
                            <View style={{ padding: 12 }}><Text style={{ color: '#6b7280' }}>未找到匹配模型</Text></View>
                          )}
                        </ScrollView>
                      </View>
              </View>
            </LayeredModal>
          );
        })()}
      </>

      {/* 修改密码弹窗 */}
      <Modal
        visible={isPasswordModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>修改密码</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>当前密码</Text>
              <TextInput
                style={styles.textInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="请输入当前密码"
                secureTextEntry={true}
                autoFocus={true}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>新密码</Text>
              <TextInput
                style={styles.textInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="请输入新密码"
                secureTextEntry={true}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>确认新密码</Text>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="请再次输入新密码"
                secureTextEntry={true}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsPasswordModalVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPassword}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>确认</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 绑定邮箱弹窗 */}
      <Modal
        visible={isEmailModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEmailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>绑定邮箱</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>邮箱地址</Text>
              <TextInput
                style={styles.textInput}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="请输入邮箱地址"
                keyboardType="email-address"
                autoFocus={true}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>验证码</Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={styles.codeInput}
                  value={emailCode}
                  onChangeText={setEmailCode}
                  placeholder="请输入验证码"
                  keyboardType="numeric"
                  maxLength={6}
                />
                <TouchableOpacity
                  style={[styles.codeButton, emailCountdown > 0 && styles.codeButtonDisabled]}
                  onPress={handleSendEmailCode}
                  disabled={emailCountdown > 0}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.codeButtonText, emailCountdown > 0 && styles.codeButtonTextDisabled]}>
                    {emailCountdown > 0 ? `${emailCountdown}s` : '发送'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEmailModalVisible(false);
                  setNewEmail('');
                  setEmailCode('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmEmail}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>确认</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 绑定手机弹窗 */}
      <Modal
        visible={isPhoneModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPhoneModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>绑定手机</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>手机号码</Text>
              <TextInput
                style={styles.textInput}
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="请输入手机号码"
                keyboardType="phone-pad"
                maxLength={11}
                autoFocus={true}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>验证码</Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={styles.codeInput}
                  value={phoneCode}
                  onChangeText={setPhoneCode}
                  placeholder="请输入验证码"
                  keyboardType="numeric"
                  maxLength={6}
                />
                <TouchableOpacity
                  style={[styles.codeButton, phoneCountdown > 0 && styles.codeButtonDisabled]}
                  onPress={handleSendPhoneCode}
                  disabled={phoneCountdown > 0}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.codeButtonText, phoneCountdown > 0 && styles.codeButtonTextDisabled]}>
                    {phoneCountdown > 0 ? `${phoneCountdown}s` : '发送'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsPhoneModalVisible(false);
                  setNewPhone('');
                  setPhoneCode('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPhone}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>确认</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 高级选项弹窗 */}
      <Modal
        visible={isAdvancedModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsAdvancedModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: 12 }]}>
            <Text style={styles.modalTitle}>高级选项</Text>

            {/* 内容区：可滚动 */}
            <View style={{ flex: 1, width: '100%' }}>
              <ScrollView style={styles.advancedModalScroll} contentContainerStyle={{ paddingBottom: 12 }}>
                <View style={styles.advancedContainer}>
                  <Text style={styles.advancedSectionTitle}>AI大模型设置</Text>

                  <View style={styles.advancedItem}>
                    <View style={styles.advancedItemLeft}>
                      <FontAwesome6 name="brain" size={16} color="#6366f1" style={styles.advancedIcon} />
                      <Text style={styles.advancedItemText}>使用AI大模型的API</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.toggle, advancedSettings.useAiApi && styles.toggleActive]}
                      onPress={handleAiApiToggle}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.toggleThumb, advancedSettings.useAiApi && styles.toggleThumbActive]} />
                    </TouchableOpacity>
                  </View>

                  {advancedSettings.useAiApi && (
                    <View style={styles.apiSettings}>
                      {/* 文本模型设置（原有） */}
                      <Text style={styles.advancedSectionTitle}>文本模型（用于生成文本）</Text>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>API密钥（文本）</Text>
                        <TextInput
                          style={styles.textInput}
                          value={advancedSettings.apiKey}
                          onChangeText={(text) => setAdvancedSettings(prev => ({ ...prev, apiKey: text }))}
                          placeholder="请输入文本模型 API 密钥"
                          secureTextEntry={true}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>API地址（文本）</Text>
                        <TextInput
                          style={styles.textInput}
                          value={advancedSettings.apiUrl}
                          onChangeText={(text) => setAdvancedSettings(prev => ({ ...prev, apiUrl: text }))}
                          placeholder="请输入文本模型 API 地址"
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>模型选择（文本）</Text>
                        <TouchableOpacity
                          style={styles.modelSelector}
                          onPress={() => { setModelTarget('text'); setModelSearch(''); setIsModelModalVisible(true); }}
                        >
                          <Text style={styles.modelSelectorText}>{advancedSettings.model || '请选择模型'}</Text>
                          <FontAwesome6 name="chevron-down" size={12} color="#6b7280" />
                        </TouchableOpacity>
                      </View>

                      {/* 图像模型设置（新增） */}
                      <Text style={[styles.advancedSectionTitle, { marginTop: 8 }]}>图像模型（用于生成图片）</Text>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>API密钥（图像）</Text>
                        <TextInput
                          style={styles.textInput}
                          value={advancedSettings.imageApiKey}
                          onChangeText={(text) => setAdvancedSettings(prev => ({ ...prev, imageApiKey: text }))}
                          placeholder="请输入图像模型 API 密钥"
                          secureTextEntry={true}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>API地址（图像）</Text>
                        <TextInput
                          style={styles.textInput}
                          value={advancedSettings.imageApiUrl}
                          onChangeText={(text) => setAdvancedSettings(prev => ({ ...prev, imageApiUrl: text }))}
                          placeholder="请输入图像模型 API 地址"
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>模型选择（图像）</Text>
                        <TouchableOpacity
                          style={styles.modelSelector}
                          onPress={() => { setModelTarget('image'); setModelSearch(''); setIsModelModalVisible(true); }}
                        >
                          <Text style={styles.modelSelectorText}>{advancedSettings.imageModel || '请选择模型'}</Text>
                          <FontAwesome6 name="chevron-down" size={12} color="#6b7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* 底部固定按钮 */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAdvancedModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmAdvanced}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>保存</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast提示 */}
      {isToastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;




import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface IllustrationData {
  id: string;
  locationId: string;
  imageUrl: string;
  alt: string;
  category: string;
}

interface WorkData {
  title: string;
  author: string;
  content: string;
  illustrations: IllustrationData[];
}

const WorkEditScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const workId = params.workId as string || 'work_001';

  // 状态管理
  const [workTitle, setWorkTitle] = useState<string>('月光下的秘密花园');
  const [workAuthor, setWorkAuthor] = useState<string>('林小雨');
  const [storyContent, setStoryContent] = useState<string>('在一个宁静的夜晚，小女孩莉莉发现了一个隐藏在森林深处的神秘花园。每当月光洒下时，花园里的花朵就会发出柔和的光芒。\n\n莉莉小心翼翼地走进花园，发现这里的每一朵花都有自己独特的颜色和香味。最引人注目的是中央的那朵金色玫瑰，它的花瓣在月光下闪闪发光，仿佛镶嵌了无数颗钻石。\n\n突然，花园中央出现了一位美丽的花仙子。她告诉莉莉，这个花园是月光女神的秘密花园，只有心地纯洁的孩子才能看到它。花仙子送给莉莉一颗闪亮的种子，告诉她只要用心浇灌，就能在自己的花园里种出同样美丽的花朵。\n\n从那以后，莉莉每天都会来到这个秘密花园，和花仙子一起照顾那些神奇的花朵。她也学会了如何用心去感受大自然的美丽和神奇。');
  const [isIllustrationModalVisible, setIsIllustrationModalVisible] = useState<boolean>(false);
  const [isSaveConfirmModalVisible, setIsSaveConfirmModalVisible] = useState<boolean>(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [currentIllustrationId, setCurrentIllustrationId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // 插图数据
  const [illustrations, setIllustrations] = useState<IllustrationData[]>([
    {
      id: 'illustration_1',
      locationId: 'loc_001',
      imageUrl: 'https://s.coze.cn/image/ln5zxBOhYG0/',
      alt: '月光下的花园插图',
      category: '自然风景',
    },
    {
      id: 'illustration_2',
      locationId: 'loc_002',
      imageUrl: 'https://s.coze.cn/image/bi0ZJuIoGxY/',
      alt: '花园中的金色玫瑰',
      category: '自然风景',
    },
  ]);

  // 处理返回按钮
  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      setIsSaveConfirmModalVisible(true);
    } else {
      router.back();
    }
  };

  // 处理保存
  const handleSave = () => {
    if (!workTitle.trim()) {
      Alert.alert('提示', '请输入作品标题');
      return;
    }

    if (!workAuthor.trim()) {
      Alert.alert('提示', '请输入作者名称');
      return;
    }

    // 模拟保存过程
    const workData: WorkData = {
      title: workTitle,
      author: workAuthor,
      content: storyContent,
      illustrations: illustrations,
    };

    console.log('保存作品:', { workId, ...workData });
    setHasUnsavedChanges(false);
    Alert.alert('成功', '作品保存成功');
  };

  // 处理插图点击
  const handleIllustrationPress = (illustrationId: string) => {
    setCurrentIllustrationId(illustrationId);
    setIsIllustrationModalVisible(true);
  };

  // 重新生成插图
  const handleRegenerateIllustration = () => {
    if (currentIllustrationId) {
      const illustration = illustrations.find(ill => ill.id === currentIllustrationId);
      if (illustration) {
        router.push(`/p-illustration_select?workId=${workId}&locationId=${illustration.locationId}`);
      }
    }
    setIsIllustrationModalVisible(false);
  };

  // 替换为本地图片
  const handleReplaceWithLocalImage = () => {
    setIsIllustrationModalVisible(false);
    Alert.alert('提示', '功能开发中，敬请期待');
  };

  // 删除插图
  const handleDeleteIllustration = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这张插图吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            if (currentIllustrationId) {
              setIllustrations(prev => prev.filter(ill => ill.id !== currentIllustrationId));
              setHasUnsavedChanges(true);
            }
            setIsIllustrationModalVisible(false);
          },
        },
      ]
    );
  };

  // 放弃更改
  const handleDiscardChanges = () => {
    setIsSaveConfirmModalVisible(false);
    router.back();
  };

  // 保存并离开
  const handleSaveAndLeave = () => {
    handleSave();
    setIsSaveConfirmModalVisible(false);
    router.back();
  };

  // 进入全屏模式
  const handleEnterFullscreen = () => {
    setIsFullscreenMode(true);
  };

  // 退出全屏模式
  const handleExitFullscreen = () => {
    setIsFullscreenMode(false);
  };

  // 保存全屏内容
  const handleSaveFullscreen = () => {
    setHasUnsavedChanges(true);
    setIsFullscreenMode(false);
    Alert.alert('成功', '内容已保存');
  };

  // 计算字数
  const getCharacterCount = (): number => {
    return storyContent.length;
  };

  // 监听文本变化
  const handleTextChange = (text: string) => {
    setStoryContent(text);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (text: string) => {
    setWorkTitle(text);
    setHasUnsavedChanges(true);
  };

  const handleAuthorChange = (text: string) => {
    setWorkAuthor(text);
    setHasUnsavedChanges(true);
  };

  // 渲染插图
  const renderIllustration = (illustration: IllustrationData) => (
    <TouchableOpacity
      key={illustration.id}
      style={styles.illustrationPlaceholder}
      onPress={() => handleIllustrationPress(illustration.id)}
      activeOpacity={0.8}
    >
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationImageContainer}>
          <View style={styles.illustrationOverlay}>
            <View style={styles.illustrationOverlayContent}>
              <FontAwesome6 name="wand-magic-sparkles" size={20} color="#6366f1" />
              <Text style={styles.illustrationOverlayText}>点击编辑插图</Text>
            </View>
          </View>
        </View>
        <View style={styles.illustrationTagContainer}>
          <Text style={styles.illustrationTag}>AI生成插图</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isFullscreenMode) {
    return (
      <SafeAreaView style={styles.fullscreenContainer}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.fullscreenHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.fullscreenHeaderTitle}>沉浸式创作</Text>
          <TouchableOpacity
            style={styles.fullscreenCloseButton}
            onPress={handleExitFullscreen}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="xmark" size={20} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={styles.fullscreenContent}>
          <TextInput
            style={styles.fullscreenTextInput}
            value={storyContent}
            onChangeText={handleTextChange}
            placeholder="开始你的创作..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            autoFocus
          />
        </View>
        
        <View style={styles.fullscreenFooter}>
          <Text style={styles.fullscreenCharCount}>字数：{getCharacterCount()}</Text>
          <TouchableOpacity
            style={styles.fullscreenSaveButton}
            onPress={handleSaveFullscreen}
            activeOpacity={0.8}
          >
            <Text style={styles.fullscreenSaveButtonText}>保存并退出</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 顶部导航栏 */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconContainer}>
              <FontAwesome6 name="pen-to-square" size={16} color="#6366f1" />
            </View>
            <Text style={styles.headerTitle}>编辑作品</Text>
          </View>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>保存</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 作品信息区域 */}
          <View style={styles.workInfoSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>作品标题</Text>
              <TextInput
                style={styles.textInput}
                value={workTitle}
                onChangeText={handleTitleChange}
                placeholder="请输入作品标题"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>作者</Text>
              <TextInput
                style={styles.textInput}
                value={workAuthor}
                onChangeText={handleAuthorChange}
                placeholder="请输入作者名称"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* 文本编辑区域 */}
          <View style={styles.editorMain}>
            <View style={styles.editorCard}>
              <View style={styles.editorHeader}>
                <Text style={styles.editorTitle}>故事内容</Text>
                <View style={styles.editorHeaderRight}>
                  <View style={styles.charCountContainer}>
                    <FontAwesome6 name="circle-info" size={12} color="#6b7280" />
                    <Text style={styles.charCount}>字数：{getCharacterCount()}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.fullscreenToggleButton}
                    onPress={handleEnterFullscreen}
                    activeOpacity={0.7}
                  >
                    <FontAwesome6 name="expand" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.textEditorContainer}>
                <TextInput
                  style={styles.textEditor}
                  value={storyContent}
                  onChangeText={handleTextChange}
                  placeholder="开始你的创作..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  textAlignVertical="top"
                />
                
                {/* 插图占位符 */}
                {illustrations.map(renderIllustration)}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 插图编辑模态框 */}
        <Modal
          visible={isIllustrationModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsIllustrationModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.illustrationModalContainer}>
              <View style={styles.illustrationModalContent}>
                <View style={styles.illustrationModalHeader}>
                  <Text style={styles.illustrationModalTitle}>编辑插图</Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setIsIllustrationModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <FontAwesome6 name="xmark" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.illustrationModalOptions}>
                  <TouchableOpacity
                    style={styles.regenerateButton}
                    onPress={handleRegenerateIllustration}
                    activeOpacity={0.8}
                  >
                    <FontAwesome6 name="arrow-rotate-right" size={18} color="#ffffff" />
                    <Text style={styles.regenerateButtonText}>重新生成</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.replaceButton}
                    onPress={handleReplaceWithLocalImage}
                    activeOpacity={0.8}
                  >
                    <FontAwesome6 name="image" size={18} color="#1f2937" />
                    <Text style={styles.replaceButtonText}>替换为本地图片</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteIllustration}
                    activeOpacity={0.8}
                  >
                    <FontAwesome6 name="trash" size={18} color="#ffffff" />
                    <Text style={styles.deleteButtonText}>删除插图</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* 保存确认模态框 */}
        <Modal
          visible={isSaveConfirmModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsSaveConfirmModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.saveConfirmModalContainer}>
              <View style={styles.saveConfirmModalContent}>
                <View style={styles.saveConfirmIconContainer}>
                  <FontAwesome6 name="triangle-exclamation" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.saveConfirmTitle}>确认离开？</Text>
                <Text style={styles.saveConfirmMessage}>您有未保存的更改，确定要离开吗？</Text>
                
                <View style={styles.saveConfirmButtons}>
                  <TouchableOpacity
                    style={styles.discardButton}
                    onPress={handleDiscardChanges}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.discardButtonText}>放弃更改</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveAndLeaveButton}
                    onPress={handleSaveAndLeave}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveAndLeaveButtonText}>保存并离开</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WorkEditScreen;


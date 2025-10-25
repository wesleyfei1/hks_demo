

import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface StoryElement {
  type: 'text' | 'illustration';
  text?: string;
  url?: string;
  alt?: string;
  category?: string;
  thread?: string;
}

interface StoryThread {
  id: string;
  name: string;
  description: string;
}

interface StoryData {
  title: string;
  author: string;
  content: StoryElement[];
  threads: StoryThread[];
}

const ReadingViewScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [currentStoryData, setCurrentStoryData] = useState<StoryData | null>(null);
  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isFontModalVisible, setIsFontModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  // selectedImageAlt is intentionally kept for potential future use (alt text),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImageAlt, setSelectedImageAlt] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(8);
  // readingProgress is read-only for now; suppress unused-setter lint
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [readingProgress, setReadingProgress] = useState(12.5);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [lineSpacing, setLineSpacing] = useState('normal');
  const [isLoading, setIsLoading] = useState(true);

  // 模拟故事数据
  const storyDataMap: Record<string, StoryData> = {
    '1': {
      title: '月光下的秘密花园',
      author: '林小雨',
      content: [
        {
          type: 'text',
          text: '在一个宁静的夜晚，小女孩莉莉发现了一个隐藏在森林深处的神秘花园。每当月光洒下时，花园里的花朵就会发出柔和的光芒，仿佛有无数颗小星星在花丛中闪烁。',
          thread: '主线'
        },
        {
          type: 'illustration',
          url: 'https://s.coze.cn/image/tyDnPSJRFMY/',
          alt: '月光下的花园，花朵发出柔和的光芒',
          category: '自然风景'
        },
        {
          type: 'text',
          text: '莉莉小心翼翼地走进花园，她的脚步轻盈得像一只小猫。花园中央有一座古老的喷泉，泉水清澈见底，倒映着天上的明月和周围的花朵。',
          thread: '主线'
        },
        {
          type: 'text',
          text: '突然，莉莉听到了一阵轻柔的歌声。她循声望去，发现一只美丽的蝴蝶停在最大的那朵玫瑰花上，蝴蝶的翅膀闪烁着七彩的光芒。',
          thread: '暗线1'
        },
        {
          type: 'illustration',
          url: 'https://s.coze.cn/image/aIyDTr2Jmms/',
          alt: '七彩蝴蝶停在玫瑰花上',
          category: '动物'
        },
        {
          type: 'text',
          text: '蝴蝶开口说话了："你好，勇敢的小女孩。我是花园的守护者，已经在这里等待了一百年，终于等到了像你这样纯洁心灵的人。"',
          thread: '暗线1'
        },
        {
          type: 'text',
          text: '莉莉惊讶得说不出话来。她从来没有见过会说话的蝴蝶，更没有想过自己会成为花园的守护者等待的人。',
          thread: '主线'
        },
        {
          type: 'illustration',
          url: 'https://s.coze.cn/image/fw2TlIi8P30/',
          alt: '小女孩惊讶地看着会说话的蝴蝶',
          category: '人物'
        }
      ],
      threads: [
        { id: 'main', name: '主线', description: '莉莉发现花园的主要故事线' },
        { id: 'sub1', name: '暗线1', description: '花园守护者的秘密' }
      ]
    },
    '2': {
      title: '星际迷航：新纪元',
      author: '科幻迷',
      content: [
        {
          type: 'text',
          text: '2242年，人类终于突破了光速限制，开始了真正的星际探索。年轻的宇航员亚历克斯将踏上一段改变人类命运的旅程。',
          thread: '主线'
        },
        {
          type: 'illustration',
          url: 'https://s.coze.cn/image/hAoWsXUx1tE/',
          alt: '星际飞船在太空中飞行',
          category: '商业科技'
        }
      ],
      threads: [
        { id: 'main', name: '主线', description: '亚历克斯的星际探索之旅' }
      ]
    }
  };

  useEffect(() => {
    loadStoryContent();
  }, []);

  const loadStoryContent = async () => {
    try {
      setIsLoading(true);
      const workId = (params.workId as string) || '1';
      const storyData = storyDataMap[workId];
      
      if (storyData) {
        setCurrentStoryData(storyData);
        // 计算总页数（假设每页约500字）
        const totalWords = storyData.content.reduce((total, element) => {
          return total + (element.type === 'text' ? (element.text?.length || 0) : 0);
        }, 0);
        setTotalPages(Math.ceil(totalWords / 500));
      } else {
        Alert.alert('错误', '未找到该作品');
        router.back();
      }
    } catch (error) {
      console.error('加载故事内容失败:', error);
      Alert.alert('错误', '加载内容失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/p-works_list');
    }
  };

  const handleThreadNavPress = () => {
    setIsThreadModalVisible(true);
  };

  const handleThreadSelect = (threadName: string) => {
    setIsThreadModalVisible(false);
    // 这里可以添加线索高亮逻辑
    Alert.alert('线索导航', `已定位到"${threadName}"相关内容`);
  };

  const handleImagePress = (imageUrl: string, altText: string) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageAlt(altText);
    setIsImageModalVisible(true);
  };

  const handleFontSizePress = () => {
    setIsFontModalVisible(true);
  };

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handlePrevPagePress = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // 滚动到上一页
  scrollViewRef.current?.scrollTo({ y: -500, animated: true });
    }
  };

  const handleNextPagePress = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // 滚动到下一页
  scrollViewRef.current?.scrollTo({ y: 500, animated: true });
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
  };

  const handleLineSpacingChange = (spacing: string) => {
    setLineSpacing(spacing);
  };

  const getFontSizeStyle = () => {
    switch (fontSize) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      case 'xl':
        return 20;
      default:
        return 16;
    }
  };

  const getLineHeightStyle = () => {
    switch (lineSpacing) {
      case 'tight':
        return 1.5;
      case 'normal':
        return 1.8;
      case 'loose':
        return 2.2;
      default:
        return 1.8;
    }
  };

  const renderStoryElement = (element: StoryElement, index: number) => {
    if (element.type === 'text') {
      return (
        <Text
          key={index}
          style={[
            styles.storyText,
            {
              fontSize: getFontSizeStyle(),
              lineHeight: getFontSizeStyle() * getLineHeightStyle(),
            },
          ]}
        >
          {element.text}
        </Text>
      );
    } else if (element.type === 'illustration' && element.url) {
      return (
        <View key={index} style={styles.illustrationContainer}>
          <TouchableOpacity
            onPress={() => handleImagePress(element.url!, element.alt || '')}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: element.url }}
              style={styles.illustrationImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Text style={styles.illustrationCaption}>{element.alt}</Text>
        </View>
      );
    }
    return null;
  };

  if (isLoading || !currentStoryData) {
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
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.workInfo}>
          <Text style={styles.workTitle}>{currentStoryData.title}</Text>
          <Text style={styles.workAuthor}>作者：{currentStoryData.author}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleThreadNavPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="sitemap" size={20} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* 阅读进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>第 {currentPage} 页 / 共 {totalPages} 页</Text>
          <Text style={styles.readingTime}>预计 15 分钟</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${readingProgress}%` }
            ]}
          />
        </View>
      </View>

      {/* 阅读区域 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.readingMain}
        contentContainerStyle={styles.readingContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStoryData.content.map((element, index) =>
          renderStoryElement(element, index)
        )}
      </ScrollView>

      {/* 底部控制栏 */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleFontSizePress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="text-height" size={16} color="#6b7280" />
          <Text style={styles.controlButtonText}>字体</Text>
        </TouchableOpacity>
        
        <View style={styles.pageControls}>
          <TouchableOpacity
            style={styles.pageButton}
            onPress={handlePrevPagePress}
            activeOpacity={0.7}
            disabled={currentPage <= 1}
          >
            <FontAwesome6 name="chevron-left" size={14} color="#6b7280" />
          </TouchableOpacity>
          <View style={styles.pageNumberContainer}>
            <Text style={styles.pageNumber}>{currentPage}</Text>
          </View>
          <TouchableOpacity
            style={styles.pageButton}
            onPress={handleNextPagePress}
            activeOpacity={0.7}
            disabled={currentPage >= totalPages}
          >
            <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleBookmarkPress}
          activeOpacity={0.7}
        >
          <FontAwesome6
            name="bookmark"
            size={16}
            color={isBookmarked ? '#f59e0b' : '#6b7280'}
            solid={isBookmarked}
          />
          <Text style={styles.controlButtonText}>书签</Text>
        </TouchableOpacity>
      </View>

      {/* 线索导航弹窗 */}
      <Modal
        visible={isThreadModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsThreadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setIsThreadModalVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>故事线索</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsThreadModalVisible(false)}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="xmark" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.threadList}>
              {currentStoryData.threads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  style={styles.threadItem}
                  onPress={() => handleThreadSelect(thread.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.threadInfo}>
                    <Text style={styles.threadName}>{thread.name}</Text>
                    <Text style={styles.threadDescription}>{thread.description}</Text>
                  </View>
                  <FontAwesome6 name="chevron-right" size={14} color="#6b7280" />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.modalCloseButtonLarge}
              onPress={() => setIsThreadModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 图片放大预览弹窗 */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalBackdrop}
            onPress={() => setIsImageModalVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.imageModalContent}>
            <Image
              source={{ uri: selectedImageUrl }}
              style={styles.enlargedImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.imageModalCloseButton}
              onPress={() => setIsImageModalVisible(false)}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="xmark" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 字体大小设置弹窗 */}
      <Modal
        visible={isFontModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFontModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setIsFontModalVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>阅读设置</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsFontModalVisible(false)}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="xmark" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.fontSettingsContainer}>
              <View style={styles.fontSettingSection}>
                <Text style={styles.fontSettingLabel}>字体大小</Text>
                <View style={styles.fontSizeButtons}>
                  {[
                    { key: 'small', label: '小' },
                    { key: 'medium', label: '中' },
                    { key: 'large', label: '大' },
                    { key: 'xl', label: '特大' },
                  ].map((size) => (
                    <TouchableOpacity
                      key={size.key}
                      style={[
                        styles.fontSizeButton,
                        fontSize === size.key && styles.fontSizeButtonActive
                      ]}
                      onPress={() => handleFontSizeChange(size.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.fontSizeButtonText,
                          fontSize === size.key && styles.fontSizeButtonTextActive
                        ]}
                      >
                        {size.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.fontSettingSection}>
                <Text style={styles.fontSettingLabel}>行间距</Text>
                <View style={styles.lineSpacingButtons}>
                  {[
                    { key: 'tight', label: '紧密' },
                    { key: 'normal', label: '正常' },
                    { key: 'loose', label: '宽松' },
                  ].map((spacing) => (
                    <TouchableOpacity
                      key={spacing.key}
                      style={[
                        styles.lineSpacingButton,
                        lineSpacing === spacing.key && styles.lineSpacingButtonActive
                      ]}
                      onPress={() => handleLineSpacingChange(spacing.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.lineSpacingButtonText,
                          lineSpacing === spacing.key && styles.lineSpacingButtonTextActive
                        ]}
                      >
                        {spacing.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.modalCloseButtonLarge}
              onPress={() => setIsFontModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReadingViewScreen;


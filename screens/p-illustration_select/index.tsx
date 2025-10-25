

import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface IllustrationLocation {
  id: string;
  text: string;
  type: string;
  status: string;
  selectedIllustration?: string;
}

interface IllustrationCard {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  isRecommended?: boolean;
}

const IllustrationSelectScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const workId = params.workId || 'work_001';

  // 模拟插图定位点数据
  const [illustrationLocations] = React.useState<IllustrationLocation[]>([
    {
      id: 'location_001',
      text: '在一个宁静的夜晚，小女孩莉莉发现了一个隐藏在森林深处的神秘花园。每当月光洒下时，花园里的花朵就会发出柔和的光芒，仿佛有无数颗星星落在了花瓣上...',
      type: '画面感强',
      status: '待选择'
    },
    {
      id: 'location_002',
      text: '突然，花园中央的一朵金色玫瑰开始发光，一个小精灵从花蕊中飞了出来，对莉莉说："欢迎来到月光花园，勇敢的小访客..."',
      type: '高潮',
      status: '待选择'
    },
    {
      id: 'location_003',
      text: '莉莉和小精灵成为了好朋友，每个月圆之夜，她都会来到这个神秘花园，与小精灵一起探索花园的秘密，度过一个又一个神奇的夜晚...',
      type: '结局',
      status: '待选择'
    }
  ]);

  // 模拟插图数据
  const [illustrationCards] = React.useState<IllustrationCard[]>([
    {
      id: '1',
      imageUrl: 'https://s.coze.cn/image/v-wVquB8pJs/',
      title: '月光花园',
      category: '自然风景',
      isRecommended: true
    },
    {
      id: '2',
      imageUrl: 'https://s.coze.cn/image/7ZpYEoNxpCM/',
      title: '森林秘境',
      category: '自然风景'
    },
    {
      id: '3',
      imageUrl: 'https://s.coze.cn/image/LNo1XTWT3_k/',
      title: '奇幻时刻',
      category: '人物'
    },
    {
      id: '4',
      imageUrl: 'https://s.coze.cn/image/UEMsGoIoIqo/',
      title: '花园入口',
      category: '建筑城市'
    }
  ]);

  const [currentLocationIndex, setCurrentLocationIndex] = React.useState(0);
  const [selectedIllustrationId, setSelectedIllustrationId] = React.useState<string | null>(null);
  const [isLoadingVisible, setIsLoadingVisible] = React.useState(false);
  const [scrollIndicatorIndex, setScrollIndicatorIndex] = React.useState(0);

  const currentLocation = illustrationLocations[currentLocationIndex];

  const handleBackPress = () => {
    Alert.alert(
      '确定要返回吗？',
      '当前的插图选择将不会保存。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            }
          }
        }
      ]
    );
  };

  const handleSkipPress = () => {
    Alert.alert(
      '确定要跳过吗？',
      '确定要跳过这个插图位置吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: handleSelectionComplete('skip') }
      ]
    );
  };

  const handleIllustrationSelect = (illustrationId: string) => {
    setSelectedIllustrationId(illustrationId);
  };

  const handleRegeneratePress = () => {
    Alert.alert(
      '确定要重新生成吗？',
      '当前的选择将被清空。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            setIsLoadingVisible(true);
            setTimeout(() => {
              setIsLoadingVisible(false);
              setSelectedIllustrationId(null);
              showToast('插图重新生成完成！');
            }, 3000);
          }
        }
      ]
    );
  };

  const handleAbandonPress = () => {
    Alert.alert(
      '确定要放弃吗？',
      '确定要放弃这个插图位置吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: handleSelectionComplete('abandon') }
      ]
    );
  };

  const handleConfirmSelection = () => {
    if (selectedIllustrationId) {
      handleSelectionComplete('select');
    }
  };

  const handlePreviousPress = () => {
    if (currentLocationIndex > 0) {
      setCurrentLocationIndex(currentLocationIndex - 1);
      setSelectedIllustrationId(null);
    }
  };

  const handleNextPress = () => {
    if (currentLocationIndex < illustrationLocations.length - 1) {
      setCurrentLocationIndex(currentLocationIndex + 1);
      setSelectedIllustrationId(null);
    } else {
      router.push(`/p-reading_view?workId=${workId}`);
    }
  };

  const handleSelectionComplete = (action: 'select' | 'abandon' | 'skip') => () => {
    const updatedLocation = { ...currentLocation };
    
    if (action === 'select' && selectedIllustrationId) {
      updatedLocation.status = '已选择';
      updatedLocation.selectedIllustration = selectedIllustrationId;
      showToast('插图选择成功！');
    } else if (action === 'abandon') {
      updatedLocation.status = '已放弃';
      showToast('已放弃此处插图');
    } else if (action === 'skip') {
      updatedLocation.status = '已跳过';
      showToast('已跳过此位置');
    }

    // 这里应该更新状态到服务器或本地存储
    // 简化处理，直接跳转到下一步
    if (currentLocationIndex < illustrationLocations.length - 1) {
      setCurrentLocationIndex(currentLocationIndex + 1);
      setSelectedIllustrationId(null);
    } else {
      setTimeout(() => {
        router.push(`/p-reading_view?workId=${workId}`);
      }, 1000);
    }
  };

  const showToast = (message: string) => {
    // 简化的Toast实现
    Alert.alert('提示', message);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollLeft = event.nativeEvent.contentOffset.x;
    const scrollWidth = event.nativeEvent.contentSize.width - event.nativeEvent.layoutMeasurement.width;
    const percentage = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
    const indicatorIndex = Math.floor(percentage * (illustrationCards.length - 1));
    setScrollIndicatorIndex(indicatorIndex);
  };

  const renderIllustrationCard = ({ item }: { item: IllustrationCard }) => {
    const isSelected = selectedIllustrationId === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.illustrationCard, isSelected && styles.illustrationCardSelected]}
        onPress={() => handleIllustrationSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.illustrationImageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.illustrationImage} />
          {item.isRecommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>推荐</Text>
            </View>
          )}
        </View>
        <View style={styles.illustrationInfo}>
          <Text style={styles.illustrationTitle}>{item.title}</Text>
          <TouchableOpacity
            style={styles.selectIllustrationButton}
            onPress={() => handleIllustrationSelect(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectIllustrationButtonText}>选择此图</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderScrollIndicator = () => {
    return (
      <View style={styles.scrollIndicators}>
        {illustrationCards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.scrollIndicator,
              index === scrollIndicatorIndex && styles.scrollIndicatorActive
            ]}
          />
        ))}
      </View>
    );
  };

  // 文本高亮功能：保留实现，未来可用于富文本渲染
  // （当前 UI 使用纯文本显示，避免未使用函数触发 lint 警告）

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
          
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIcon}>
              <FontAwesome6 name="image" size={16} color="#6366f1" />
            </View>
            <Text style={styles.headerTitle}>选择插图</Text>
          </View>
          
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipPress}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>跳过</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 断点提示 */}
        <View style={styles.breakpointIndicator}>
          <LinearGradient
            colors={['#dbeafe', '#ede9fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.breakpointIndicatorGradient}
          >
            <View style={styles.breakpointIndicatorContent}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.breakpointIndicatorIcon}
              >
                <FontAwesome6 name="wand-magic-sparkles" size={14} color="#ffffff" />
              </LinearGradient>
              <View style={styles.breakpointIndicatorText}>
                <Text style={styles.breakpointIndicatorTitle}>智能插图生成</Text>
                <Text style={styles.breakpointIndicatorSubtitle}>为故事中的精彩片段生成插图</Text>
              </View>
              <View style={styles.breakpointIndicatorProgress}>
                <Text style={styles.breakpointIndicatorProgressText}>
                  {currentLocationIndex + 1}/{illustrationLocations.length}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 当前文本段落预览 */}
        <View style={styles.textPreviewSection}>
          <View style={styles.textPreviewHeader}>
            <FontAwesome6 name="quote-left" size={16} color="#6366f1" />
            <Text style={styles.textPreviewTitle}>当前段落</Text>
          </View>
          <View style={styles.currentParagraph}>
            <Text style={styles.currentParagraphText}>
              {currentLocation.text}
            </Text>
          </View>
          
          {/* 上下文联系信息 */}
          <View style={styles.contextInfo}>
            <Text style={styles.contextInfoTitle}>AI分析：</Text>
            <View style={styles.contextTags}>
              <View style={[styles.contextTag, styles.contextTagGreen]}>
                <Text style={styles.contextTagText}>画面感强</Text>
              </View>
              <View style={[styles.contextTag, styles.contextTagBlue]}>
                <Text style={styles.contextTagText}>关键场景</Text>
              </View>
              <View style={[styles.contextTag, styles.contextTagPurple]}>
                <Text style={styles.contextTagText}>情感丰富</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 候选插图展示区 */}
        <View style={styles.illustrationSection}>
          <View style={styles.illustrationSectionHeader}>
            <FontAwesome6 name="images" size={16} color="#6366f1" />
            <Text style={styles.illustrationSectionTitle}>候选插图</Text>
          </View>
          
          {/* 插图滚动区域 */}
          <View style={styles.illustrationScrollContainer}>
            <FlatList
              data={illustrationCards}
              renderItem={renderIllustrationCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.illustrationScrollContent}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
            {renderScrollIndicator()}
          </View>

          {/* 插图操作按钮 */}
          <View style={styles.illustrationActions}>
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={handleRegeneratePress}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="arrow-rotate-right" size={16} color="#1f2937" />
              <Text style={styles.regenerateButtonText}>重新生成</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.abandonButton}
              onPress={handleAbandonPress}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="xmark" size={16} color="#6b7280" />
              <Text style={styles.abandonButtonText}>放弃此处插图</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部操作区域 */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedIllustrationId && styles.confirmButtonDisabled
            ]}
            onPress={handleConfirmSelection}
            disabled={!selectedIllustrationId}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedIllustrationId ? ['#6366f1', '#8b5cf6'] : ['#9ca3af', '#9ca3af']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButtonGradient}
            >
              <FontAwesome6 name="check" size={18} color="#ffffff" />
              <Text style={styles.confirmButtonText}>确认选择</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navigationButton,
                currentLocationIndex === 0 && styles.navigationButtonDisabled
              ]}
              onPress={handlePreviousPress}
              disabled={currentLocationIndex === 0}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="arrow-left" size={16} color={currentLocationIndex === 0 ? '#9ca3af' : '#6b7280'} />
              <Text style={[
                styles.navigationButtonText,
                currentLocationIndex === 0 && styles.navigationButtonTextDisabled
              ]}>上一个</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={handleNextPress}
              activeOpacity={0.8}
            >
              <Text style={styles.navigationButtonText}>
                {currentLocationIndex === illustrationLocations.length - 1 ? '完成' : '下一个'}
              </Text>
              <FontAwesome6 
                name={currentLocationIndex === illustrationLocations.length - 1 ? 'check' : 'arrow-right'} 
                size={16} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 加载遮罩 */}
      {isLoadingVisible && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingTitle}>正在生成插图...</Text>
            <Text style={styles.loadingSubtitle}>AI正在为您创作独特的插图</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default IllustrationSelectScreen;


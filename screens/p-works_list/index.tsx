

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import WorkCard from '../../components/WorkCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import FilterDropdown from './components/FilterDropdown';

interface WorkItem {
  id: string;
  title: string;
  author: string;
  category: string;
  categoryColor: string;
  description: string;
  coverImage: string;
  lastModified: string;
  created: string;
}

const WorksListScreen = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);

  const [worksData, setWorksData] = useState<WorkItem[]>([]);

  useEffect(() => {
    const loadWorks = async () => {
      try {
        const raw = await AsyncStorage.getItem('@user_works');
        if (raw) {
          const parsed = JSON.parse(raw) as WorkItem[];
          setWorksData(parsed);
        } else {
          // 保持为空数组（移除示例/虚假作品）
          setWorksData([]);
        }
      } catch (err) {
        console.error('加载作品列表失败', err);
        setWorksData([]);
      }
    };

    loadWorks();
  }, []);

  const filterOptions = [
    { value: 'all', label: '全部作品', color: '#6366f1' },
    { value: '童话故事', label: '童话故事', color: '#10b981' },
    { value: '科幻冒险', label: '科幻冒险', color: '#3b82f6' },
    { value: '动物故事', label: '动物故事', color: '#f59e0b' },
    { value: '魔法奇幻', label: '魔法奇幻', color: '#8b5cf6' },
  ];

  const filteredWorks = worksData.filter(work => {
    if (selectedFilters.includes('all')) return true;
    return selectedFilters.includes(work.category);
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('提示', '刷新完成');
    } catch {
      Alert.alert('错误', '刷新失败，请重试');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.push('/p-settings');
  }, [router]);

  const handleNewWorkPress = useCallback(() => {
    router.push('/p-new_work');
  }, [router]);

  const handleTutorialPress = useCallback(() => {
    Alert.alert('提示', '使用教程功能开发中');
  }, []);

  const handleFilterPress = useCallback(() => {
    setIsFilterDropdownVisible(!isFilterDropdownVisible);
  }, [isFilterDropdownVisible]);

  const handleFilterChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
    setIsFilterDropdownVisible(false);
  }, []);

  const handleReadWork = useCallback((workId: string) => {
    router.push(`/p-reading_view?workId=${workId}`);
  }, [router]);

  const handleEditWork = useCallback((workId: string) => {
    router.push(`/p-work_edit?workId=${workId}`);
  }, [router]);

  const handleCreateFirstWork = useCallback(() => {
    router.push('/p-new_work');
  }, [router]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyStateGradient}
      >
        <View style={styles.emptyStateIconContainer}>
          <FontAwesome6 name="pen-fancy" size={32} color="#ffffff" />
        </View>
        <Text style={styles.emptyStateTitle}>开始你的创作之旅</Text>
        <Text style={styles.emptyStateDescription}>
          还没有任何作品，点击下方按钮开始创作你的第一个故事
        </Text>
        <TouchableOpacity
          style={styles.createFirstWorkButton}
          onPress={handleCreateFirstWork}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createFirstWorkButtonGradient}
          >
            <FontAwesome6 name="plus" size={16} color="#ffffff" style={styles.createFirstWorkButtonIcon} />
            <Text style={styles.createFirstWorkButtonText}>创建第一个作品</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

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
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="gear" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <View style={styles.appIconContainer}>
              <FontAwesome6 name="palette" size={18} color="#6366f1" />
            </View>
            <Text style={styles.appTitle}>画叙</Text>
          </View>
          
          <TouchableOpacity
            style={styles.newWorkButton}
            onPress={handleNewWorkPress}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="plus" size={14} color="#6366f1" style={styles.newWorkButtonIcon} />
            <Text style={styles.newWorkButtonText}>新建作品</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* 主要内容 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 特色欢迎横幅 */}
        <LinearGradient
          colors={['#f3f4f6', '#dbeafe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.welcomeBanner}
        >
          <View style={styles.welcomeBannerContent}>
            <View style={styles.welcomeBannerIconContainer}>
              <FontAwesome6 name="lightbulb" size={20} color="#ffffff" />
            </View>
            <View style={styles.welcomeBannerTextContainer}>
              <Text style={styles.welcomeBannerTitle}>欢迎来到画叙创作空间</Text>
              <Text style={styles.welcomeBannerDescription}>
                释放你的想象力，创作独一无二的图文故事作品
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.tutorialButton}
            onPress={handleTutorialPress}
            activeOpacity={0.7}
          >
            <Text style={styles.tutorialButtonText}>使用教程</Text>
            <FontAwesome6 name="arrow-right" size={12} color="#6366f1" style={styles.tutorialButtonIcon} />
          </TouchableOpacity>
        </LinearGradient>

        {/* 页面标题和筛选 */}
        <View style={styles.pageTitleSection}>
          <View style={styles.pageTitleContainer}>
            <Text style={styles.pageTitle}>我的作品</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={handleFilterPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="bars" size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.pageSubtitle}>创作属于你的图文故事</Text>
        </View>

        {/* 筛选下拉菜单 */}
        {isFilterDropdownVisible && (
          <FilterDropdown
            options={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClose={() => setIsFilterDropdownVisible(false)}
          />
        )}

        {/* 作品列表或空状态 */}
        {filteredWorks.length > 0 ? (
          <View style={styles.worksList}>
            {filteredWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                onRead={handleReadWork}
                onEdit={handleEditWork}
              />
            ))}
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorksListScreen;


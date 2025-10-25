import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const AnalysisResultScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const workId = (params.workId as string) || '';

  const [analysisText, setAnalysisText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      setIsLoading(true);
      if (!workId) {
        Alert.alert('错误', '未提供作品ID');
        router.back();
        return;
      }
      const raw = await AsyncStorage.getItem(`@analysis_${workId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAnalysisText(parsed.analysis || '');
      } else {
        setAnalysisText('未找到分析结果。');
      }
    } catch (err) {
      console.error('读取分析失败', err);
      Alert.alert('错误', '读取分析失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await AsyncStorage.setItem(`@analysis_${workId}`, JSON.stringify({ analysis: analysisText, updatedAt: new Date().toISOString() }));
      setIsEditing(false);
      Alert.alert('已保存', '分析文档已保存');
    } catch (err) {
      console.error('保存分析失败', err);
      Alert.alert('错误', '保存失败');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 分析结果</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
        {isLoading ? (
          <Text>加载中...</Text>
        ) : (
          <>
            {!isEditing ? (
              <View>
                <Text style={styles.analysisText}>{analysisText}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                  <Text style={styles.editButtonText}>编辑</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TextInput
                  value={analysisText}
                  onChangeText={setAnalysisText}
                  multiline
                  style={styles.textInput}
                />
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                    <Text style={styles.saveButtonText}>保存</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisResultScreen;



import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

interface WorkData {
  title: string;
  author: string;
  content: string;
  createdAt: string;
}

const NewWorkScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [storyTitle, setStoryTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showCreationTip, setShowCreationTip] = useState(true);
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);
  const [saveStatus, setSaveStatus] = useState('已保存');
  const [fullscreenContent, setFullscreenContent] = useState('');
  
  const autoSaveTimerRef = useRef<number | null>(null);
  const storyContentRef = useRef<TextInput>(null);

  // 字数统计
  const characterCount = storyContent.length;
  const paragraphCount = storyContent.split('\n').filter(p => p.trim().length > 0).length;
  
  // 检查是否可以继续
  const canProceed = storyTitle.trim().length > 0 && 
                    authorName.trim().length > 0 && 
                    storyContent.trim().length > 100;

  // 处理文本变化
  const handleTextChange = (setter: (text: string) => void) => (text: string) => {
    setter(text);
    setHasUnsavedChanges(true);
    
    // 清除之前的自动保存定时器
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // 3秒后自动保存
    autoSaveTimerRef.current = setTimeout(autoSave, 3000) as unknown as number;
  };

  // 自动保存
  const autoSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setSaveStatus('保存中...');
    
    try {
      const workData: WorkData = {
        title: storyTitle.trim(),
        author: authorName.trim(),
        content: storyContent.trim(),
        createdAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('@new_work_draft', JSON.stringify(workData));
      setHasUnsavedChanges(false);
      setSaveStatus('已保存');
    } catch (error) {
      console.error('自动保存失败:', error);
      setSaveStatus('保存失败');
    }
  };

  // 手动保存草稿
  const handleSaveDraft = async () => {
    setSaveStatus('保存中...');
    
    setSaveStatus('保存中...');
    
    try {
      const workData: WorkData = {
        title: storyTitle.trim(),
        author: authorName.trim(),
        content: storyContent.trim(),
        createdAt: new Date().toISOString()
      };
      
  await AsyncStorage.setItem('@new_work_draft', JSON.stringify(workData));
  setHasUnsavedChanges(false);
  setSaveStatus('已保存');
  showToast('草稿保存成功');
    } catch (error) {
      console.error('保存草稿失败:', error);
      setSaveStatus('保存失败');
      showToast('保存失败，请重试');
    }
  };

  // 开始AI分析
  const handleStartAnalysis = async () => {
    if (isAnalyzing || !canProceed) return;

    setIsAnalyzing(true);
    setShowLoadingModal(true);

    try {
      // 先保存当前内容
      await handleSaveDraft();

      // 生成临时作品ID
      const tempWorkId = 'temp_' + Date.now();

      const workData: WorkData = {
        title: storyTitle.trim(),
        author: authorName.trim(),
        content: storyContent.trim(),
        createdAt: new Date().toISOString()
      };

      // 保存当前内容到localStorage（模拟后端保存）
      await AsyncStorage.setItem(`@temp_work_${tempWorkId}`, JSON.stringify(workData));

      // 调用 AI 分析接口
      const analysis = await analyzeStoryWithModel(storyContent.trim());

      // 保存分析结果
      try {
        await AsyncStorage.setItem(`@analysis_${tempWorkId}`, JSON.stringify({ analysis, createdAt: new Date().toISOString() }));
      } catch (saveErr) {
        console.error('保存分析结果失败', saveErr);
        // 不阻塞用户流程，提示并继续导航
        Alert.alert('警告', '分析已生成，但保存到本地失败；稍后可能无法查看分析结果。');
      }

      // 先隐藏 loading 状态再导航，避免覆盖新页面的 UI
      setShowLoadingModal(false);
      setIsAnalyzing(false);

      // 跳转到分析结果展示页
      console.log('导航到分析结果页, workId=', tempWorkId);
      router.push(`/p-analysis_result?workId=${tempWorkId}`);
    } catch (error) {
      console.error('AI分析失败:', error);
      showToast('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
      setShowLoadingModal(false);
    }
  };

  // 调用大模型分析文本
  const analyzeStoryWithModel = async (text: string) => {
    // First: try to call a local backend bridge if available
    const callLocalAnalyze = async (textToAnalyze: string) => {
      try {
        // include advanced settings if provided so backend can use same model params
        const raw = await AsyncStorage.getItem('@advanced_settings');
        const settings = raw ? JSON.parse(raw) : null;

        // build payload with both camelCase and snake_case keys so bridge server
        // (which accepts either) can map them reliably to backend scripts
        const payload: any = { text: textToAnalyze };
        if (settings && settings.useAiApi) {
          const k = settings.apiKey || '';
          const u = settings.apiUrl || '';
          const m = settings.model || '';
          const p = settings.provider || settings.providerName || '';

          // snake_case
          if (k) payload.api_key = k;
          if (u) payload.api_url = u;
          if (m) payload.model = m;
          if (p) payload.provider = p;

          // camelCase
          if (k) payload.apiKey = k;
          if (u) payload.apiUrl = u;
          if (m) payload.model = m; // same key name for model
          if (p) payload.provider = p;
        }

        // Helpful debug log so developer can see exactly what is forwarded
        console.log('[callLocalAnalyze] payload ->', payload);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        // When running in development, prefer simulate mode for faster, deterministic responses
        const simulateQuery = typeof __DEV__ !== 'undefined' && __DEV__ ? '?simulate=1' : '';
        const res = await fetch(`http://127.0.0.1:8000/analyze${simulateQuery}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal as any
        });
        clearTimeout(timeout);
        if (!res.ok) {
          const textErr = await res.text();
          console.warn('[callLocalAnalyze] local backend returned non-200', res.status, textErr);
          throw new Error(`local backend ${res.status}`);
        }

        const j = await res.json();
        // bridge server typically returns { ok: true, result: {...} }
        if (j && (j.ok === true) && j.result) {
          return j.result;
        }

        // if bridge returned files (image flow) or other shapes, return raw
        if (j && (j.ok === true) && (j.files || j.url)) {
          return j;
        }

        console.warn('[callLocalAnalyze] unexpected local backend response', j);
        throw new Error('invalid local backend response');
      } catch (e) {
        console.warn('本地后端不可用或超时，回退到前端/外部 API', e);
        return null;
      }
    };

    try {
      // try local backend first
      const local = await callLocalAnalyze(text);
      if (local) {
        // Try to make a readable string for UI; fallback to JSON string
        try {
          // if segments exist, create a compact summary
          if (local.segments && Array.isArray(local.segments)) {
            const segs = local.segments as any[];
            const summaries = segs.slice(0, 6).map((s, i) => `${i + 1}. ${s.summary || (s.text || '').slice(0, 80)}`);
            return `（后端分析）\n段落摘要：\n${summaries.join('\n\n')}`;
          }
          return JSON.stringify(local, null, 2);
        } catch (e) {
          return JSON.stringify(local);
        }
      }

      // 如果本地后端不可用，继续使用原有高级设置/直接调用第三方 API 的逻辑
      // 读取全局高级设置
      const raw = await AsyncStorage.getItem('@advanced_settings');
      let settings = null;
      if (raw) settings = JSON.parse(raw);

      const systemPrompt = '你是一个有经验的故事分析师，任务是：请分析以下文本的故事脉络，理清文本包含哪些故事，其是否存在明线暗线并且理清。输出应包含：\n1) 概要（两到三段）\n2) 识别出的线索/情节（分段列出明线与暗线）\n3) 建议的插图位置（给出段落索引或关键词）';
      const userPrompt = `用户文本：\n${text}`;

      // If external API configured, prefer that
  if (settings && settings.useAiApi && settings.apiKey) {
        const apiUrl = settings.apiUrl?.trim() || 'https://api.openai.com/v1/chat/completions';
        const model = settings.model || 'gpt-4';

        // 简单诊断：检查 apiUrl 是否可达（非保密）
        try {
          await fetch(apiUrl, { method: 'GET' });
        } catch (connErr) {
          console.warn('AI API 连接检测失败', connErr);
          Alert.alert('⚠️ AI 服务连接失败', '无法访问配置的 API 地址，请检查网络或 API 地址是否正确。');
          throw connErr;
        }

        const payload = {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1200,
          temperature: 0.2
        };
        // 规范化 apiUrl：如果用户只填了 base URL（如 https://.../v1），补全为 /chat/completions
        const normalizeApiUrl = (url: string) => {
          if (!url) return url;
          let u = url.trim();
          if (u.endsWith('/')) u = u.slice(0, -1);
          if (/\/chat\//i.test(u) || /completions/i.test(u)) return u;
          if (/\/v1$/i.test(u)) return `${u}/chat/completions`;
          if (!/v\d+/i.test(u)) return `${u}/v1/chat/completions`;
          return `${u}/chat/completions`;
        };

        const requestUrl = normalizeApiUrl(apiUrl);
        console.log('AI 请求 URL:', requestUrl);

          try {
          const res = await fetch(requestUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            const textErr = await res.text();
            console.warn('AI 服务返回非200，回退到模拟分析', res.status, textErr);
            let parsedErr: any = null;
            try { parsedErr = JSON.parse(textErr); } catch (e) { parsedErr = null; }

            // If provider returned balance/model errors, surface clearer message
            if (parsedErr && (parsedErr.code === 30011 || /paid balance|balance is insufficient|requires paid/i.test(parsedErr.message || ''))) {
              Alert.alert('AI 服务拒绝（需付费）', `${parsedErr.message || '所选模型需要付费或余额不足，请充值或更换模型/Key。'}`);
            } else if (parsedErr && (parsedErr.code === 20012 || /模型不存在/i.test(parsedErr.message || ''))) {
              const availableModels = [
                'Qwen/QwQ-32B', 'Qwen/Qwen2.5-72B-Instruct', 'deepseek-ai/DeepSeek-V3'
              ];
              Alert.alert('模型不存在', `${parsedErr.message || '模型不存在，请检查模型名称。'}\n\n请在设置 -> 高级选项中将模型字段改为：\n${availableModels.join('\n')}`);
            } else {
              Alert.alert('⚠️ AI 服务不可用', 'AI 服务响应异常，已使用基于你文本片段的降级模拟分析。');
            }

            const snippet = text.length > 300 ? text.slice(0, 300) + '...' : text;
            return `（降级模拟分析，基于用户文本片段）\n用户原文片段：\n${snippet}\n\n（注：请求返回 ${res.status}，响应体：${textErr}）\n\n概要：\n根据上述用户文本，可判断该故事的核心是...（模拟）\n明线：...\n暗线：...\n建议插图位置：第若干段（基于文本关键词）`;
          }

          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || JSON.stringify(data);
          return content;
        } catch (fetchErr) {
          console.error('调用 AI 服务失败，使用模拟分析回退', fetchErr);
          Alert.alert('⚠️ AI 服务不可用', '无法连接 AI 服务，已使用基于你文本片段的降级模拟分析。');
          const snippet = text.length > 300 ? text.slice(0, 300) + '...' : text;
          return `（降级模拟分析，基于用户文本片段）\n用户原文片段：\n${snippet}\n\n概要：\n根据上述用户文本，可判断该故事的核心是...（模拟）\n明线：...\n暗线：...\n建议插图位置：第若干段（基于文本关键词）`;
        }
      }

      // Fallback: mock analysis if no API configured
      return `（模拟分析）\n概要：\n该故事讲述了……（示例）\n明线：主人公寻找秘密花园……\n暗线：花园守护者的过去与秘密……\n建议插图位置：开头、高潮、结尾。`;
    } catch (err) {
      console.error('analyzeStoryWithModel error', err);
      throw err;
    }
  };

  // 处理返回
  const handleBackPress = () => {
    if (!hasUnsavedChanges) {
      router.back();
      return;
    }
    setShowConfirmModal(true);
  };

  // 确认离开
  const handleConfirmLeave = () => {
    setShowConfirmModal(false);
    router.back();
  };

  // 取消离开
  const handleCancelLeave = () => {
    setShowConfirmModal(false);
  };

  // 关闭创作提示
  const handleCloseTip = () => {
    setShowCreationTip(false);
  };

  // 全屏编辑
  const handleFullscreenPress = () => {
    setFullscreenContent(storyContent);
    setShowFullscreenEditor(true);
  };

  // 保存并退出全屏
  const handleSaveFullscreen = () => {
    setStoryContent(fullscreenContent);
    setShowFullscreenEditor(false);
    showToast('内容已保存');
  };

  // 退出全屏
  const handleExitFullscreen = () => {
    setShowFullscreenEditor(false);
  };

  // 显示提示消息
  const showToast = (message: string) => {
    Alert.alert('提示', message);
  };

  // 生成标题
  const handleGenerateTitle = () => {
    showToast('AI正在生成标题...');
    // TODO: 实现AI生成标题功能
  };

  // 扩展情节
  const handleExpandPlot = () => {
    showToast('AI正在扩展情节...');
    // TODO: 实现AI扩展情节功能
  };

  // 人物塑造
  const handleCharacterDevelopment = () => {
    showToast('AI正在进行人物塑造...');
    // TODO: 实现AI人物塑造功能
  };

  // 图片生成：使用 imageModel / imageApiUrl / imageApiKey
  const generateIllustrationWithModel = async (prompt: string) => {
    try {
      // First try local backend
      try {
        // include image settings if present so backend can use front-end configured image model
        const rawSettings = await AsyncStorage.getItem('@advanced_settings');
        const settings = rawSettings ? JSON.parse(rawSettings) : null;
        const payload: any = { prompt };
        if (settings && settings.useAiApi) {
          const k = settings.imageApiKey || '';
          const u = settings.imageApiUrl || '';
          const m = settings.imageModel || '';
          const s = settings.imageSize || '';

          // snake_case
          if (k) payload.image_api_key = k;
          if (u) payload.image_api_url = u;
          if (m) payload.image_model = m;
          if (s) payload.image_size = s;
          // camelCase
          if (k) payload.imageApiKey = k;
          if (u) payload.imageApiUrl = u;
          if (m) payload.imageModel = m;
          if (s) payload.imageSize = s;
        }

        console.log('[generateIllustrationWithModel] payload ->', payload);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch('http://127.0.0.1:8000/generate_image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal as any
        });
        clearTimeout(timeout);
        if (res.ok) {
          const j = await res.json();
          if (j.ok && j.files) {
            // bridge may return filenames; map them to accessible static URLs
            const files = Array.isArray(j.files) ? j.files : [];
            const mapped = files.map((f: string) => {
              if (!f) return f;
              if (/^https?:\/\//i.test(f)) return f;
              // if f contains generated_images path already, use as-is relative
              const name = f.split(/[\\/]/).pop();
              return `http://127.0.0.1:8000/static/generated_images/${name}`;
            });
            return { url: '', files: mapped, raw: j };
          }
          if (j.ok && j.url) {
            return { url: j.url, raw: j };
          }
        }
      } catch (e) {
        console.warn('本地图像生成后端不可用或超时，回退到前端/外部 API', e);
      }

      const raw = await AsyncStorage.getItem('@advanced_settings');
      const settings = raw ? JSON.parse(raw) : null;

      if (settings && settings.useAiApi && settings.imageApiKey) {
        const apiUrl = settings.imageApiUrl?.trim() || '';
        const model = settings.imageModel || 'sd-xl-1.0';

        if (!apiUrl) {
          Alert.alert('图像 API 未配置', '请在设置 -> 高级选项中配置图像模型的 API 地址与 Key');
          throw new Error('image api not configured');
        }

        // 简单可达性检测（GET）
        try {
          await fetch(apiUrl, { method: 'GET' });
        } catch (connErr) {
          console.warn('图像 AI API 连接检测失败', connErr);
          Alert.alert('⚠️ 图像 AI 服务连接失败', '无法访问配置的图像 API 地址，请检查网络或 API 地址是否正确。');
          throw connErr;
        }

        const normalizeApiUrl = (url: string) => {
          if (!url) return url;
          let u = url.trim();
          if (u.endsWith('/')) u = u.slice(0, -1);
          if (/generate|images|image/i.test(u)) return u;
          if (/v1$/i.test(u)) return `${u}/images/generate`;
          return `${u}/v1/images/generate`;
        };

        const requestUrl = normalizeApiUrl(apiUrl);
        console.log('图像 AI 请求 URL:', requestUrl);

        const payload: any = {
          model,
          prompt,
          size: '1024x1024'
        };

        const res = await fetch(requestUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings.imageApiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const txt = await res.text();
          console.warn('图像生成返回非200', res.status, txt);
          Alert.alert('图像生成失败', '图像服务返回错误；已使用模拟图像作为回退。');
          return { url: '', message: `（模拟图像）基于提示：${prompt.slice(0, 200)}...` };
        }

        const data = await res.json();
        const imageUrl = data.data?.[0]?.url || data.result?.[0]?.url || data.output?.[0]?.url || '';
        return { url: imageUrl, raw: data };
      }

      return { url: '', message: `（未配置图像 API）模拟图像基于文本：${prompt.slice(0, 200)}...` };
    } catch (err) {
      console.error('generateIllustrationWithModel error', err);
      throw err;
    }
  };

  // 点击触发图像生成功能（基于当前故事内容的一段提示）
  const handleGenerateIllustration = async () => {
    const prompt = storyContent.trim().slice(0, 800) || storyTitle || '请为以下故事生成一张插图';
    setShowLoadingModal(true);
    try {
      const result = await generateIllustrationWithModel(prompt);
      setShowLoadingModal(false);
      if (result?.url) {
        // 简单处理：存储到本地并提示用户
        const id = 'temp_img_' + Date.now();
        await AsyncStorage.setItem(`@${id}`, JSON.stringify({ url: result.url, prompt, createdAt: new Date().toISOString() }));
        Alert.alert('图像生成完成', `生成的图片已保存为临时项（${id}），URL: ${result.url}`);
      } else {
        Alert.alert('图像生成（回退）', result?.message || '已使用模拟图像');
      }
    } catch (err) {
      setShowLoadingModal(false);
      console.error('handleGenerateIllustration error', err);
      Alert.alert('图像生成失败', '请检查图像模型设置或稍后重试');
    } finally {
      setShowLoadingModal(false);
    }
  };

  // 组件卸载时保存
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSave();
    };
  }, []);

  // 检查是否有未完成的草稿
  useEffect(() => {
    // auto-restore saved draft silently on open
    const checkDraft = async () => {
      try {
        const savedDraft = await AsyncStorage.getItem('@new_work_draft');
        if (savedDraft) {
          const draft: WorkData = JSON.parse(savedDraft);
          setStoryTitle(draft.title || '');
          setAuthorName(draft.author || '');
          setStoryContent(draft.content || '');
          setHasUnsavedChanges(false);
          setSaveStatus('已保存');
        }
      } catch (error) {
        console.error('检查草稿失败:', error);
      }
    };

    checkDraft();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
            >
              <FontAwesome6 name="arrow-left" size={20} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <View style={styles.titleIcon}>
                <FontAwesome6 name="plus" size={16} color="#6366f1" />
              </View>
              <Text style={styles.headerTitle}>新建作品</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.nextButton,
                !canProceed && styles.nextButtonDisabled
              ]}
              onPress={handleStartAnalysis}
              disabled={!canProceed}
            >
              <FontAwesome6 name="arrow-right" size={12} color={canProceed ? '#6366f1' : '#9ca3af'} />
              <Text style={[
                styles.nextButtonText,
                !canProceed && styles.nextButtonTextDisabled
              ]}>
                下一步
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* 主要内容区域 */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 引导提示卡片 */}
          {showCreationTip && (
            <LinearGradient
              colors={['#eff6ff', '#f3e8ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tipCard}
            >
              <TouchableOpacity 
                style={styles.closeTipButton}
                onPress={handleCloseTip}
              >
                <FontAwesome6 name="xmark" size={14} color="#6b7280" />
              </TouchableOpacity>
              <View style={styles.tipContent}>
                <LinearGradient
                  colors={['#3b82f6', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tipIcon}
                >
                  <FontAwesome6 name="lightbulb" size={18} color="#ffffff" />
                </LinearGradient>
                <View style={styles.tipTextContainer}>
                  <Text style={styles.tipTitle}>创作提示</Text>
                  <Text style={styles.tipDescription}>
                    请输入你的故事文本，AI将智能分析故事结构并在关键位置生成插图。建议文本长度在500-5000字之间，包含完整的故事情节。
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* 文本输入区域 */}
          <View style={styles.inputSection}>
            {/* 故事标题 */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <FontAwesome6 name="bookmark" size={14} color="#6366f1" />
                <Text style={styles.labelText}>故事标题</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="请输入故事标题..."
                placeholderTextColor="#9ca3af"
                value={storyTitle}
                onChangeText={handleTextChange(setStoryTitle)}
                maxLength={50}
              />
              <Text style={styles.characterCount}>
                {storyTitle.length}/50
              </Text>
            </View>

            {/* 作者名称 */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <FontAwesome6 name="user" size={14} color="#6366f1" />
                <Text style={styles.labelText}>作者名称</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="请输入作者名称..."
                placeholderTextColor="#9ca3af"
                value={authorName}
                onChangeText={handleTextChange(setAuthorName)}
                maxLength={30}
              />
              <Text style={styles.characterCount}>
                {authorName.length}/30
              </Text>
            </View>

            {/* 故事内容 */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelWithButton}>
                <View style={styles.inputLabel}>
                  <FontAwesome6 name="pen-fancy" size={14} color="#6366f1" />
                  <Text style={styles.labelText}>故事内容</Text>
                </View>
                <TouchableOpacity 
                  style={styles.fullscreenButton}
                  onPress={handleFullscreenPress}
                >
                  <FontAwesome6 name="expand" size={14} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <TextInput
                ref={storyContentRef}
                style={styles.textArea}
                placeholder={`请输入你的故事内容...

例如：
在一个遥远的王国里，住着一位勇敢的骑士。他听说在黑森林的深处，有一条恶龙绑架了美丽的公主...

建议包含：
• 完整的故事情节
• 生动的场景描写
• 鲜明的人物形象`}
                placeholderTextColor="#9ca3af"
                value={storyContent}
                onChangeText={handleTextChange(setStoryContent)}
                maxLength={10000}
                multiline
                textAlignVertical="top"
              />
              
              {/* 字数统计和自动保存状态 */}
              <View style={styles.statsContainer}>
                <View style={styles.statsLeft}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>字数：</Text>
                    <Text style={[
                      styles.statValue,
                      characterCount > 8000 && styles.statValueDanger,
                      characterCount > 5000 && characterCount <= 8000 && styles.statValueWarning
                    ]}>
                      {characterCount}
                    </Text>
                    <Text style={styles.statLabel}>/10000</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>段落：</Text>
                    <Text style={styles.statValue}>{paragraphCount}</Text>
                  </View>
                </View>
                
                <View style={styles.saveStatusContainer}>
                  <View style={[
                    styles.saveIndicator,
                    saveStatus === '已保存' && styles.saveIndicatorSuccess,
                    saveStatus === '保存中...' && styles.saveIndicatorWarning
                  ]} />
                  <Text style={[
                    styles.saveStatusText,
                    saveStatus === '已保存' && styles.saveStatusSuccess,
                    saveStatus === '保存中...' && styles.saveStatusWarning
                  ]}>
                    {saveStatus}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 功能提示卡片 */}
          <View style={styles.featuresGrid}>
            <LinearGradient
              colors={['#f0fdf4', '#ecfdf5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureIcon}
              >
                <FontAwesome6 name="wand-magic-sparkles" size={14} color="#ffffff" />
              </LinearGradient>
              <Text style={styles.featureTitle}>AI智能分析</Text>
              <Text style={styles.featureDescription}>
                自动识别故事高潮、结局和画面感强的段落
              </Text>
            </LinearGradient>
            
            <TouchableOpacity onPress={handleGenerateIllustration} activeOpacity={0.85}>
              <LinearGradient
                colors={['#faf5ff', '#f3e8ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureCard}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIcon}
                >
                  <FontAwesome6 name="image" size={14} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.featureTitle}>智能插图生成</Text>
                <Text style={styles.featureDescription}>
                  为关键情节生成高质量、风格一致的插图
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* 左侧功能面板 */}
          <View style={styles.panelsContainer}>
            <View style={styles.leftPanel}>
              <View style={styles.panelHeader}>
                <FontAwesome6 name="lightbulb" size={14} color="#f59e0b" />
                <Text style={styles.panelTitle}>创作助手</Text>
              </View>
              <View style={styles.assistantButtons}>
                <TouchableOpacity 
                  style={styles.assistantButton}
                  onPress={handleGenerateTitle}
                >
                  <Text style={styles.assistantButtonText}>生成标题</Text>
                  <FontAwesome6 name="chevron-right" size={12} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.assistantButton}
                  onPress={handleExpandPlot}
                >
                  <Text style={styles.assistantButtonText}>扩展情节</Text>
                  <FontAwesome6 name="chevron-right" size={12} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.assistantButton}
                  onPress={handleCharacterDevelopment}
                >
                  <Text style={styles.assistantButtonText}>人物塑造</Text>
                  <FontAwesome6 name="chevron-right" size={12} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.rightPanel}>
              <View style={styles.panelHeader}>
                <FontAwesome6 name="book-open" size={14} color="#6366f1" />
                <Text style={styles.panelTitle}>写作建议</Text>
              </View>
              <View style={styles.writingTips}>
                <Text style={styles.tipItem}>• 尝试添加更多感官细节，让场景更生动</Text>
                <Text style={styles.tipItem}>• 考虑增加人物对话，推动情节发展</Text>
                <Text style={styles.tipItem}>• 注意故事节奏，适当设置悬念和高潮</Text>
                <Text style={styles.tipItem}>• 保持一致的叙述视角，增强代入感</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部操作区域 */}
        <View style={styles.bottomActions}>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.saveDraftButton}
              onPress={handleSaveDraft}
            >
              <FontAwesome6 name="floppy-disk" size={14} color="#1f2937" />
              <Text style={styles.saveDraftButtonText}>保存草稿</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.startAnalysisButton,
                !canProceed && styles.startAnalysisButtonDisabled
              ]}
              onPress={handleStartAnalysis}
              disabled={!canProceed || isAnalyzing}
            >
              <LinearGradient
                colors={canProceed ? ['#6366f1', '#8b5cf6'] : ['#d1d5db', '#9ca3af']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startAnalysisGradient}
              >
                <FontAwesome6 name="rocket" size={14} color="#ffffff" />
                <Text style={styles.startAnalysisButtonText}>开始AI分析</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* 底部提示 */}
          <View style={styles.bottomTip}>
            <FontAwesome6 name="shield-halved" size={12} color="#6b7280" />
            <Text style={styles.bottomTipText}>
              你的内容会自动保存，不用担心丢失
            </Text>
          </View>
        </View>

        {/* 确认对话框 */}
        <Modal
          visible={showConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={handleCancelLeave}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModal}>
              <View style={styles.confirmIcon}>
                <FontAwesome6 name="triangle-exclamation" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.confirmTitle}>确认离开？</Text>
              <Text style={styles.confirmMessage}>
                你有未保存的内容，确定要离开吗？
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity 
                  style={styles.confirmCancelButton}
                  onPress={handleCancelLeave}
                >
                  <Text style={styles.confirmCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmLeaveButton}
                  onPress={handleConfirmLeave}
                >
                  <Text style={styles.confirmLeaveButtonText}>确认离开</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 加载动画 */}
        <Modal
          visible={showLoadingModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
                <View style={styles.loadingModal}>
                  <ActivityIndicator size="large" color="#6366f1" style={{ marginBottom: 12 }} />
                  <Text style={styles.loadingTitle}>AI正在分析你的故事...</Text>
                  <Text style={styles.loadingMessage}>
                    这可能需要几分钟时间，请耐心等待
                  </Text>
                </View>
          </View>
        </Modal>

        {/* 全屏编辑器 */}
        <Modal
          visible={showFullscreenEditor}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.fullscreenContainer}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fullscreenHeader}
            >
              <Text style={styles.fullscreenHeaderTitle}>沉浸式创作</Text>
              <TouchableOpacity 
                style={styles.fullscreenCloseButton}
                onPress={handleExitFullscreen}
              >
                <FontAwesome6 name="xmark" size={20} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
            
            <View style={styles.fullscreenContent}>
              <TextInput
                style={styles.fullscreenTextInput}
                placeholder="开始你的创作..."
                placeholderTextColor="#9ca3af"
                value={fullscreenContent}
                onChangeText={setFullscreenContent}
                maxLength={10000}
                multiline
                textAlignVertical="top"
                autoFocus
              />
            </View>
            
            <View style={styles.fullscreenFooter}>
              <Text style={styles.fullscreenCharCount}>
                字数：{fullscreenContent.length}/10000
              </Text>
              <TouchableOpacity 
                style={styles.fullscreenSaveButton}
                onPress={handleSaveFullscreen}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.fullscreenSaveGradient}
                >
                  <Text style={styles.fullscreenSaveButtonText}>保存并退出</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewWorkScreen;


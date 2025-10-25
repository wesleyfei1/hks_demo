import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
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
  const [analysisObj, setAnalysisObj] = useState<any | null>(null);
  const [originalAnalysis, setOriginalAnalysis] = useState<any | null>(null);
  const [imagesMap, setImagesMap] = useState<Record<string, string[]>>({});
  const [generatingMap, setGeneratingMap] = useState<Record<string, boolean>>({});
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });

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
        const analysis = parsed.analysis || '';
        // if analysis is an object (backend structured), keep it
        if (analysis && typeof analysis === 'object') {
          setAnalysisObj(analysis);
          setOriginalAnalysis(analysis);
          // Also keep a plaintext fallback for editing
          try {
            setAnalysisText(JSON.stringify(analysis, null, 2));
          } catch (e) {
            setAnalysisText(String(analysis));
          }
          // load any cached images for this analysis
          const imgsRaw = await AsyncStorage.getItem(`@analysis_images_${workId}`);
          if (imgsRaw) setImagesMap(JSON.parse(imgsRaw));
        } else {
          setAnalysisText(analysis || '');
          setAnalysisObj(null);
          setOriginalAnalysis(analysis || null);
        }
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

  // generate illustration for a suggested slot
  const generateForSuggestion = async (slot: any, idx: number) => {
    const key = slot.position || `slot_${idx}`;
    // avoid duplicate triggers
    if (generatingMap[key]) return;
    setGeneratingMap(prev => ({ ...prev, [key]: true }));

    try {
      // build prompt: prefer provided reason or nearby text
      const prompt = slot.prompt || slot.reason || slot.summary || slot.text || `为故事片段生成一张插图：${slot.position || ''}`;

      // attempt local bridge first
      try {
        const rawSettings = await AsyncStorage.getItem('@advanced_settings');
        const settings = rawSettings ? JSON.parse(rawSettings) : null;
  // Prepare payload: include the full slot as `segments` so bridge can
  // directly write the segments JSON file expected by generate_images_from_scenes.py
  const payload: any = { prompt };
  // include structured segments; bridge will accept either a dict {segments:[...]} or an array
  payload.segments = { segments: [slot] };
        if (settings && settings.useAiApi) {
          const k = settings.imageApiKey || '';
          const u = settings.imageApiUrl || '';
          const m = settings.imageModel || '';
          const s = settings.imageSize || '';
          if (k) payload.image_api_key = k;
          if (u) payload.image_api_url = u;
          if (m) payload.image_model = m;
          if (s) payload.image_size = s;
          if (k) payload.imageApiKey = k;
          if (u) payload.imageApiUrl = u;
          if (m) payload.imageModel = m;
          if (s) payload.imageSize = s;
        }

        // allow simulate during dev by adding simulate flag if analysisObj?.simulated
        if (analysisObj && (analysisObj.simulated === true)) payload.simulate = true;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        const res = await fetch('http://127.0.0.1:8000/generate_image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal as any
        });
        clearTimeout(timeout);
        if (res.ok) {
          const j = await res.json();
          let mapped: string[] = [];
          if (j.ok && j.files) {
            const files = Array.isArray(j.files) ? j.files : [];
            mapped = files.map((f: string) => {
              if (!f) return f;
              if (/^https?:\/\//i.test(f)) return f;
              const name = f.split(/[\\/]/).pop();
              return `http://127.0.0.1:8000/static/generated_images/${name}`;
            });
          } else if (j.ok && j.url) {
            mapped = [j.url];
          } else if (j.simulated && j.files) {
            mapped = (j.files || []).map((n: string) => `http://127.0.0.1:8000/static/generated_images/${n}`);
          }

          // persist to imagesMap and AsyncStorage
          setImagesMap(prev => {
            const next = { ...prev, [key]: mapped };
            AsyncStorage.setItem(`@analysis_images_${workId}`, JSON.stringify(next)).catch(() => {});
            return next;
          });
        } else {
          const txt = await res.text();
          console.warn('generate_image non-200', res.status, txt);
          Alert.alert('图像生成失败', '本地桥接返回错误，已查看控制台');
        }
      } catch (e) {
        console.warn('本地图像生成失败，尝试远程或模拟', e);
        Alert.alert('提示', '图像生成失败，可能未配置本地桥接或上游服务不可用。');
      }
    } finally {
      setGeneratingMap(prev => ({ ...prev, [key]: false }));
    }
  };

  // generate all suggested illustrations with limited concurrency
  const generateAllSuggestions = async (concurrency = 2) => {
    if (!analysisObj || !Array.isArray(analysisObj.suggested_illustrations)) return;
    const slots = analysisObj.suggested_illustrations;
    setBatchGenerating(true);
    setBatchProgress({ done: 0, total: slots.length });

    // simple concurrency pool
    let i = 0;
    const runNext = async () => {
      const idx = i++;
      if (idx >= slots.length) return;
      try {
        await generateForSuggestion(slots[idx], idx);
      } catch (e) {
        console.warn('generateAllSuggestions slot failed', idx, e);
      }
      setBatchProgress(prev => ({ ...prev, done: prev.done + 1 }));
      await runNext();
    };

    const workers = [];
    for (let w = 0; w < Math.max(1, concurrency); w++) {
      workers.push(runNext());
    }

    await Promise.all(workers);
    setBatchGenerating(false);
  };

  const handleSaveEdit = async () => {
    try {
      // If the edited text is valid JSON, save as structured analysis; otherwise save as string
      let toSave: any = analysisText;
      try {
        const parsed = JSON.parse(analysisText);
        toSave = parsed;
      } catch (e) {
        // keep as text
        toSave = analysisText;
      }

      await AsyncStorage.setItem(`@analysis_${workId}`, JSON.stringify({ analysis: toSave, updatedAt: new Date().toISOString() }));
      setIsEditing(false);
      // update in-memory structures
      if (typeof toSave === 'object') {
        setAnalysisObj(toSave);
        setOriginalAnalysis(toSave);
        try { setAnalysisText(JSON.stringify(toSave, null, 2)); } catch (e) { setAnalysisText(String(toSave)); }
      } else {
        setAnalysisObj(null);
        setOriginalAnalysis(toSave);
      }

      Alert.alert('已保存', '分析文档已保存');
    } catch (err) {
      console.error('保存分析失败', err);
      Alert.alert('错误', '保存失败');
    }
  };

  const handleCancelEdit = () => {
    // restore original analysis state
    if (originalAnalysis && typeof originalAnalysis === 'object') {
      setAnalysisObj(originalAnalysis);
      try { setAnalysisText(JSON.stringify(originalAnalysis, null, 2)); } catch (e) { setAnalysisText(String(originalAnalysis)); }
    } else {
      setAnalysisObj(null);
      setAnalysisText(originalAnalysis || '');
    }
    setIsEditing(false);
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
                {analysisObj ? (
                  <View>
                    {/* segments */}
                    {Array.isArray(analysisObj.segments) && (
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ fontWeight: '700', marginBottom: 8 }}>段落 / 场景</Text>
                        {analysisObj.segments.map((s: any, i: number) => (
                          <View key={`seg_${i}`} style={{ marginBottom: 10 }}>
                            <Text style={{ fontWeight: '600' }}>{`段 ${i + 1}: ${s.summary || (s.text || '').slice(0, 80)}`}</Text>
                            <Text style={{ color: '#6b7280' }}>{(s.text || '').slice(0, 300)}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* suggested illustrations */}
                    {Array.isArray(analysisObj.suggested_illustrations) && (
                      <View style={{ marginTop: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <Text style={{ fontWeight: '700' }}>建议插图</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.generateButton, { marginRight: 8, opacity: batchGenerating ? 0.6 : 1 }]} onPress={() => generateAllSuggestions(2)} disabled={batchGenerating}>
                              <Text style={{ color: '#fff' }}>{batchGenerating ? `生成中 ${batchProgress.done}/${batchProgress.total}` : '全部生成'}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {analysisObj.suggested_illustrations.map((slot: any, idx: number) => {
                          const key = slot.position || `slot_${idx}`;
                          const imgs = imagesMap[key] || [];
                          const generating = !!generatingMap[key];
                          return (
                            <View key={key} style={styles.suggestionCard}>
                              <Text style={styles.suggestionTitle}>{slot.position || `插图 ${idx + 1}`}</Text>
                              <Text style={styles.suggestionReason}>{slot.reason || slot.summary || slot.prompt}</Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {imgs.length > 0 ? (
                                  imgs.map((u, i) => (
                                    <Image key={u + i} source={{ uri: u }} style={styles.thumb} />
                                  ))
                                ) : (
                                  <View style={styles.thumb}><Text style={{ color: '#9ca3af' }}>{generating ? '生成中...' : '未生成'}</Text></View>
                                )}
                                <View>
                                  <TouchableOpacity style={styles.generateButton} onPress={() => generateForSuggestion(slot, idx)} disabled={generating}>
                                    <Text style={{ color: '#fff' }}>{generating ? '生成中...' : (imgs.length > 0 ? '重新生成' : '生成插图')}</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}

                    {/* raw analysis text */}
                    <View style={{ marginTop: 12 }}>
                      <Text style={styles.analysisText}>{analysisText}</Text>
                    </View>

                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                      <Text style={styles.editButtonText}>编辑</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.analysisText}>{analysisText}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                      <Text style={styles.editButtonText}>编辑</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
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

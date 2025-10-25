#!/usr/bin/env python3
"""
story_segmenter.py

功能：
- 将一段叙事文本拆分成逻辑段落、场景、转折点
- 支持两种模式：'heuristic'（本地启发式）与 'ai'（调用外部大模型接口）
- 输出 JSON 结构，方便后续自动插图、可视化或导出为 Markdown/HTML/PDF

作者：ChatGPT (示例)
"""

import argparse
import json
import os
import re
import math
from typing import List, Dict, Any, Optional, Tuple, Sequence

try:
    import requests
except Exception:
    requests = None  # requests 仅在 AI 模式下需要

# ---------------------------
# Helpers: sentence tokenizer
# ---------------------------
SENTENCE_END_RE = re.compile(r'([。！？?!\.]+)\s*')  # 简单中文/英文混合句尾识别

def split_into_sentences(text: str) -> List[str]:
    """把文本切分成句子（简单实现，适合中短篇叙事）。"""
    parts = SENTENCE_END_RE.split(text)
    if not parts:
        return [text.strip()] if text.strip() else []
    sentences = []
    i = 0
    while i < len(parts)-1:
        sent = (parts[i] + parts[i+1]).strip()
        if sent:
            sentences.append(sent)
        i += 2
    # 如果剩余未配对部分
    if i < len(parts) and parts[i].strip():
        sentences.append(parts[i].strip())
    # 合并非常短的碎片（避免过度切分）
    merged = []
    buffer = ""
    for s in sentences:
        if len(buffer) == 0:
            buffer = s
        elif len(s) < 6:  # 太短的句子并入上句（可调整）
            buffer += s
        else:
            merged.append(buffer)
            buffer = s
    if buffer:
        merged.append(buffer)
    return merged

# ---------------------------
# Heuristic segmentation
# ---------------------------
SCENE_BREAK_KEYWORDS = [
    "第二天", "几天后", "过了", "与此同时", "与此同时，", "与此同时：",
    "与此同时。", "当时", "回忆起", "后来", "后来，", "随后", "与此同时", "与此同时，",
    "一会儿后", "不久", "凌晨", "傍晚", "清晨", "晚上", "白天", "午后", "当晚"
]

DIALOGUE_RE = re.compile(r'^[「“"].+[」”"]$')

def heuristic_segment(text: str, density: float = 0.5) -> Dict[str, Any]:
    """
    启发式分段算法（离线可用）。
    density: 0..1, 值越大 -> 更多分段（更细）
    """
    sentences = split_into_sentences(text)
    n = len(sentences)
    if n == 0:
        return {"segments": []}

    # 目标段数基于文本长度和密集度：min 1, max roughly n/2
    min_seg = 1
    max_seg = max(1, n // 2)
    # map density to target segments (可调整映射)
    target_segments = min_seg + int((max_seg - min_seg) * density + 0.5)
    target_segments = max(1, min(target_segments, n))

    # 给每个可能边界评分（越高倾向于断开）
    scores = [0.0] * (n-1)  # boundary between sentence i and i+1
    for i in range(n-1):
        a = sentences[i]
        b = sentences[i+1]
        score = 0.0
        # 明显段落换行
        if a.endswith("\n") or b.startswith("\n"):
            score += 1.5
        # 场景关键字触发
        combined = (a + " " + b)
        for kw in SCENE_BREAK_KEYWORDS:
            if kw in combined:
                score += 2.0
        # 对话块（长对话通常是同一场景，不鼓励断开）
        if DIALOGUE_RE.match(a.strip()) or DIALOGUE_RE.match(b.strip()):
            score -= 1.0
        # 句子长度差异（长句后断开可能性）
        if len(a) > 60 and len(b) > 20:
            score += 0.4
        # 标点强度（问号、感叹号更可能是段落边界）
        if re.search(r'[？！!?。\.]+$', a.strip()):
            score += 0.3
        scores[i] = score

    # 选择 top-k 分割点
    # 先根据 density 调整阈值：更高 density -> 选择更多边界
    # 我们直接选择 k = target_segments - 1 的边界（如果为0则不选）
    k = max(0, target_segments - 1)
    indices = []
    if k > 0:
        # pick k largest scores, but keep them ordered
        indexed = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)
        topk = sorted([idx for idx, sc in indexed[:k]])
        indices = topk

    # build segments
    segs = []
    start = 0
    for cut in indices:
        seg_sents = sentences[start:cut+1]
        seg_text = " ".join(seg_sents).strip()
        segs.append({
            "type": "scene",  # heuristic 不区分细化类型，后面可再分类
            "start_sentence": start,
            "end_sentence": cut,
            "text": seg_text,
            "summary": summarize_text_simple(seg_text)
        })
        start = cut+1
    # last segment
    seg_text = " ".join(sentences[start:]).strip()
    segs.append({
        "type": "scene",
        "start_sentence": start,
        "end_sentence": n-1,
        "text": seg_text,
        "summary": summarize_text_simple(seg_text)
    })

    # 找出转折点（heuristic：以“但是”、“然而”、“然而，”等为线索）
    twists = []
    TWIST_WORDS = ["但是", "然而", "可却", "可见", "却", "不过", "结果", "出乎意料"]
    for i, s in enumerate(sentences):
        for tw in TWIST_WORDS:
            if tw in s and len(s) > 6:
                twists.append({
                    "sentence_index": i,
                    "text": s,
                    "cue": tw
                })
                break

    return {"segments": segs, "twists": twists, "sentence_count": n}


def summarize_text_simple(text: str, max_chars: int = 120) -> str:
    """极简本地摘要：取首句 + 截断"""
    sents = split_into_sentences(text)
    if not sents:
        return ""
    first = sents[0]
    if len(first) <= max_chars:
        return first
    return first[:max_chars].rstrip() + "…"

# ---------------------------
# AI-based segmentation
# ---------------------------

AI_PROMPT_TEMPLATE = """
你是一个文本结构分析器（Chinese）。给定一段叙事文本，请把它拆分成“逻辑段落/场景/转折点”。输出必须是严格有效的 JSON。
输入字段：
- "text": 原文
- "density": 取值 0.0 到 1.0（越大输出越细），请据此决定分割粒度。

输出 JSON 格式如下：
{{
  "segments": [
    {{
      "id": 1,
      "type": "scene" | "paragraph" | "turning_point",
      "start_char": <int>, 
      "end_char": <int>,
      "summary": "<一句话概述该段内容，15~50字>",
      "cues": ["短语1", "短语2"]  // 触发分割的线索词或事件
    }},
    ...
  ],
  "twists": [
    {{
      "sentence_index": <int>,
      "char_index": <int>,
      "text": "<包含转折的原句>",
      "reason": "<为什么认为是转折（关键词或情节冲突）>"
    }}
  ]
}}

要求：
- segments 应按文本顺序排列，start_char 和 end_char 要正确映射到原始文本（字符索引）。
- density 决定分割细度：例如 density=0.2 -> 粗略（少分段）；density=0.8 -> 细致（多分段）。
- 不要输出任何多余的文字（只有 JSON）。
现在收到输入：请根据下面的 JSON 输入进行处理并返回结果（只输出 JSON）：

{{
  "text": {text_json},
  "density": {density_val}
}}
"""

def call_ai_api_openai_like(text: str, density: float = 0.5, model: str = "gpt-4o-mini", api_key: Optional[str] = None, api_url: Optional[str] = None, timeout: int = 30) -> Dict[str, Any]:
    """
    示例：用通用 REST 风格调用 OpenAI-like API（可按需替换为具体 SDK）。
    - api_key: 若 None 则从环境变量 AI_API_KEY 读取
    - api_url: 若 None，使用一个示例默认端点（你应该替换为实际端点）
    注意：这是一个示例实现，具体字段需要根据你使用的 API 调整（model 名称、输入字段等）。
    """
    if requests is None:
        raise RuntimeError("requests 未安装，请 pip install requests 或使用 heuristic 模式")

    if api_key is None:
        api_key = os.getenv("AI_API_KEY")
    if not api_key:
        raise RuntimeError("未找到 API Key，请设置 AI_API_KEY 或传入 api_key 参数")

    # 默认示例端点（请替换为真实可用端点）
    if api_url is None:
        api_url = "https://api.openai.com/v1/chat/completions"

    prompt = AI_PROMPT_TEMPLATE.format(
        text_json=json.dumps(text, ensure_ascii=False),
        density_val=float(density)
    )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "你是一个 JSON 输出的文本结构专家。严格输出 JSON。"},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.0,
        "max_tokens": 1500
    }

    resp = requests.post(api_url, headers=headers, data=json.dumps(payload), timeout=timeout)
    if resp.status_code != 200:
        raise RuntimeError(f"API 请求失败：{resp.status_code} {resp.text}")
    data = resp.json()

    # 解析返回（这里假定返回在 choices[0].message.content）
    try:
        content = data["choices"][0]["message"]["content"]
    except Exception:
        raise RuntimeError("无法解析 API 返回结构，请根据你使用的 API 调整解析代码。")

    # 有时模型会在 JSON 前后加说明文本，尝试提取首个 JSON 对象
    j = extract_json_from_text(content)
    if j is None:
        # 作为保险，尝试直接解析 content
        try:
            return json.loads(content)
        except Exception:
            raise RuntimeError("模型返回内容中未能找到 JSON。返回原文片段：\n" + content[:1000])
    return j

def extract_json_from_text(s: str) -> Optional[Dict[str, Any]]:
    """从较长文本中抓取第一个大括号包裹的 JSON 对象（简单实现）。"""
    s = s.strip()
    # 寻找第一个 { 并匹配到对应的 }
    start = s.find('{')
    if start == -1:
        return None
    stack = 0
    for i in range(start, len(s)):
        if s[i] == '{':
            stack += 1
        elif s[i] == '}':
            stack -= 1
            if stack == 0:
                candidate = s[start:i+1]
                try:
                    return json.loads(candidate)
                except Exception:
                    return None
    return None

# ---------------------------
# Public API
# ---------------------------

def segment_story(text: str, density: float = 0.5, mode: str = 'heuristic', ai_provider: str = 'openai', **ai_kwargs) -> Dict[str, Any]:
    """
    主函数：
    - text: 原始故事文本
    - density: 0..1
    - mode: 'heuristic' 或 'ai'
    - ai_provider: 目前仅 'openai' 被示例实现
    - ai_kwargs: 转发给 AI 调用（api_key, model, api_url 等）
    """
    density = max(0.0, min(1.0, float(density)))
    if mode == 'heuristic':
        return heuristic_segment(text, density=density)
    elif mode == 'ai':
        provider = ai_provider.lower()
        if provider == 'openai':
            return call_ai_api_openai_like(text=text, density=density, **ai_kwargs)
        else:
            raise ValueError(f"未知的 ai_provider: {ai_provider}")
    else:
        raise ValueError("mode 必须是 'heuristic' 或 'ai'")
    

def generate_annotated_text(original_text: str, segments: Sequence[dict], marker_template: str = "{{seg {id:03d}}}") -> str:
    """
    生成带注记的文本（在每个 segment 之后插入标记）。
    - 如果 segments 包含字符级索引（start_char & end_char），使用字符索引精确插入（推荐）。
    - 否则基于 segments[i]['text'] 重建并在每段后插入标记（可能略有格式差异）。
    - 编号从 0 开始；marker_template 保持与 format 兼容（默认 -> "{seg 000}" 等）
    """
    if not segments:
        return original_text

    # 如果 segments 包含字符级索引，则使用字符方式插入（更精确）
    has_char_indices = all(('start_char' in s and 'end_char' in s) for s in segments) and len(segments) > 0

    if has_char_indices:
        # 为安全起见，按 start_char 排序（避免 AI 返回乱序）
        segs_sorted = sorted(segments, key=lambda s: int(s['start_char']))
        pieces = []
        last = 0
        for idx, seg in enumerate(segs_sorted):
            start = int(seg['start_char'])
            end = int(seg['end_char'])
            # append original between last and start (未覆盖文本)
            if start > last:
                pieces.append(original_text[last:start])
            # append the segment text slice
            # 注意：end 是包含式还是不包含式？本函数假定 end_char 为包含的最后字符索引（与之前实现一致）
            pieces.append(original_text[start:end+1])
            # insert marker AFTER this segment
            marker = marker_template.format(id=idx)  # idx 从 0 开始
            pieces.append(" " + marker)  # 在段落后加一个空格再标记，便于阅读
            last = end + 1
        # append trailing text
        if last < len(original_text):
            pieces.append(original_text[last:])
        return "".join(pieces)

    # 否则：基于 segments[i]['text'] 重建注记文本（会保留段落顺序）
    annotated_parts = []
    for idx, seg in enumerate(segments):
        seg_text = seg.get('text', '').strip()
        marker = marker_template.format(id=idx)  # idx 从 0 开始
        # 把标记放在段落之后，段落与标记之间留一个空格
        # 保持段落间用空行分隔，便于阅读和后续处理
        annotated_parts.append(seg_text + " " + marker)
    return "\n\n".join(annotated_parts)


def write_annotated_file(input_path: str, original_text: str, segments: Sequence[dict]) -> str:
    """
    写出注记文件，文件名为 input_path + ".annotated.txt"
    返回写入的路径。
    """
    annotated = generate_annotated_text(original_text, segments)
    annotated_path = input_path + ".annotated.txt"
    with open(annotated_path, "w", encoding="utf-8") as f:
        f.write(annotated)
    return annotated_path

# ---------------------------
# CLI
# ---------------------------
def read_input_file(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_output_file(path: str, data: Dict[str, Any]) -> None:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser(description="将叙事文本拆分为场景/段落/转折点")
    parser.add_argument("input", help="输入文本文件路径（UTF-8）")
    parser.add_argument("--output", "-o", help="输出 JSON 文件路径（默认：input.json）")
    parser.add_argument("--mode", choices=['heuristic','ai'], default='heuristic', help="使用本地启发式还是 AI")
    parser.add_argument("--provider", default='openai', help="AI 提供商（ai 模式有效），例如 openai")
    parser.add_argument("--model", default='gpt-4o-mini', help="模型名（ai 模式有效）")
    parser.add_argument("--density", type=float, default=0.5, help="分段密集度 0.0..1.0")
    parser.add_argument("--api_key", default=None, help="API Key（可不传，从环境 AI_API_KEY 读取）")
    parser.add_argument("--api_url", default=None, help="API URL（可选，ai 模式）")
    args = parser.parse_args()

    text = read_input_file(args.input)
    outpath = args.output or (args.input + ".json")

    try:
        result = segment_story(
            text,
            density=args.density,
            mode=args.mode,
            ai_provider=args.provider,
            api_key=args.api_key,
            model=args.model,
            api_url=args.api_url
        )
    except Exception as e:
        print("处理失败：", e)
        raise

    write_output_file(outpath, result)
    segments = result.get("segments", [])
    try:
        annotated_path = write_annotated_file(args.input, text, segments)
        print(f"已生成注记文本：{annotated_path}")
    except Exception as e:
        print("生成注记文本失败：", e)



if __name__ == "__main__":
    main()

# python story_segmenter.py --mode heuristic --density 0.6 input_story.txt

import { SectionData } from './types';

export const EDUCATIONAL_CONTENT: SectionData[] = [
  {
    id: 'definition',
    title: '什么是肺动脉栓塞 (PE)?',
    liteDescription: '想象一下，身体里的血管就像高速公路。肺栓塞就像是腿部的“血块石头”（血栓）脱落了，顺着血流漂到了肺部的血管里，把路堵住了。这会让肺没法正常工作，导致缺氧、胸痛，甚至有生命危险。',
    proDescription: '肺动脉栓塞 (Pulmonary Embolism, PE) 是指内源性或外源性栓子堵塞肺动脉或其分支，引起肺循环障碍的临床和病理生理综合征。最常见的栓子来源于下肢深静脉血栓形成 (DVT)，血栓脱落后随静脉回流至右心，进而进入肺动脉主干或其分支导致阻塞。',
    icon: 'Activity'
  },
  {
    id: 'symptoms',
    title: '症状识别',
    liteDescription: '主要表现为“突然的不舒服”。比如突然感觉气短、喘不上气；深呼吸时胸口疼；咳血；或者心跳突然变得很快，甚至晕倒。如果出现这些情况，必须马上看急诊。',
    proDescription: 'PE 的临床表现缺乏特异性，典型症状包括“三联征”：呼吸困难 (Dyspnea)、胸痛 (Chest Pain, 胸膜炎性或心绞痛样) 和咯血 (Hemoptysis)。其他体征包括心动过速 (Tachycardia)、低血压、发绀、颈静脉充盈以及 P2 亢进。',
    icon: 'AlertCircle'
  },
  {
    id: 'prevention',
    title: '如何预防?',
    liteDescription: '最重要的是“动起来”。长途坐车或坐飞机时，多活动脚踝；做完手术后尽早下床活动；平时多喝水，避免血液太粘稠。必要时医生会让你穿特殊的弹力袜。',
    proDescription: '预防策略主要针对 Virchow 三要素 (静脉血液淤滞、静脉壁损伤、血液高凝状态)。措施包括：机械预防 (由于加压弹力袜 GCS、间歇充气加压装置 IPC) 和药物预防 (低分子肝素 LMWH、华法林等抗凝药物)。早期活动和充分水化至关重要。',
    icon: 'ShieldCheck'
  }
];

export const FALLBACK_QUESTIONS = [
  {
    question: "肺动脉栓塞最常见的栓子来源是哪里？",
    options: ["心脏", "下肢深静脉", "脑血管", "上肢动脉"],
    correctAnswerIndex: 1,
    explanation: "约 70%-95% 的肺栓塞来源于下肢深静脉血栓 (DVT)。"
  },
  {
    question: "以下哪项不是预防肺栓塞的有效措施？",
    options: ["长途旅行时久坐不动", "术后早期下床活动", "穿着医用弹力袜", "多喝水"],
    correctAnswerIndex: 0,
    explanation: "久坐不动会增加血液淤滞的风险，是导致血栓形成的高危因素。"
  },
  {
    question: "肺栓塞发生时，最常见的症状是什么？",
    options: ["皮疹", "不明原因的呼吸困难", "腹泻", "听力下降"],
    correctAnswerIndex: 1,
    explanation: "突发的、不明原因的呼吸困难是肺栓塞最常见且具有警示性的症状。"
  }
];

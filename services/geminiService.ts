import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WordMatchQuestion, SentenceQuestion, ClozePassage } from "../types";

// Initialize Gemini Client
// CRITICAL: API Key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// ------------------------------------------------------------------
// CONFIGURATION: CUSTOM VOCABULARY LIST (自定義詞庫)
// ------------------------------------------------------------------

// The full text provided by the user to serve as context for the AI
// This ensures definitions and sentence styles match the user's material.
const VOCAB_CONTEXT = `
1. accustom
(v.) 使習慣
 She slowly accustomed herself to the new routine, like a bird learning the rhythm of a foreign sky.
2. witness (see)
(v.) 目睹；見證
 We witnessed the sunrise break through the clouds, a quiet proof that darkness never lasts.
3. disclose
(v.) 揭露；透露
 The report disclosed several errors that had long been buried in silence.
4. alter
(v.) 改變；調整
 She decided to alter her plan—just a small shift, but enough to redirect the whole journey.
5. stintless
(adj.) 無節制的；無保留的
 His stintless generosity warmed everyone around him.
6. finite
(adj.) 有限的
 Our time is finite, yet our hopes stretch like constellations beyond measure.
7. window pane
(n.) 窗玻璃
 Raindrops slid down the window pane, carrying fragments of sky with them.
8. incautious (小心謹慎)
(adj.) 不小心的；輕率的
 An incautious remark can wound more deeply than we expect.
9. carriage
(n.) 馬車；運輸工具
 The old carriage creaked along the road like a memory refusing to fade.
10. immortality 
mortal 會死的 immortal 不會死的
(n.) 不朽
 Artists chase immortality through their work, hoping a fragment of themselves survives time.
11. labor
(n.) 勞動；辛勞
 Years of labor shaped her hands into quiet maps of perseverance.
12. leisure
(n.) 閒暇
 During rare moments of leisure, she allowed her mind to wander freely.
13. civility
(n.) 禮貌；文明
 In heated debates, civility becomes a rare but precious companion.
14. quiver
(v./n.) 顫抖；抖動
 Her voice quivered like a leaf about to loosen from its branch.
15. scarcely
(adv.) 幾乎不
 He had scarcely enough time to breathe before the next challenge arrived.
16. surmise
(v.) 猜測
 From the silence, she surmised that something had gone wrong.
17. eternity
(n.) 永恆
 Some moments feel like they stretch into eternity, glowing in the mind long after they pass.
18. germ
(n.) 細菌；微生物
 A single germ can spark a chain of consequences no one foresaw.
19. antibacterial
(adj.) 抗菌的
 She used an antibacterial spray to clean the classroom countertop.
20. residue
(n.) 殘留物
 A faint residue of dust lingered after the storm settled.
21. eliminate
(v.) 消除
 The new system helps eliminate unnecessary steps.
22. alarm
(v.) 使驚慌；使警覺
 The sudden noise alarmed the students, snapping their attention into focus.
23. antibiotic
(n.) 抗生素
 The doctor prescribed an antibiotic to stop the infection from spreading.
24. bacteria
(n.) 細菌
 Not all bacteria are harmful—some quietly help us survive.
25. sanitized
(adj.) 消毒過的
 The lab must remain sanitized to ensure accurate experiments.
26. immune system
(n.) 免疫系統
 A strong immune system acts like a steadfast guard at the body’s borders.
27. ward off
(ph.) 防止；避免
 Vitamin C may help ward off minor colds.
28. hydrogen peroxide
(n.) 過氧化氫
 They used hydrogen peroxide to clean the wound, the bubbles whispering relief.
29. vinegar
(n.) 醋
 Vinegar can be surprisingly effective for cleaning stubborn stains.
30. reproduce
(v.) 繁殖；再生
 Some bacteria reproduce at astonishing speed.
31. anecdote
(n.) 軼事；小故事
 She opened the lesson with an anecdote that made everyone laugh.
32. triclosan
(n.) 三氯沙（抗菌劑）
 Some soaps contain triclosan, though its safety is debated.
33. resistant
(adj.) 抗藥性的／抗拒的
 Some germs become resistant to antibiotics over time.
34. infection
(n.) 感染
 The cut grew red—an early sign of infection.
35. stubborn
(adj.) 頑固的；難以消除的
 A stubborn stain refused to fade no matter how she scrubbed.
36. vulnerable
(adj.) 脆弱的；易受傷害的
 Children are especially vulnerable to seasonal illnesses.
37. invasive
(adj.) 侵入性的
 The doctor recommended a non-invasive test first.
38. resilient
(adj.) 有韌性的；能迅速恢復的
 She was resilient, bending but never breaking.
39. beneficial
(adj.) 有益的
 Regular sleep is beneficial to both mind and body.
40. alternative
(n./adj.) 替代方案；替代的
 They looked for an alternative approach when the first plan failed.
41. acuity
(n.) 敏銳度
 Visual acuity often declines with age.
42. magnitude
(n.) 規模；震度；巨量
 Scientists measured the magnitude of the earthquake.
43. breadth
(n.) 廣度；幅度
 Her research showed remarkable breadth of knowledge.
44. precision
(n.) 精準
 The experiment required absolute precision.
45. stimulus
(n.) 刺激物
 Light acts as a stimulus that awakens the retina.
46. stellar
(adj.) 出色的；星星的
 He delivered a stellar performance that left the room glowing.
47. acoustic
(adj.) 聲學的；音響的
 The hall’s acoustic design made every note shimmer.
48. propensity
(n.) 傾向
 She had a propensity to overthink, especially at night.
49. transcend
(v.) 超越
 Great stories transcend culture, time, and language.
50. apparatus
(n.) 儀器；裝置
 The lab’s new apparatus enabled more precise measurements.
51. parapsychology
(n.) 超心理學
 He researched parapsychology, searching the boundaries of the unseen.
52. persistent
(adj.) 持續的；堅持不懈的
 Her persistent hope carried her through difficult seasons.
53. double-blind
(adj.) 雙盲的（實驗）
 A double-blind study prevents bias from either side.
54. wield
(v.) 揮舞；運用
 She wielded her words like a subtle blade—gentle but unmistakably sharp.
55. encounter
(v./n.) 遭遇；邂逅
 Their brief encounter changed the tone of his day.
56. diagnostic
(adj.) 診斷的
 Doctors collected diagnostic data to understand the symptoms.
57. velocity
(n.) 速度
 The object reached a velocity beyond expectation.
58. polarized
(adj.) 兩極化的；偏振的
 The debate grew increasingly polarized as opinions hardened.
59. seismograph
(n.) 地震儀
 The seismograph recorded the tremors with delicate lines.
60. constellation
(n.) 星座；群集
 A new constellation of ideas began to take shape.
61. remnant
(n.) 殘餘；遺跡
 Only a remnant of the ancient structure remained.
62. titanic
(adj.) 巨大的；龐大的
 They faced a titanic challenge but refused to retreat.
63. retina
(n.) 視網膜
 Light patterns danced across the retina, shaping perception.
64. wrath
(n.) 憤怒；怒火
 His quiet wrath was more frightening than shouting.
65. honing
(n./v.) 磨練；精進
 She kept honing her craft, day after day.
66. phenomenon
(n.) 現象
 The aurora is a phenomenon that feels both earthly and divine.
67. emerge
(v.) 出現；浮現
 New ideas often emerge in moments of stillness.
68. enable
(v.) 使能夠
 Technology can enable us to reach further than we once imagined.
69. carbon monoxide
(n.) 一氧化碳
 Low ventilation increases carbon monoxide risk.
70. majesty
(n.) 壯麗；宏偉
 The mountain rose with such majesty it silenced every thought.
71. supersentient
(adj.) 超感知的
 In fiction, supersentient beings perceive layers of reality we cannot.
72. survive
(v.) 生存；度過
 The seedlings survived the storm against all odds.
73. ordinary
(adj.) 普通的
 Even an ordinary day can carry extraordinary grace.
74. effective
(adj.) 有效的
 This method proved far more effective than expected.
75. expert
(n./adj.) 專家；熟練的
 An expert can make the complex feel simple.
76. susceptible
(adj.) 易受影響的
 Young students are highly susceptible to positive encouragement.
77. tolerant
(adj.) 容忍的；有耐受力的
 Some plants are tolerant of extreme heat.
78. countertop
(n.) 流理台；桌面
 She placed the groceries on the kitchen countertop.
79. burial mound
(n.) 土墳；古墓
 The burial mound stood silent under the moon, holding centuries of stories.
80. march
(v./n.) 行進；前進
 They marched forward with steady determination, like time itself refusing to stall.
`;

const TARGET_VOCABULARY = [
  "accustom", "witness", "disclose", "alter", "stintless", "finite", "window pane", "incautious", "carriage", "immortality",
  "labor", "leisure", "civility", "quiver", "scarcely", "surmise", "eternity", "germ", "antibacterial", "residue",
  "eliminate", "alarm", "antibiotic", "bacteria", "sanitized", "immune system", "ward off", "hydrogen peroxide", "vinegar", "reproduce",
  "anecdote", "triclosan", "resistant", "infection", "stubborn", "vulnerable", "invasive", "resilient", "beneficial", "alternative",
  "acuity", "magnitude", "breadth", "precision", "stimulus", "stellar", "acoustic", "propensity", "transcend", "apparatus",
  "parapsychology", "persistent", "double-blind", "wield", "encounter", "diagnostic", "velocity", "polarized", "seismograph", "constellation",
  "remnant", "titanic", "retina", "wrath", "honing", "phenomenon", "emerge", "enable", "carbon monoxide", "majesty",
  "supersentient", "survive", "ordinary", "effective", "expert", "susceptible", "tolerant", "countertop", "burial mound", "march"
];

// Utility to shuffle arrays
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper to get random subset of words from the list
const getRandomWords = (count: number): string[] => {
  const shuffled = shuffleArray([...TARGET_VOCABULARY]);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Generates Level 1: English Word -> Chinese Meaning Questions
 */
export const generateWordMatchQuestions = async (count: number = 5): Promise<WordMatchQuestion[]> => {
  const targetWords = getRandomWords(count);

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        word: { type: Type.STRING, description: "The English vocabulary word" },
        correctChinese: { type: Type.STRING, description: "The correct Traditional Chinese definition (繁體中文)" },
        distractors: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "3 incorrect Traditional Chinese definitions"
        }
      },
      required: ["word", "correctChinese", "distractors"],
    },
  };

  const prompt = `Generate ${targetWords.length} vocabulary questions.
  
  CRITICAL INSTRUCTION: You MUST use the following specific words for the questions: 
  ${JSON.stringify(targetWords)}

  CRITICAL INSTRUCTION: Refer to the provided VOCAB_CONTEXT below for the preferred Chinese definitions. 
  If the word exists in the VOCAB_CONTEXT, use the exact Chinese definition provided there.
  
  VOCAB_CONTEXT:
  ${VOCAB_CONTEXT}

  For each word:
  1. Provide the English Word.
  2. Provide the correct definition in Traditional Chinese (繁體中文) based on the context.
  3. Provide 3 incorrect definitions in Traditional Chinese (distractors).`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2, // Low temperature to stick to provided definitions
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Transform to internal format with randomized options
    return rawData.map((item: any, index: number) => {
      const options = shuffleArray([item.correctChinese, ...item.distractors]);
      return {
        id: `lvl1-${index}-${Date.now()}`,
        word: item.word,
        correctAnswer: item.correctChinese,
        options: options,
      };
    });
  } catch (error) {
    console.error("Error generating word match questions:", error);
    throw error;
  }
};

/**
 * Generates Level 2: Sentence Completion Questions
 */
export const generateSentenceQuestions = async (count: number = 5): Promise<SentenceQuestion[]> => {
  const targetWords = getRandomWords(count);

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        sentencePre: { type: Type.STRING, description: "Part of sentence before the blank" },
        sentencePost: { type: Type.STRING, description: "Part of sentence after the blank" },
        correctWord: { type: Type.STRING, description: "The correct English word to fill the blank" },
        distractors: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "3 incorrect English words"
        }
      },
      required: ["sentencePre", "sentencePost", "correctWord", "distractors"],
    },
  };

  const prompt = `Generate ${targetWords.length} sentence completion questions.
  
  CRITICAL INSTRUCTION: You MUST use the following specific words as the CORRECT ANSWERS:
  ${JSON.stringify(targetWords)}

  CRITICAL INSTRUCTION: Refer to the provided VOCAB_CONTEXT below.
  You may use the example sentences found in the context or create similar ones that fit the meaning.
  
  VOCAB_CONTEXT:
  ${VOCAB_CONTEXT}
  
  For each word:
  1. Create a clear context sentence using the word.
  2. Split the sentence into two parts (pre and post) around that word.
  3. Provide 3 distractors that are plausible but incorrect (same part of speech).`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.5,
      },
    });

    const rawData = JSON.parse(response.text || "[]");

    return rawData.map((item: any, index: number) => {
      const options = shuffleArray([item.correctWord, ...item.distractors]);
      return {
        id: `lvl2-${index}-${Date.now()}`,
        sentenceParts: [item.sentencePre, item.sentencePost],
        correctAnswer: item.correctWord,
        options: options,
      };
    });
  } catch (error) {
    console.error("Error generating sentence questions:", error);
    throw error;
  }
};

/**
 * Generates Level 3: Cloze Test (Paragraph)
 */
export const generateClozeTest = async (): Promise<ClozePassage> => {
  // Cloze test usually needs about 5 blanks
  const targetWords = getRandomWords(5);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      segments: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "The text segments surrounding the blanks. If there are N blanks, there should be N+1 segments."
      },
      blanks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            correctWord: { type: Type.STRING },
            distractors: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["correctWord", "distractors"]
        }
      }
    },
    required: ["title", "segments", "blanks"],
  };

  const prompt = `Generate a cohesive paragraph (Story or Article) for a cloze test.
  
  CRITICAL INSTRUCTION: The paragraph MUST use exactly these 5 words as the blanks:
  ${JSON.stringify(targetWords)}
  
  VOCAB_CONTEXT (For reference on usage):
  ${VOCAB_CONTEXT}

  Requirements:
  1. Write a coherent text incorporating these words naturally.
  2. The style should be literary or academic (B2/C1 level).
  3. Provide the text split into segments around these blanks.
  4. For each blank, provide the correct word (from the list above) and 3 distractors.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const item = JSON.parse(response.text || "{}");

    // Process blanks to match internal structure
    const processedBlanks = item.blanks.map((b: any, index: number) => ({
      id: `blank-${index}`,
      correctAnswer: b.correctWord,
      options: shuffleArray([b.correctWord, ...b.distractors])
    }));

    return {
      title: item.title,
      textSegments: item.segments,
      blanks: processedBlanks
    };
  } catch (error) {
    console.error("Error generating cloze test:", error);
    throw error;
  }
};

export interface Question {
  id: number;
  category: string;
  subcategory: string;
  text: string;
}

export const questions: Question[] = [
  // 1. AI Understanding (6 questions)
  { id: 1, category: "AI 이해", subcategory: "AI 개념", text: "인공지능(AI)과 머신러닝의 기본 개념을 설명할 수 있다." },
  { id: 2, category: "AI 이해", subcategory: "AI 역사", text: "AI의 발전 과정과 주요 기술적 전환점을 이해하고 있다." },
  { id: 3, category: "AI 이해", subcategory: "딥러닝", text: "딥러닝과 전통적인 머신러닝의 차이점을 알고 있다." },
  { id: 4, category: "AI 이해", subcategory: "생성형 AI", text: "LLM(거대언어모델)의 작동 원리에 대해 기본적으로 이해하고 있다." },
  { id: 5, category: "AI 이해", subcategory: "AI 트렌드", text: "최신 AI 기술 트렌드와 산업별 적용 사례를 파악하고 있다." },
  { id: 6, category: "AI 이해", subcategory: "AI 한계", text: "현재 AI 기술의 한계점과 기술적 제약사항을 인지하고 있다." },

  // 2. Data Literacy (6 questions)
  { id: 7, category: "데이터 리터러시", subcategory: "데이터 수집", text: "업무에 필요한 데이터를 정의하고 수집할 수 있다." },
  { id: 8, category: "데이터 리터러시", subcategory: "데이터 전처리", text: "수집된 데이터의 결측치나 이상치를 파악하고 정제할 수 있다." },
  { id: 9, category: "데이터 리터러시", subcategory: "데이터 시각화", text: "데이터를 차트나 그래프로 시각화하여 인사이트를 도출할 수 있다." },
  { id: 10, category: "데이터 리터러시", subcategory: "데이터 해석", text: "통계적 지표를 바탕으로 데이터의 의미를 올바르게 해석할 수 있다." },
  { id: 11, category: "데이터 리터러시", subcategory: "데이터 기반 의사결정", text: "직관이 아닌 데이터를 근거로 의사결정을 내린다." },
  { id: 12, category: "데이터 리터러시", subcategory: "데이터 보안", text: "데이터 보안 및 개인정보 보호의 중요성을 이해하고 준수한다." },

  // 3. AI Utilization (8 questions)
  { id: 13, category: "AI 활용", subcategory: "프롬프트 엔지니어링", text: "원하는 결과를 얻기 위해 프롬프트를 효과적으로 작성할 수 있다." },
  { id: 14, category: "AI 활용", subcategory: "문서 작성", text: "AI 도구를 활용하여 보고서나 이메일 초안을 작성한다." },
  { id: 15, category: "AI 활용", subcategory: "이미지 생성", text: "이미지 생성 AI를 활용하여 필요한 시각 자료를 만들 수 있다." },
  { id: 16, category: "AI 활용", subcategory: "데이터 분석", text: "AI 도구를 활용하여 엑셀 데이터 분석이나 요약을 수행한다." },
  { id: 17, category: "AI 활용", subcategory: "코딩 보조", text: "코드 작성이나 디버깅에 AI 코딩 어시스턴트를 활용한다." },
  { id: 18, category: "AI 활용", subcategory: "번역 및 요약", text: "외국어 문서 번역이나 긴 글 요약에 AI를 적극적으로 사용한다." },
  { id: 19, category: "AI 활용", subcategory: "아이디어 도출", text: "기획 단계에서 아이디어 브레인스토밍에 AI를 활용한다." },
  { id: 20, category: "AI 활용", subcategory: "업무 자동화", text: "반복적인 업무를 AI를 통해 자동화하는 방법을 모색한다." },

  // 4. AI Ethics (6 questions)
  { id: 21, category: "AI 윤리", subcategory: "편향성", text: "AI 모델이 가질 수 있는 편향성(Bias)의 위험을 인지하고 있다." },
  { id: 22, category: "AI 윤리", subcategory: "저작권", text: "AI 생성물의 저작권 이슈와 올바른 사용 범위를 이해하고 있다." },
  { id: 23, category: "AI 윤리", subcategory: "할루시네이션", text: "AI의 환각(Hallucination) 현상을 이해하고 사실 검증을 수행한다." },
  { id: 24, category: "AI 윤리", subcategory: "책임성", text: "AI 활용 결과에 대한 책임이 사용자에게 있음을 인지하고 있다." },
  { id: 25, category: "AI 윤리", subcategory: "악용 방지", text: "AI 기술이 딥페이크 등 범죄에 악용될 수 있음을 경계한다." },
  { id: 26, category: "AI 윤리", subcategory: "투명성", text: "AI 사용 여부를 명시해야 하는 상황을 이해하고 실천한다." },

  // 5. AI Collaboration (4 questions)
  { id: 27, category: "AI 협업", subcategory: "역할 분담", text: "AI와 인간의 역할을 구분하고 상호 보완적으로 협업한다." },
  { id: 28, category: "AI 협업", subcategory: "피드백", text: "AI의 결과물을 비판적으로 검토하고 개선 피드백을 줄 수 있다." },
  { id: 29, category: "AI 협업", subcategory: "워크플로우", text: "기존 업무 프로세스에 AI를 통합하여 효율성을 높인다." },
  { id: 30, category: "AI 협업", subcategory: "변화 적응", text: "AI 기술 발전에 따른 업무 방식의 변화를 긍정적으로 받아들인다." },
];

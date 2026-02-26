export interface CourseRecommendation {
  title: string;
  type: '온라인' | '오프라인';
  level: '초급' | '고급';
  duration: string;
  desc: string;
  link: string;
}

export const recommendationsData: Record<string, CourseRecommendation[]> = {
  "AI 이해": [
    {
      title: "AI 이해 기초 다지기",
      type: "온라인",
      level: "초급",
      duration: "4주",
      desc: "AI 이해의 핵심 개념을 체계적으로 학습합니다.",
      link: "https://www.scopelabs.co/"
    },
    {
      title: "AI 이해 실무 적용 워크샵",
      type: "오프라인",
      level: "고급",
      duration: "1일",
      desc: "실제 업무 시나리오를 바탕으로 AI 이해 역량을 강화합니다.",
      link: "https://www.scopelabs.co/"
    }
  ],
  "데이터 리터러시": [
    {
      title: "데이터 리터러시 기초 다지기",
      type: "온라인",
      level: "초급",
      duration: "4주",
      desc: "데이터 리터러시의 핵심 개념을 체계적으로 학습합니다.",
      link: "https://www.scopelabs.co/"
    },
    {
      title: "데이터 리터러시 실무 적용 워크샵",
      type: "오프라인",
      level: "고급",
      duration: "1일",
      desc: "실제 업무 시나리오를 바탕으로 데이터 리터러시 역량을 강화합니다.",
      link: "https://www.scopelabs.co/"
    }
  ],
  "AI 활용": [
    {
      title: "AI 활용 기초 다지기",
      type: "온라인",
      level: "초급",
      duration: "4주",
      desc: "AI 활용의 핵심 개념을 체계적으로 학습합니다.",
      link: "https://www.scopelabs.co/"
    },
    {
      title: "AI 활용 실무 적용 워크샵",
      type: "오프라인",
      level: "고급",
      duration: "1일",
      desc: "실제 업무 시나리오를 바탕으로 AI 활용 역량을 강화합니다.",
      link: "https://www.scopelabs.co/"
    }
  ],
  "AI 윤리": [
    {
      title: "AI 윤리 기초 다지기",
      type: "온라인",
      level: "초급",
      duration: "4주",
      desc: "AI 윤리의 핵심 개념을 체계적으로 학습합니다.",
      link: "https://www.scopelabs.co/"
    },
    {
      title: "AI 윤리 실무 적용 워크샵",
      type: "오프라인",
      level: "고급",
      duration: "1일",
      desc: "실제 업무 시나리오를 바탕으로 AI 윤리 역량을 강화합니다.",
      link: "https://www.scopelabs.co/"
    }
  ],
  "AI 협업": [
    {
      title: "AI 협업 기초 다지기",
      type: "온라인",
      level: "초급",
      duration: "4주",
      desc: "AI 협업의 핵심 개념을 체계적으로 학습합니다.",
      link: "https://www.scopelabs.co/"
    },
    {
      title: "AI 협업 실무 적용 워크샵",
      type: "오프라인",
      level: "고급",
      duration: "1일",
      desc: "실제 업무 시나리오를 바탕으로 AI 협업 역량을 강화합니다.",
      link: "https://www.scopelabs.co/"
    }
  ]
};

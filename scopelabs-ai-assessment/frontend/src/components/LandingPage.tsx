import { motion } from 'motion/react';
import { useAssessment } from '../context/AssessmentContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Brain, Database, Cpu, Scale, Users, CheckCircle2, TrendingUp } from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer
} from 'recharts';

export function LandingPage() {
  const { setStep } = useAssessment();

  const categories = [
    {
      title: 'AI 이해',
      description: 'AI의 기본 개념과 원리, 최신 트렌드를 이해하는 능력',
      icon: Brain,
      questions: 6,
    },
    {
      title: '데이터 리터러시',
      description: '데이터를 수집, 분석, 해석하여 인사이트를 도출하는 능력',
      icon: Database,
      questions: 6,
    },
    {
      title: 'AI 활용',
      description: '다양한 AI 도구를 업무에 적용하여 생산성을 높이는 능력',
      icon: Cpu,
      questions: 8,
    },
    {
      title: 'AI 윤리',
      description: 'AI 사용 시 발생할 수 있는 윤리적 문제를 인지하고 대응하는 능력',
      icon: Scale,
      questions: 6,
    },
    {
      title: 'AI 협업',
      description: 'AI와 인간의 역할을 구분하고 효과적으로 협업하는 능력',
      icon: Users,
      questions: 4,
    },
  ];

  const mockChartData = [
    { category: 'AI 이해', score: 85, fullMark: 100 },
    { category: '데이터 리터러시', score: 65, fullMark: 100 },
    { category: 'AI 활용', score: 90, fullMark: 100 },
    { category: 'AI 윤리', score: 70, fullMark: 100 },
    { category: 'AI 협업', score: 80, fullMark: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-24 py-12 overflow-hidden"
    >
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto relative px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
        >
          나의 <span className="text-primary relative inline-block">
            AI 역량 수준
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>은?
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
        >
          30문항으로 진단하는 5가지 AI 역량 영역.<br />
          맞춤형 역량 개발 가이드를 받아보세요.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 flex flex-col items-center gap-6"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <Button size="lg" onClick={() => setStep('info')} className="relative px-10 text-lg h-16 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 bg-primary hover:bg-primary/90">
              무료 진단 시작하기 →
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <Users size={16} className="text-primary" />
              <span>현재 <span className="font-bold text-gray-900">1,240명</span>의 직장인이 참여했습니다</span>
            </div>
            <p className="text-xs text-gray-500">마케터, 개발자, 기획자 등 다양한 직군 참여 중!</p>
          </div>
        </motion.div>
      </section>

      {/* Sneak Peek Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">진단 결과 리포트 미리보기</h2>
            <p className="text-gray-600">진단 후 제공되는 상세 분석 리포트를 확인해보세요</p>
          </div>
          
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: Chart Preview */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-primary/10 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                  <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        역량 밸런스 분석
                      </CardTitle>
                      <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">Sample</span>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[320px] flex items-center justify-center p-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockChartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="category" tick={{ fill: '#4b5563', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name="점수"
                          dataKey="score"
                          stroke="#4973F2"
                          fill="#4973F2"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right: Features List */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">객관적인 역량 수준 진단</h3>
                      <p className="text-sm text-gray-600 mt-1">5가지 핵심 영역별 점수와 상세 분석을 통해 나의 현재 위치를 정확하게 파악할 수 있습니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">맞춤형 성장 가이드</h3>
                      <p className="text-sm text-gray-600 mt-1">부족한 역량을 보완할 수 있는 구체적인 학습 경로와 실천 방안을 제안해 드립니다.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">실무 적용 팁 제공</h3>
                      <p className="text-sm text-gray-600 mt-1">단순 이론이 아닌, 실제 업무 현장에서 바로 활용 가능한 AI 툴과 적용 사례를 추천합니다.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">5가지 핵심 진단 영역</h2>
          <p className="text-gray-600 mt-2">AI 역량을 구성하는 필수 요소들을 입체적으로 분석합니다</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-64"
            >
              <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-default group relative overflow-hidden">
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 group-hover:-translate-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <category.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-400 font-medium">{category.questions}문항</p>
                </div>
                
                <div className="absolute inset-0 bg-white/95 p-6 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4">
        <div className="bg-gray-900 text-white rounded-3xl p-12 text-center space-y-8 relative overflow-hidden max-w-5xl mx-auto shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">지금 바로 시작하세요</h2>
            <p className="text-gray-300 max-w-xl mx-auto text-lg">
              AI 시대, 당신의 경쟁력을 확인하고 성장할 수 있는 기회입니다.<br/>
              이미 1,200명 이상의 동료들이 진단을 완료했습니다.
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <Button 
              onClick={() => setStep('info')} 
              className="bg-white text-gray-900 hover:bg-gray-100 border-none px-10 h-14 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform"
            >
              무료 진단 시작하기
            </Button>
            <p className="mt-4 text-sm text-gray-400">
              로그인 없이 바로 시작 가능합니다
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

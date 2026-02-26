import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAssessment } from '../context/AssessmentContext';
import { questions } from '../data/questions';
import { recommendationsData } from '../data/recommendations';
import { SCOPELABS_COURSE_URL } from '../constants';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { encodeData } from '../utils/share';
import { saveAssessment } from '../services/api';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { Download, Share2, Loader2, RefreshCw } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export function Results() {
  const { userInfo: contextUserInfo, answers: contextAnswers, resetAssessment, sharedData, sessionId } = useAssessment();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isSavedRef = useRef(false);

  // Use shared data if available, otherwise use context data
  const userInfo = sharedData ? sharedData.userInfo : contextUserInfo;
  const answers = sharedData ? sharedData.answers : contextAnswers;

  // Calculate scores
  const categories = Array.from(new Set(questions.map(q => q.category)));

  const categoryScores = categories.map(category => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const totalPossible = categoryQuestions.length * 5;
    const currentScore = categoryQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const percentage = (currentScore / totalPossible) * 100;

    return {
      category,
      score: Math.round(percentage),
      raw: currentScore,
      fullMark: 100
    };
  });

  const totalScore = Math.round(
    categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categories.length
  );

  // Determine Level
  let level = '';
  let comment = '';
  if (totalScore >= 90) {
    level = '고도화';
    comment = 'AI 선도 수준입니다. 조직 내 AI 전략가 역할을 수행할 수 있습니다.';
  } else if (totalScore >= 75) {
    level = '활용';
    comment = 'AI 활용 능력이 우수합니다. 더 심화된 기술 이해를 통해 전문가로 성장할 수 있습니다.';
  } else if (totalScore >= 60) {
    level = '기초';
    comment = '기본적인 AI 역량을 갖추고 있습니다. 실무 적용 범위를 넓혀보세요.';
  } else {
    level = '입문';
    comment = 'AI 역량 개발이 필요합니다. 기초부터 차근차근 학습해보세요.';
  }

  // Recommendations logic (lowest 2 categories)
  const sortedCategories = [...categoryScores].sort((a, b) => a.score - b.score);
  const weakCategories = sortedCategories.slice(0, 2);

  const recommendations = weakCategories.map(cat => ({
    category: cat.category,
    courses: recommendationsData[cat.category] || []
  }));

  useEffect(() => {
    // Save data only if it's not shared data (i.e., it's a new assessment)
    // and we haven't started saving yet (prevent React StrictMode double effect)
    if (!sharedData && !isSavedRef.current) {
      isSavedRef.current = true;
      const saveData = async () => {
        setIsSaving(true);
        try {
          const resultData = {
            categoryScores,
            totalScore,
            level,
            comment,
            recommendations
          };

          await saveAssessment({
            userInfo,
            answers,
            result_data: resultData
          });
        } catch (error) {
          console.error('Failed to save assessment result:', error);
          isSavedRef.current = false; // Allow retry on failure
        } finally {
          setIsSaving(false);
        }
      };

      saveData();
    }

    // Simulate page loading (1-2 seconds)
    const pageTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);

    // Simulate AI analysis loading
    const aiTimer = setTimeout(() => {
      setIsAiAnalyzing(false);
    }, 3500);

    return () => {
      clearTimeout(pageTimer);
      clearTimeout(aiTimer);

      // If the user navigates away from the result page (e.g. back button or home button),
      // we should clear the assessment data so they don't resume it later.
      if (!sharedData) {
        localStorage.removeItem('scopelabs-assessment');
      }
    };
  }, []); // Run once on mount

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;

    try {
      // Ensure fonts are loaded to fix text baseline shifts
      await document.fonts.ready;

      // Temporarily scroll to top to prevent html2canvas capturing offsets
      const originalScrollY = window.scrollY;
      window.scrollTo(0, 0);

      // Force a window resize event so responsive libraries (like Recharts) 
      // can recalculate their dimensions while we are at scroll (0,0)
      window.dispatchEvent(new Event('resize'));

      // Small delay to allow SVG (Recharts) to finish any inner reflows or animations
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use html-to-image to create a pixel-perfect PNG utilizing SVG <foreignObject>
      // This bypasses html2canvas redraw bugs entirely.
      const dataUrl = await toPng(resultRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High-res capture
        backgroundColor: '#f9fafb',
        filter: (node) => {
          // Ignore elements with data-html2canvas-ignore attribute
          if (node.tagName && (node as HTMLElement).dataset && (node as HTMLElement).dataset.html2canvasIgnore === 'true') {
            return false;
          }
          return true;
        }
      });

      // Restore original scroll position
      window.scrollTo(0, originalScrollY);

      const pdfWidth = 210; // A4 width in mm
      // Create a PDF image using the generated image dimensions
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const imgHeight = (img.height * pdfWidth) / img.width;

        // Create a PDF with a custom page size that fits the entire content
        const pdf = new jsPDF('p', 'mm', [pdfWidth, Math.max(pdfWidth, imgHeight)]);

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
        pdf.save(`AI_역량진단_결과_${userInfo.name || '사용자'}.pdf`);
      };
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleShare = async () => {
    const encoded = encodeData(userInfo, answers);
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      alert('결과 링크가 복사되었습니다. 친구들에게 공유해보세요!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for environments where clipboard API might be restricted
      prompt('링크를 복사해주세요:', url);
    }
  };

  if (isPageLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-4"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-medium text-gray-700">결과를 불러오는 중...</h2>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div id="result-container" ref={resultRef} className="space-y-8 bg-gray-50 p-4 md:p-8 rounded-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {userInfo.name || '사용자'}님의 AI 역량진단 결과
          </h1>
          <p className="text-gray-500">진단일자: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Summary Card */}
        <Card className="border-primary-20 shadow-lg bg-white overflow-hidden relative">
          <div
            className="absolute top-0 left-0 w-full h-2"
            style={{ backgroundImage: 'linear-gradient(to right, #7096f6, #4973F2)' }}
          />
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-2 min-w-[200px]">
                <span className="inline-block px-3 py-1 bg-primary-10 text-primary font-semibold rounded-full text-sm mb-2">
                  [{level}]
                </span>
                <div className="text-5xl font-bold text-gray-900">
                  {totalScore}<span className="text-2xl text-gray-400 font-normal">점</span>
                </div>
              </div>
              <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 w-full">
                <h3 className="text-lg font-semibold mb-2">총평</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {comment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">역량 밸런스 (Radar Chart)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={categoryScores}>
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
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">영역별 상세 점수 (Bar Chart)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pl-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={categoryScores} margin={{ left: 0, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="score" fill="#4973F2" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#4b5563', fontSize: 12, formatter: (val: number) => `${val}점` }}>
                    {categoryScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#4973F2' : '#93C5FD'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Comment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI 분석 코멘트</CardTitle>
          </CardHeader>
          <CardContent>
            {isAiAnalyzing ? (
              <div className="space-y-3 animate-pulse">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">AI가 분석 중입니다...</span>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>강점:</strong> {sortedCategories[4].category} 및 {sortedCategories[3].category} 영역에서 우수한 역량을 보여주고 있습니다. 이는 AI 기술을 실제 업무에 적용하고 활용하는 데 있어 좋은 기반이 됩니다.
                </p>
                <p>
                  <strong>약점:</strong> 상대적으로 {sortedCategories[0].category} 영역의 점수가 낮게 나타났습니다. 이 부분을 보완한다면 더욱 균형 잡힌 AI 역량을 갖출 수 있을 것입니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Analysis & Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">맞춤 교육과정 추천</h2>
          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.category} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 break-keep">
                  <span className="w-2 h-6 bg-primary rounded-full shrink-0" />
                  {rec.category} 역량 강화 과정
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rec.courses.map((course) => (
                    <Card
                      key={course.title}
                      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-gray-300 hover:border-l-primary"
                      onClick={() => window.open(course.link, '_blank')}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex gap-2">
                            <span className={`inline-flex items-center justify-center text-xs px-2.5 py-1 rounded font-medium whitespace-nowrap leading-none ${course.level === '초급' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              <span className="relative top-[1px]">{course.level}</span>
                            </span>
                            <span className={`inline-flex items-center justify-center text-xs px-2.5 py-1 rounded font-medium whitespace-nowrap leading-none ${course.type === '온라인' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              <span className="relative top-[1px]">{course.type}</span>
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium whitespace-nowrap flex items-center leading-none mt-1">{course.duration}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 break-keep leading-snug">{course.title}</h4>
                        <p className="text-sm text-gray-600 break-keep leading-relaxed">{course.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6" data-html2canvas-ignore="true">
            <Button
              variant="outline"
              className="w-full md:w-auto px-8"
              onClick={() => window.open(SCOPELABS_COURSE_URL, '_blank')}
            >
              Scopelabs 전체 교육과정 보기 →
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-4">
        <Button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2">
          <Download size={18} />
          PDF 다운로드
        </Button>

        {sharedData ? (
          <Button onClick={resetAssessment} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none">
            <RefreshCw size={18} />
            나도 테스트 하러 가기
          </Button>
        ) : (
          <Button variant="outline" onClick={handleShare} className="flex items-center justify-center gap-2 bg-white">
            <Share2 size={18} />
            공유하기
          </Button>
        )}

        {!sharedData && (
          <Button variant="ghost" onClick={() => {
            resetAssessment();
            // Optional: if using a router, navigate('/'), but since step-based routing:
            window.location.href = '/';
          }} className="text-gray-500 flex items-center justify-center">
            처음으로 돌아가기
          </Button>
        )}
      </div>
    </motion.div>
  );
}

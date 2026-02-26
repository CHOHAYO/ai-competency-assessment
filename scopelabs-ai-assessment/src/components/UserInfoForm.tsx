import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAssessment } from '../context/AssessmentContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Loader2 } from 'lucide-react';
import { startDiagnosis } from '../services/api';

const jobOptions: Record<string, string[]> = {
  '마케팅': ['퍼포먼스 마케팅', '콘텐츠 마케팅', '브랜드 마케팅', '그로스 마케팅', 'CRM 마케팅'],
  '개발': ['프론트엔드', '백엔드', '풀스택', '모바일 앱', 'DevOps/SRE', '데이터 엔지니어링', 'AI/ML'],
  '디자인': ['UI/UX 디자인', '프로덕트 디자인', '그래픽 디자인', '브랜드 디자인', '영상/모션'],
  '기획/PM': ['서비스 기획', 'PM/PO', '사업 기획', '전략 기획'],
  '영업': ['B2B 영업', 'B2C 영업', '기술 영업', '해외 영업', '영업 관리'],
  '인사/HR': ['채용', 'HRM', 'HRD', '조직문화', '노무'],
  '경영지원': ['총무', '재무/회계', '구매/자재', '법무'],
  '기타': ['기타']
};
const commonDomains = ['gmail.com', 'naver.com', 'kakao.com', 'outlook.com', 'icloud.com'];

export function UserInfoForm() {
  const { userInfo, setUserInfo, setStep, setSessionId } = useAssessment();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!userInfo.name) newErrors.name = '이름을 입력해주세요.';
    if (!userInfo.email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(userInfo.email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API to start Diagnosis & create Session
      const { session_id } = await startDiagnosis(userInfo);
      setSessionId(session_id);

      setIsLoading(false);
      setStep('assessment');
    } catch (error) {
      console.error('Failed to start diagnosis:', error);
      alert('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setUserInfo({ ...userInfo, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    if (field === 'email') {
      const emailValue = value as string;
      if (emailValue.includes('@')) {
        const [localPart, domainPart] = emailValue.split('@');
        if (domainPart !== undefined) {
          const suggestions = commonDomains
            .filter(d => d.startsWith(domainPart))
            .map(d => `${localPart}@${d}`);
          setEmailSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    }

    // Reset task if job changes
    if (field === 'job') {
      setUserInfo({ ...userInfo, job: value as string, task: '' });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleChange('email', suggestion);
    setShowSuggestions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto py-12"
    >
      <Card>
        <CardHeader>
          <CardTitle>기본 정보 입력</CardTitle>
          <CardDescription className="text-primary font-medium">
            입력하신 직무와 연차를 바탕으로 더욱 정교한 동료 그룹 비교 데이터와 맞춤형 교육을 추천해 드립니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="이름 (필수)"
                placeholder="홍길동"
                value={userInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
              />

              <div className="relative">
                <Input
                  label="이메일 (필수)"
                  type="email"
                  placeholder="example@company.com"
                  value={userInfo.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => {
                    if (userInfo.email && userInfo.email.includes('@')) {
                      const [localPart, domainPart] = userInfo.email.split('@');
                      if (domainPart !== undefined) {
                        const suggestions = commonDomains
                          .filter(d => d.startsWith(domainPart))
                          .map(d => `${localPart}@${d}`);
                        setEmailSuggestions(suggestions);
                        setShowSuggestions(suggestions.length > 0);
                      }
                    }
                  }}
                  error={errors.email}
                />
                {showSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-auto">
                    {emailSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-blue-600 mt-1 ml-1">
                  * 회사 이메일 입력 시 B2B 도입 혜택 제공
                </p>
              </div>

              <Input
                label="소속 (선택)"
                placeholder="회사명 또는 기관명"
                value={userInfo.affiliation || ''}
                onChange={(e) => handleChange('affiliation', e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">직무 (선택)</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={userInfo.job || ''}
                    onChange={(e) => handleChange('job', e.target.value)}
                  >
                    <option value="">직무 선택</option>
                    {Object.keys(jobOptions).map((job) => (
                      <option key={job} value={job}>{job}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">세부 직무 (선택)</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={userInfo.task || ''}
                    onChange={(e) => handleChange('task', e.target.value)}
                    disabled={!userInfo.job}
                  >
                    <option value="">세부 직무 선택</option>
                    {userInfo.job && jobOptions[userInfo.job]?.map((task) => (
                      <option key={task} value={task}>{task}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">업종 (선택)</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={userInfo.industry || ''}
                    onChange={(e) => handleChange('industry', e.target.value)}
                  >
                    <option value="">선택해주세요</option>
                    <option value="IT/SW">IT/소프트웨어</option>
                    <option value="Finance">금융</option>
                    <option value="Manufacturing">제조</option>
                    <option value="Service">서비스</option>
                    <option value="Education">교육</option>
                    <option value="Other">기타</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">연령대 (선택)</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={userInfo.age || ''}
                    onChange={(e) => handleChange('age', e.target.value)}
                  >
                    <option value="">선택해주세요</option>
                    <option value="20s">20대</option>
                    <option value="30s">30대</option>
                    <option value="40s">40대</option>
                    <option value="50s">50대 이상</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="marketing"
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  checked={userInfo.marketing || false}
                  onChange={(e) => handleChange('marketing', e.target.checked)}
                />
                <label htmlFor="marketing" className="text-sm text-gray-600 cursor-pointer select-none">
                  마케팅 정보 수신 동의 (선택)
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  처리중...
                </>
              ) : (
                '진단 시작하기 →'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

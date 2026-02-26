import { ReactNode } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { Button } from './ui/Button';
import { 
  COMPANY_INFO_URL, 
  PRIVACY_POLICY_URL, 
  TERMS_OF_SERVICE_URL, 
  CONTACT_URL 
} from '../constants';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { setStep } = useAssessment();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('landing')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Scopelabs <span className="text-gray-500 font-normal text-sm ml-1">AI 역량진단</span>
            </span>
          </div>
          <Button onClick={() => setStep('info')} size="sm">
            진단 시작
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-6 opacity-80">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Scopelabs</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 text-sm text-gray-600">
            <a href={COMPANY_INFO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">기업정보</a>
            <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">개인정보처리방침</a>
            <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">이용약관</a>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">문의처</a>
          </div>
          
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Scopelabs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

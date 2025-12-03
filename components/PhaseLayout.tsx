import React from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface PhaseLayoutProps {
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  onBack: () => void;
  onNext?: () => void;
  children: React.ReactNode;
  isNextDisabled?: boolean;
}

export const PhaseLayout: React.FC<PhaseLayoutProps> = ({
  title,
  subtitle,
  color,
  icon,
  onBack,
  onNext,
  children,
  isNextDisabled = false,
}) => {
  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
           {/* Auto-save indicator would go here */}
           <span className="text-xs text-gray-400 italic flex items-center gap-1">
             <Save size={14} /> Guardado automático
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {children}
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t px-6 py-4 flex justify-between items-center sticky bottom-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        
        {onNext && (
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all shadow-md
              ${isNextDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}
            `}
          >
            Siguiente Fase
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
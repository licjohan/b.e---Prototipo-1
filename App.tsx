import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Users, 
  Target, 
  Wrench, 
  CheckCircle, 
  Layout, 
  BookOpen, 
  Plus, 
  Star, 
  Trash2, 
  Image as ImageIcon,
  BrainCircuit,
  FileText,
  Download
} from 'lucide-react';
import { PhaseLayout } from './components/PhaseLayout';
import { generateIdeasWithGemini } from './services/geminiService';
import { 
  Phase, 
  ProjectData, 
  INITIAL_PROJECT_DATA, 
  Idea 
} from './types';

// --- Sub-Components (Defined here to maintain single-file complexity balance) ---

// 1. Empathy Map Component
const EmpathyPhase: React.FC<{ data: ProjectData['empathy']; onChange: (data: ProjectData['empathy']) => void }> = ({ data, onChange }) => {
  const handleChange = (field: keyof ProjectData['empathy'], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {[
        { id: 'thinks', label: '¿Qué PIENSA y SIENTE?', placeholder: 'Lo que realmente le importa, sus preocupaciones...', icon: '🧠', color: 'bg-blue-50 border-blue-200' },
        { id: 'sees', label: '¿Qué VE?', placeholder: 'Su entorno, amigos, ofertas del mercado...', icon: '👀', color: 'bg-green-50 border-green-200' }, // Mapping 'sees' to 'does' visually or conceptually if needed, keeping strict to PDF 'Says/Thinks/Does/Feels'
        { id: 'says', label: '¿Qué DICE y HACE?', placeholder: 'Su actitud en público, comportamiento, aspecto...', icon: '🗣️', color: 'bg-yellow-50 border-yellow-200' },
        { id: 'does', label: '¿Qué OYE?', placeholder: 'Lo que dicen amigos, jefe, influencias...', icon: '👂', color: 'bg-pink-50 border-pink-200' }, // PDF actually asks for Says/Thinks/Does/Feels. Let's align with typical map.
      ].map((section, idx) => {
        // Remap for the specific PDF fields: Siente(feels), Piensa(thinks), Dice(says), Hace(does)
        // Adjusting layout to match standard Empathy Map quadrants
        let field: keyof ProjectData['empathy'] = 'thinks';
        let title = '';
        if(idx === 0) { field = 'thinks'; title = '¿Qué PIENSA y SIENTE?'; }
        if(idx === 1) { field = 'does'; title = '¿Qué HACE?'; }
        if(idx === 2) { field = 'says'; title = '¿Qué DICE?'; }
        if(idx === 3) { field = 'feels'; title = '¿Qué SIENTE (emociones)?'; }

        return (
          <div key={idx} className={`p-4 rounded-2xl border-2 ${section.color} transition-all focus-within:ring-2 focus-within:ring-blue-400`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{section.icon}</span>
              <h3 className="font-bold text-gray-700">{title}</h3>
            </div>
            <textarea
              value={data[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full h-32 bg-white/50 p-3 rounded-lg border border-gray-200 focus:outline-none focus:bg-white transition-colors resize-none"
              placeholder={section.placeholder}
            />
          </div>
        );
      })}
    </div>
  );
};

// 2. Define Component
const DefinePhase: React.FC<{ data: ProjectData['define']; onChange: (data: ProjectData['define']) => void }> = ({ data, onChange }) => {
  const handleChange = (field: keyof ProjectData['define'], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="text-purple-600" />
          Definición del Reto (Point of View)
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1 text-right font-medium text-gray-600">El usuario (Describe tu usuario)</div>
            <div className="md:col-span-2">
              <input 
                type="text" 
                value={data.user}
                onChange={(e) => handleChange('user', e.target.value)}
                className="w-full p-3 bg-purple-50 border-b-2 border-purple-200 focus:border-purple-600 outline-none rounded-t-lg transition-colors"
                placeholder="Ej: Estudiante de grado 11..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1 text-right font-medium text-gray-600">NECESITA (Un verbo/acción)</div>
            <div className="md:col-span-2">
               <input 
                type="text" 
                value={data.need}
                onChange={(e) => handleChange('need', e.target.value)}
                className="w-full p-3 bg-purple-50 border-b-2 border-purple-200 focus:border-purple-600 outline-none rounded-t-lg transition-colors"
                placeholder="Ej: Aprender a gestionar su tiempo..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1 text-right font-medium text-gray-600">PORQUE (Insight/Descubrimiento)</div>
            <div className="md:col-span-2">
               <input 
                type="text" 
                value={data.insight}
                onChange={(e) => handleChange('insight', e.target.value)}
                className="w-full p-3 bg-purple-50 border-b-2 border-purple-200 focus:border-purple-600 outline-none rounded-t-lg transition-colors"
                placeholder="Ej: Se siente abrumado con las tareas y el estudio..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
        <h4 className="font-bold text-purple-100 mb-2 uppercase text-xs tracking-wider">Tu Declaración del Problema</h4>
        <p className="text-xl md:text-2xl font-serif italic leading-relaxed">
          "{data.user || '___'} necesita {data.need || '___'} porque {data.insight || '___'}."
        </p>
      </div>
    </div>
  );
};

// 3. Ideate Component
const IdeatePhase: React.FC<{ 
  data: ProjectData['ideate']; 
  defineData: ProjectData['define'];
  onChange: (data: ProjectData['ideate']) => void 
}> = ({ data, defineData, onChange }) => {
  const [newIdea, setNewIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addIdea = (text: string) => {
    if (!text.trim()) return;
    onChange([...data, { id: Date.now().toString() + Math.random(), text, isFavorite: false }]);
    setNewIdea('');
  };

  const toggleFavorite = (id: string) => {
    onChange(data.map(idea => idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea));
  };

  const removeIdea = (id: string) => {
    onChange(data.filter(idea => idea.id !== id));
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const suggestions = await generateIdeasWithGemini(defineData);
    const newIdeas = suggestions.map(text => ({
      id: Date.now().toString() + Math.random(),
      text,
      isFavorite: false
    }));
    onChange([...data, ...newIdeas]);
    setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
        <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
          <Lightbulb className="fill-yellow-500 text-yellow-600" />
          Brainstorming (Lluvia de Ideas)
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIdea(newIdea)}
            placeholder="Escribe una idea loca aquí..."
            className="flex-1 p-3 rounded-lg border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <button 
            onClick={() => addIdea(newIdea)}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
          >
            <Plus />
          </button>
        </div>
        
        {/* Gemini Integration */}
        {process.env.API_KEY && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating || !defineData.user}
              className="text-xs flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
            >
              <BrainCircuit size={16} />
              {isGenerating ? 'Generando ideas...' : 'Ayúdame con IA (Gemini)'}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Lightbulb size={48} className="mb-2 opacity-50" />
            <p>Aún no hay ideas. ¡Deja volar tu imaginación!</p>
          </div>
        )}
        {data.map(idea => (
          <div key={idea.id} className={`p-4 rounded-xl border flex justify-between items-start gap-3 transition-all ${idea.isFavorite ? 'bg-yellow-50 border-yellow-400 shadow-md' : 'bg-white border-gray-200 hover:shadow-sm'}`}>
            <p className="flex-1 text-gray-700 font-medium">{idea.text}</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => toggleFavorite(idea.id)} className={`transition-transform active:scale-90 ${idea.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}>
                <Star className={idea.isFavorite ? 'fill-current' : ''} size={20} />
              </button>
              <button onClick={() => removeIdea(idea.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Prototype Component
const PrototypePhase: React.FC<{ data: ProjectData['prototype']; onChange: (data: ProjectData['prototype']) => void }> = ({ data, onChange }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Descripción del Prototipo</h3>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Describe qué es, cómo funciona y qué materiales usarás..."
          />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Características Principales</h3>
          <textarea
            value={data.features}
            onChange={(e) => onChange({ ...data, features: e.target.value })}
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Lista las funcionalidades clave (e.g., Es portátil, usa energía solar...)"
          />
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-1 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-400 transition-colors">
          {data.imageUrl ? (
            <>
              <img src={data.imageUrl} alt="Prototipo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-medium">Click para cambiar imagen</p>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ImageIcon size={32} />
              </div>
              <p className="text-gray-500 font-medium">Sube un boceto o foto de tu prototipo</p>
              <p className="text-xs text-gray-400 mt-2">Máx 5MB</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// 5. Test Component (Feedback Grid)
const TestPhase: React.FC<{ data: ProjectData['test']; onChange: (data: ProjectData['test']) => void }> = ({ data, onChange }) => {
  const GridItem = ({ title, field, placeholder, icon, color }: any) => (
    <div className={`p-4 rounded-xl border ${color} flex flex-col h-full`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-bold text-gray-700">{title}</h4>
      </div>
      <textarea
        value={(data as any)[field]}
        onChange={(e) => onChange({ ...data, [field]: e.target.value })}
        className="flex-1 w-full bg-white/60 p-3 rounded-lg border border-gray-200 focus:bg-white resize-none outline-none"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full auto-rows-fr">
      <GridItem 
        title="¿Qué funcionó?" 
        field="worked" 
        placeholder="Cosas que al usuario le gustaron..." 
        icon={<CheckCircle className="text-green-600" />} 
        color="bg-green-50 border-green-200"
      />
      <GridItem 
        title="¿Qué NO funcionó?" 
        field="notWorked" 
        placeholder="Críticas constructivas, problemas..." 
        icon={<div className="text-red-600 font-bold text-xl">✕</div>} 
        color="bg-red-50 border-red-200"
      />
      <GridItem 
        title="Dudas que surgieron" 
        field="questions" 
        placeholder="¿Qué preguntas hicieron los usuarios?" 
        icon={<div className="text-yellow-600 font-bold text-xl">?</div>} 
        color="bg-yellow-50 border-yellow-200"
      />
      <GridItem 
        title="Nuevas Ideas" 
        field="ideas" 
        placeholder="Inspiración para la siguiente iteración..." 
        icon={<Lightbulb className="text-blue-600" />} 
        color="bg-blue-50 border-blue-200"
      />
    </div>
  );
};

// 6. Summary View
const SummaryView: React.FC<{ data: ProjectData; onPrint: () => void; onBack: () => void }> = ({ data, onPrint, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Resumen del Proyecto</h1>
        <div className="flex gap-4">
           <button onClick={onBack} className="text-gray-500 hover:text-gray-700">Volver a editar</button>
           <button onClick={onPrint} className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black">
             <Download size={18} /> Exportar PDF
           </button>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none" id="printable-area">
        <div className="bg-blue-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{data.projectName || 'Proyecto Sin Nombre'}</h2>
          <p className="opacity-90">Creado por: {data.studentName || 'Estudiante'}</p>
        </div>

        <div className="p-8 space-y-10">
          <section>
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">1. Empatizar</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded"><strong>Dice:</strong> {data.empathy.says}</div>
              <div className="bg-gray-50 p-3 rounded"><strong>Piensa:</strong> {data.empathy.thinks}</div>
              <div className="bg-gray-50 p-3 rounded"><strong>Hace:</strong> {data.empathy.does}</div>
              <div className="bg-gray-50 p-3 rounded"><strong>Siente:</strong> {data.empathy.feels}</div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">2. Definir</h3>
            <p className="text-lg italic text-gray-600 border-l-4 border-purple-500 pl-4">
              "{data.define.user} necesita {data.define.need} porque {data.define.insight}."
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">3. Idear (Top Ideas)</h3>
            <ul className="list-disc pl-5 space-y-2">
              {data.ideate.filter(i => i.isFavorite).map(idea => (
                <li key={idea.id} className="text-gray-700">{idea.text}</li>
              ))}
              {data.ideate.filter(i => i.isFavorite).length === 0 && <span className="text-gray-400">No hay ideas favoritas seleccionadas.</span>}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">4. Prototipar</h3>
            <div className="flex gap-6">
              <div className="flex-1">
                 <p className="mb-2"><strong>Descripción:</strong> {data.prototype.description}</p>
                 <p><strong>Características:</strong> {data.prototype.features}</p>
              </div>
              {data.prototype.imageUrl && (
                <div className="w-1/3">
                  <img src={data.prototype.imageUrl} alt="Prototipo" className="rounded-lg border" />
                </div>
              )}
            </div>
          </section>

          <section>
             <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">5. Testear</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded border border-green-100">
                  <strong className="text-green-800">Funcionó:</strong>
                  <p className="text-sm mt-1">{data.test.worked}</p>
                </div>
                <div className="p-3 bg-red-50 rounded border border-red-100">
                  <strong className="text-red-800">A mejorar:</strong>
                  <p className="text-sm mt-1">{data.test.notWorked}</p>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};


// --- Main Application Component ---

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.HOME);
  const [projectData, setProjectData] = useState<ProjectData>(INITIAL_PROJECT_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulate auth

  // Simulated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-2">b.e</h1>
            <p className="text-gray-500">Herramienta de Emprendimiento Escolar</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="estudiante@escuela.edu.co" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
              Ingresar
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Versión MVP 1.0 (React Prototype)</p>
          </form>
        </div>
      </div>
    );
  }

  // Phase Router Logic
  const renderPhase = () => {
    switch (currentPhase) {
      case Phase.HOME:
        return (
          <div className="max-w-6xl mx-auto p-8">
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Hola, Emprendedor 🚀</h1>
              <p className="text-xl text-gray-600">Sigue la ruta del Design Thinking para crear tu proyecto.</p>
              
              <div className="mt-8 max-w-md mx-auto">
                 <label className="block text-left text-sm font-medium text-gray-700 mb-1">Nombre de tu Proyecto</label>
                 <input 
                  type="text" 
                  value={projectData.projectName}
                  onChange={(e) => setProjectData({...projectData, projectName: e.target.value})}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Mochila Solar"
                 />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { phase: Phase.EMPATHIZE, title: '1. Empatizar', desc: 'Conoce a tu usuario', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
                { phase: Phase.DEFINE, title: '2. Definir', desc: 'Encuentra el problema real', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
                { phase: Phase.IDEATE, title: '3. Idear', desc: 'Genera muchas soluciones', icon: Lightbulb, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                { phase: Phase.PROTOTYPE, title: '4. Prototipar', desc: 'Construye tu idea', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
                { phase: Phase.TEST, title: '5. Testear', desc: 'Valida con usuarios', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
              ].map((item) => (
                <button
                  key={item.phase}
                  onClick={() => setCurrentPhase(item.phase)}
                  className={`p-6 rounded-2xl border-2 ${item.border} ${item.bg} hover:shadow-lg transition-all text-left group`}
                >
                  <div className={`mb-4 p-3 rounded-full bg-white w-fit ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className={`text-xl font-bold ${item.color} mb-2`}>{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </button>
              ))}
              
              {/* Summary Card */}
               <button
                  onClick={() => setCurrentPhase(Phase.SUMMARY)}
                  className="p-6 rounded-2xl border-2 border-gray-200 bg-white hover:shadow-lg transition-all text-left flex flex-col justify-center items-center text-center group"
                >
                   <div className="mb-4 p-3 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Ver Resumen Final</h3>
                </button>
            </div>
          </div>
        );

      case Phase.EMPATHIZE:
        return (
          <PhaseLayout
            title="Fase 1: Empatizar"
            subtitle="Entiende profundamente a tu usuario poniéndote en sus zapatos."
            color="bg-blue-600"
            icon={<Users size={24} />}
            onBack={() => setCurrentPhase(Phase.HOME)}
            onNext={() => setCurrentPhase(Phase.DEFINE)}
          >
            <EmpathyPhase 
              data={projectData.empathy} 
              onChange={(data) => setProjectData({ ...projectData, empathy: data })} 
            />
          </PhaseLayout>
        );

      case Phase.DEFINE:
        return (
          <PhaseLayout
            title="Fase 2: Definir"
            subtitle="Sintetiza la información para encontrar un Insight poderoso."
            color="bg-purple-600"
            icon={<Target size={24} />}
            onBack={() => setCurrentPhase(Phase.EMPATHIZE)}
            onNext={() => setCurrentPhase(Phase.IDEATE)}
          >
            <DefinePhase 
              data={projectData.define} 
              onChange={(data) => setProjectData({ ...projectData, define: data })} 
            />
          </PhaseLayout>
        );

      case Phase.IDEATE:
        return (
          <PhaseLayout
            title="Fase 3: Idear"
            subtitle="¡No hay malas ideas! Genera la mayor cantidad posible."
            color="bg-yellow-500"
            icon={<Lightbulb size={24} />}
            onBack={() => setCurrentPhase(Phase.DEFINE)}
            onNext={() => setCurrentPhase(Phase.PROTOTYPE)}
          >
            <IdeatePhase 
              data={projectData.ideate} 
              defineData={projectData.define}
              onChange={(data) => setProjectData({ ...projectData, ideate: data })} 
            />
          </PhaseLayout>
        );

      case Phase.PROTOTYPE:
        return (
          <PhaseLayout
            title="Fase 4: Prototipar"
            subtitle="Haz tus ideas tangibles para poder interactuar con ellas."
            color="bg-orange-500"
            icon={<Wrench size={24} />}
            onBack={() => setCurrentPhase(Phase.IDEATE)}
            onNext={() => setCurrentPhase(Phase.TEST)}
          >
            <PrototypePhase 
              data={projectData.prototype} 
              onChange={(data) => setProjectData({ ...projectData, prototype: data })} 
            />
          </PhaseLayout>
        );

      case Phase.TEST:
        return (
          <PhaseLayout
            title="Fase 5: Testear"
            subtitle="Recibe feedback real para iterar y mejorar tu solución."
            color="bg-green-600"
            icon={<CheckCircle size={24} />}
            onBack={() => setCurrentPhase(Phase.PROTOTYPE)}
            onNext={() => setCurrentPhase(Phase.SUMMARY)}
          >
            <TestPhase 
              data={projectData.test} 
              onChange={(data) => setProjectData({ ...projectData, test: data })} 
            />
          </PhaseLayout>
        );

      case Phase.SUMMARY:
        return (
          <SummaryView 
            data={projectData} 
            onPrint={() => window.print()}
            onBack={() => setCurrentPhase(Phase.HOME)}
          />
        );
        
      default:
        return <div>Fase no encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
       {/* Global Navbar for logged in user */}
       {isAuthenticated && (
         <nav className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-2 font-black text-xl text-blue-600 cursor-pointer" onClick={() => setCurrentPhase(Phase.HOME)}>
             <Layout className="text-blue-600" />
             b.e
           </div>
           <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden md:block">Johan Guerrero (Estudiante)</span>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                JG
              </div>
           </div>
         </nav>
       )}
       
       {renderPhase()}
    </div>
  );
}
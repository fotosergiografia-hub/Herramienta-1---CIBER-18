
import React, { useState, useMemo } from 'react';
import { QuoteState, PrintType, PaperType, PaperSize } from './types';
import { PRICING, PAPER_ADDONS, WHATSAPP_LINK, WHATSAPP_MESSAGE } from './constants';
import { 
  Printer, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  MessageCircle, 
  Hash, 
  ArrowRight,
  Calculator
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<QuoteState>({
    printType: null,
    paperType: null,
    paperSize: null,
    quantity: 1,
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const reset = () => {
    setStep(1);
    setQuote({
      printType: null,
      paperType: null,
      paperSize: null,
      quantity: 1,
    });
  };

  const calculateTotal = useMemo(() => {
    if (!quote.printType || !quote.paperSize || !quote.paperType) return 0;
    const basePrice = PRICING[quote.printType][quote.paperSize];
    const addon = PAPER_ADDONS[quote.paperType];
    return (basePrice + addon) * quote.quantity;
  }, [quote]);

  // Screen 1: Start
  if (step === 1) {
    return (
      <Layout>
        <div className="flex flex-col items-center text-center space-y-6 py-8 fade-in">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <Calculator size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 px-4 leading-tight">
            Calcula tu impresión en segundos
          </h1>
          <p className="text-gray-600 px-6 text-lg">
            Obtén un costo aproximado antes de enviar tus documentos.
          </p>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mx-6">
            <p className="text-amber-800 text-sm font-medium">
              Nota: El precio final se confirma al revisar los archivos.
            </p>
          </div>
          <button 
            onClick={handleNext}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xl active:scale-95"
          >
            <span>Comenzar cotización</span>
            <ChevronRight size={24} />
          </button>
        </div>
      </Layout>
    );
  }

  // Screen 2: Type
  if (step === 2) {
    return (
      <Layout onBack={handleBack} progress={20}>
        <div className="space-y-6 fade-in">
          <h2 className="text-2xl font-bold text-gray-800">¿Cómo deseas imprimir?</h2>
          <div className="grid grid-cols-1 gap-4">
            <OptionButton 
              selected={quote.printType === PrintType.BW}
              onClick={() => { setQuote({...quote, printType: PrintType.BW}); handleNext(); }}
              icon={<Printer size={24} className="text-gray-600" />}
              title="Blanco y negro"
              subtitle="Texto y diagramas simples"
            />
            <OptionButton 
              selected={quote.printType === PrintType.COLOR}
              onClick={() => { setQuote({...quote, printType: PrintType.COLOR}); handleNext(); }}
              icon={<Printer size={24} className="text-blue-500" />}
              title="Color"
              subtitle="Fotos, logos o resaltados"
            />
          </div>
          <p className="text-sm text-gray-500 italic text-center px-4">
            "Cualquier archivo con algo de color se considera impresión a color."
          </p>
        </div>
      </Layout>
    );
  }

  // Screen 3: Paper & Size
  if (step === 3) {
    const isSticker = quote.paperType === PaperType.STICKER;

    return (
      <Layout onBack={handleBack} progress={40}>
        <div className="space-y-8 fade-in pb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Layers size={20} className="text-blue-600" />
              Tipo de papel
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(PaperType).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    // Si es sticker, forzar a tamaño carta
                    if (type === PaperType.STICKER) {
                      setQuote({...quote, paperType: type, paperSize: PaperSize.CARTA});
                    } else {
                      setQuote({...quote, paperType: type});
                    }
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    quote.paperType === type 
                    ? 'border-blue-600 bg-blue-50 text-blue-800' 
                    : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span className="font-semibold">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`space-y-4 transition-opacity ${quote.paperType ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h3 className="text-xl font-bold text-gray-800">Tamaño de papel</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(PaperSize).map((size) => {
                const disabled = isSticker && size !== PaperSize.CARTA;
                return (
                  <button
                    key={size}
                    disabled={disabled}
                    onClick={() => setQuote({...quote, paperSize: size})}
                    className={`py-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                      quote.paperSize === size 
                      ? 'border-blue-600 bg-blue-50 text-blue-800' 
                      : disabled 
                        ? 'border-gray-100 bg-gray-50 text-gray-300'
                        : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase">{size}</span>
                  </button>
                );
              })}
            </div>
            {isSticker && (
              <p className="text-xs text-blue-600 font-medium">* Los stickers solo se manejan en tamaño Carta.</p>
            )}
          </div>

          <button 
            disabled={!quote.paperType || !quote.paperSize}
            onClick={handleNext}
            className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Continuar
            <ChevronRight size={20} />
          </button>
        </div>
      </Layout>
    );
  }

  // Screen 4: Quantity
  if (step === 4) {
    return (
      <Layout onBack={handleBack} progress={60}>
        <div className="space-y-8 fade-in py-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">¿Cuántas hojas deseas imprimir?</h2>
          
          <div className="flex flex-col items-center space-y-6">
             <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setQuote({...quote, quantity: Math.max(1, quote.quantity - 1)})}
                  className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 text-3xl font-bold active:bg-gray-200"
                >
                  -
                </button>
                <div className="relative">
                  <input 
                    type="number"
                    value={quote.quantity}
                    onChange={(e) => setQuote({...quote, quantity: parseInt(e.target.value) || 1})}
                    className="w-24 text-center text-4xl font-black border-b-4 border-blue-600 bg-transparent focus:outline-none py-2 text-gray-900"
                  />
                </div>
                <button 
                  onClick={() => setQuote({...quote, quantity: quote.quantity + 1})}
                  className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold active:bg-blue-200"
                >
                  +
                </button>
             </div>
             <p className="text-gray-500 font-medium flex items-center gap-2">
               <Hash size={18} />
               Cada página cuenta como una hoja.
             </p>
          </div>

          <button 
            onClick={handleNext}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg transition-all text-xl mt-8 active:scale-95"
          >
            Ver resultado
          </button>
        </div>
      </Layout>
    );
  }

  // Screen 5: Result
  if (step === 5) {
    return (
      <Layout onBack={handleBack} progress={80}>
        <div className="space-y-6 fade-in">
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Resumen de cotización</h2>
            
            <div className="space-y-4">
              <SummaryItem label="Tipo" value={quote.printType!} />
              <SummaryItem label="Papel" value={quote.paperType!} />
              <SummaryItem label="Tamaño" value={quote.paperSize!} />
              <SummaryItem label="Cantidad" value={`${quote.quantity} hoja(s)`} />
            </div>

            <div className="pt-6 border-t border-dashed flex justify-between items-end">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Costo aproximado</p>
                <p className="text-5xl font-black text-blue-600">${calculateTotal.toFixed(2)}</p>
              </div>
              <div className="text-right pb-1">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold">MXN</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            * El costo puede variar si el archivo requiere ajustes o tiene contenido mixto.
          </p>

          <button 
            onClick={handleNext}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg active:scale-95"
          >
            Continuar
            <ArrowRight size={20} />
          </button>
        </div>
      </Layout>
    );
  }

  // Screen 6: Final
  return (
    <Layout progress={100}>
      <div className="text-center space-y-8 py-4 fade-in">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 size={48} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 px-4">¡Todo listo!</h2>
          <p className="text-gray-600 text-lg px-6 leading-relaxed">
            Envía tus documentos por WhatsApp para confirmar e imprimir.
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl mx-4 text-left border border-gray-100">
          <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-tight">Presupuesto estimado:</p>
          <p className="text-3xl font-black text-gray-800">${calculateTotal.toFixed(2)} MXN</p>
        </div>

        <div className="flex flex-col gap-4 px-4">
          <a 
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 text-xl active:scale-95"
          >
            <MessageCircle size={24} />
            WhatsApp
          </a>

          <button 
            onClick={reset}
            className="w-full py-4 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-all"
          >
            Nueva cotización
          </button>
        </div>
      </div>
    </Layout>
  );
};

// UI Components
const Layout: React.FC<{
  children: React.ReactNode; 
  onBack?: () => void; 
  progress?: number;
}> = ({ children, onBack, progress }) => (
  <div className="min-h-screen max-w-md mx-auto bg-slate-50 flex flex-col shadow-2xl overflow-hidden relative">
    {/* Header */}
    <header className="bg-white px-6 py-6 border-b flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex flex-col">
          <span className="text-xs font-black text-blue-600 tracking-tighter uppercase">Champotón</span>
          <h1 className="text-sm font-bold text-gray-800">Papelería de la 18</h1>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md">
        18
      </div>
    </header>

    {/* Progress Bar */}
    {progress !== undefined && (
      <div className="h-1.5 w-full bg-gray-100 overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    )}

    {/* Content */}
    <main className="flex-1 p-6 flex flex-col justify-center max-h-screen overflow-y-auto">
      {children}
    </main>

    {/* Footer */}
    <footer className="py-6 px-6 text-center">
      <p className="text-gray-400 text-xs font-medium">
        © {new Date().getFullYear()} Papelería & Electrónica de la 18
      </p>
    </footer>
  </div>
);

const OptionButton: React.FC<{
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ selected, onClick, icon, title, subtitle }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-6 rounded-3xl border-2 transition-all text-left group active:scale-[0.98] ${
      selected 
      ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600 ring-offset-2' 
      : 'border-white bg-white shadow-sm hover:border-blue-200'
    }`}
  >
    <div className={`p-4 rounded-2xl mr-4 transition-colors ${selected ? 'bg-white' : 'bg-gray-50'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h3 className={`font-bold text-lg ${selected ? 'text-blue-900' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm ${selected ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{subtitle}</p>
    </div>
    <ChevronRight className={selected ? 'text-blue-600' : 'text-gray-300'} />
  </button>
);

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-400 font-medium text-sm">{label}</span>
    <span className="text-gray-800 font-bold text-right ml-4">{value}</span>
  </div>
);

export default App;

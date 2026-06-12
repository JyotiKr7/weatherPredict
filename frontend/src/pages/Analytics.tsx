import { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Download, CheckCircle2, Loader2, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const data = [
  { month: 'Jan', rain_2025: 45, rain_2026: 55 },
  { month: 'Feb', rain_2025: 30, rain_2026: 40 },
  { month: 'Mar', rain_2025: 65, rain_2026: 50 },
  { month: 'Apr', rain_2025: 80, rain_2026: 85 },
  { month: 'May', rain_2025: 120, rain_2026: 100 },
  { month: 'Jun', rain_2025: 150, rain_2026: 170 },
  { month: 'Jul', rain_2025: 200, rain_2026: 190 },
];

const Analytics = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeMachineYear, setTimeMachineYear] = useState(2026);

  const timeMachineData = useMemo(() => {
    // Simulate global warming: 1980 baseline, increasing steadily
    const baseTemp = 28.0;
    const warmingFactor = ((timeMachineYear - 1980) / 10) * 0.45; // ~0.45C per decade
    
    return [
      { month: 'Jan', temp: Number((baseTemp - 6 + warmingFactor).toFixed(1)) },
      { month: 'Apr', temp: Number((baseTemp + 4 + warmingFactor).toFixed(1)) },
      { month: 'Jul', temp: Number((baseTemp + 8 + warmingFactor).toFixed(1)) },
      { month: 'Oct', temp: Number((baseTemp + 2 + warmingFactor).toFixed(1)) },
    ];
  }, [timeMachineYear]);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    
    try {
      // Small delay to ensure rendering is complete
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#0f172a' // Match the dark background
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate aspect ratio to fit A4 page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ClimateSense_Analytics_Report.pdf');
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">Historical Climate Analytics</h2>
          <p className="text-gray-700 mt-1 font-medium">Deep dive into long-term climate patterns and precipitation trends.</p>
        </div>
        
        <button 
          onClick={downloadPDF}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
            isSuccess 
              ? 'bg-green-600 text-white'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {isGenerating ? (
            <><Loader2 size={18} className="animate-spin" /> Generating PDF...</>
          ) : isSuccess ? (
            <><CheckCircle2 size={18} /> Report Saved!</>
          ) : (
            <><Download size={18} /> Download PDF Report</>
          )}
        </button>
      </div>

      {/* Wrapping the content we want to export in a ref */}
      <div ref={reportRef} className="space-y-6 bg-background -mx-4 p-4 lg:mx-0 lg:p-0">
        
        {/* Climate Time Machine */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 text-purple-600 rounded-xl">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Climate Time Machine</h3>
                <p className="text-sm text-muted-foreground">Simulated average temperatures for India</p>
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <span className="text-4xl font-black text-gray-900">{timeMachineYear}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <input 
              type="range" 
              min="1980" 
              max="2026" 
              value={timeMachineYear} 
              onChange={(e) => setTimeMachineYear(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-bold">
              <span>1980</span>
              <span>1990</span>
              <span>2000</span>
              <span>2010</span>
              <span>2020</span>
              <span>2026</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeMachineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#6b7280" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="temp" name="Avg Temp (°C)" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <h3 className="text-xl font-bold mb-6">Precipitation Comparison (YoY)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="month" stroke="#888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888" tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="rain_2025" name="2025 Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rain_2026" name="2026 Rainfall (mm)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">Climate Pattern Detection</h3>
            <p className="text-muted-foreground mb-4">AI analysis of the last 5 years indicates a noticeable shift in seasonal transitions.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">Spring Onset Anomaly</span>
                  <span className="text-red-400 font-bold">+12 days</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[70%]" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">Monsoon Intensity</span>
                  <span className="text-blue-400 font-bold">+15%</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Executive Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Based on the 2026 precipitation data relative to the 2025 baseline, the region is experiencing a 15% increase in monsoon intensity. This necessitates immediate infrastructural reviews for flood management systems in vulnerable coastal sectors.
            </p>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;

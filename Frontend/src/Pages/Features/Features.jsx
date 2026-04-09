import React from "react";
import { BrainCircuit, Search, Fingerprint, Layers, ShieldCheck, Zap } from "lucide-react";

const FeatureCard = ({ title, desc, icon: Icon, spanCols, colorClass }) => (
  <div className={`relative overflow-hidden group rounded-[2rem] bg-white border border-slate-100 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${spanCols} flex flex-col justify-between`}>
    
    {/* Background Glow on hover */}
    <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl ${colorClass.bg}`}></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${colorClass.iconWrapper} transition-transform duration-300 group-hover:scale-110`}>
         <Icon className={`w-7 h-7 ${colorClass.icon}`} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-600 text-base leading-relaxed font-medium">{desc}</p>
    </div>
    
    {/* Abstract base decoration for larger flex items */}
    {spanCols.includes('lg:col-span-2') && (
      <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none transform translate-x-1/4 translate-y-1/4">
         <Icon className={`w-[200px] h-[200px] ${colorClass.icon}`} />
      </div>
    )}
  </div>
);

const Features = () => {
  return (
    <div className="w-full py-24 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-bold uppercase tracking-wider border border-purple-100 shadow-sm">
            <Zap className="w-4 h-4 text-purple-600 fill-purple-600/20" /> Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tools built for the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">modern creator</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Everything you need to seamlessly network, interview, and ship products together.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto lg:auto-rows-[300px]">
          
          <FeatureCard 
            title="AI-Powered Interviews"
            desc="Our smart engine asks dynamic questions tailored to the project requirements, removing hiring biases and saving hours of manual screening."
            icon={BrainCircuit}
            spanCols="lg:col-span-2"
            colorClass={{
              bg: 'bg-indigo-500', 
              iconWrapper: 'bg-indigo-50 border-indigo-100', 
              icon: 'text-indigo-600'
            }}
          />

          <FeatureCard 
            title="Verified Authenticity"
            desc="Say goodbye to fake profiles. Our robust verification pipeline ensures you're teaming up with real, vetted professionals."
            icon={ShieldCheck}
            spanCols="lg:col-span-1"
            colorClass={{
              bg: 'bg-emerald-500', 
              iconWrapper: 'bg-emerald-50 border-emerald-100', 
              icon: 'text-emerald-600'
            }}
          />

          <FeatureCard 
            title="Intelligent Discovery"
            desc="Stop endless browsing. Our algorithm maps your skills to the perfect open roles across thousands of active projects."
            icon={Search}
            spanCols="lg:col-span-1"
            colorClass={{
              bg: 'bg-orange-500', 
              iconWrapper: 'bg-orange-50 border-orange-100', 
              icon: 'text-orange-500'
            }}
          />

          <FeatureCard 
            title="Agile Team Spaces"
            desc="Once matched, hop straight into built-in collaboration boards, file sharing, and chat channels—no external tools required."
            icon={Layers}
            spanCols="lg:col-span-2"
            colorClass={{
              bg: 'bg-blue-500', 
              iconWrapper: 'bg-blue-50 border-blue-100', 
              icon: 'text-blue-600'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
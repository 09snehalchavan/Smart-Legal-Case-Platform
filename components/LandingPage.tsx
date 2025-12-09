
import React, { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// Standard Typewriter for Hero (starts immediately/after delay)
const Typewriter = ({ text, speed = 50, startDelay = 500, className = "" }: { text: string, speed?: number, startDelay?: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);

  return (
    <span className={`${className} inline-block`}>
      {displayedText}
      <span className="ml-1 animate-pulse font-light text-blue-500">|</span>
    </span>
  );
};

// Scroll-triggered Typewriter for sections down the page
const ScrollTypewriter = ({ text, speed = 50, className = "" }: { text: string, speed?: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger only once
        }
      },
      { threshold: 0.3 } // Start when 30% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, displayedText, text, speed]);

  return (
    <span ref={containerRef} className={`${className} inline-block`}>
      {displayedText}
      <span className={`ml-1 animate-pulse font-light text-blue-500 ${displayedText.length === text.length ? 'opacity-0' : 'opacity-100'}`}>|</span>
    </span>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full font-sans text-slate-800 overflow-x-hidden scroll-smooth">
      {/* HERO SECTION */}
      <section id="hero" className="relative h-screen w-full flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?q=80&w=2069&auto=format&fit=crop" 
                alt="Legal Scales on Desk" 
                className="w-full h-full object-cover object-center"
            />
            {/* Dark Overlay for Effective High-Contrast Look - Darkened for better text clarity */}
            <div className="absolute inset-0 bg-black/80 bg-gradient-to-r from-black/95 via-black/70 to-black/40"></div>
        </div>

        {/* Navigation Bar */}
        <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-24 py-8 text-white">
            <div className="flex flex-col">
                <h2 className="font-bold tracking-[0.3em] text-xs uppercase leading-relaxed border-b-2 border-blue-500 pb-1 inline-block">
                    Soo And Tran Justice
                </h2>
            </div>
            <ul className="hidden md:flex space-x-8 text-sm font-medium tracking-widest uppercase text-gray-300">
                <li className="cursor-pointer hover:text-white transition-colors hover:border-b border-blue-500 pb-1" onClick={() => scrollTo('hero')}>Home</li>
                <li className="cursor-pointer hover:text-white transition-colors hover:border-b border-blue-500 pb-1" onClick={() => scrollTo('about')}>About</li>
                <li className="cursor-pointer hover:text-white transition-colors hover:border-b border-blue-500 pb-1" onClick={() => scrollTo('focus')}>Expertise</li>
                <li className="cursor-pointer hover:text-white transition-colors hover:border-b border-blue-500 pb-1" onClick={() => scrollTo('services')}>Services</li>
                <li className="cursor-pointer hover:text-white transition-colors hover:border-b border-blue-500 pb-1" onClick={() => scrollTo('testimonials')}>Stories</li>
            </ul>
            <button 
                onClick={onGetStarted}
                className="hidden md:block border border-white/30 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
                Portal Login
            </button>
        </nav>

        <div className="relative z-10 px-8 md:px-24 w-full max-w-7xl mx-auto mt-16">
            <div className="max-w-6xl">
                {/* BIGGER TEXT & CLEARER ANIMATION */}
                <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 min-h-[180px] md:min-h-[240px] drop-shadow-2xl">
                    <Typewriter text="Solving your problems head-on" speed={55} />
                </h1>
                <p className="text-gray-200 text-xl md:text-2xl font-light mb-12 leading-relaxed max-w-xl animate-[fadeIn_1.5s_ease-in_1.5s_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
                    We provide you with direct and expert legal care so that you can resolve issues early and amicably.
                </p>
                <button 
                    onClick={() => scrollTo('services')}
                    className="bg-blue-600 text-white text-sm font-bold py-5 px-12 tracking-widest hover:bg-blue-700 hover:scale-105 transition-all uppercase shadow-2xl rounded-sm animate-[fadeIn_1.5s_ease-in_2s_forwards] opacity-0"
                    style={{ animationFillMode: 'forwards' }}
                >
                    See Services
                </button>
            </div>
        </div>
      </section>

      {/* ABOUT / DIVORCE SECTION */}
      <section id="about" className="py-32 px-8 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
                <h2 className="font-playfair text-5xl md:text-7xl text-slate-900 mb-8 leading-tight">
                    We know divorce is <span className="italic text-slate-500">tough</span>.
                </h2>
                <p className="text-slate-600 text-xl leading-relaxed mb-8 font-light">
                    We work closely with our clients throughout every stage of what is usually a long and tough ordeal so that they can accomplish their goals and desires.
                </p>
                <p className="text-slate-600 text-xl leading-relaxed mb-12 font-light">
                    With our combined experience of handling complex trials and litigations for over 30 years, you can trust us to be forthright and diligent in meeting your needs.
                </p>
                <button 
                    onClick={() => scrollTo('contact')}
                    className="border-2 border-[#0f3057] text-[#0f3057] text-xs font-bold py-4 px-10 tracking-widest hover:bg-[#0f3057] hover:text-white transition-all uppercase"
                >
                    Get In Touch
                </button>
            </div>
            <div className="relative h-[700px] shadow-2xl overflow-hidden rounded-lg group">
                <img 
                    src="https://images.unsplash.com/photo-1589216532372-1c2a367900d9?q=80&w=2070&auto=format&fit=crop" 
                    alt="Lady Justice" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
        </div>
      </section>

      {/* EXPERTISE / FOCUS SECTION - CENTERED & BIG */}
      <section id="focus" className="py-32 px-8 md:px-24 bg-[#111827]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            {/* Title Centered, Big, with Typewriter */}
            <div className="text-center mb-24 max-w-4xl">
                <span className="italic block text-2xl md:text-3xl text-blue-400 mb-6 font-light tracking-wide uppercase">Our Expertise</span>
                <h2 className="font-playfair text-6xl md:text-8xl text-white leading-tight min-h-[160px]">
                    <ScrollTypewriter text="What we focus on" speed={80} />
                </h2>
            </div>
            
            {/* Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                {/* Card 1 - Dark Blue */}
                <div className="bg-[#0f3057] p-10 text-white min-h-[400px] flex flex-col justify-between shadow-2xl hover:-translate-y-3 transition-transform duration-500 rounded-sm group border-t-4 border-blue-400">
                    <h3 className="font-playfair text-3xl pl-2 group-hover:pl-4 transition-all">Child Custody</h3>
                    <p className="text-base leading-relaxed text-gray-300">
                        Ensuring the well-being of your children through fair and compassionate custody arrangements. We advocate relentlessly for your parental rights.
                    </p>
                </div>
                {/* Card 2 - Light Gray */}
                <div className="bg-slate-200 p-10 text-slate-900 min-h-[400px] flex flex-col justify-between shadow-2xl hover:-translate-y-3 transition-transform duration-500 rounded-sm group border-t-4 border-slate-400">
                    <h3 className="font-playfair text-3xl pl-2 group-hover:pl-4 transition-all">Divorce</h3>
                    <p className="text-base leading-relaxed text-slate-700">
                        Navigating the complexities of separation with dignity. We handle asset division, spousal support, and mediation with precision.
                    </p>
                </div>
                {/* Card 3 - White */}
                <div className="bg-white p-10 text-slate-900 min-h-[400px] flex flex-col justify-between shadow-2xl hover:-translate-y-3 transition-transform duration-500 rounded-sm group border-t-4 border-slate-900">
                    <h3 className="font-playfair text-3xl pl-2 group-hover:pl-4 transition-all">Complex Litigation</h3>
                    <p className="text-base leading-relaxed text-slate-600">
                        Robust representation for high-stakes disputes. Our trial experience ensures your interests are protected in the courtroom.
                    </p>
                </div>
                {/* Card 4 - Image */}
                <div className="min-h-[400px] shadow-2xl overflow-hidden rounded-sm relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop"
                        alt="Gavel on Book"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <span className="text-white font-playfair text-xl tracking-wider">Unwavering Justice</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-32 px-8 md:px-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16 h-[500px] overflow-hidden shadow-2xl rounded-lg relative group">
                <img 
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop" 
                    alt="Signing Contract" 
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                    <h2 className="font-playfair text-5xl md:text-7xl text-slate-900 mb-6">
                        Our Main <br/><span className="italic text-[#0f3057]">Services</span>
                    </h2>
                    <div className="h-1 w-32 bg-[#0f3057]"></div>
                </div>
                <div>
                    <p className="text-slate-600 mb-10 text-xl font-light leading-relaxed">
                        We offer a comprehensive suite of legal services tailored to individuals and businesses. Our goal is to provide clarity and resolution in the most efficient manner possible.
                    </p>
                    <ul className="space-y-6 text-lg">
                        {[
                            "Family Law & Mediation",
                            "Corporate & Business Litigation",
                            "Estate Planning & Probate",
                            "Real Estate Transactions",
                            "Intellectual Property Protection"
                        ].map((service, idx) => (
                            <li key={idx} className="flex items-center text-slate-800 group cursor-default">
                                <span className="w-2 h-2 bg-[#0f3057] rounded-full mr-6 group-hover:scale-150 transition-transform duration-300"></span>
                                <span className="border-b border-transparent group-hover:border-slate-300 transition-colors pb-1">{service}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-32 px-8 md:px-24 bg-slate-100">
        <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="font-playfair text-5xl md:text-6xl text-slate-900 mb-6">
                Testimonials
            </h2>
            <p className="text-slate-600 text-xl">An honest look into how we work</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
                { name: 'Ingrid Correa', text: 'The team at Soo and Tran Justice was incredibly supportive during my custody battle. They explained everything clearly and fought hard for my rights.' },
                { name: 'Wendy Salinas', text: 'I was overwhelmed by my business litigation case, but their expertise gave me confidence. We achieved a favorable outcome thanks to their strategic approach.' },
                { name: 'Gabriel Shelby', text: 'Professional, responsive, and compassionate. They made a difficult divorce process much smoother than I anticipated. Highly recommended.' }
            ].map((t, i) => (
                <div key={i} className="bg-white p-12 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-sm border border-slate-200">
                    <div className="text-[#0f3057] text-6xl font-serif mb-8 opacity-20">”</div>
                    <p className="text-slate-600 mb-10 leading-relaxed text-base italic">
                        {t.text}
                    </p>
                    <div className="w-16 h-px bg-slate-300 mb-6"></div>
                    <p className="font-playfair text-xl text-slate-900 font-bold">- {t.name}</p>
                </div>
            ))}
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer id="contact" className="bg-[#0a0a0a] text-white py-24 px-8 md:px-24 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-1">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 text-white border-l-2 border-blue-600 pl-4">Soo And Tran<br/>Justice</h3>
            </div>
            <div>
                <h4 className="font-playfair text-3xl mb-8 text-gray-200">Contact</h4>
                <p className="text-gray-400 mb-2 text-lg">123 Legal Way, Suite 400</p>
                <p className="text-gray-400 mb-8 text-lg">Lawsville, LS 54321</p>
                <p className="text-gray-400 mb-2 hover:text-blue-400 transition-colors cursor-pointer text-lg">(555) 555-5555</p>
                <p className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer text-lg">contact@sooandtran.com</p>
            </div>
            <div>
                <h4 className="font-playfair text-3xl mb-8 text-gray-200">Hours</h4>
                <div className="space-y-4 text-gray-400 text-lg">
                    <p><span className="block text-white font-medium text-sm uppercase tracking-wider mb-1">Monday - Friday</span> 9:00 am - 6:00 pm</p>
                    <p><span className="block text-white font-medium text-sm uppercase tracking-wider mb-1">Saturday</span> 9:00 am - 12:00 pm</p>
                    <p className="pt-2 text-red-400">Closed on Sundays</p>
                </div>
            </div>
            <div>
                <h4 className="font-playfair text-3xl mb-8 text-gray-200">Social</h4>
                <div className="flex space-x-6">
                    {/* Social Icons */}
                    <div className="w-12 h-12 bg-white/10 hover:bg-white rounded-full text-white hover:text-blue-600 flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300">f</div>
                    <div className="w-12 h-12 bg-white/10 hover:bg-white rounded-full text-white hover:text-blue-400 flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300">t</div>
                    <div className="w-12 h-12 bg-white/10 hover:bg-white rounded-full text-white hover:text-pink-600 flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300">i</div>
                </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 Soo And Tran Justice. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Privacy Policy &bull; Terms of Service</p>
        </div>
      </footer>
      
      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

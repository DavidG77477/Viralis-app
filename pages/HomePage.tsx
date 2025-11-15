import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import VideoGenerator from '../components/VideoGenerator';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import Hero from '../components/Hero';
import Demo from '../components/Demo';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import TrustSection from '../components/TrustSection';
import PromptExamples from '../components/PromptExamples';
import SuccessStories from '../components/SuccessStories';
import FAQ from '../components/FAQ';
import GrowthHighlights from '../components/GrowthHighlights';
import type { Language } from '../App';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ContactSection: React.FC<{ language: Language }> = ({ language }) => {
  const t = {
    fr: {
      contactTitle: "Contactez-nous",
      contactSubtitle: "Une question ? Une suggestion ? N'hésitez pas à nous contacter.",
      contactFormName: "Votre nom",
      contactFormEmail: "Votre email",
      contactFormMessage: "Votre message",
      contactFormSubmit: "Envoyer",
      contactSubmitting: "Envoi en cours...",
      contactSuccess: "Message envoyé avec succès !",
    },
    en: {
      contactTitle: "Contact Us",
      contactSubtitle: "Have a question? A suggestion? Don't hesitate to contact us.",
      contactFormName: "Your name",
      contactFormEmail: "Your email",
      contactFormMessage: "Your message",
      contactFormSubmit: "Send",
      contactSubmitting: "Sending...",
      contactSuccess: "Message sent successfully!",
    },
    es: {
      contactTitle: "Contáctanos",
      contactSubtitle: "¿Tienes una pregunta? ¿Una sugerencia? No dudes en contactarnos.",
      contactFormName: "Tu nombre",
      contactFormEmail: "Tu correo electrónico",
      contactFormMessage: "Tu mensaje",
      contactFormSubmit: "Enviar",
      contactSubmitting: "Enviando...",
      contactSuccess: "¡Mensaje enviado con éxito!",
    },
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitMessage(t[language].contactSuccess);
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1000);
  };

  const inputStyle = "w-full bg-white/5 border border-white/10 text-white px-[18px] py-3.5 rounded-[10px] text-[15px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#52FFCB] transition-all duration-200 disabled:opacity-60";

  return (
    <section id="contact" className="py-20 px-4 md:px-8">
      <div className="container mx-auto flex flex-col items-center text-center gap-8 animate-fade-in-up">
        <h2 
          className="text-[42px] font-bold tracking-tight"
          style={{ background: 'linear-gradient(90deg, #52FFCB, #5CB8FF)', WebkitBackgroundClip: 'text', color: 'transparent' }}
        >
          {t[language].contactTitle}
        </h2>
        <p className="text-lg text-slate-300 max-w-xl">
          {t[language].contactSubtitle}
        </p>
        
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-xl flex flex-col gap-[18px] mt-4"
        >
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t[language].contactFormName}
            required
            disabled={isSubmitting}
            className={inputStyle}
          />
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t[language].contactFormEmail}
            required
            disabled={isSubmitting}
            className={inputStyle}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t[language].contactFormMessage}
            required
            rows={5}
            disabled={isSubmitting}
            className={inputStyle}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#52FFCB] to-[#5CB8FF] border-none p-4 rounded-xl cursor-pointer text-[#0D0F12] font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait"
          >
            {isSubmitting ? t[language].contactSubmitting : t[language].contactFormSubmit}
          </button>
        </form>
        {submitMessage && <p className="text-brand-green mt-4 animate-fade-in">{submitMessage}</p>}
      </div>
    </section>
  );
};

interface HomePageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const HomePage: React.FC<HomePageProps> = ({ language, onLanguageChange }) => {
  const [userTokens, setUserTokens] = useState(100);
  const [pricingAlert, setPricingAlert] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reason') === 'low-tokens') {
      setPricingAlert("Vous n'avez plus assez de jetons.");
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.hash = 'pricing';
        }
      }, 100);
      const cleanUrl = `${location.pathname}#pricing`;
      window.history.replaceState({}, '', cleanUrl);
    } else {
      setPricingAlert(null);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden">
      <Header language={language} onLanguageChange={onLanguageChange} />
      <main>
        <Hero language={language} />
        <section id="generator" className="pb-24 px-4 md:px-8">
          <VideoGenerator
            userTokens={userTokens}
            setUserTokens={setUserTokens}
            language={language}
            supabaseUserId={user?.id ?? null}
          />
        </section>
        <Features language={language} />
        <GrowthHighlights language={language} />
        <TrustSection language={language} />
        <Testimonials language={language} />
        <Demo language={language} />
        <PromptExamples language={language} />
        <SuccessStories language={language} />
        {pricingAlert && (
          <div className="px-4 md:px-8">
            <div className="container mx-auto mb-6">
              <div className="rounded-2xl border border-brand-green/40 bg-slate-900/70 backdrop-blur-md px-6 py-5 shadow-[0_0_35px_rgba(82,255,203,0.15)] animate-fade-in">
                <p className="text-brand-green text-lg font-semibold">
                  {pricingAlert}
                </p>
              </div>
            </div>
          </div>
        )}
        <Pricing language={language} />
        <FAQ language={language} />
      </main>
      <ContactSection language={language} />
      <Footer language={language} />
    </div>
  );
};

export default HomePage;

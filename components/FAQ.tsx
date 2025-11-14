import React, { useState } from 'react';
import type { Language } from '../App';
import { translations } from '../translations';

interface FaqItemData {
  question: string;
  answer: string;
}

// FIX: Explicitly type FaqItem as a React.FC to correctly handle the `key` prop provided in the parent component's map function.
const FaqItem: React.FC<{ item: FaqItemData, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-800">
      <h2>
        <button
          onClick={onClick}
          className="flex justify-between items-center w-full py-5 text-left text-lg font-semibold text-slate-200 hover:text-white"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${item.question}`}
        >
          <span>{item.question}</span>
          <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h2>
      <div
        id={`faq-answer-${item.question}`}
        className="grid overflow-hidden transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
            <p className="pb-5 text-slate-400">
            {item.answer}
            </p>
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const faqData = t.faqData;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl animate-fade-in-up">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4"
              style={{ background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              {t.faqTitle}
          </h2>
          <p className="text-lg text-slate-400">
            {t.faqSubtitle}
          </p>
        </div>
        <div className="mt-12" role="list">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
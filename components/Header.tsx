import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import { translations } from '../translations';
import logoImage from '../attached_assets/LOGO.png';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    language: Language;
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const { user, isLoading, signOut } = useAuth();
    
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languageOptions: { code: Language; name: string }[] = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];
    
      const navLinks = [
        { name: translations[language].nav_generator, href: "#generator" },
        { name: translations[language].nav_pricing, href: "/pricing" },
        { name: translations[language].nav_faq, href: "#faq" },
      ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="relative top-4 mx-4 mb-4 z-50 animate-fade-in rounded-[28px] border border-[#00FF9D] shadow-[0_0_20px_rgba(0,255,153,0.35),0_0_40px_rgba(0,255,153,0.25)] overflow-visible">
        <div className="relative rounded-[28px] bg-slate-900/85 backdrop-blur-lg w-full h-full">
            <div className="pointer-events-none absolute inset-0 rounded-[28px]">
                <div
                    className="absolute -top-[40%] -left-[35%] w-[120%] h-[180%] bg-gradient-to-br from-emerald-400/35 via-transparent to-sky-500/30 blur-[140px]"
                />
                <div
                    className="absolute -bottom-[35%] -right-[30%] w-[120%] h-[180%] bg-gradient-to-tl from-sky-500/30 via-transparent to-emerald-400/35 blur-[140px]"
                />
            </div>
            <div className="relative z-10 container mx-auto px-4 md:px-8 flex items-center justify-between h-24">
                <Link to="/" className="flex items-center">
                    <img src={logoImage} alt="Viralis Studio" className="h-28 w-auto md:h-32 lg:h-36 transition-transform duration-200 hover:scale-[1.02]" />
                </Link>
                <nav className="hidden md:block">
                    <ul className="flex items-center space-x-8 text-slate-300">
                        {navLinks.map(link => (
                            <li key={link.name}>
                                <a href={link.href} className="hover:text-white transition-colors">{link.name}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center space-x-3">
                    {!user && !isLoading && (
                      <>
                        <Link
                          to="/auth"
                          className="rounded-lg border border-brand-green/40 px-3 py-1.5 text-sm font-medium text-brand-green transition hover:bg-brand-green/10"
                        >
                          {translations[language].login}
                        </Link>
                        <Link
                          to="/register"
                          className="rounded-lg bg-brand-green px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-brand-green/80"
                        >
                          {language === 'en' ? 'Sign up' : language === 'es' ? 'Crear cuenta' : "S'inscrire"}
                        </Link>
                      </>
                    )}
                    {user && (
                      <>
                        <Link
                          to="/dashboard"
                          className="hidden sm:inline-flex rounded-lg border border-brand-green/40 px-3 py-1.5 text-sm font-medium text-brand-green transition hover:bg-brand-green/10"
                        >
                          Tableau de bord
                        </Link>
                        <button
                          onClick={async () => {
                            await signOut();
                          }}
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
                        >
                          Déconnexion
                        </button>
                      </>
                    )}
                    {/* Language Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-center border border-slate-700 rounded-md px-3 py-1.5 text-sm font-semibold w-24 text-slate-300 hover:border-slate-500 transition-colors"
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                        >
                            <span>{language.toUpperCase()}</span>
                            <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <ul
                                className="absolute top-full mt-2 w-32 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-lg overflow-hidden animate-fade-in"
                                style={{animationDuration: '150ms'}}
                                role="menu"
                            >
                                {languageOptions.map(option => (
                                    <li key={option.code}>
                                        <button
                                            onClick={() => {
                                                setLanguage(option.code);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                                            role="menuitem"
                                        >
                                            {option.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;
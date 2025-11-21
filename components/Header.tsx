import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import { translations } from '../translations';
import logoImage from '../attached_assets/LOGO.png';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const { user, isLoading, signOut } = useAuth();
  const t = translations[language];
    
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const languageOptions: { code: Language; name: string }[] = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];
    
      const navLinks = [
        { name: t.nav_generator, href: "#generator" },
        { name: t.nav_pricing, href: "/pricing" },
        { name: t.nav_faq, href: "#faq" },
      ];

  const authCtaByLanguage: Record<Language, string> = {
    fr: "Créer un compte",
    en: "Sign up",
    es: "Crear cuenta",
  };

  const dashboardLabel: Record<Language, string> = {
    fr: "Tableau de bord",
    en: "Dashboard",
    es: "Panel",
  };

  const logoutLabel: Record<Language, string> = {
    fr: "Déconnexion",
    en: "Log out",
    es: "Cerrar sesión",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isClickInsideDropdown = dropdownRef.current?.contains(target);
      const isClickOnButton = dropdownButtonRef.current?.contains(target);
      
      if (!isClickInsideDropdown && !isClickOnButton) {
        setIsDropdownOpen(false);
      }
    };
    
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="relative top-4 mx-4 mb-4 z-50 animate-fade-in">
        <div className="relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Animated gradient background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d]/5 via-transparent to-[#00b3ff]/5" />
                <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-[#00ff9d]/10 via-transparent to-transparent blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
                <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-[#00b3ff]/10 via-transparent to-transparent blur-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d]/20 to-[#00b3ff]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img 
                                src={logoImage} 
                                alt="Viralis Studio" 
                                className="relative h-16 w-auto md:h-20 lg:h-24 transition-all duration-300 group-hover:scale-105 group-hover:brightness-110" 
                            />
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center">
                        <ul className="flex items-center gap-1">
                            {navLinks.map(link => (
                                <li key={link.name}>
                                    <a 
                                        href={link.href} 
                                        className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 group"
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00ff9d]/10 to-[#00b3ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {!user && !isLoading && (
                          <>
                            <Link
                              to="/auth"
                              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
                            >
                              {t.login}
                            </Link>
                            <Link
                              to="/register"
                              className="relative px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-200 rounded-lg overflow-hidden group"
                            >
                              <span className="absolute inset-0 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] opacity-100 group-hover:opacity-90 transition-opacity" />
                              <span className="relative z-10 flex items-center gap-1.5">
                                {authCtaByLanguage[language]}
                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </span>
                            </Link>
                          </>
                        )}
                        {user && (
                          <>
                            <Link
                              to="/dashboard"
                              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#00ff9d] hover:text-white transition-all duration-200 rounded-lg border border-[#00ff9d]/30 hover:border-[#00ff9d]/50 hover:bg-[#00ff9d]/10 backdrop-blur-sm"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              {dashboardLabel[language]}
                            </Link>
                            <button
                              onClick={async () => {
                                await signOut();
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200 rounded-lg border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span className="hidden sm:inline">{logoutLabel[language]}</span>
                            </button>
                          </>
                        )}
                        
                        {/* Language Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                ref={dropdownButtonRef}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center justify-center gap-1.5 border border-slate-700/50 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200 backdrop-blur-sm min-w-[60px]"
                                aria-haspopup="true"
                                aria-expanded={isDropdownOpen}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                <span>{language.toUpperCase()}</span>
                                <svg className={`w-3 h-3 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-36 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden animate-fade-in">
                                    <ul role="menu" className="py-1">
                                        {languageOptions.map(option => (
                                            <li key={option.code}>
                                                <button
                                                    onClick={() => {
                                                        onLanguageChange(option.code);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 ${
                                                        language === option.code
                                                            ? 'text-white bg-gradient-to-r from-[#00ff9d]/20 to-[#00b3ff]/20 font-medium'
                                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                                    }`}
                                                    role="menuitem"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {language === option.code && (
                                                            <svg className="w-3.5 h-3.5 text-[#00ff9d]" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                        {option.name}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;
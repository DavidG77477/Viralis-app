import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TikTokIcon, YouTubeIcon, InstagramIcon, XLogoIcon, ViralisFullLogo } from './icons/Icons';
import type { Language } from '../App';
import { translations } from '../translations';

const socialLinks = [
    { icon: TikTokIcon, href: "#" },
    { icon: YouTubeIcon, href: "#" },
    { icon: InstagramIcon, href: "#" },
    { icon: XLogoIcon, href: "#" }
];

const Footer: React.FC<{ language: Language }> = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];
  const footerLinks = t.footerLinks;
  
  return (
    <footer className="bg-slate-950/50 border-t border-slate-800 py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-3">
                <button onClick={() => navigate('/')} className="flex items-center mb-4 cursor-pointer">
                  <ViralisFullLogo className="h-20 w-auto md:h-24" />
                </button>
                <p className="text-slate-400 text-sm mt-4 max-w-xs">
                    {t.footerDescription}
                </p>
            </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {/* FIX: Cast `links` to string[] to resolve TypeScript error where it was inferred as 'unknown'. */}
                {(links as string[]).map(link => {
                  // Map footer link text to routes - check all possible variations
                  const normalizedLink = link.toLowerCase().trim();
                  const isTerms = normalizedLink.includes('terms') || normalizedLink.includes('conditions') || normalizedLink.includes('términos');
                  const isPrivacy = normalizedLink.includes('privacy') || normalizedLink.includes('confidentialité') || normalizedLink.includes('privacidad');
                  
                  let route: string | null = null;
                  if (isTerms) {
                    route = '/terms';
                  } else if (isPrivacy) {
                    route = '/privacy';
                  }
                  
                  return (
                    <li key={link}>
                      {route ? (
                        <Link
                          to={route}
                          className="text-slate-400 hover:text-brand-green transition-colors cursor-pointer"
                        >
                          {link}
                        </Link>
                      ) : (
                        <span className="text-slate-400">{link}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-slate-500 text-sm">{t.footerCopyright}</p>
            <div className="flex gap-4 text-sm">
              <Link
                to="/terms"
                className="text-slate-400 hover:text-brand-green transition-colors cursor-pointer"
              >
                {language === 'fr' ? 'Conditions d\'Utilisation' : language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
              </Link>
              <span className="text-slate-600">|</span>
              <Link
                to="/privacy"
                className="text-slate-400 hover:text-brand-green transition-colors cursor-pointer"
              >
                {language === 'fr' ? 'Politique de Confidentialité' : language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
              </Link>
            </div>
          </div>
          <div className="flex space-x-5">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.href} 
                className="text-slate-500 hover:text-brand-green transition-colors"
                onClick={(e) => {
                  if (social.href === '#') {
                    e.preventDefault();
                  }
                }}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
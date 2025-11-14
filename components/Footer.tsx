import React from 'react';
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
  const t = translations[language];
  const footerLinks = t.footerLinks;
  
  return (
    <footer className="bg-slate-950/50 border-t border-slate-800 py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-3">
                <a href="#" className="flex items-center mb-4">
                  <ViralisFullLogo className="h-20 w-auto md:h-24" />
                </a>
                <p className="text-slate-400 text-sm mt-4 max-w-xs">
                    {t.footerDescription}
                </p>
            </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {/* FIX: Cast `links` to string[] to resolve TypeScript error where it was inferred as 'unknown'. */}
                {(links as string[]).map(link => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-brand-green transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">{t.footerCopyright}</p>
          <div className="flex space-x-5">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} className="text-slate-500 hover:text-brand-green transition-colors">
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
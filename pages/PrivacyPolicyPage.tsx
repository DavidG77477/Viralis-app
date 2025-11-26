import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Language } from '../App';

const PrivacyPolicyPage: React.FC<{ language: Language; onLanguageChange: (lang: Language) => void }> = ({ language, onLanguageChange }) => {
  const content = {
    fr: {
      title: "Politique de Confidentialité",
      lastUpdated: "Dernière mise à jour : 25 novembre 2024",
      sections: [
        {
          title: "1. Introduction",
          content: `Viralis Studio ("nous", "notre", "nos") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles lorsque vous utilisez notre Service.`
        },
        {
          title: "2. Informations que Nous Collectons",
          content: `Nous collectons les informations suivantes :
• Informations de compte : nom, adresse e-mail, mot de passe (haché)
• Informations de profil : avatar, préférences linguistiques
• Informations de paiement : traitées par Stripe (nous ne stockons pas vos numéros de carte)
• Données d'utilisation : vidéos générées, prompts utilisés, préférences de style
• Données techniques : adresse IP, type de navigateur, appareil utilisé
• Cookies et technologies similaires pour améliorer votre expérience`
        },
        {
          title: "3. Comment Nous Utilisons Vos Informations",
          content: `Nous utilisons vos informations pour :
• Fournir et améliorer le Service
• Traiter vos paiements et gérer vos abonnements
• Vous envoyer des notifications importantes concernant votre compte
• Personnaliser votre expérience utilisateur
• Analyser l'utilisation du Service pour améliorer nos fonctionnalités
• Détecter et prévenir la fraude ou les abus
• Respecter nos obligations légales`
        },
        {
          title: "4. Partage d'Informations",
          content: `Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
• Prestataires de services : Stripe (paiements), Supabase (hébergement de données), Vercel (hébergement)
• Obligations légales : si requis par la loi ou une ordonnance judiciaire
• Protection de nos droits : pour protéger nos droits, propriété ou sécurité
• Avec votre consentement explicite`
        },
        {
          title: "5. Stockage et Sécurité",
          content: `Vos données sont stockées de manière sécurisée via Supabase (hébergement cloud sécurisé). Nous utilisons des mesures de sécurité techniques et organisationnelles appropriées, notamment :
• Chiffrement des données en transit et au repos
• Authentification sécurisée
• Contrôle d'accès basé sur les rôles
• Sauvegardes régulières
Cependant, aucune méthode de transmission sur Internet n'est 100% sécurisée.`
        },
        {
          title: "6. Conservation des Données",
          content: `Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir le Service et respecter nos obligations légales. Si vous supprimez votre compte, nous supprimerons vos données personnelles dans un délai raisonnable, sauf si la conservation est requise par la loi.`
        },
        {
          title: "7. Vos Droits",
          content: `Vous avez le droit de :
• Accéder à vos données personnelles
• Corriger des données inexactes
• Demander la suppression de vos données
• Vous opposer au traitement de vos données
• Demander la portabilité de vos données
• Retirer votre consentement à tout moment
Pour exercer ces droits, contactez-nous via le formulaire de contact.`
        },
        {
          title: "8. Cookies et Technologies Similaires",
          content: `Nous utilisons des cookies et technologies similaires pour :
• Maintenir votre session de connexion
• Mémoriser vos préférences (langue, etc.)
• Analyser l'utilisation du Service
Vous pouvez contrôler les cookies via les paramètres de votre navigateur.`
        },
        {
          title: "9. Vidéos Générées",
          content: `Les vidéos que vous générez via le Service sont stockées dans votre compte. Nous ne partageons pas vos vidéos avec des tiers sans votre consentement explicite. Vous pouvez supprimer vos vidéos à tout moment depuis votre tableau de bord.`
        },
        {
          title: "10. Données des Mineurs",
          content: `Notre Service n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données personnelles de mineurs. Si vous êtes parent et pensez que votre enfant nous a fourni des données, contactez-nous immédiatement.`
        },
        {
          title: "11. Transferts Internationaux",
          content: `Vos données peuvent être transférées et stockées dans des serveurs situés en dehors de votre pays de résidence. En utilisant le Service, vous consentez à ce transfert. Nous nous assurons que des mesures de protection appropriées sont en place.`
        },
        {
          title: "12. Modifications de cette Politique",
          content: `Nous pouvons modifier cette Politique de Confidentialité à tout moment. Les modifications importantes vous seront notifiées par e-mail ou via une notification dans le Service. Votre utilisation continue du Service après les modifications constitue votre acceptation de la nouvelle Politique.`
        },
        {
          title: "13. Contact",
          content: `Pour toute question concernant cette Politique de Confidentialité ou pour exercer vos droits, veuillez nous contacter via le formulaire de contact disponible sur le Service.`
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: November 25, 2024",
      sections: [
        {
          title: "1. Introduction",
          content: `Viralis Studio ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our Service.`
        },
        {
          title: "2. Information We Collect",
          content: `We collect the following information:
• Account information: name, email address, password (hashed)
• Profile information: avatar, language preferences
• Payment information: processed by Stripe (we do not store your card numbers)
• Usage data: generated videos, prompts used, style preferences
• Technical data: IP address, browser type, device used
• Cookies and similar technologies to improve your experience`
        },
        {
          title: "3. How We Use Your Information",
          content: `We use your information to:
• Provide and improve the Service
• Process your payments and manage your subscriptions
• Send you important notifications about your account
• Personalize your user experience
• Analyze Service usage to improve our features
• Detect and prevent fraud or abuse
• Comply with our legal obligations`
        },
        {
          title: "4. Information Sharing",
          content: `We never sell your personal data. We may share your information only in the following cases:
• Service providers: Stripe (payments), Supabase (data hosting), Vercel (hosting)
• Legal obligations: if required by law or court order
• Protection of our rights: to protect our rights, property, or safety
• With your explicit consent`
        },
        {
          title: "5. Storage and Security",
          content: `Your data is stored securely via Supabase (secure cloud hosting). We use appropriate technical and organizational security measures, including:
• Encryption of data in transit and at rest
• Secure authentication
• Role-based access control
• Regular backups
However, no method of transmission over the Internet is 100% secure.`
        },
        {
          title: "6. Data Retention",
          content: `We retain your personal data for as long as necessary to provide the Service and comply with our legal obligations. If you delete your account, we will delete your personal data within a reasonable time, unless retention is required by law.`
        },
        {
          title: "7. Your Rights",
          content: `You have the right to:
• Access your personal data
• Correct inaccurate data
• Request deletion of your data
• Object to processing of your data
• Request data portability
• Withdraw your consent at any time
To exercise these rights, contact us via the contact form.`
        },
        {
          title: "8. Cookies and Similar Technologies",
          content: `We use cookies and similar technologies to:
• Maintain your login session
• Remember your preferences (language, etc.)
• Analyze Service usage
You can control cookies through your browser settings.`
        },
        {
          title: "9. Generated Videos",
          content: `Videos you generate via the Service are stored in your account. We do not share your videos with third parties without your explicit consent. You can delete your videos at any time from your dashboard.`
        },
        {
          title: "10. Children's Data",
          content: `Our Service is not intended for people under 18 years of age. We do not knowingly collect personal data from minors. If you are a parent and believe your child has provided us with data, please contact us immediately.`
        },
        {
          title: "11. International Transfers",
          content: `Your data may be transferred and stored on servers located outside your country of residence. By using the Service, you consent to this transfer. We ensure that appropriate safeguards are in place.`
        },
        {
          title: "12. Changes to this Policy",
          content: `We may modify this Privacy Policy at any time. Significant changes will be notified to you by email or via a notification in the Service. Your continued use of the Service after changes constitutes your acceptance of the new Policy.`
        },
        {
          title: "13. Contact",
          content: `For any questions regarding this Privacy Policy or to exercise your rights, please contact us via the contact form available on the Service.`
        }
      ]
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: 25 de noviembre de 2024",
      sections: [
        {
          title: "1. Introducción",
          content: `Viralis Studio ("nosotros", "nuestro", "nos") se compromete a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tu información personal cuando usas nuestro Servicio.`
        },
        {
          title: "2. Información que Recopilamos",
          content: `Recopilamos la siguiente información:
• Información de cuenta: nombre, dirección de correo electrónico, contraseña (hasheada)
• Información de perfil: avatar, preferencias de idioma
• Información de pago: procesada por Stripe (no almacenamos tus números de tarjeta)
• Datos de uso: videos generados, prompts utilizados, preferencias de estilo
• Datos técnicos: dirección IP, tipo de navegador, dispositivo utilizado
• Cookies y tecnologías similares para mejorar tu experiencia`
        },
        {
          title: "3. Cómo Usamos Tu Información",
          content: `Usamos tu información para:
• Proporcionar y mejorar el Servicio
• Procesar tus pagos y gestionar tus suscripciones
• Enviarte notificaciones importantes sobre tu cuenta
• Personalizar tu experiencia de usuario
• Analizar el uso del Servicio para mejorar nuestras funciones
• Detectar y prevenir fraude o abuso
• Cumplir con nuestras obligaciones legales`
        },
        {
          title: "4. Compartir Información",
          content: `Nunca vendemos tus datos personales. Podemos compartir tu información solo en los siguientes casos:
• Proveedores de servicios: Stripe (pagos), Supabase (alojamiento de datos), Vercel (alojamiento)
• Obligaciones legales: si es requerido por ley u orden judicial
• Protección de nuestros derechos: para proteger nuestros derechos, propiedad o seguridad
• Con tu consentimiento explícito`
        },
        {
          title: "5. Almacenamiento y Seguridad",
          content: `Tus datos se almacenan de forma segura a través de Supabase (alojamiento en la nube seguro). Utilizamos medidas de seguridad técnicas y organizativas apropiadas, incluyendo:
• Cifrado de datos en tránsito y en reposo
• Autenticación segura
• Control de acceso basado en roles
• Copias de seguridad regulares
Sin embargo, ningún método de transmisión por Internet es 100% seguro.`
        },
        {
          title: "6. Conservación de Datos",
          content: `Conservamos tus datos personales durante el tiempo necesario para proporcionar el Servicio y cumplir con nuestras obligaciones legales. Si eliminas tu cuenta, eliminaremos tus datos personales en un plazo razonable, a menos que la conservación sea requerida por ley.`
        },
        {
          title: "7. Tus Derechos",
          content: `Tienes derecho a:
• Acceder a tus datos personales
• Corregir datos inexactos
• Solicitar la eliminación de tus datos
• Oponerte al procesamiento de tus datos
• Solicitar la portabilidad de tus datos
• Retirar tu consentimiento en cualquier momento
Para ejercer estos derechos, contáctanos a través del formulario de contacto.`
        },
        {
          title: "8. Cookies y Tecnologías Similares",
          content: `Utilizamos cookies y tecnologías similares para:
• Mantener tu sesión de inicio de sesión
• Recordar tus preferencias (idioma, etc.)
• Analizar el uso del Servicio
Puedes controlar las cookies a través de la configuración de tu navegador.`
        },
        {
          title: "9. Videos Generados",
          content: `Los videos que generas a través del Servicio se almacenan en tu cuenta. No compartimos tus videos con terceros sin tu consentimiento explícito. Puedes eliminar tus videos en cualquier momento desde tu panel de control.`
        },
        {
          title: "10. Datos de Menores",
          content: `Nuestro Servicio no está destinado a personas menores de 18 años. No recopilamos conscientemente datos personales de menores. Si eres padre y crees que tu hijo nos ha proporcionado datos, contáctanos inmediatamente.`
        },
        {
          title: "11. Transferencias Internacionales",
          content: `Tus datos pueden ser transferidos y almacenados en servidores ubicados fuera de tu país de residencia. Al usar el Servicio, consientes esta transferencia. Nos aseguramos de que existan salvaguardas apropiadas.`
        },
        {
          title: "12. Modificaciones de esta Política",
          content: `Podemos modificar esta Política de Privacidad en cualquier momento. Los cambios importantes te serán notificados por correo electrónico o mediante una notificación en el Servicio. Tu uso continuo del Servicio después de los cambios constituye tu aceptación de la nueva Política.`
        },
        {
          title: "13. Contacto",
          content: `Para cualquier pregunta sobre esta Política de Privacidad o para ejercer tus derechos, contáctanos a través del formulario de contacto disponible en el Servicio.`
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header language={language} onLanguageChange={onLanguageChange} />
      <main className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
        <div className="bg-slate-900/50 rounded-2xl p-8 md:p-12 border border-slate-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            {t.title}
          </h1>
          <p className="text-slate-400 mb-8">{t.lastUpdated}</p>
          
          <div className="space-y-8">
            {t.sections.map((section, index) => (
              <div key={index} className="border-b border-slate-800 pb-6 last:border-b-0">
                <h2 className="text-2xl font-semibold text-white mb-4">{section.title}</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              {language === 'fr' 
                ? 'En utilisant Viralis Studio, vous reconnaissez avoir lu, compris et accepté cette Politique de Confidentialité.'
                : language === 'es'
                ? 'Al usar Viralis Studio, reconoces haber leído, entendido y aceptado esta Política de Privacidad.'
                : 'By using Viralis Studio, you acknowledge that you have read, understood, and agreed to this Privacy Policy.'}
            </p>
          </div>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default PrivacyPolicyPage;


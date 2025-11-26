import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Language } from '../App';

const TermsOfServicePage: React.FC<{ language: Language; onLanguageChange: (lang: Language) => void }> = ({ language, onLanguageChange }) => {
  const content = {
    fr: {
      title: "Conditions d'Utilisation",
      lastUpdated: "Dernière mise à jour : 25 novembre 2024",
      sections: [
        {
          title: "1. Acceptation des Conditions",
          content: `En accédant et en utilisant Viralis Studio ("le Service"), vous acceptez d'être lié par ces Conditions d'Utilisation ("Conditions"). Si vous n'acceptez pas ces Conditions, vous ne devez pas utiliser le Service.`
        },
        {
          title: "2. Description du Service",
          content: `Viralis Studio est une plateforme de génération de vidéos par intelligence artificielle qui permet aux utilisateurs de créer des vidéos pour les réseaux sociaux, notamment TikTok, à partir de prompts textuels. Le Service utilise des technologies d'IA avancées pour générer du contenu vidéo.`
        },
        {
          title: "3. Compte Utilisateur",
          content: `Pour utiliser le Service, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion. Vous acceptez de nous notifier immédiatement de toute utilisation non autorisée de votre compte.`
        },
        {
          title: "4. Abonnements et Paiements",
          content: `Le Service propose des abonnements récurrents (Pro Mensuel à 19,99$/mois et Pro Annuel à 199,99$/an) ainsi que des packs de tokens à usage unique. Les paiements sont traités via Stripe. En vous abonnant, vous autorisez des facturations récurrentes jusqu'à annulation.`
        },
        {
          title: "5. Politique d'Annulation et de Remboursement",
          content: `Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. L'annulation prend effet à la fin de la période de facturation en cours. Vous conservez l'accès aux fonctionnalités Pro jusqu'à la fin de la période payée (1 mois pour Pro Mensuel, 1 an pour Pro Annuel). Aucun remboursement n'est accordé pour les périodes déjà facturées. Les packs de tokens sont non remboursables une fois achetés.`
        },
        {
          title: "6. Tokens et Utilisation",
          content: `Les tokens sont des crédits de génération vidéo. Chaque génération de vidéo consomme un certain nombre de tokens selon la résolution choisie. Les tokens non utilisés n'expirent pas pour les comptes Pro. Les tokens achetés via des packs sont valides indéfiniment.`
        },
        {
          title: "7. Propriété Intellectuelle",
          content: `Les vidéos générées via le Service sont la propriété de l'utilisateur qui les a créées. Cependant, vous accordez à Viralis Studio une licence mondiale, non exclusive et gratuite pour utiliser, modifier et afficher ces vidéos à des fins de promotion du Service. Le Service lui-même, y compris son code, ses designs et ses technologies d'IA, reste la propriété exclusive de Viralis Studio.`
        },
        {
          title: "8. Contenu Généré par l'IA",
          content: `Les vidéos générées par notre IA sont créées automatiquement et peuvent contenir des erreurs ou des résultats inattendus. Viralis Studio ne garantit pas la qualité, l'exactitude ou l'adéquation des vidéos générées à vos besoins spécifiques. Vous êtes responsable de vérifier et d'approuver tout contenu généré avant de le publier.`
        },
        {
          title: "9. Utilisation Acceptable",
          content: `Vous vous engagez à ne pas utiliser le Service pour créer du contenu illégal, diffamatoire, harcelant, obscène, ou violant les droits d'autrui. Vous ne devez pas utiliser le Service pour générer du contenu qui viole les conditions d'utilisation de TikTok ou d'autres plateformes.`
        },
        {
          title: "10. Disponibilité du Service",
          content: `Viralis Studio s'efforce de maintenir le Service disponible 24/7, mais ne garantit pas une disponibilité ininterrompue. Le Service peut être temporairement indisponible pour maintenance, mises à jour ou raisons techniques.`
        },
        {
          title: "11. Limitation de Responsabilité",
          content: `Dans la mesure permise par la loi, Viralis Studio ne sera pas responsable des dommages directs, indirects, accessoires ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le Service.`
        },
        {
          title: "12. Modifications des Conditions",
          content: `Viralis Studio se réserve le droit de modifier ces Conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le Service. Votre utilisation continue du Service après les modifications constitue votre acceptation des nouvelles Conditions.`
        },
        {
          title: "13. Résiliation",
          content: `Viralis Studio peut suspendre ou résilier votre compte à tout moment en cas de violation de ces Conditions. Vous pouvez résilier votre compte à tout moment en annulant votre abonnement et en supprimant votre compte depuis les paramètres.`
        },
        {
          title: "14. Loi Applicable",
          content: `Ces Conditions sont régies par les lois applicables. Tout litige sera résolu conformément à la juridiction compétente.`
        },
        {
          title: "15. Contact",
          content: `Pour toute question concernant ces Conditions, veuillez nous contacter via le formulaire de contact disponible sur le Service.`
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: November 25, 2024",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing and using Viralis Studio ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Service.`
        },
        {
          title: "2. Service Description",
          content: `Viralis Studio is an AI-powered video generation platform that enables users to create videos for social media, particularly TikTok, from text prompts. The Service uses advanced AI technologies to generate video content.`
        },
        {
          title: "3. User Account",
          content: `To use the Service, you must create an account. You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your account.`
        },
        {
          title: "4. Subscriptions and Payments",
          content: `The Service offers recurring subscriptions (Pro Monthly at $19.99/month and Pro Annual at $199.99/year) as well as one-time token packs. Payments are processed via Stripe. By subscribing, you authorize recurring billing until cancellation.`
        },
        {
          title: "5. Cancellation and Refund Policy",
          content: `You may cancel your subscription at any time from your dashboard. Cancellation takes effect at the end of the current billing period. You retain access to Pro features until the end of the paid period (1 month for Pro Monthly, 1 year for Pro Annual). No refunds are granted for already billed periods. Token packs are non-refundable once purchased.`
        },
        {
          title: "6. Tokens and Usage",
          content: `Tokens are video generation credits. Each video generation consumes a certain number of tokens based on the selected resolution. Unused tokens do not expire for Pro accounts. Tokens purchased via packs are valid indefinitely.`
        },
        {
          title: "7. Intellectual Property",
          content: `Videos generated via the Service are owned by the user who created them. However, you grant Viralis Studio a worldwide, non-exclusive, royalty-free license to use, modify, and display these videos for Service promotion purposes. The Service itself, including its code, designs, and AI technologies, remains the exclusive property of Viralis Studio.`
        },
        {
          title: "8. AI-Generated Content",
          content: `Videos generated by our AI are created automatically and may contain errors or unexpected results. Viralis Studio does not guarantee the quality, accuracy, or suitability of generated videos for your specific needs. You are responsible for reviewing and approving any generated content before publishing.`
        },
        {
          title: "9. Acceptable Use",
          content: `You agree not to use the Service to create illegal, defamatory, harassing, obscene content, or content that violates others' rights. You must not use the Service to generate content that violates TikTok's or other platforms' terms of service.`
        },
        {
          title: "10. Service Availability",
          content: `Viralis Studio strives to keep the Service available 24/7, but does not guarantee uninterrupted availability. The Service may be temporarily unavailable for maintenance, updates, or technical reasons.`
        },
        {
          title: "11. Limitation of Liability",
          content: `To the extent permitted by law, Viralis Studio will not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Service.`
        },
        {
          title: "12. Changes to Terms",
          content: `Viralis Studio reserves the right to modify these Terms at any time. Changes take effect upon publication on the Service. Your continued use of the Service after changes constitutes your acceptance of the new Terms.`
        },
        {
          title: "13. Termination",
          content: `Viralis Studio may suspend or terminate your account at any time in case of violation of these Terms. You may terminate your account at any time by canceling your subscription and deleting your account from settings.`
        },
        {
          title: "14. Governing Law",
          content: `These Terms are governed by applicable laws. Any dispute will be resolved in accordance with the competent jurisdiction.`
        },
        {
          title: "15. Contact",
          content: `For any questions regarding these Terms, please contact us via the contact form available on the Service.`
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización: 25 de noviembre de 2024",
      sections: [
        {
          title: "1. Aceptación de los Términos",
          content: `Al acceder y usar Viralis Studio ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio ("Términos"). Si no aceptas estos Términos, no debes usar el Servicio.`
        },
        {
          title: "2. Descripción del Servicio",
          content: `Viralis Studio es una plataforma de generación de videos con IA que permite a los usuarios crear videos para redes sociales, particularmente TikTok, a partir de prompts de texto. El Servicio utiliza tecnologías de IA avanzadas para generar contenido de video.`
        },
        {
          title: "3. Cuenta de Usuario",
          content: `Para usar el Servicio, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales de inicio de sesión. Aceptas notificarnos inmediatamente de cualquier uso no autorizado de tu cuenta.`
        },
        {
          title: "4. Suscripciones y Pagos",
          content: `El Servicio ofrece suscripciones recurrentes (Pro Mensual a $19.99/mes y Pro Anual a $199.99/año) así como paquetes de tokens de un solo uso. Los pagos se procesan a través de Stripe. Al suscribirte, autorizas facturación recurrente hasta cancelación.`
        },
        {
          title: "5. Política de Cancelación y Reembolso",
          content: `Puedes cancelar tu suscripción en cualquier momento desde tu panel de control. La cancelación entra en vigor al final del período de facturación actual. Conservas el acceso a las funciones Pro hasta el final del período pagado (1 mes para Pro Mensual, 1 año para Pro Anual). No se otorgan reembolsos por períodos ya facturados. Los paquetes de tokens no son reembolsables una vez comprados.`
        },
        {
          title: "6. Tokens y Uso",
          content: `Los tokens son créditos de generación de video. Cada generación de video consume un cierto número de tokens según la resolución seleccionada. Los tokens no utilizados no expiran para cuentas Pro. Los tokens comprados a través de paquetes son válidos indefinidamente.`
        },
        {
          title: "7. Propiedad Intelectual",
          content: `Los videos generados a través del Servicio son propiedad del usuario que los creó. Sin embargo, otorgas a Viralis Studio una licencia mundial, no exclusiva y libre de regalías para usar, modificar y mostrar estos videos con fines de promoción del Servicio. El Servicio en sí, incluido su código, diseños y tecnologías de IA, sigue siendo propiedad exclusiva de Viralis Studio.`
        },
        {
          title: "8. Contenido Generado por IA",
          content: `Los videos generados por nuestra IA se crean automáticamente y pueden contener errores o resultados inesperados. Viralis Studio no garantiza la calidad, precisión o idoneidad de los videos generados para tus necesidades específicas. Eres responsable de revisar y aprobar cualquier contenido generado antes de publicarlo.`
        },
        {
          title: "9. Uso Aceptable",
          content: `Aceptas no usar el Servicio para crear contenido ilegal, difamatorio, acosador, obsceno o que viole los derechos de otros. No debes usar el Servicio para generar contenido que viole los términos de servicio de TikTok u otras plataformas.`
        },
        {
          title: "10. Disponibilidad del Servicio",
          content: `Viralis Studio se esfuerza por mantener el Servicio disponible 24/7, pero no garantiza disponibilidad ininterrumpida. El Servicio puede estar temporalmente no disponible por mantenimiento, actualizaciones o razones técnicas.`
        },
        {
          title: "11. Limitación de Responsabilidad",
          content: `En la medida permitida por la ley, Viralis Studio no será responsable de daños directos, indirectos, incidentales o consecuentes resultantes del uso o la imposibilidad de usar el Servicio.`
        },
        {
          title: "12. Modificaciones de los Términos",
          content: `Viralis Studio se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios entran en vigor al publicarse en el Servicio. Tu uso continuo del Servicio después de los cambios constituye tu aceptación de los nuevos Términos.`
        },
        {
          title: "13. Terminación",
          content: `Viralis Studio puede suspender o terminar tu cuenta en cualquier momento en caso de violación de estos Términos. Puedes terminar tu cuenta en cualquier momento cancelando tu suscripción y eliminando tu cuenta desde la configuración.`
        },
        {
          title: "14. Ley Aplicable",
          content: `Estos Términos se rigen por las leyes aplicables. Cualquier disputa se resolverá de acuerdo con la jurisdicción competente.`
        },
        {
          title: "15. Contacto",
          content: `Para cualquier pregunta sobre estos Términos, contáctanos a través del formulario de contacto disponible en el Servicio.`
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
                ? 'En utilisant Viralis Studio, vous reconnaissez avoir lu, compris et accepté ces Conditions d\'Utilisation.'
                : language === 'es'
                ? 'Al usar Viralis Studio, reconoces haber leído, entendido y aceptado estos Términos de Servicio.'
                : 'By using Viralis Studio, you acknowledge that you have read, understood, and agreed to these Terms of Service.'}
            </p>
          </div>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default TermsOfServicePage;


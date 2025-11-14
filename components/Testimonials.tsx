import React, { useMemo } from 'react';
import {
  StarIcon,
  RedditIcon,
  PinterestIcon,
  FacebookIcon,
  XLogoIcon,
  InstagramIcon,
  YouTubeIcon,
} from './icons/Icons';
import type { Testimonial } from '../types';
import type { Language } from '../App';
import { translations } from '../translations';

const platformIcons: Record<Testimonial['platform'], React.FC<React.SVGProps<SVGSVGElement>>> = {
  reddit: RedditIcon,
  pinterest: PinterestIcon,
  facebook: FacebookIcon,
  x: XLogoIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};

const platformLabels: Record<Testimonial['platform'], string> = {
  reddit: 'Reddit',
  pinterest: 'Pinterest',
  facebook: 'Facebook',
  x: 'X (Twitter)',
  instagram: 'Instagram',
  youtube: 'YouTube',
};

type MultiLangTestimonial = Omit<Testimonial, 'language' | 'review'> & {
  reviews: Record<Language, string>;
};

const BASE_TESTIMONIALS: MultiLangTestimonial[] = [
  {
    name: 'Léna Martin',
    handle: '@lenacreative',
    role: 'Créatrice de contenus lifestyle',
    country: 'Paris, France',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=47',
    platform: 'instagram',
    reviews: {
      fr: '“Viralis Studio a doublé le taux d’engagement de mes vidéos. L’IA me propose des idées qui collent vraiment à mon univers.”',
      en: '“Viralis Studio doubled the engagement on my clips. The AI keeps suggesting angles that feel true to my brand.”',
      es: '“Viralis Studio duplicó el engagement de mis vídeos. La IA sugiere ideas que encajan perfecto con mi estilo.”',
    },
  },
  {
    name: 'Akim Belaid',
    handle: '@akimbusiness',
    role: 'Coach business & mindset',
    country: 'Casablanca, Maroc',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=12',
    platform: 'youtube',
    reviews: {
      fr: '“J’utilise la plateforme pour produire 3 capsules par jour. Même mon équipe est bluffée par la rapidité.”',
      en: '“I now launch three short videos a day. The team is impressed with how fast we iterate ideas.”',
      es: '“Lanzo tres cápsulas diarias. El equipo alucina con la velocidad a la que iteramos ideas.”',
    },
  },
  {
    name: 'Manon Dupuis',
    handle: '@manonbeauty',
    role: 'Influenceuse beauté',
    country: 'Lille, France',
    rating: 4,
    avatar_url: 'https://i.pravatar.cc/150?img=32',
    platform: 'pinterest',
    reviews: {
      fr: '“Le rendu est pro et les scripts générés me font gagner des heures. Il me reste juste à personnaliser la voix off.”',
      en: '“Professional-looking results with scripts ready to record. I only tweak the voice-over now.”',
      es: '“Resultados profesionales con guiones listos para grabar. Solo personalizo la voz en off.”',
    },
  },
  {
    name: 'Nassim Khaldi',
    handle: '@nassimtech',
    role: 'Créateur tech & IA',
    country: 'Montréal, Canada',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=62',
    platform: 'reddit',
    reviews: {
      fr: '“La meilleure façon de publier régulièrement sans sacrifier la qualité. Les prompts thématiques sont ultra pertinents.”',
      en: '“Thematic prompts keep my channel on trend. Publishing regularly without losing quality is now doable.”',
      es: '“Los prompts temáticos mantienen mi canal en tendencia. Publico seguido sin perder calidad.”',
    },
  },
  {
    name: 'Sophie Ellis',
    handle: '@sophieexplains',
    role: 'YouTube educator',
    country: 'London, UK',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=5',
    platform: 'youtube',
    reviews: {
      fr: '“Mes vidéos explicatives prennent maintenant minutes, pas des heures. Le rythme correspond parfaitement à YouTube Shorts.”',
      en: '“My explainer clips now take minutes, not hours. The pacing fits YouTube Shorts perfectly.”',
      es: '“Mis vídeos explicativos se producen en minutos. El ritmo encaja perfecto con YouTube Shorts.”',
    },
  },
  {
    name: 'Alex Rivera',
    handle: '@alexgamingpro',
    role: 'Gaming content creator',
    country: 'Los Angeles, USA',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=18',
    platform: 'youtube',
    reviews: {
      fr: '“Je suis passé de 0 à 1 200$/mois juste avec mes vidéos de gaming. Viralis a transformé ma chaîne en machine à revenus.”',
      en: '“I went from $0 to $1,200/month just with my gaming videos. Viralis turned my channel into a revenue machine.”',
      es: '“Pasé de $0 a $1,200/mes solo con mis videos de gaming. Viralis convirtió mi canal en una máquina de ingresos.”',
    },
  },
  {
    name: 'Daniel Brooks',
    handle: '@dbrooksmarketing',
    role: 'Marketing strategist',
    country: 'Austin, USA',
    rating: 4,
    avatar_url: 'https://i.pravatar.cc/150?img=24',
    platform: 'facebook',
    reviews: {
      fr: '“Viralis nous permet de tester cinq créations par jour. On dispose enfin de données solides pour chaque campagne.”',
      en: '“Viralis lets our team test five creatives a day. We finally have data to back every campaign decision.”',
      es: '“Probamos cinco creatividades al día. Por fin tenemos datos para justificar cada decisión.”',
    },
  },
  {
    name: 'Maya Patel',
    handle: '@mayapmotions',
    role: 'Fitness creator',
    country: 'Toronto, Canada',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=36',
    platform: 'instagram',
    reviews: {
      fr: '“Les scripts IA capturent parfaitement mon ton. Je n’ai plus qu’à enregistrer la voix off.”',
      en: '“The AI scripts nail my tone. All I do is record the VO and let the platform handle the rest.”',
      es: '“Los guiones de la IA clavan mi tono. Solo grabo la voz y listo.”',
    },
  },
  {
    name: 'Jamal Wright',
    handle: '@jamaltechreview',
    role: 'Tech reviewer',
    country: 'Atlanta, USA',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=55',
    platform: 'x',
    reviews: {
      fr: '“Le flux watermark-au-téléchargement est génial. Je prévisualise vite, puis je brand mes rendus finaux.”',
      en: '“The watermark-on-download workflow is genius. I preview fast, then brand the final exports.”',
      es: '“El flujo de marca de agua al descargar es brillante. Previsualizo rápido y luego sello la versión final.”',
    },
  },
  {
    name: 'Valentina Ríos',
    handle: '@valenstories',
    role: 'Storyteller digital',
    country: 'Buenos Aires, Argentina',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=45',
    platform: 'instagram',
    reviews: {
      fr: '“Mes stories retiennent 3× plus. L’IA propose des scénarios dynamiques qui accrochent.”',
      en: '“My stories keep viewers 3× longer. The AI pitches dynamic scenarios that grip instantly.”',
      es: '“Mis historias retienen 3× más. La IA propone escenas dinámicas que enganchan al momento.”',
    },
  },
  {
    name: 'Sarah Chen',
    handle: '@sarahfitcoach',
    role: 'Fitness influencer',
    country: 'Vancouver, Canada',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=22',
    platform: 'instagram',
    reviews: {
      fr: '“Mes revenus ont explosé : de 500$ à 3 500$/mois grâce aux vidéos générées par Viralis. Mes abonnés adorent le contenu.”',
      en: '“My income exploded: from $500 to $3,500/month thanks to Viralis-generated videos. My followers love the content.”',
      es: '“Mis ingresos explotaron: de $500 a $3,500/mes gracias a los videos generados por Viralis. Mis seguidores adoran el contenido.”',
    },
  },
  {
    name: 'Diego Fernández',
    handle: '@diegofocus',
    role: 'Consultor de marca personal',
    country: 'Madrid, España',
    rating: 4,
    avatar_url: 'https://i.pravatar.cc/150?img=14',
    platform: 'facebook',
    reviews: {
      fr: '“Je publie quotidiennement sans dépendre d’un monteur. Viralis est clé dans ma routine.”',
      en: '“I post every day without needing an editor. Viralis is the backbone of my routine.”',
      es: '“Publico diario sin depender de un editor. Viralis es parte clave de mi rutina.”',
    },
  },
  {
    name: 'Camila Ortega',
    handle: '@camihealth',
    role: 'Coach nutricional',
    country: 'México, CDMX',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=29',
    platform: 'pinterest',
    reviews: {
      fr: '“Les prompts thématiques sont une mine d’or. Chaque vidéo répond exactement aux questions de mon audience.”',
      en: '“The thematic prompts are pure gold. Every video answers exactly what my audience is asking.”',
      es: '“Los prompts temáticos son oro puro. Cada vídeo responde justo lo que mi audiencia necesita.”',
    },
  },
  {
    name: 'Luis Herrera',
    handle: '@luishustle',
    role: 'Creador motivacional',
    country: 'Santiago, Chile',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=9',
    platform: 'youtube',
    reviews: {
      fr: '“Je prépare des semaines de contenu en une journée. L’intégration IA + calendrier est redoutable.”',
      en: '“I prep weeks of content in a single day. The AI + calendar integration is lethal.”',
      es: '“Preparo semanas de contenido en un solo día. La integración IA + calendario es brutal.”',
    },
  },
  {
    name: 'Marcus Johnson',
    handle: '@marcusentrepreneur',
    role: 'Business coach',
    country: 'Miami, USA',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/150?img=33',
    platform: 'facebook',
    reviews: {
      fr: '“En 3 mois, j’ai généré 8 000$ de revenus passifs avec mes vidéos éducatives. Viralis est un investissement qui paie.”',
      en: '“In 3 months, I generated $8,000 in passive income with my educational videos. Viralis is an investment that pays off.”',
      es: '“En 3 meses, generé $8,000 en ingresos pasivos con mis videos educativos. Viralis es una inversión que se paga sola.”',
    },
  },
];

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`}
      />
    ))}
  </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  const PlatformIcon = platformIcons[testimonial.platform];
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl h-full flex flex-col shadow-lg shadow-slate-900/10 transition-transform hover:-translate-y-2 hover:shadow-xl">
    <div className="flex items-start gap-4 mb-4">
        <img
          src={testimonial.avatar_url}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full border-2 border-white shadow-md shadow-slate-900/10"
        />
      <div className="flex-grow">
          <p className="font-semibold text-slate-900">{testimonial.name}</p>
          <p className="text-sm text-slate-500">{testimonial.handle}</p>
          <p className="text-xs text-slate-400 mt-1">
            {testimonial.role}, {testimonial.country}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200 shadow-inner">
            <PlatformIcon className="h-5 w-5 text-slate-600" />
          </div>
          <span className="mt-1 text-[11px] font-medium text-slate-400">
            Avis sur {platformLabels[testimonial.platform]}
          </span>
        </div>
        </div>
      <Rating rating={testimonial.rating} />
      <p className="text-slate-600 mt-4 flex-grow text-left leading-relaxed italic">"{testimonial.review}"</p>
    </div>
);
};

const Testimonials: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const testimonials = useMemo<Testimonial[]>(() => {
    return BASE_TESTIMONIALS.map(({ reviews, ...base }) => ({
      ...base,
      language,
      review: reviews[language] ?? reviews.en,
    }));
  }, [language]);
  const carouselItems = useMemo(
    () => [...testimonials, ...testimonials, ...testimonials],
    [testimonials],
  );

  return (
    <section className="py-24 animate-fade-in-up">
      <div className="container mx-auto text-center px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4" style={{background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
          {t.testimonialsTitle} 💬
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12">
          {t.testimonialsSubtitle}
        </p>
      </div>
      <div className="w-full overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]">
        <div className="flex w-max animate-carousel-scroll hover:[animation-play-state:paused]">
          {carouselItems.map((testimonial, index) => (
            <div key={`${testimonial.handle}-${index}`} className="flex-shrink-0 w-[340px] md:w-[360px] lg:w-[380px] p-4">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
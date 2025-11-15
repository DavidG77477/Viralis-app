export const translations = {
    fr: {
        // Header
        nav_generator: "Générateur IA",
        nav_pricing: "Tarifs",
        nav_faq: "FAQ",
        nav_blog: "Blog",
        login: "Se connecter",

        auth: {
            common: {
                emailLabel: "Email",
                passwordLabel: "Mot de passe",
                confirmPasswordLabel: "Confirmer le mot de passe",
                emailPlaceholder: "ton@email.com",
                passwordPlaceholder: "••••••••",
                confirmPasswordPlaceholder: "••••••••",
                backHome: "← Retour à l'accueil",
                backToLogin: "← Retour à la connexion",
                genericError: "Une erreur est survenue. Réessaie.",
            },
            login: {
                title: "Connexion",
                subtitle: "Connecte-toi avec ton email pour générer des vidéos, suivre tes jetons et retrouver ton historique.",
                submit: "Se connecter",
                submitting: "Connexion…",
                missingFields: "Merci de renseigner ton email et ton mot de passe.",
                magicLinkCta: "Recevoir un lien magique",
                magicLinkSending: "Envoi du lien…",
                magicLinkSuccess: "Lien envoyé ! Consulte ta boîte mail pour accéder au tableau de bord.",
                registerPrompt: "Pas encore de compte ?",
                registerCta: "Créer un compte",
                forgotCta: "Mot de passe oublié ?",
                forgotSending: "Envoi du lien…",
                forgotSuccess: "Un email de réinitialisation vient d'être envoyé. Clique sur le lien pour choisir un nouveau mot de passe.",
                forgotMissingEmail: "Entre ton email pour recevoir le lien de réinitialisation.",
            },
            register: {
                title: "Créer un compte",
                subtitle: "Rejoins Viralis Studio pour générer tes vidéos IA et suivre ton utilisation de jetons.",
                submit: "Créer mon compte",
                submitting: "Création du compte…",
                missingFields: "Merci de remplir tous les champs.",
                passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
                passwordMismatch: "Les mots de passe ne correspondent pas.",
                successMessage: "Ton compte a été créé. Vérifie ta boîte mail pour confirmer ton inscription.",
                hasAccountPrompt: "Déjà membre ?",
                loginCta: "Se connecter",
            },
            reset: {
                title: "Réinitialiser le mot de passe",
                subtitle: "Entre ton nouveau mot de passe ci-dessous.",
                submit: "Mettre à jour le mot de passe",
                submitting: "Mise à jour…",
                missingFields: "Merci de renseigner et confirmer ton nouveau mot de passe.",
                passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
                passwordMismatch: "Les mots de passe ne correspondent pas.",
                successMessage: "Ton mot de passe a été mis à jour avec succès ! Tu peux maintenant te connecter.",
                sessionWarning: "Le lien n’a pas permis de récupérer ta session. Redemande un email de réinitialisation puis clique à nouveau sur le lien.",
            },
        },

        // Hero
        heroTitle: "Générateur de Vidéos IA Virales pour TikTok",
        heroSubtitle: "Créez des vidéos qui génèrent des millions de vues et des revenus passifs. L'IA la plus avancée transforme vos idées en contenu viral en quelques minutes — sans compétences techniques.",
        heroCta: "Réclamer mes 45 jetons gratuits !",
        heroSocialProof: {
            introText: "Déjà membre de Viralis Studio ?",
            linkText: "Connexion",
            linkHref: "/auth",
            totalUsers: 2291,
            totalUsersOverride: "10 000+",
            totalLabel: "Créateurs heureux",
            rating: 4.8,
            ratingLabel: "Note moyenne",
            avatars: [
                { name: "Amelie Chen", src: "https://i.pravatar.cc/80?img=11" },
                { name: "Yacine Dupont", src: "https://i.pravatar.cc/80?img=27" },
                { name: "Sofia Martinez", src: "https://i.pravatar.cc/80?img=35" },
                { name: "Jordan Smith", src: "https://i.pravatar.cc/80?img=50" },
            ],
        },
        heroTrust1: "🔒 Paiement sécurisé",
        heroTrust2: "🤖 IA de dernière génération",
        heroTrust3: "⚡ Résultats rapides",
        
        // Features
        featuresTitle: "Fonctionnalités Principales",
        features: [
            {
                icon: "🎨",
                title: "Styles Vidéo Variés",
                description: "Créez des vidéos dans tous les styles : storytelling, lifestyle, podcast, cinéma ou publicité.",
            },
            {
                icon: "⚡",
                title: "Génération Ultra Rapide",
                description: "Passez de votre idée au rendu final en quelques minutes grâce à notre moteur IA Viralis Engine.",
            },
            {
                icon: "💰",
                title: "Optimisé pour la Monétisation",
                description: "Créez des vidéos longues et engageantes pour débloquer la monétisation TikTok et augmenter vos revenus.",
            },
            {
                icon: "🤖",
                title: "Personnalisation Avancée",
                description: "Contrôlez la durée, les transitions, la musique et le ton — laissez Viralis Studio faire le reste.",
            },
        ],
        growthHighlightsTitle: "Pourquoi Viralis propulse vos vidéos",
        growthHighlightsSubtitle: "Trois accélérateurs qui transforment une simple idée en un contenu premium prêt à monétiser.",
        growthHighlights: [
            {
                icon: "🚀",
                title: "Accroches hyper addictives",
                description: "Chaque vidéo démarre avec des accroches testées qui capturent l'attention en moins de 3 secondes et boostent la rétention."
            },
            {
                icon: "🎯",
                title: "Synchronisation audience",
                description: "Viralis adapte automatiquement le ton et les thématiques à vos segments (gaming, coaching, lifestyle) pour un rendu sur-mesure."
            },
            {
                icon: "💰",
                title: "Prêt à monétiser",
                description: "Exports optimisés avec scripts, sous-titres et formats prêts pour les partenariats, affiliés et placements produits."
            }
        ],

        // Trust Section
        trustTitle: "🌍 Plus de 10 000 créateurs font confiance à Viralis Studio",
        trustSubtitle: "Chaque jour, des créateurs de contenu, entrepreneurs, artistes, coachs et entreprises utilisent Viralis Studio pour produire des vidéos performantes et optimiser leur présence en ligne.",
        trustAllows: "Viralis Studio permet :",
        trustBenefits: [
            "Une production de contenu plus efficace",
            "Une augmentation du volume de tests pour identifier ce qui fonctionne",
            "Un gain de temps significatif sur l'édition et le montage",
            "Un focus sur l'idée et le message, plutôt que sur la technique",
        ],
        trustJoin: "🔥 Rejoignez une communauté croissante de créateurs qui innovent dans leur façon de produire du contenu digital.",
        trustVignettes: [
            {
                icon: "🎥",
                title: "Création simplifiée",
                description: "Concentrez-vous sur vos idées, pas sur la technique complexe du montage vidéo.",
            },
            {
                icon: "🚀",
                title: "Publication plus rapide",
                description: "Accélérez votre rythme de publication et restez pertinent auprès de votre audience.",
            },
            {
                icon: "📈",
                title: "Meilleure capacité de test et d'itération",
                description: "Testez plus d'idées et de formats pour trouver ce qui résonne le plus avec votre public.",
            },
        ],

        // Testimonials
        testimonialsTitle: "Ce que nos créateurs disent",
        testimonialsSubtitle: "Plus de 10 000 utilisateurs utilisent déjà Viralis Studio pour booster leur contenu TikTok.",

        // Demo
        demoTitle: "Exemples Inspirants",
        demoSubtitle: "Découvrez des vidéos générées avec Viralis Studio qui cartonnent sur les réseaux.",
        demoViews: "🔥 20 Millions de vues",

        // Prompt Examples
        promptExamplesTitle: "Du Prompt à la Vidéo Virale",
        promptExamplesSubtitle: "Voyez comment Viralis Studio transforme vos idées en contenu tendance.",
        promptExamplesLabel: "Prompt d'exemple",
        promptUsed: "Prompt utilisé",
        generatedIn: "Généré en",
        promptExamples: [
            {
                category: "🎤 Interview Tendance",
                prompt: "A realistic scene of a car towing two giraffes on the highway while passing under a bridge — bright daylight, dynamic motion, humorous and cinematic composition.",
                generationTime: "1 minute",
                mediaKey: "giraffeInterview"
            },
            {
                category: "🐶 Effet Viral Satisfaisant",
                prompt: "Chien qui saute en parachute avec son maître au-dessus de Bora Bora",
                generationTime: "1 minute",
                mediaKey: "chienVolant"
            }
        ],

        // Success Stories
        successStoriesTitle: "Success Stories : They Started, You Can Too",
        successStoriesSubtitle: "De nouveaux créateurs gagnent facilement de l'argent en ligne en créant du contenu avec Viralis Studio. Découvrez leurs parcours et commencez le vôtre.",
        successStoriesCta: "Commencer à créer aujourd'hui",
        successStories: [
            {
                quote: "Je n'aurais jamais pensé pouvoir gagner de l'argent avec mes vidéos. Viralis Studio a changé ma vie !",
                name: "Emma Johnson",
                amount: "Premier 100$",
                description: "En seulement 2 semaines, Emma a généré son premier revenu passif. Ses vidéos de lifestyle ont rapidement trouvé leur audience sur TikTok.",
                avatar: "https://i.pravatar.cc/150?img=47"
            },
            {
                quote: "La rapidité de création avec Viralis est incroyable. J'ai multiplié ma production par 10 !",
                name: "Lucas Anderson",
                amount: "Premier 500$",
                description: "En un mois, Lucas est passé de 0 abonnés à plus de 50k. Ses vidéos éducatives sur le business génèrent maintenant des revenus réguliers.",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            {
                quote: "Viralis Studio m'a permis de transformer ma passion en véritable business. Je recommande à 100% !",
                name: "Sophie Williams",
                amount: "Premier 1000$",
                description: "En 3 mois, Sophie a créé une chaîne YouTube rentable. Ses vidéos de fitness génèrent maintenant des revenus passifs mensuels.",
                avatar: "https://i.pravatar.cc/150?img=32"
            }
        ],

        // Pricing
        pricingTitle: "Prix Simples et Transparents de Viralis Studio",
        pricingSubtitle: "Choisissez un plan abordable pour créer des vidéos professionnelles avec notre technologie IA avancée.",
        pricingVat: "TTC",
        pricingFooter: "Tarifs en USD, toutes taxes comprises (TTC). Les tokens correspondent aux crédits de génération vidéo.",
        pricingPlans: [
            {
                title: "Pack Tokens",
                price: "$9.99",
                priceSubtitle: "100 tokens pour générer de nombreuses vidéos",
                features: null,
                ctaText: "Acheter maintenant",
                badge: null,
                href: "#"
            },
            {
                title: "Pack Tokens Premium",
                price: "$99.99",
                priceSubtitle: "1200 tokens — 20% de tokens en plus",
                features: null,
                ctaText: "Acheter maintenant",
                badge: "Plus rentable",
                badgeGradient: "bg-gradient-to-r from-sky-400 to-blue-500",
                href: "#"
            },
            {
                title: "Pro Mensuel",
                price: "$19.99",
                priceSubtitle: "300 tokens par mois + avantages pro",
                features: [
                    "300 tokens par mois",
                    "Génération prioritaire",
                    "Accès prioritaire aux nouvelles fonctionnalités",
                    "Mode Photo → Vidéo",
                    "Support prioritaire",
                    "Vidéos sans filigrane"
                ],
                ctaText: "Choisir Pro Mensuel",
                badge: null,
                href: "#"
            },
            {
                title: "Pro Annuel",
                price: "$199.99",
                priceSubtitle: "300 tokens par mois + 2 mois gratuits",
                features: [
                    "3600 tokens par an (300/mois)",
                    "Génération prioritaire",
                    "Accès prioritaire aux nouvelles fonctionnalités",
                    "Mode Photo → Vidéo",
                    "Support prioritaire",
                    "2 mois gratuits",
                    "Vidéos sans filigrane"
                ],
                ctaText: "Choisir Pro Annuel",
                badge: "Plus populaire",
                badgeGradient: "bg-gradient-to-r from-orange-400 to-red-500",
                href: "#"
            }
        ],

        // FAQ
        faqTitle: "Foire Aux Questions sur Viralis Studio",
        faqSubtitle: "Une autre question ? Contactez-nous sur Discord ou par e-mail.",
        faqData: [
            {
                question: "Qu'est-ce que Viralis Studio ?",
                answer: "Viralis Studio est un générateur de vidéos IA avancé qui transforme des prompts textuels en vidéos professionnelles en quelques minutes."
            },
            {
                question: "Comment fonctionne Viralis Studio ?",
                answer: "Entrez un court prompt, choisissez votre style et vos paramètres, puis générez. Notre IA assemble les visuels, le rythme et les transitions pour produire un clip prêt à l'emploi."
            },
            {
                question: "Qu'est-ce qui différencie Viralis Studio des autres générateurs ?",
                answer: "Viralis Studio se concentre sur la simplicité d'utilisation, des rendus de haute qualité et une itération rapide pour que les créateurs puissent tester plus d'idées, plus vite, sans compétences avancées en montage."
            },
            {
                question: "Quels types de vidéos puis-je créer ?",
                answer: "Publicités, contenu pour les réseaux sociaux, vidéos explicatives, animations, démos de produits, clips narratifs, et plus encore. Viralis Studio s'adapte à vos besoins créatifs."
            },
            {
                question: "Quelle est la qualité des vidéos générées ?",
                answer: "Viralis Studio génère des vidéos en HD adaptées aux réseaux sociaux, aux présentations et à un usage professionnel."
            },
            {
                question: "Combien de temps faut-il pour générer une vidéo ?",
                answer: "La plupart des vidéos sont générées en quelques minutes. Les prompts plus complexes ou les durées plus longues peuvent prendre un peu plus de temps."
            },
            {
                question: "Puis-je personnaliser les styles et les durées ?",
                answer: "Oui. Vous pouvez ajuster le style visuel, la durée, les transitions et l'ambiance pour correspondre à votre marque et à votre plateforme."
            },
            {
                question: "Est-ce que je conserve les droits commerciaux sur mes vidéos ?",
                answer: "Oui, sous réserve de nos Conditions d'Utilisation et des éventuels contenus tiers que vous choisissez d'inclure."
            }
        ],

        // Video Generator
        generatorTitle: "Passez de l'Idée à la Vidéo",
        generatorSubtitle: "C'est ici que la magie opère. Utilisez notre IA pour générer votre prochaine vidéo virale en quelques secondes.",
        generatorSettingsTitle: "Paramètres de Génération",
        generatorStyleLabel: "Style de la vidéo",
        generatorStyleDescription: "Choisis le dispositif de prise de vue (bodycam, CCTV, smartphone, dashcam…) pour forcer l’IA à respecter cet angle.",
        generatorStyleButton: "Choisir un style de caméra",
        generatorStyleNone: "Aucun style (laisser l'IA choisir)",
        generatorStyleModalTitle: "Sélection du style de caméra",
        generatorStyleModalSubtitle: "Inspire-toi des caméras réelles les plus virales : l’IA collera exactement à cette prise de vue.",
        generatorStyleCategories: [
            {
                id: "hyper_realism",
                title: "Hyperréalisme & Cinéma",
                description: "Pour des rendus ultra immersifs, comme filmés avec une caméra cinéma.",
                options: [
                    { value: "hyper_real_cinematic", label: "Hyperréalisme cinématographique", promptInstruction: "Utiliser un éclairage cinéma, une profondeur de champ réaliste et des textures photoréalistes ultra détaillées." },
                    { value: "handheld_documentary", label: "Caméra épaule immersive", promptInstruction: "Adopter un mouvement caméra à l'épaule, léger grain et dynamique documentaire moderne." },
                    { value: "police_body_cam", label: "Bodycam policière", promptInstruction: "Simuler un rendu bodycam avec angle grand-angle, mouvements brusques et HUD minimal." },
                    { value: "nat_geo_doc", label: "Documentaire National Geographic", promptInstruction: "Proposer une narration documentaire premium, lumière naturelle, prise de vue animalière ou nature." },
                    { value: "premium_phone_vlog", label: "Vidéo smartphone premium", promptInstruction: "Imiter un tournage smartphone haut de gamme avec stabilisation, reflets réalistes et rendu lifestyle." }
                ]
            },
            {
                id: "japanese_animation",
                title: "Animation japonaise",
                description: "Des univers inspirés des grands studios d'animation japonais.",
                options: [
                    { value: "studio_ghibli", label: "Univers chaleureux Studio Ghibli", promptInstruction: "Créer un monde chaleureux, végétation luxuriante et animation douce inspirée de Ghibli." },
                    { value: "shonen_anime", label: "Anime shōnen dynamique", promptInstruction: "Mettre en scène un style anime énergique avec effets de vitesse, lignes d'action et contrastes forts." },
                    { value: "cyberpunk_anime", label: "Anime cyberpunk néon", promptInstruction: "Composer une ville futuriste néon, silhouettes stylisées et ambiance nocturne inspirée d'Akira." },
                    { value: "pastel_romance_anime", label: "Anime romance pastel", promptInstruction: "Utiliser une palette pastel, ambiance douce et expressions émotionnelles très marquées." },
                    { value: "mecha_epic_anime", label: "Anime mecha épique", promptInstruction: "Mettre en scène des robots géants, angles dramatiques et explosions stylisées." }
                ]
            },
            {
                id: "western_animation",
                title: "Animation occidentale",
                description: "Les styles iconiques des studios occidentaux cultes.",
                options: [
                    { value: "pixar_family", label: "Pixar aventure familiale", promptInstruction: "Créer un rendu 3D lumineux avec émotions fortes, textures propres et lumière colorée typique Pixar." },
                    { value: "disney_fairytale", label: "Disney féerique", promptInstruction: "Produire un univers féerique, éclatant, avec animation fluide et magie scintillante." },
                    { value: "dreamworks_comedy", label: "DreamWorks comédie d'aventure", promptInstruction: "Mixer humour rapide et action, expressions exagérées et rendu 3D stylisé." },
                    { value: "simpsons_style", label: "Style Les Simpson", promptInstruction: "Emprunter le style cartoon plat, palette jaune et humour satirique façon Springfield." },
                    { value: "family_guy_style", label: "Style Family Guy", promptInstruction: "Adopter un cartoon adulte, contours épais, humour décalé et plans statiques." },
                    { value: "cartoon_network", label: "Cartoon Network punchy", promptInstruction: "Proposer un cartoon nerveux, couleurs vives, formes géométriques et energy comique." }
                ]
            },
            {
                id: "artistic_illustration",
                title: "Arts & Illustration",
                description: "Transformez votre vidéo en œuvre illustrée.",
                options: [
                    { value: "watercolor_motion", label: "Aquarelle animée", promptInstruction: "Simuler un rendu aquarelle fluide avec coups de pinceau visibles et transitions liquides." },
                    { value: "oil_painting", label: "Peinture à l'huile vivante", promptInstruction: "Créer une toile à l'huile animée avec matière épaisse, reflets et lumière mise en scène." },
                    { value: "euro_comic", label: "Illustration BD européenne", promptInstruction: "Utiliser un style bande dessinée franco-belge, lignes nettes et aplats colorés." },
                    { value: "pop_art", label: "Pop art vibrant", promptInstruction: "Employer un pop art saturé, trames BD, onomatopées et compositions graphiques." },
                    { value: "marvel_comic", label: "Comic-book Marvel", promptInstruction: "Réaliser un style comic-book héroïque avec encrage dynamique et couleurs dramatiques." }
                ]
            },
            {
                id: "experimental_retro",
                title: "Expérimental & rétro",
                description: "Des effets originaux pour se démarquer.",
                options: [
                    { value: "glitch_retro_future", label: "Glitch rétro futuriste", promptInstruction: "Ajouter des glitchs numériques, chromatic aberration et esthétique synthwave." },
                    { value: "vhs_90s", label: "VHS années 90", promptInstruction: "Appliquer un filtre VHS avec bruit vidéo, timestamps et tracking old-school." },
                    { value: "grainy_bw", label: "Noir et blanc granuleux", promptInstruction: "Tourner en noir et blanc contrasté avec grain argentique et lumière dramatique." },
                    { value: "holographic_3d", label: "Holographique 3D", promptInstruction: "Créer un rendu holographique translucide, reflets prismatiques et rayons laser." },
                    { value: "dreamlike_surreal", label: "Vision onirique surréaliste", promptInstruction: "Composer un univers surréaliste, transitions fluides et symboles poétiques flottants." }
                ]
            },
            {
                id: "minimalist_modern",
                title: "Minimaliste & Moderne",
                description: "Design épuré et contemporain pour un impact visuel fort.",
                options: [
                    { value: "minimal_clean", label: "Minimalisme épuré", promptInstruction: "Utiliser un design épuré, lignes nettes, espace blanc et composition équilibrée." },
                    { value: "brutalist_design", label: "Brutalisme graphique", promptInstruction: "Adopter un style brutaliste avec formes géométriques, contraste fort et typographie bold." },
                    { value: "neomorphism", label: "Néomorphisme doux", promptInstruction: "Créer un rendu néomorphique avec ombres douces, reliefs subtils et palette pastel." },
                    { value: "glassmorphism", label: "Glassmorphisme", promptInstruction: "Utiliser un effet verre dépoli, transparence, flou et bordures lumineuses." },
                    { value: "flat_design", label: "Design plat moderne", promptInstruction: "Composer avec des aplats de couleur, icônes stylisées et hiérarchie visuelle claire." }
                ]
            },
            {
                id: "cinematic_genres",
                title: "Genres Cinématographiques",
                description: "Styles de réalisation inspirés des grands genres du cinéma.",
                options: [
                    { value: "noir_film", label: "Film noir classique", promptInstruction: "Adopter un style film noir avec ombres chinoises, contrastes dramatiques et narration en voix off." },
                    { value: "western_cinematic", label: "Western cinématique", promptInstruction: "Créer une ambiance western avec paysages désertiques, lumière dorée et tension dramatique." },
                    { value: "neo_noir", label: "Néo-noir moderne", promptInstruction: "Mélanger esthétique film noir avec éléments modernes, néons et narration non-linéaire." },
                    { value: "found_footage", label: "Found footage authentique", promptInstruction: "Simuler un found footage avec caméra tremblante, grain et esthétique amateur réaliste." },
                    { value: "one_shot", label: "Plan-séquence immersif", promptInstruction: "Créer un plan-séquence fluide avec mouvement caméra continu et transitions naturelles." }
                ]
            },
            {
                id: "social_media_styles",
                title: "Styles Réseaux Sociaux",
                description: "Esthétiques optimisées pour TikTok, Instagram et YouTube.",
                options: [
                    { value: "tiktok_trendy", label: "TikTok tendance", promptInstruction: "Utiliser des transitions rapides, effets zoom, textes animés et rythme accrocheur typique TikTok." },
                    { value: "instagram_aesthetic", label: "Aesthetic Instagram", promptInstruction: "Créer une esthétique Instagram avec filtres cohérents, composition carrée et palette harmonieuse." },
                    { value: "youtube_thumbnail", label: "Style YouTube viral", promptInstruction: "Composer avec visages expressifs, textes impactants et couleurs saturées pour miniatures." },
                    { value: "reels_dynamic", label: "Reels dynamique", promptInstruction: "Adopter un rythme rapide, cuts percutants et visuels accrocheurs pour Instagram Reels." },
                    { value: "shorts_vertical", label: "Shorts vertical optimisé", promptInstruction: "Optimiser pour format vertical avec action centrée, textes lisibles et rythme soutenu." }
                ]
            }
        ],
        generatorThemeLabel: "Thème de la vidéo",
        generatorThemeDescription: "Affinez l'ambiance générale pour guider l'IA et obtenir un rendu cohérent.",
        generatorThemeOptions: [
            { value: "none", label: "Aucun (laisser le prompt libre)" },
            { value: "horror", label: "Horreur cinématique", color: "#FE4A49", promptInstruction: "Créer un univers angoissant, sombre, avec une tension progressive digne d'un thriller viral." },
            { value: "joyful", label: "Énergie joyeuse", color: "#FFD166", promptInstruction: "Mettre en scène une ambiance lumineuse, positive et motivante qui capte l'attention." },
            { value: "fantasy", label: "Fantastique immersif", color: "#9C6BFF", promptInstruction: "Déployer un monde magique ou futuriste riche en détails visuels spectaculaires." },
            { value: "business", label: "Business/Startup", color: "#3DFF8C", promptInstruction: "Proposer un ton crédible et inspirant, adapté à une présentation produit ou pitch viral." },
            { value: "epic", label: "Épique cinématographique", color: "#23A6F0", promptInstruction: "Créer une tension héroïque avec un rythme intense, des plans dramatiques et une narration légendaire." },
            { value: "romance", label: "Romance lumineuse", color: "#FF8FA3", promptInstruction: "Mettre en avant des émotions sincères, des plans doux et un rythme chaleureux qui touche le cœur." },
            { value: "documentary", label: "Documentaire impactant", color: "#8D99AE", promptInstruction: "Adopter un ton crédible, narratif et informatif avec des faits clés et des plans immersifs." },
            { value: "sports", label: "Sport dynamique", color: "#00B2A9", promptInstruction: "Insuffler une énergie sportive intense avec des mouvements rapides, ralentis dramatiques et cris de victoire." },
            { value: "cyberpunk", label: "Cyberpunk futuriste", color: "#7A00FF", promptInstruction: "Plonger dans une ville néon futuriste, contrastée, avec une ambiance électronique et rebelle." },
            { value: "mystery", label: "Mystère énigmatique", color: "#264653", promptInstruction: "Créer une ambiance intrigante, semi-nocturne, avec indices, suspense et révélations virales." },
            { value: "adventure", label: "Aventure explosante", color: "#F6AE2D", promptInstruction: "Composer un récit rythmé avec des plans mouvementés, des paysages grandioses et un ton inspirant." },
            { value: "retro", label: "Retro nostalgique", color: "#FF6F91", promptInstruction: "Utiliser un style vintage avec filtres pellicule, typographies 80s et transitions analogiques." },
            { value: "luxury", label: "Luxe élégant", color: "#D4AF37", promptInstruction: "Mettre en scène une atmosphère premium avec éclairage sophistiqué, ralentis et détails haute couture." },
            { value: "education", label: "Pédagogique clair", color: "#3A86FF", promptInstruction: "Structurer un contenu didactique, avec des points clés, annotations visuelles et ton rassurant." },
            { value: "wellness", label: "Bien-être apaisant", color: "#80ED99", promptInstruction: "Concevoir une ambiance zen, naturelle, avec voix douce, respiration et visuels relaxants." },
            { value: "nature", label: "Nature immersive", color: "#52B788", promptInstruction: "Mettre en avant la beauté des paysages, sons naturels et ralentis contemplatifs." },
            { value: "sciFi", label: "Science-fiction", color: "#7209B7", promptInstruction: "Imaginer un futur spectaculaire, technologies avancées et effets lumineux contrastés." },
            { value: "urban", label: "Urbain street", color: "#4361EE", promptInstruction: "Capturer l'énergie de la ville, graffitis, lifestyle streetwear et rythme percutant." },
            { value: "holiday", label: "Esprit festif", color: "#FF9F1C", promptInstruction: "Créer une ambiance de fête, musique entraînante, décorations brillantes et joie collective." },
            { value: "kids", label: "Univers enfants", color: "#F4A261", promptInstruction: "Utiliser des couleurs vives, personnages ludiques, narration simple et humour bienveillant." },
            { value: "gaming", label: "Gaming e-sport", color: "#5A00FF", promptInstruction: "Mettre en scène un gameplay nerveux, effets glitch, stats dynamiques et hype compétitive." },
            { value: "fashion", label: "Mode tendance", color: "#FF5D8F", promptInstruction: "Composer un défilé stylé, gros plans sur les textures, transitions rapides et ton sophistiqué." },
            { value: "news", label: "News punchy", color: "#1E90FF", promptInstruction: "Adopter un rythme journalistique, breaking news, lower-thirds et voix énergique." },
            { value: "comedy", label: "Comédie hilarante", color: "#FFB800", promptInstruction: "Créer une ambiance comique avec timing parfait, gags visuels et humour absurde viral." },
            { value: "drama", label: "Drame émotionnel", color: "#6C5CE7", promptInstruction: "Mettre en scène des émotions intenses, tension narrative et moments poignants." },
            { value: "thriller", label: "Thriller haletant", color: "#2D3436", promptInstruction: "Construire un suspense haletant avec rythme tendu, révélations et tension croissante." },
            { value: "action", label: "Action explosive", color: "#E17055", promptInstruction: "Composer des scènes d'action dynamiques, mouvements rapides et effets spectaculaires." },
            { value: "travel", label: "Voyage inspirant", color: "#00B894", promptInstruction: "Capturer l'esprit du voyage avec paysages époustouflants, découvertes et aventure." },
            { value: "food", label: "Gastronomie alléchante", color: "#FDCB6E", promptInstruction: "Mettre en valeur la nourriture avec gros plans appétissants, textures et couleurs vibrantes." },
            { value: "tech", label: "Technologie futuriste", color: "#0984E3", promptInstruction: "Présenter des innovations tech avec visuels high-tech, interfaces et esthétique moderne." },
            { value: "fitness", label: "Fitness motivant", color: "#E84393", promptInstruction: "Créer une énergie fitness avec mouvements dynamiques, motivation et transformation." },
            { value: "beauty", label: "Beauté raffinée", color: "#FD79A8", promptInstruction: "Mettre en avant la beauté avec éclairage doux, textures peau et esthétique premium." },
            { value: "music_video", label: "Clip musical", color: "#A29BFE", promptInstruction: "Composer un clip avec rythme musical, transitions synchronisées et esthétique artistique." }
        ],
        generatorMusicLabel: "Ambiance musicale",
        generatorMusicDescription: "Choisissez une couleur sonore pour renforcer l'émotion et la dynamique.",
        generatorMusicOptions: [
            { value: "none", label: "Aucune ambiance (laisser le prompt libre)" },
            { value: "cinematic", label: "Épique cinématique", color: "#5D3FD3", promptInstruction: "Bande-son orchestrale avec percussions puissantes et crescendos dramatiques." },
            { value: "synthwave", label: "Synthwave futuriste", color: "#A855F7", promptInstruction: "Synthés rétro, basses lourdes et rythme électronique années 80." },
            { value: "lofi", label: "Lo-fi chill", color: "#64DFDF", promptInstruction: "Battements doux, crackle de vinyle et ambiance relaxante." },
            { value: "trap", label: "Trap énergique", color: "#F72585", promptInstruction: "808 grasses, hi-hats rapides et drop percutant pour hype immédiate." },
            { value: "acoustic", label: "Acoustique doux", color: "#F4A261", promptInstruction: "Guitares chaleureuses, piano léger et percussions discrètes pour un ton humain." },
            { value: "orchestral", label: "Orchestral émouvant", color: "#E9C46A", promptInstruction: "Cordes lyriques, crescendo inspirant et piano émotionnel." },
            { value: "rock", label: "Rock dynamique", color: "#E63946", promptInstruction: "Guitares saturées, batterie énergique et solos percutants." },
            { value: "house", label: "House dansante", color: "#3A0CA3", promptInstruction: "Beat 120 BPM, synthés lumineux et montée progressive pour ambiance club." },
            { value: "afrobeat", label: "Afrobeat vibrant", color: "#FFBE0B", promptInstruction: "Percussions organiques, cuivres festifs et groove afro pour énergie contagieuse." },
            { value: "pop", label: "Pop motivante", color: "#FF6F91", promptInstruction: "Mélodie accrocheuse, claps dynamiques et montée euphorique mainstream." },
            { value: "ambient", label: "Ambient atmosphérique", color: "#00BBF9", promptInstruction: "Textures aériennes, pads planants et rythme minimaliste pour immersion totale." },
            { value: "drill", label: "Drill percutante", color: "#7209B7", promptInstruction: "Basses sub, syncopes sombres et tension urbaine très actuelle." },
            { value: "jazz", label: "Jazz sophistiqué", color: "#D4A574", promptInstruction: "Intégrer des harmonies jazz, saxophone doux et rythme swing élégant." },
            { value: "reggaeton", label: "Reggaeton entraînant", color: "#FF6B9D", promptInstruction: "Utiliser des beats reggaeton, dembow et énergie latine festive." },
            { value: "country", label: "Country authentique", color: "#C9A961", promptInstruction: "Ajouter des guitares country, harmonica et ambiance road trip américain." },
            { value: "reggae", label: "Reggae relaxant", color: "#2ECC71", promptInstruction: "Intégrer un groove reggae, basse ronde et ambiance îles tropicales." },
            { value: "classical", label: "Classique élégant", color: "#E8D5B7", promptInstruction: "Utiliser des compositions classiques, orchestre symphonique et émotions intemporelles." },
            { value: "edm", label: "EDM énergique", color: "#9B59B6", promptInstruction: "Créer une montée EDM, drop puissant et énergie festival électro." },
            { value: "hiphop", label: "Hip-hop urbain", color: "#34495E", promptInstruction: "Intégrer des beats hip-hop, flow rythmé et ambiance street authentique." },
            { value: "indie", label: "Indie alternatif", color: "#E67E22", promptInstruction: "Utiliser des guitares indie, mélodies mélancoliques et atmosphère alternative." },
            { value: "techno", label: "Techno industrielle", color: "#1ABC9C", promptInstruction: "Créer un rythme techno répétitif, basses profondes et ambiance club underground." },
            { value: "folk", label: "Folk acoustique", color: "#95A5A6", promptInstruction: "Intégrer des instruments folk, banjo et narration poétique." }
        ],
        enhancingPromptMessage: "Optimisation du prompt avec ChatGPT...",
        promptPlaceholder: "ex: Un golden retriever DJ dans une fête spatiale futuriste...",
        uploadImageLabel: "Télécharger une Image (Optionnel)",
        aspectRatioLabel: "Format de l'image",
        qualityLabel: "Qualité",
        thinkingModeLabel: "Mode Réflexion",
        thinkingModeDescription: "Utiliser l'IA pour générer un script d'abord.",
        generateScriptButton: "Générer le Script",
        generateVideoButton: "Générer la Vidéo",
        tokens: "Jetons",
        outputTitle: "Votre Chef-d'œuvre vous Attend",
        outputSubtitle: "La vidéo générée apparaîtra ici.",
        watermarkWarning: "Filigrane inclus — Passez à Pro pour le retirer",
        upgradeToPro: "Passer à Pro",
        downloadVideo: "Télécharger la vidéo",
        downloadWorking: "Téléchargement...",
        downloadPreparing: "Préparation du téléchargement…",
        downloadLoadingWatermark: "Téléchargement en cours…",
        downloadCompositing: "Téléchargement en cours…",
        downloadFinalizing: "Finalisation…",
        downloadError: "Impossible de télécharger la vidéo. Réessaie.",
        // Errors
        errorPromptOrImage: "Veuillez fournir un prompt ou une image.",
        errorTokensThinking: "Pas assez de jetons pour le Mode Réflexion.",
        errorScriptGeneration: "La génération du script a échoué.",
        errorTokensVideo: "Pas assez de jetons pour générer une vidéo.",
        errorRetrieveVideo: "Impossible de récupérer la vidéo générée.",
        errorInvalidApiKey: "La clé API est invalide. Veuillez sélectionner une clé valide.",
        errorUnknown: "Une erreur inconnue est survenue lors de la génération de la vidéo.",
        // Other
        loadingCreative: "Activation des circuits créatifs...",
        generatedScriptIdea: "Idée de script générée",
        loadingMessages: [
            "Échauffement des caméras...",
            "Brainstorming d'idées virales...",
            "Réalisation de la scène...",
            "Ajout des effets spéciaux...",
            "Application des touches finales...",
            "Rendu de la version finale...",
            "Téléchargement vers le cloud...",
            "Cela prend un peu plus de temps que d'habitude, mais le résultat sera à la hauteur...",
        ],
        
        // Contact Section
        contactTitle: "Nous Contacter",
        contactSubtitle: "Besoin d'aide ou envie de collaborer ? Envoyez-nous un message.",
        contactFormName: "Nom",
        contactFormEmail: "Email",
        contactFormMessage: "Message",
        contactFormSubmit: "Envoyer le message",
        contactSubmitting: "Envoi en cours...",
        contactSuccess: "Message envoyé avec succès !",

        // Footer
        footerDescription: "Transformez vos idées en vidéos virales et monétisables avec Viralis Studio.",
        footerLinks: {
            Ressources: ["Centre d'aide", "Documentation API", "Communauté"],
            Légal: ["Conditions d'utilisation", "Politique de confidentialité"]
        },
        footerCopyright: "© 2025 Viralis Studio. Tous droits réservés.",

    },
    en: {
        // Header
        nav_generator: "AI Generator",
        nav_pricing: "Pricing",
        nav_faq: "FAQ",
        nav_blog: "Blog",
        login: "Log in",

        auth: {
            common: {
                emailLabel: "Email",
                passwordLabel: "Password",
                confirmPasswordLabel: "Confirm password",
                emailPlaceholder: "you@email.com",
                passwordPlaceholder: "••••••••",
                confirmPasswordPlaceholder: "••••••••",
                backHome: "← Back to home",
                backToLogin: "← Back to login",
                genericError: "Something went wrong. Please try again.",
            },
            login: {
                title: "Sign in",
                subtitle: "Use your email to log in, keep track of your tokens, and access all your videos.",
                submit: "Sign in",
                submitting: "Signing in…",
                missingFields: "Please enter both email and password.",
                magicLinkCta: "Send me a magic link",
                magicLinkSending: "Sending link…",
                magicLinkSuccess: "Magic link sent! Check your inbox to open the dashboard.",
                registerPrompt: "No account yet?",
                registerCta: "Create an account",
                forgotCta: "Forgot your password?",
                forgotSending: "Sending reset link…",
                forgotSuccess: "Reset email sent! Open the link to choose a new password.",
                forgotMissingEmail: "Please enter your email to receive the reset link.",
            },
            register: {
                title: "Create an account",
                subtitle: "Join Viralis Studio to generate AI videos and monitor your token usage.",
                submit: "Create my account",
                submitting: "Creating account…",
                missingFields: "Please fill in every field.",
                passwordTooShort: "Password must contain at least 8 characters.",
                passwordMismatch: "Passwords do not match.",
                successMessage: "Account created. Check your inbox to confirm your email.",
                hasAccountPrompt: "Already a member?",
                loginCta: "Sign in",
            },
            reset: {
                title: "Reset password",
                subtitle: "Enter and confirm your new password below.",
                submit: "Update password",
                submitting: "Updating…",
                missingFields: "Please enter and confirm your new password.",
                passwordTooShort: "Password must contain at least 8 characters.",
                passwordMismatch: "Passwords do not match.",
                successMessage: "Your password was updated successfully. You can now log in.",
                sessionWarning: "We couldn't restore your session from the link. Request a new reset email and open the link again.",
            },
        },

        // Hero
        heroTitle: "Viral AI Video Generator for TikTok",
        heroSubtitle: "Create videos that generate millions of views and passive income. The most advanced AI turns your ideas into viral content in minutes — no technical skills required.",
        heroCta: "Claim my 45 free tokens !",
        heroSocialProof: {
            introText: "Already using Viralis Studio?",
            linkText: "Sign In",
            linkHref: "/auth",
            totalUsers: 2291,
            totalUsersOverride: "10,000+",
            totalLabel: "Happy customers",
            rating: 4.8,
            ratingLabel: "Average rating",
            avatars: [
                { name: "Alicia Green", src: "https://i.pravatar.cc/80?img=14" },
                { name: "Michael Torres", src: "https://i.pravatar.cc/80?img=39" },
                { name: "Priya Singh", src: "https://i.pravatar.cc/80?img=58" },
                { name: "Noah Johnson", src: "https://i.pravatar.cc/80?img=60" },
            ],
        },
        heroTrust1: "🔒 Secure payment",
        heroTrust2: "🤖 Latest generation AI",
        heroTrust3: "⚡ Fast results",

        // Features
        featuresTitle: "Main Features",
        features: [
            {
                icon: "🎨",
                title: "Varied Video Styles",
                description: "Create videos in any style: storytelling, lifestyle, podcast, cinema, or advertising.",
            },
            {
                icon: "⚡",
                title: "Ultra-Fast Generation",
                description: "Go from your idea to the final render in minutes thanks to our Viralis Engine AI.",
            },
            {
                icon: "💰",
                title: "Optimized for Monetization",
                description: "Create long and engaging videos to unlock TikTok monetization and increase your revenue.",
            },
            {
                icon: "🤖",
                title: "Advanced Customization",
                description: "Control the duration, transitions, music, and tone — let Viralis Studio do the rest.",
            },
        ],
        growthHighlightsTitle: "What Makes Viralis Different",
        growthHighlightsSubtitle: "Three strategic boosts that turn any idea into a polished, profitable video asset.",
        growthHighlights: [
            {
                icon: "🚀",
                title: "Instant Viral Hooks",
                description: "Every video starts with a tested hook that captures attention in under 3 seconds and boosts retention."
            },
            {
                icon: "🎯",
                title: "Smart Audience Sync",
                description: "Viralis adapts tone and topics to your niches (gaming, coaching, lifestyle) so each clip feels tailor-made."
            },
            {
                icon: "💰",
                title: "Monetization Ready",
                description: "Exports include optimized scripts, captions, and formats aligned with brand deals, affiliates, and product placements."
            }
        ],

        // Trust Section
        trustTitle: "🌍 Over 10,000 creators trust Viralis Studio",
        trustSubtitle: "Every day, content creators, entrepreneurs, artists, coaches, and businesses use Viralis Studio to produce high-performing videos and optimize their online presence.",
        trustAllows: "Viralis Studio allows for:",
        trustBenefits: [
            "More efficient content production",
            "Increased testing volume to identify what works",
            "Significant time savings on editing and assembly",
            "A focus on the idea and message, rather than the technique",
        ],
        trustJoin: "🔥 Join a growing community of creators who are innovating the way they produce digital content.",
        trustVignettes: [
            {
                icon: "🎥",
                title: "Simplified creation",
                description: "Focus on your ideas, not on the complex techniques of video editing.",
            },
            {
                icon: "🚀",
                title: "Faster publishing",
                description: "Speed up your publishing pace and stay relevant to your audience.",
            },
            {
                icon: "📈",
                title: "Better testing and iteration capacity",
                description: "Test more ideas and formats to find what resonates most with your audience.",
            },
        ],

        // Testimonials
        testimonialsTitle: "What our creators are saying",
        testimonialsSubtitle: "Over 10,000 users are already using Viralis Studio to boost their TikTok content.",

        // Demo
        demoTitle: "Inspiring Examples",
        demoSubtitle: "Discover videos generated with Viralis Studio that are killing it on social media.",
        demoViews: "🔥 20 Million views",

        // Prompt Examples
        promptExamplesTitle: "From Prompt to Viral Video",
        promptExamplesSubtitle: "See how Viralis Studio turns your ideas into trending content.",
        promptExamplesLabel: "Example prompt",
        promptUsed: "Prompt used",
        generatedIn: "Generated in",
        promptExamples: [
            {
                category: "🎤 Trending Interview",
                prompt: "A realistic scene of a car towing two giraffes on the highway while passing under a bridge — bright daylight, dynamic motion, humorous and cinematic composition.",
                generationTime: "1 minute",
                mediaKey: "giraffeInterview"
            },
            {
                category: "🐶 Satisfying Viral Effect",
                prompt: "Dog jumping in parachute with its owner above Bora Bora",
                generationTime: "1 minute",
                mediaKey: "chienVolant"
            }
        ],

        // Success Stories
        successStoriesTitle: "Success Stories : They Started, You Can Too",
        successStoriesSubtitle: "New creators are easily starting to earn money online by creating content with Viralis Studio. Discover their journeys and start yours.",
        successStoriesCta: "Start Creating Today",
        successStories: [
            {
                quote: "I never thought I could make money with my videos. Viralis Studio changed my life!",
                name: "Emma Johnson",
                amount: "First $100",
                description: "In just 2 weeks, Emma generated her first passive income. Her lifestyle videos quickly found their audience on TikTok.",
                avatar: "https://i.pravatar.cc/150?img=47"
            },
            {
                quote: "The speed of creation with Viralis is incredible. I multiplied my production by 10!",
                name: "Lucas Anderson",
                amount: "First $500",
                description: "In one month, Lucas went from 0 followers to over 50k. His educational business videos now generate regular income.",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            {
                quote: "Viralis Studio allowed me to turn my passion into a real business. I recommend it 100%!",
                name: "Sophie Williams",
                amount: "First $1,000",
                description: "In 3 months, Sophie created a profitable YouTube channel. Her fitness videos now generate monthly passive income.",
                avatar: "https://i.pravatar.cc/150?img=32"
            }
        ],

        // Pricing
        pricingTitle: "Simple and Transparent Pricing",
        pricingSubtitle: "Choose an affordable plan to create professional videos with our advanced AI technology.",
        pricingVat: "incl. VAT",
        pricingFooter: "Prices in USD, all taxes included (VAT). Tokens correspond to video generation credits.",
        pricingPlans: [
            {
                title: "Token Pack",
                price: "$9.99",
                priceSubtitle: "100 tokens to generate numerous videos",
                features: null,
                ctaText: "Buy Now",
                badge: null,
                href: "#"
            },
            {
                title: "Premium Token Pack",
                price: "$99.99",
                priceSubtitle: "1200 tokens — 20% more tokens",
                features: null,
                ctaText: "Buy Now",
                badge: "Best Value",
                badgeGradient: "bg-gradient-to-r from-sky-400 to-blue-500",
                href: "#"
            },
            {
                title: "Pro Monthly",
                price: "$19.99",
                priceSubtitle: "300 tokens per month + pro benefits",
                features: [
                    "300 tokens per month",
                    "Priority generation",
                    "Priority access to new features",
                    "Photo → Video Mode",
                    "Priority support",
                    "Watermark-free videos"
                ],
                ctaText: "Choose Pro Monthly",
                badge: null,
                href: "#"
            },
            {
                title: "Pro Annual",
                price: "$199.99",
                priceSubtitle: "300 tokens per month + 2 months free",
                features: [
                    "3600 tokens per year (300/month)",
                    "Priority generation",
                    "Priority access to new features",
                    "Photo → Video Mode",
                    "Priority support",
                    "2 months free",
                    "Watermark-free videos"
                ],
                ctaText: "Choose Pro Annual",
                badge: "Most Popular",
                badgeGradient: "bg-gradient-to-r from-orange-400 to-red-500",
                href: "#"
            }
        ],
        
        // FAQ
        faqTitle: "Frequently Asked Questions about Viralis Studio",
        faqSubtitle: "Have another question? Contact us on Discord or by email.",
        faqData: [
            {
                question: "What is Viralis Studio?",
                answer: "Viralis Studio is an advanced AI video generator that transforms text prompts into professional videos in minutes."
            },
            {
                question: "How does Viralis Studio work?",
                answer: "Enter a short text prompt, choose your style and settings, then generate. Our AI assembles visuals, pacing, and transitions to produce a ready-to-use clip."
            },
            {
                question: "What makes Viralis Studio different from other video generators?",
                answer: "Viralis Studio focuses on ease of use, high-quality outputs, and rapid iteration so creators can test more ideas, faster—without advanced editing skills."
            },
            {
                question: "What types of videos can I create?",
                answer: "Ads, social content, explainers, animations, product demos, storytelling clips, and more—Viralis Studio adapts to your creative needs."
            },
            {
                question: "What is the quality of generated videos?",
                answer: "Viralis Studio generates HD videos suitable for social media, presentations, and professional use."
            },
            {
                question: "How long does it take to generate a video?",
                answer: "Most videos are generated within a few minutes. More complex prompts or longer durations may take slightly longer."
            },
            {
                question: "Can I customize styles and durations?",
                answer: "Yes. You can adjust visual style, duration, transitions, and mood to fit your brand and platform."
            },
            {
                question: "Do I keep commercial rights to my videos?",
                answer: "Yes, subject to our Terms of Use and any applicable third-party assets you choose to include."
            }
        ],

        // Video Generator
        generatorTitle: "Go from Idea to Video",
        generatorSubtitle: "This is where the magic happens. Use our AI to generate your next viral video in seconds.",
        generatorSettingsTitle: "Generation Settings",
        generatorStyleLabel: "Video style",
        generatorStyleDescription: "Pick the recording device (body cam, CCTV, smartphone, dashcam…) so the AI sticks to that POV.",
        generatorStyleButton: "Choose a camera style",
        generatorStyleNone: "No style (let the AI decide)",
        generatorStyleModalTitle: "Camera style selection",
        generatorStyleModalSubtitle: "Select a realistic camera angle— the AI will enforce it inside the prompt.",
        generatorStyleCategories: [
            {
                id: "hyper_realism",
                title: "Hyper-real & cinematic",
                description: "For ultra-immersive, camera-grade realism.",
                options: [
                    { value: "hyper_real_cinematic", label: "Hyper-real cinematic", promptInstruction: "Use film-grade lighting, realistic depth of field and ultra-detailed photoreal textures." },
                    { value: "handheld_documentary", label: "Handheld documentary", promptInstruction: "Adopt a shoulder-mounted camera feel with subtle grain and modern documentary motion." },
                    { value: "police_body_cam", label: "Police body cam", promptInstruction: "Simulate a bodycam POV with wide angle lens, jittery movement and a minimal HUD." },
                    { value: "nat_geo_doc", label: "National Geographic wildlife", promptInstruction: "Deliver a premium documentary tone with natural light and nature or wildlife cinematography." },
                    { value: "premium_phone_vlog", label: "Premium smartphone vlog", promptInstruction: "Imitate a high-end smartphone shoot with stabilization, realistic reflections and lifestyle framing." }
                ]
            },
            {
                id: "japanese_animation",
                title: "Japanese animation",
                description: "Signature looks from legendary Japanese studios.",
                options: [
                    { value: "studio_ghibli", label: "Studio Ghibli warmth", promptInstruction: "Build a cozy world with lush nature, soft animation and poetic lighting inspired by Ghibli." },
                    { value: "shonen_anime", label: "Shōnen anime action", promptInstruction: "Craft a high-energy anime style with speed lines, dynamic poses and bold contrast." },
                    { value: "cyberpunk_anime", label: "Neon cyberpunk anime", promptInstruction: "Compose a neon-drenched futuristic city with stylized silhouettes and night ambience." },
                    { value: "pastel_romance_anime", label: "Pastel romance anime", promptInstruction: "Use a pastel palette, soft lighting and expressive close-ups full of emotion." },
                    { value: "mecha_epic_anime", label: "Epic mecha anime", promptInstruction: "Stage giant robots with dramatic angles, intense scale and stylized explosions." }
                ]
            },
            {
                id: "western_animation",
                title: "Western animation",
                description: "Beloved aesthetics from iconic Western shows.",
                options: [
                    { value: "pixar_family", label: "Pixar family adventure", promptInstruction: "Create a bright 3D render with heartfelt emotions, clean textures and colorful lighting." },
                    { value: "disney_fairytale", label: "Disney fairy tale", promptInstruction: "Deliver a sparkling fairy-tale world with fluid animation and magical highlights." },
                    { value: "dreamworks_comedy", label: "DreamWorks adventure comedy", promptInstruction: "Blend humor and action with exaggerated expressions and stylized 3D shading." },
                    { value: "simpsons_style", label: "The Simpsons style", promptInstruction: "Adopt a flat cartoon look, yellow palette and satirical Springfield vibe." },
                    { value: "family_guy_style", label: "Family Guy satire", promptInstruction: "Recreate an adult cartoon look with bold outlines, deadpan humor and static framing." },
                    { value: "cartoon_network", label: "Bold Cartoon Network", promptInstruction: "Deliver punchy cartoon energy with saturated colors, geometric shapes and fast timing." }
                ]
            },
            {
                id: "artistic_illustration",
                title: "Art & illustration",
                description: "Turn your video into a living artwork.",
                options: [
                    { value: "watercolor_motion", label: "Watercolor motion art", promptInstruction: "Simulate fluid watercolor strokes with visible brush textures and liquid transitions." },
                    { value: "oil_painting", label: "Oil painting come to life", promptInstruction: "Animate a painterly canvas with thick brushwork, dramatic lighting and rich pigments." },
                    { value: "euro_comic", label: "European graphic novel", promptInstruction: "Use a Franco-Belgian comic style with clean line art and bold color blocking." },
                    { value: "pop_art", label: "Vibrant pop art", promptInstruction: "Apply saturated pop art panels, halftone textures and impactful graphic compositions." },
                    { value: "marvel_comic", label: "Marvel comic style", promptInstruction: "Channel heroic comic-book energy with dynamic inking and dramatic color grading." }
                ]
            },
            {
                id: "experimental_retro",
                title: "Experimental & retro",
                description: "Unique treatments that instantly stand out.",
                options: [
                    { value: "glitch_retro_future", label: "Glitchy retro-futuristic", promptInstruction: "Add digital glitches, chromatic aberration and a synthwave retro-future vibe." },
                    { value: "vhs_90s", label: "90s VHS nostalgia", promptInstruction: "Apply VHS tape artifacts with video noise, timestamps and vintage tracking lines." },
                    { value: "grainy_bw", label: "Grainy black & white", promptInstruction: "Shoot in dramatic black and white with strong contrast and analog grain." },
                    { value: "holographic_3d", label: "3D holographic", promptInstruction: "Create translucent holograms with prismatic reflections and laser beams." },
                    { value: "dreamlike_surreal", label: "Dreamlike surrealism", promptInstruction: "Compose a surreal atmosphere with fluid transitions and floating poetic symbols." }
                ]
            },
            {
                id: "minimalist_modern",
                title: "Minimalist & Modern",
                description: "Clean, contemporary design for strong visual impact.",
                options: [
                    { value: "minimal_clean", label: "Clean minimalism", promptInstruction: "Use a clean design with sharp lines, white space and balanced composition." },
                    { value: "brutalist_design", label: "Brutalist graphic", promptInstruction: "Adopt a brutalist style with geometric shapes, strong contrast and bold typography." },
                    { value: "neomorphism", label: "Soft neomorphism", promptInstruction: "Create a neomorphic look with soft shadows, subtle reliefs and pastel palette." },
                    { value: "glassmorphism", label: "Glassmorphism", promptInstruction: "Use a frosted glass effect, transparency, blur and glowing borders." },
                    { value: "flat_design", label: "Modern flat design", promptInstruction: "Compose with flat colors, stylized icons and clear visual hierarchy." }
                ]
            },
            {
                id: "cinematic_genres",
                title: "Cinematic Genres",
                description: "Directing styles inspired by major film genres.",
                options: [
                    { value: "noir_film", label: "Classic film noir", promptInstruction: "Adopt a film noir style with chinese shadows, dramatic contrasts and voice-over narration." },
                    { value: "western_cinematic", label: "Cinematic western", promptInstruction: "Create a western atmosphere with desert landscapes, golden light and dramatic tension." },
                    { value: "neo_noir", label: "Modern neo-noir", promptInstruction: "Blend film noir aesthetics with modern elements, neon lights and non-linear narration." },
                    { value: "found_footage", label: "Authentic found footage", promptInstruction: "Simulate found footage with shaky camera, grain and realistic amateur aesthetic." },
                    { value: "one_shot", label: "Immersive one-shot", promptInstruction: "Create a fluid one-shot with continuous camera movement and natural transitions." }
                ]
            },
            {
                id: "social_media_styles",
                title: "Social Media Styles",
                description: "Aesthetics optimized for TikTok, Instagram and YouTube.",
                options: [
                    { value: "tiktok_trendy", label: "Trendy TikTok", promptInstruction: "Use fast transitions, zoom effects, animated text and catchy rhythm typical of TikTok." },
                    { value: "instagram_aesthetic", label: "Instagram aesthetic", promptInstruction: "Create an Instagram aesthetic with consistent filters, square composition and harmonious palette." },
                    { value: "youtube_thumbnail", label: "Viral YouTube style", promptInstruction: "Compose with expressive faces, impactful text and saturated colors for thumbnails." },
                    { value: "reels_dynamic", label: "Dynamic Reels", promptInstruction: "Adopt a fast pace, punchy cuts and eye-catching visuals for Instagram Reels." },
                    { value: "shorts_vertical", label: "Optimized vertical Shorts", promptInstruction: "Optimize for vertical format with centered action, readable text and sustained rhythm." }
                ]
            }
        ],
        generatorThemeLabel: "Video theme",
        generatorThemeDescription: "Fine-tune the overall mood to guide the AI and keep the result on brand.",
        generatorThemeOptions: [
            { value: "none", label: "None (stick to the user prompt)" },
            { value: "horror", label: "Cinematic horror", color: "#FE4A49", promptInstruction: "Create a chilling, suspenseful atmosphere with dramatic pacing fit for viral thrillers." },
            { value: "joyful", label: "Joyful energy", color: "#FFD166", promptInstruction: "Deliver a bright, positive, high-energy vibe that instantly hooks the audience." },
            { value: "fantasy", label: "Immersive fantasy", color: "#9C6BFF", promptInstruction: "Build a magical or futuristic world packed with spectacular visual details." },
            { value: "business", label: "Business / startup", color: "#3DFF8C", promptInstruction: "Craft a credible, inspiring tone suitable for product showcases and viral pitches." },
            { value: "epic", label: "Epic cinematic", color: "#23A6F0", promptInstruction: "Set an heroic, intense mood with dramatic shots and a legendary narrative arc." },
            { value: "romance", label: "Warm romance", color: "#FF8FA3", promptInstruction: "Highlight genuine emotions, soft lighting, and heartfelt storytelling that resonates instantly." },
            { value: "documentary", label: "Impactful documentary", color: "#8D99AE", promptInstruction: "Adopt an informative, credible tone with key facts, immersive narration, and visual proofs." },
            { value: "sports", label: "High-energy sports", color: "#00B2A9", promptInstruction: "Inject intense motion, hype moments, slow-motion highlights, and victorious shouts." },
            { value: "cyberpunk", label: "Neon cyberpunk", color: "#7A00FF", promptInstruction: "Dive into a futuristic neon city with bold contrasts, electronic beats, and rebel attitude." },
            { value: "mystery", label: "Enigmatic mystery", color: "#264653", promptInstruction: "Craft an intriguing, late-night vibe with clues, suspense, and viral twists." },
            { value: "adventure", label: "Explosive adventure", color: "#F6AE2D", promptInstruction: "Build a high-paced narrative with sweeping landscapes, heroic transitions, and inspiring tone." },
            { value: "retro", label: "Retro nostalgia", color: "#FF6F91", promptInstruction: "Use vintage styling, grain filters, analogue transitions, and a playful mixtape vibe." },
            { value: "luxury", label: "Luxury elegance", color: "#D4AF37", promptInstruction: "Showcase premium aesthetics with refined lighting, slow motion glamour, and upscale framing." },
            { value: "education", label: "Educational clarity", color: "#3A86FF", promptInstruction: "Structure concise teaching points with supporting visuals, clean typography, and a reassuring tone." },
            { value: "wellness", label: "Wellness calm", color: "#80ED99", promptInstruction: "Express a zen feeling with serene visuals, soft narration, and mindful pacing." },
            { value: "nature", label: "Immersive nature", color: "#52B788", promptInstruction: "Highlight raw beauty of landscapes, natural sounds, and contemplative slow pans." },
            { value: "sciFi", label: "Science fiction", color: "#7209B7", promptInstruction: "Imagine a futuristic world with advanced tech, neon glows, and cinematic tension." },
            { value: "urban", label: "Urban street", color: "#4361EE", promptInstruction: "Capture street energy with handheld motion, graffiti art, and bold transitions." },
            { value: "holiday", label: "Festive mood", color: "#FF9F1C", promptInstruction: "Deliver celebratory vibes with lively music, bright decor, and joyful storytelling." },
            { value: "kids", label: "Kids fun", color: "#F4A261", promptInstruction: "Adopt colorful, playful narration with friendly characters and positive humor." },
            { value: "gaming", label: "Gaming e-sport", color: "#5A00FF", promptInstruction: "Highlight fast gameplay, glitch effects, energetic shoutcasters, and epic wins." },
            { value: "fashion", label: "Fashion forward", color: "#FF5D8F", promptInstruction: "Create runway-inspired visuals with textured close-ups, trendy beats, and bold typography." },
            { value: "news", label: "Punchy news", color: "#1E90FF", promptInstruction: "Adopt a newsroom pace with breaking headlines, lower-thirds, and authoritative voice." },
            { value: "comedy", label: "Hilarious comedy", color: "#FFB800", promptInstruction: "Create a comedic atmosphere with perfect timing, visual gags and absurd viral humor." },
            { value: "drama", label: "Emotional drama", color: "#6C5CE7", promptInstruction: "Stage intense emotions, narrative tension and poignant moments." },
            { value: "thriller", label: "Gripping thriller", color: "#2D3436", promptInstruction: "Build gripping suspense with tense rhythm, revelations and rising tension." },
            { value: "action", label: "Explosive action", color: "#E17055", promptInstruction: "Compose dynamic action scenes, fast movements and spectacular effects." },
            { value: "travel", label: "Inspiring travel", color: "#00B894", promptInstruction: "Capture the spirit of travel with stunning landscapes, discoveries and adventure." },
            { value: "food", label: "Appetizing gastronomy", color: "#FDCB6E", promptInstruction: "Showcase food with appetizing close-ups, textures and vibrant colors." },
            { value: "tech", label: "Futuristic technology", color: "#0984E3", promptInstruction: "Present tech innovations with high-tech visuals, interfaces and modern aesthetic." },
            { value: "fitness", label: "Motivating fitness", color: "#E84393", promptInstruction: "Create fitness energy with dynamic movements, motivation and transformation." },
            { value: "beauty", label: "Refined beauty", color: "#FD79A8", promptInstruction: "Highlight beauty with soft lighting, skin textures and premium aesthetic." },
            { value: "music_video", label: "Music video", color: "#A29BFE", promptInstruction: "Compose a music video with musical rhythm, synchronized transitions and artistic aesthetic." }
        ],
        generatorMusicLabel: "Music vibe",
        generatorMusicDescription: "Pick a soundscape so the AI suggests the perfect audio energy.",
        generatorMusicOptions: [
            { value: "none", label: "No music (prompt only)" },
            { value: "cinematic", label: "Epic cinematic", color: "#5D3FD3", promptInstruction: "Orchestral score with powerful drums, brass hits and dramatic crescendos." },
            { value: "synthwave", label: "Futuristic synthwave", color: "#A855F7", promptInstruction: "Retro synth leads, heavy basslines and 80s-style electronic pulse." },
            { value: "lofi", label: "Lo-fi chill", color: "#64DFDF", promptInstruction: "Soft beats, vinyl crackle and relaxed groove for study/relax moods." },
            { value: "trap", label: "High-energy trap", color: "#F72585", promptInstruction: "Punchy 808s, fast hi-hats and hype drops that boost adrenaline." },
            { value: "acoustic", label: "Warm acoustic", color: "#F4A261", promptInstruction: "Gentle guitar, light piano and subtle percussion for human warmth." },
            { value: "orchestral", label: "Emotional orchestral", color: "#E9C46A", promptInstruction: "Lush strings, dynamic crescendos and heartfelt piano textures." },
            { value: "rock", label: "Dynamic rock", color: "#E63946", promptInstruction: "Distorted guitars, energetic drums and bold riffs for intensity." },
            { value: "house", label: "House / club", color: "#3A0CA3", promptInstruction: "120 BPM groove, bright synths and progressive build-ups for dancefloor vibes." },
            { value: "afrobeat", label: "Vibrant afrobeat", color: "#FFBE0B", promptInstruction: "Organic percussion, brass flourishes and lively groove for infectious energy." },
            { value: "pop", label: "Pop motivator", color: "#FF6F91", promptInstruction: "Catchy melodies, claps and euphoric drops perfect for mainstream audiences." },
            { value: "ambient", label: "Atmospheric ambient", color: "#00BBF9", promptInstruction: "Airy pads, evolving textures and minimal beat for deep immersion." },
            { value: "drill", label: "Modern drill", color: "#7209B7", promptInstruction: "Sub-heavy bass, syncopated snares and gritty tone for urban tension." },
            { value: "jazz", label: "Sophisticated jazz", color: "#D4A574", promptInstruction: "Integrate jazz harmonies, soft saxophone and elegant swing rhythm." },
            { value: "reggaeton", label: "Catchy reggaeton", color: "#FF6B9D", promptInstruction: "Use reggaeton beats, dembow and festive Latin energy." },
            { value: "country", label: "Authentic country", color: "#C9A961", promptInstruction: "Add country guitars, harmonica and American road trip vibe." },
            { value: "reggae", label: "Relaxing reggae", color: "#2ECC71", promptInstruction: "Integrate a reggae groove, round bass and tropical island atmosphere." },
            { value: "classical", label: "Elegant classical", color: "#E8D5B7", promptInstruction: "Use classical compositions, symphonic orchestra and timeless emotions." },
            { value: "edm", label: "Energetic EDM", color: "#9B59B6", promptInstruction: "Create an EDM build-up, powerful drop and electro festival energy." },
            { value: "hiphop", label: "Urban hip-hop", color: "#34495E", promptInstruction: "Integrate hip-hop beats, rhythmic flow and authentic street vibe." },
            { value: "indie", label: "Alternative indie", color: "#E67E22", promptInstruction: "Use indie guitars, melancholic melodies and alternative atmosphere." },
            { value: "techno", label: "Industrial techno", color: "#1ABC9C", promptInstruction: "Create a repetitive techno rhythm, deep bass and underground club atmosphere." },
            { value: "folk", label: "Acoustic folk", color: "#95A5A6", promptInstruction: "Integrate folk instruments, banjo and poetic narration." }
        ],
        enhancingPromptMessage: "Polishing your prompt with ChatGPT...",
        promptPlaceholder: "e.g., A golden retriever DJing at a futuristic space party...",
        uploadImageLabel: "Upload an Image (Optional)",
        aspectRatioLabel: "Aspect Ratio",
        qualityLabel: "Quality",
        thinkingModeLabel: "Thinking Mode",
        thinkingModeDescription: "Use AI to generate a script first.",
        generateScriptButton: "Generate Script",
        generateVideoButton: "Generate Video",
        tokens: "Tokens",
        outputTitle: "Your Masterpiece Awaits",
        outputSubtitle: "The generated video will appear here.",
        watermarkWarning: "Watermark included — Upgrade to Pro to remove it",
        upgradeToPro: "Upgrade to Pro",
        downloadVideo: "Download Video",
        downloadWorking: "Downloading...",
        downloadPreparing: "Preparing download…",
        downloadLoadingWatermark: "Downloading…",
        downloadCompositing: "Downloading…",
        downloadFinalizing: "Finalizing…",
        downloadError: "Unable to download the video. Please try again.",
        // Errors
        errorPromptOrImage: "Please provide a prompt or an image.",
        errorTokensThinking: "Not enough tokens for Thinking Mode.",
        errorScriptGeneration: "Script generation failed.",
        errorTokensVideo: "Not enough tokens to generate a video.",
        errorRetrieveVideo: "Could not retrieve the generated video.",
        errorInvalidApiKey: "The API key is invalid. Please select a valid key.",
        errorUnknown: "An unknown error occurred during video generation.",
        // Other
        loadingCreative: "Activating creative circuits...",
        generatedScriptIdea: "Generated script idea",
        loadingMessages: [
            "Warming up the cameras...",
            "Brainstorming viral ideas...",
            "Directing the scene...",
            "Adding special effects...",
            "Applying the final touches...",
            "Rendering the final cut...",
            "Uploading to the cloud...",
            "This is taking a bit longer than usual, but the result will be worth it...",
        ],
        
        // Contact Section
        contactTitle: "Contact Us",
        contactSubtitle: "Need help or want to collaborate? Send us a message.",
        contactFormName: "Name",
        contactFormEmail: "Email",
        contactFormMessage: "Message",
        contactFormSubmit: "Send Message",
        contactSubmitting: "Sending...",
        contactSuccess: "Message sent successfully!",

        // Footer
        footerDescription: "Turn your ideas into viral and monetizable videos with Viralis Studio.",
        footerLinks: {
            Resources: ["Help Center", "API Documentation", "Community"],
            Legal: ["Terms of Service", "Privacy Policy"]
        },
        footerCopyright: "© 2025 Viralis Studio. All rights reserved.",
    },
    es: {
        // Header
        nav_generator: "Generador IA",
        nav_pricing: "Precios",
        nav_faq: "FAQ",
        nav_blog: "Blog",
        login: "Iniciar sesión",

        auth: {
            common: {
                emailLabel: "Email",
                passwordLabel: "Contraseña",
                confirmPasswordLabel: "Confirmar contraseña",
                emailPlaceholder: "tu@email.com",
                passwordPlaceholder: "••••••••",
                confirmPasswordPlaceholder: "••••••••",
                backHome: "← Volver al inicio",
                backToLogin: "← Volver al login",
                genericError: "Ocurrió un error. Inténtalo de nuevo.",
            },
            login: {
                title: "Iniciar sesión",
                subtitle: "Conéctate con tu email para generar videos, seguir tus tokens y acceder a tu historial.",
                submit: "Iniciar sesión",
                submitting: "Conectando…",
                missingFields: "Ingresa tu email y contraseña.",
                magicLinkCta: "Recibir un enlace mágico",
                magicLinkSending: "Enviando enlace…",
                magicLinkSuccess: "¡Enlace enviado! Revisa tu bandeja para abrir el panel.",
                registerPrompt: "¿Aún no tienes cuenta?",
                registerCta: "Crear una cuenta",
                forgotCta: "¿Olvidaste tu contraseña?",
                forgotSending: "Enviando enlace…",
                forgotSuccess: "Te enviamos un correo para restablecer tu contraseña. Ábrelo para continuar.",
                forgotMissingEmail: "Ingresa tu email para recibir el enlace de restablecimiento.",
            },
            register: {
                title: "Crear una cuenta",
                subtitle: "Únete a Viralis Studio para generar videos con IA y seguir tus tokens.",
                submit: "Crear mi cuenta",
                submitting: "Creando cuenta…",
                missingFields: "Completa todos los campos.",
                passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
                passwordMismatch: "Las contraseñas no coinciden.",
                successMessage: "Cuenta creada. Revisa tu correo para confirmar tu email.",
                hasAccountPrompt: "¿Ya tienes cuenta?",
                loginCta: "Iniciar sesión",
            },
            reset: {
                title: "Restablecer contraseña",
                subtitle: "Ingresa y confirma tu nueva contraseña.",
                submit: "Actualizar contraseña",
                submitting: "Actualizando…",
                missingFields: "Ingresa y confirma tu nueva contraseña.",
                passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
                passwordMismatch: "Las contraseñas no coinciden.",
                successMessage: "¡Tu contraseña fue actualizada! Ahora puedes iniciar sesión.",
                sessionWarning: "No pudimos recuperar tu sesión desde el enlace. Solicita un nuevo email y ábrelo de nuevo.",
            },
        },

        // Hero
        heroTitle: "Generador de Videos Virales con IA para TikTok",
        heroSubtitle: "Crea videos que generan millones de vistas e ingresos pasivos. La IA más avanzada convierte tus ideas en contenido viral en minutos — sin habilidades técnicas.",
        heroCta: "¡Reclamar mis 45 tokens gratis !",
        heroSocialProof: {
            introText: "¿Ya usas Viralis Studio?",
            linkText: "Iniciar sesión",
            linkHref: "/auth",
            totalUsers: 2291,
            totalUsersOverride: "10,000+",
            totalLabel: "Clientes felices",
            rating: 4.8,
            ratingLabel: "Valoración media",
            avatars: [
                { name: "Lucía Gómez", src: "https://i.pravatar.cc/80?img=18" },
                { name: "Thiago Rivas", src: "https://i.pravatar.cc/80?img=45" },
                { name: "Camila Flores", src: "https://i.pravatar.cc/80?img=52" },
                { name: "Mateo Silva", src: "https://i.pravatar.cc/80?img=63" },
            ],
        },
        heroTrust1: "🔒 Pago seguro",
        heroTrust2: "🤖 IA de última generación",
        heroTrust3: "⚡ Resultados rápidos",

        // Features
        featuresTitle: "Características Principales",
        features: [
            {
                icon: "🎨",
                title: "Estilos de Video Variados",
                description: "Crea videos en cualquier estilo: storytelling, lifestyle, podcast, cine o publicidad.",
            },
            {
                icon: "⚡",
                title: "Generación Ultra Rápida",
                description: "Pasa de tu idea al render final en minutos gracias a nuestro motor de IA Viralis Engine.",
            },
            {
                icon: "💰",
                title: "Optimizado para Monetización",
                description: "Crea videos largos y atractivos para desbloquear la monetización de TikTok y aumentar tus ingresos.",
            },
            {
                icon: "🤖",
                title: "Personalización Avanzada",
                description: "Controla la duración, las transiciones, la música y el tono — deja que Viralis Studio haga el resto.",
            },
        ],
        growthHighlightsTitle: "Por qué Viralis marca la diferencia",
        growthHighlightsSubtitle: "Tres impulsos estratégicos que convierten cualquier idea en un video pulido y listo para monetizar.",
        growthHighlights: [
            {
                icon: "🚀",
                title: "Ganchos virales inmediatos",
                description: "Cada video arranca con ganchos probados que capturan la atención en menos de 3 segundos y elevan la retención."
            },
            {
                icon: "🎯",
                title: "Sincronía con tu audiencia",
                description: "Viralis ajusta tono y temáticas a tus nichos (gaming, coaching, lifestyle) para que cada clip parezca hecho a medida."
            },
            {
                icon: "💰",
                title: "Listo para monetizar",
                description: "Exportaciones con guiones, subtítulos y formatos optimizados para patrocinios, afiliados y campañas de productos."
            }
        ],

        // Trust Section
        trustTitle: "🌍 Más de 10,000 creadores confían en Viralis Studio",
        trustSubtitle: "Cada día, creadores de contenido, emprendedores, artistas, coaches y empresas usan Viralis Studio para producir videos de alto rendimiento y optimizar su presencia en línea.",
        trustAllows: "Viralis Studio permite:",
        trustBenefits: [
            "Una producción de contenido más eficiente",
            "Un mayor volumen de pruebas para identificar lo que funciona",
            "Un ahorro de tiempo significativo en edición y montaje",
            "Un enfoque en la idea y el mensaje, en lugar de la técnica",
        ],
        trustJoin: "🔥 Únete a una comunidad creciente de creadores que están innovando en la forma de producir contenido digital.",
        trustVignettes: [
            {
                icon: "🎥",
                title: "Creación simplificada",
                description: "Concéntrate en tus ideas, no en las complejas técnicas de edición de video.",
            },
            {
                icon: "🚀",
                title: "Publicación más rápida",
                description: "Acelera tu ritmo de publicación y mantente relevante para tu audiencia.",
            },
            {
                icon: "📈",
                title: "Mejor capacidad de prueba e iteración",
                description: "Prueba más ideas y formatos para encontrar lo que más resuena con tu público.",
            },
        ],

        // Testimonials
        testimonialsTitle: "Lo que dicen nuestros creadores",
        testimonialsSubtitle: "Más de 10,000 usuarios ya están usando Viralis Studio para potenciar su contenido de TikTok.",

        // Demo
        demoTitle: "Ejemplos Inspiradores",
        demoSubtitle: "Descubre videos generados con Viralis Studio que están triunfando en las redes sociales.",
        demoViews: "🔥 20 Millones de vistas",

        // Prompt Examples
        promptExamplesTitle: "Del Prompt al Video Viral",
        promptExamplesSubtitle: "Mira cómo Viralis Studio convierte tus ideas en contenido de tendencia.",
        promptExamplesLabel: "Prompt de ejemplo",
        promptUsed: "Prompt utilizado",
        generatedIn: "Generado en",
        promptExamples: [
            {
                category: "🎤 Entrevista de Tendencia",
                prompt: "A realistic scene of a car towing two giraffes on the highway while passing under a bridge — bright daylight, dynamic motion, humorous and cinematic composition.",
                generationTime: "1 minuto",
                mediaKey: "giraffeInterview"
            },
            {
                category: "🐶 Efecto Viral Satisfactorio",
                prompt: "Perro saltando en paracaídas con su dueño sobre Bora Bora",
                generationTime: "1 minuto",
                mediaKey: "chienVolant"
            }
        ],

        // Success Stories
        successStoriesTitle: "Success Stories : They Started, You Can Too",
        successStoriesSubtitle: "Nuevos creadores están empezando fácilmente a ganar dinero en línea creando contenido con Viralis Studio. Descubre sus historias y comienza la tuya.",
        successStoriesCta: "Empieza a Crear Hoy",
        successStories: [
            {
                quote: "Nunca pensé que podría ganar dinero con mis videos. ¡Viralis Studio cambió mi vida!",
                name: "Emma Johnson",
                amount: "Primeros $100",
                description: "En solo 2 semanas, Emma generó sus primeros ingresos pasivos. Sus videos de lifestyle encontraron rápidamente su audiencia en TikTok.",
                avatar: "https://i.pravatar.cc/150?img=47"
            },
            {
                quote: "La velocidad de creación con Viralis es increíble. ¡Multipliqué mi producción por 10!",
                name: "Lucas Anderson",
                amount: "Primeros $500",
                description: "En un mes, Lucas pasó de 0 seguidores a más de 50k. Sus videos educativos sobre negocios ahora generan ingresos regulares.",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            {
                quote: "Viralis Studio me permitió transformar mi pasión en un negocio real. ¡Lo recomiendo al 100%!",
                name: "Sophie Williams",
                amount: "Primeros $1,000",
                description: "En 3 meses, Sophie creó un canal de YouTube rentable. Sus videos de fitness ahora generan ingresos pasivos mensuales.",
                avatar: "https://i.pravatar.cc/150?img=32"
            }
        ],

        // Pricing
        pricingTitle: "Precios Simples y Transparentes",
        pricingSubtitle: "Elige un plan asequible para crear videos profesionales con nuestra tecnología de IA avanzada.",
        pricingVat: "IVA incl.",
        pricingFooter: "Precios en USD, con todos los impuestos incluidos (IVA). Los tokens corresponden a créditos de generación de video.",
        pricingPlans: [
            {
                title: "Paquete de Tokens",
                price: "$9.99",
                priceSubtitle: "100 tokens para generar numerosos videos",
                features: null,
                ctaText: "Comprar Ahora",
                badge: null,
                href: "#"
            },
            {
                title: "Paquete de Tokens Premium",
                price: "$99.99",
                priceSubtitle: "1200 tokens — 20% más de tokens",
                features: null,
                ctaText: "Comprar Ahora",
                badge: "Mejor Valor",
                badgeGradient: "bg-gradient-to-r from-sky-400 to-blue-500",
                href: "#"
            },
            {
                title: "Pro Mensual",
                price: "$19.99",
                priceSubtitle: "300 tokens al mes + beneficios pro",
                features: [
                    "300 tokens al mes",
                    "Generación prioritaria",
                    "Acceso prioritario a nuevas funciones",
                    "Modo Foto → Video",
                    "Soporte prioritario",
                    "Videos sin marca de agua"
                ],
                ctaText: "Elegir Pro Mensual",
                badge: null,
                href: "#"
            },
            {
                title: "Pro Anual",
                price: "$199.99",
                priceSubtitle: "300 tokens al mes + 2 meses gratis",
                features: [
                    "3600 tokens al año (300/mes)",
                    "Generación prioritaria",
                    "Acceso prioritario a nuevas funciones",
                    "Modo Foto → Video",
                    "Soporte prioritario",
                    "2 meses gratis",
                    "Videos sin marca de agua"
                ],
                ctaText: "Elegir Pro Anual",
                badge: "Más Popular",
                badgeGradient: "bg-gradient-to-r from-orange-400 to-red-500",
                href: "#"
            }
        ],
        
        // FAQ
        faqTitle: "Preguntas Frecuentes sobre Viralis Studio",
        faqSubtitle: "¿Tienes otra pregunta? Contáctanos en Discord o por correo electrónico.",
        faqData: [
            {
                question: "¿Qué es Viralis Studio?",
                answer: "Viralis Studio es un generador de video con IA avanzado que transforma prompts de texto en videos profesionales en minutos."
            },
            {
                question: "¿Cómo funciona Viralis Studio?",
                answer: "Ingresa un prompt de texto corto, elige tu estilo y configuración, y luego genera. Nuestra IA ensambla los visuales, el ritmo y las transiciones para producir un clip listo para usar."
            },
            {
                question: "¿Qué diferencia a Viralis Studio de otros generadores de video?",
                answer: "Viralis Studio se enfoca en la facilidad de uso, resultados de alta calidad e iteración rápida para que los creadores puedan probar más ideas, más rápido, sin habilidades avanzadas de edición."
            },
            {
                question: "¿Qué tipos de videos puedo crear?",
                answer: "Anuncios, contenido para redes sociales, videos explicativos, animaciones, demostraciones de productos, clips narrativos y más. Viralis Studio se adapta a tus necesidades creativas."
            },
            {
                question: "¿Cuál es la calidad de los videos generados?",
                answer: "Viralis Studio genera videos en HD adecuados para redes sociales, presentaciones y uso profesional."
            },
            {
                question: "¿Cuánto tiempo se tarda en generar un video?",
                answer: "La mayoría de los videos se generan en pocos minutos. Los prompts más complejos o duraciones más largas pueden tardar un poco más."
            },
            {
                question: "¿Puedo personalizar los estilos y las duraciones?",
                answer: "Sí. Puedes ajustar el estilo visual, la duración, las transiciones y el ambiente para que se ajusten a tu marca y plataforma."
            },
            {
                question: "¿Conservo los derechos comerciales de mis videos?",
                answer: "Sí, sujeto a nuestros Términos de Uso y a cualquier activo de terceros que elijas incluir."
            }
        ],

        // Video Generator
        generatorTitle: "Pasa de la Idea al Video",
        generatorSubtitle: "Aquí es donde ocurre la magia. Usa nuestra IA para generar tu próximo video viral en segundos.",
        generatorSettingsTitle: "Ajustes de Generación",
        generatorStyleLabel: "Estilo del video",
        generatorStyleDescription: "Elige la cámara (bodycam, CCTV, smartphone, dashcam…) para que la IA mantenga exactamente ese punto de vista.",
        generatorStyleButton: "Elegir estilo de cámara",
        generatorStyleNone: "Sin estilo (dejar que la IA decida)",
        generatorStyleModalTitle: "Selección de estilo de cámara",
        generatorStyleModalSubtitle: "Selecciona un ángulo de cámara realista: la IA lo integrará directamente en el prompt.",
        generatorStyleCategories: [
            {
                id: "hyper_realism",
                title: "Hiperrealismo y cine",
                description: "Para un realismo inmersivo con acabado cinematográfico.",
                options: [
                    { value: "hyper_real_cinematic", label: "Cinematografía hiperrealista", promptInstruction: "Utilizar iluminación de cine, profundidad de campo realista y texturas fotorealistas ultra detalladas." },
                    { value: "handheld_documentary", label: "Documental cámara al hombro", promptInstruction: "Adoptar un movimiento tipo cámara al hombro con ligero grano y ritmo documental moderno." },
                    { value: "police_body_cam", label: "Bodycam policial", promptInstruction: "Simular un punto de vista bodycam con gran angular, movimientos bruscos y HUD minimalista." },
                    { value: "nat_geo_doc", label: "Documental estilo National Geographic", promptInstruction: "Transmitir un tono documental premium con luz natural y cinematografía de naturaleza o fauna." },
                    { value: "premium_phone_vlog", label: "Vlog premium con smartphone", promptInstruction: "Imitar una grabación móvil de alta gama con estabilización, reflejos realistas y encuadre lifestyle." }
                ]
            },
            {
                id: "japanese_animation",
                title: "Animación japonesa",
                description: "Inspiraciones de los grandes estudios de anime.",
                options: [
                    { value: "studio_ghibli", label: "Calidez estilo Studio Ghibli", promptInstruction: "Crear un mundo acogedor con naturaleza exuberante, animación suave y luz poética al estilo Ghibli." },
                    { value: "shonen_anime", label: "Acción anime shōnen", promptInstruction: "Diseñar un estilo anime energético con líneas de velocidad, poses dinámicas y contraste marcado." },
                    { value: "cyberpunk_anime", label: "Anime cyberpunk neón", promptInstruction: "Componer una ciudad futurista llena de neones, siluetas estilizadas y ambiente nocturno." },
                    { value: "pastel_romance_anime", label: "Anime romántico pastel", promptInstruction: "Usar paleta pastel, iluminación suave y primeros planos expresivos llenos de emoción." },
                    { value: "mecha_epic_anime", label: "Anime mecha épico", promptInstruction: "Protagonizar robots gigantes con ángulos dramáticos, gran escala y explosiones estilizadas." }
                ]
            },
            {
                id: "western_animation",
                title: "Animación occidental",
                description: "Estéticas queridas de las series icónicas occidentales.",
                options: [
                    { value: "pixar_family", label: "Aventura familiar Pixar", promptInstruction: "Crear un render 3D luminoso con emociones profundas, texturas pulidas y luz colorida." },
                    { value: "disney_fairytale", label: "Cuento de hadas Disney", promptInstruction: "Generar un mundo de fantasía brillante con animación fluida y detalles mágicos." },
                    { value: "dreamworks_comedy", label: "Comedia aventurera DreamWorks", promptInstruction: "Combinar humor y acción con expresiones exageradas y sombreado 3D estilizado." },
                    { value: "simpsons_style", label: "Estilo Los Simpson", promptInstruction: "Adoptar un look cartoon plano, paleta amarilla e ironía típica de Springfield." },
                    { value: "family_guy_style", label: "Estilo Padre de Familia", promptInstruction: "Recrear un cartoon adulto con contornos marcados, humor sarcástico y planos estáticos." },
                    { value: "cartoon_network", label: "Cartoon Network enérgico", promptInstruction: "Ofrecer energía cartoon con colores saturados, formas geométricas y ritmo veloz." }
                ]
            },
            {
                id: "artistic_illustration",
                title: "Arte e ilustración",
                description: "Convierte tu video en una obra ilustrada.",
                options: [
                    { value: "watercolor_motion", label: "Acuarela en movimiento", promptInstruction: "Simular pinceladas de acuarela con texturas visibles y transiciones fluidas tipo tinta." },
                    { value: "oil_painting", label: "Pintura al óleo viva", promptInstruction: "Animar un lienzo al óleo con materia gruesa, iluminación dramática y pigmentos ricos." },
                    { value: "euro_comic", label: "Novela gráfica europea", promptInstruction: "Usar un estilo cómic franco-belga con líneas limpias y bloques de color intensos." },
                    { value: "pop_art", label: "Pop art vibrante", promptInstruction: "Aplicar paneles pop art saturados, tramas de puntos y composiciones gráficas impactantes." },
                    { value: "marvel_comic", label: "Cómic estilo Marvel", promptInstruction: "Canalizar energía heroica de cómic con entintado dinámico y color dramático." }
                ]
            },
            {
                id: "experimental_retro",
                title: "Experimental y retro",
                description: "Tratamientos únicos para destacar al instante.",
                options: [
                    { value: "glitch_retro_future", label: "Retro-futurista glitch", promptInstruction: "Agregar glitches digitales, aberración cromática y vibra synthwave retro futurista." },
                    { value: "vhs_90s", label: "Nostalgia VHS 90s", promptInstruction: "Aplicar artefactos de cinta VHS con ruido, timestamps y líneas de tracking vintage." },
                    { value: "grainy_bw", label: "Blanco y negro granulado", promptInstruction: "Filmar en blanco y negro dramático con alto contraste y grano analógico." },
                    { value: "holographic_3d", label: "Holográfico 3D", promptInstruction: "Crear hologramas translúcidos con reflejos prismáticos y haces láser." },
                    { value: "dreamlike_surreal", label: "Sueño surrealista", promptInstruction: "Componer una atmósfera surreal con transiciones fluidas y símbolos poéticos flotando." }
                ]
            },
            {
                id: "minimalist_modern",
                title: "Minimalista y Moderno",
                description: "Diseño limpio y contemporáneo para un impacto visual fuerte.",
                options: [
                    { value: "minimal_clean", label: "Minimalismo limpio", promptInstruction: "Usar un diseño limpio, líneas nítidas, espacio blanco y composición equilibrada." },
                    { value: "brutalist_design", label: "Brutalismo gráfico", promptInstruction: "Adoptar un estilo brutalista con formas geométricas, contraste fuerte y tipografía bold." },
                    { value: "neomorphism", label: "Neomorfismo suave", promptInstruction: "Crear un look neomórfico con sombras suaves, relieves sutiles y paleta pastel." },
                    { value: "glassmorphism", label: "Glassmorfismo", promptInstruction: "Usar un efecto vidrio esmerilado, transparencia, desenfoque y bordes luminosos." },
                    { value: "flat_design", label: "Diseño plano moderno", promptInstruction: "Componer con colores planos, iconos estilizados y jerarquía visual clara." }
                ]
            },
            {
                id: "cinematic_genres",
                title: "Géneros Cinematográficos",
                description: "Estilos de dirección inspirados en los grandes géneros del cine.",
                options: [
                    { value: "noir_film", label: "Film noir clásico", promptInstruction: "Adoptar un estilo film noir con sombras chinescas, contrastes dramáticos y narración en voz en off." },
                    { value: "western_cinematic", label: "Western cinematográfico", promptInstruction: "Crear una atmósfera western con paisajes desérticos, luz dorada y tensión dramática." },
                    { value: "neo_noir", label: "Neo-noir moderno", promptInstruction: "Mezclar estética film noir con elementos modernos, neones y narración no lineal." },
                    { value: "found_footage", label: "Found footage auténtico", promptInstruction: "Simular un found footage con cámara temblorosa, grano y estética amateur realista." },
                    { value: "one_shot", label: "Plano-secuencia inmersivo", promptInstruction: "Crear un plano-secuencia fluido con movimiento de cámara continuo y transiciones naturales." }
                ]
            },
            {
                id: "social_media_styles",
                title: "Estilos Redes Sociales",
                description: "Estéticas optimizadas para TikTok, Instagram y YouTube.",
                options: [
                    { value: "tiktok_trendy", label: "TikTok tendencia", promptInstruction: "Usar transiciones rápidas, efectos zoom, textos animados y ritmo pegadizo típico de TikTok." },
                    { value: "instagram_aesthetic", label: "Aesthetic Instagram", promptInstruction: "Crear una estética Instagram con filtros coherentes, composición cuadrada y paleta armoniosa." },
                    { value: "youtube_thumbnail", label: "Estilo YouTube viral", promptInstruction: "Componer con caras expresivas, textos impactantes y colores saturados para miniaturas." },
                    { value: "reels_dynamic", label: "Reels dinámico", promptInstruction: "Adoptar un ritmo rápido, cortes contundentes y visuales llamativos para Instagram Reels." },
                    { value: "shorts_vertical", label: "Shorts vertical optimizado", promptInstruction: "Optimizar para formato vertical con acción centrada, textos legibles y ritmo sostenido." }
                ]
            }
        ],
        generatorThemeLabel: "Tema del video",
        generatorThemeDescription: "Ajusta la atmósfera general para guiar la IA y mantener la coherencia del resultado.",
        generatorThemeOptions: [
            { value: "none", label: "Ninguno (usar solo el prompt)" },
            { value: "horror", label: "Terror cinematográfico", color: "#FE4A49", promptInstruction: "Crear un universo inquietante y oscuro, con una tensión progresiva digna de un thriller viral." },
            { value: "joyful", label: "Energía alegre", color: "#FFD166", promptInstruction: "Transmitir una vibra luminosa, positiva y motivadora que atrape al público." },
            { value: "fantasy", label: "Fantástico inmersivo", color: "#9C6BFF", promptInstruction: "Desplegar un mundo mágico o futurista, lleno de detalles visuales espectaculares." },
            { value: "business", label: "Negocios/Startup", color: "#3DFF8C", promptInstruction: "Adoptar un tono creíble e inspirador, ideal para presentar productos o pitches virales." },
            { value: "epic", label: "Épico cinematográfico", color: "#23A6F0", promptInstruction: "Generar una tensión heroica con ritmo intenso, planos dramáticos y relato legendario." },
            { value: "romance", label: "Romance cálido", color: "#FF8FA3", promptInstruction: "Resaltar emociones sinceras, iluminación suave y una narrativa conmovedora que enamora." },
            { value: "documentary", label: "Documental impactante", color: "#8D99AE", promptInstruction: "Adoptar un tono informativo y creíble, con hechos clave y narración inmersiva." },
            { value: "sports", label: "Deporte explosivo", color: "#00B2A9", promptInstruction: "Inyectar energía intensa con tomas rápidas, ralentizaciones épicas y gritos de victoria." },
            { value: "cyberpunk", label: "Cyberpunk neón", color: "#7A00FF", promptInstruction: "Sumergir en una ciudad futurista llena de neones, contrastes audaces y actitud rebelde." },
            { value: "mystery", label: "Misterio enigmático", color: "#264653", promptInstruction: "Crear una atmósfera intrigante, nocturna, con pistas, suspense y giros virales." },
            { value: "adventure", label: "Aventura explosiva", color: "#F6AE2D", promptInstruction: "Construir un relato dinámico con paisajes grandiosos, ritmo heroico e inspiración constante." },
            { value: "retro", label: "Retro nostálgico", color: "#FF6F91", promptInstruction: "Usar estilo vintage con filtros analógicos, tipografías clásicas y ritmo de mixtape." },
            { value: "luxury", label: "Lujo elegante", color: "#D4AF37", promptInstruction: "Mostrar una estética premium, iluminación sofisticada, ralentí glamour y encuadres refinados." },
            { value: "education", label: "Educativo claro", color: "#3A86FF", promptInstruction: "Estructurar puntos clave con apoyo visual, tipografías limpias y tono didáctico." },
            { value: "wellness", label: "Bienestar zen", color: "#80ED99", promptInstruction: "Transmitir calma, naturaleza, respiración guiada y ritmo relajante." },
            { value: "nature", label: "Naturaleza inmersiva", color: "#52B788", promptInstruction: "Resaltar la belleza de los paisajes, sonidos orgánicos y tomas contemplativas." },
            { value: "sciFi", label: "Ciencia ficción", color: "#7209B7", promptInstruction: "Imaginar un futuro espectacular con tecnología avanzada y efectos neón." },
            { value: "urban", label: "Urbano street", color: "#4361EE", promptInstruction: "Capturar energía callejera con cámara en mano, grafitis y transiciones atrevidas." },
            { value: "holiday", label: "Ambiente festivo", color: "#FF9F1C", promptInstruction: "Crear sensación de celebración con música, decoración brillante y alegría colectiva." },
            { value: "kids", label: "Mundo infantil", color: "#F4A261", promptInstruction: "Usar colores vivos, personajes amigables y narrativa simpática." },
            { value: "gaming", label: "Gaming e-sport", color: "#5A00FF", promptInstruction: "Destacar jugadas intensas, efectos glitch y emoción competitiva." },
            { value: "fashion", label: "Moda vanguardista", color: "#FF5D8F", promptInstruction: "Componer visuales de pasarela, primeros planos de texturas y ritmo sofisticado." },
            { value: "news", label: "Noticias dinámicas", color: "#1E90FF", promptInstruction: "Adoptar ritmo periodístico, titulares impactantes y tono autoritario." },
            { value: "comedy", label: "Comedia hilarante", color: "#FFB800", promptInstruction: "Crear una atmósfera cómica con timing perfecto, gags visuales y humor absurdo viral." },
            { value: "drama", label: "Drama emocional", color: "#6C5CE7", promptInstruction: "Escenificar emociones intensas, tensión narrativa y momentos conmovedores." },
            { value: "thriller", label: "Thriller trepidante", color: "#2D3436", promptInstruction: "Construir un suspense trepidante con ritmo tenso, revelaciones y tensión creciente." },
            { value: "action", label: "Acción explosiva", color: "#E17055", promptInstruction: "Componer escenas de acción dinámicas, movimientos rápidos y efectos espectaculares." },
            { value: "travel", label: "Viaje inspirador", color: "#00B894", promptInstruction: "Capturar el espíritu del viaje con paisajes impresionantes, descubrimientos y aventura." },
            { value: "food", label: "Gastronomía apetitosa", color: "#FDCB6E", promptInstruction: "Destacar la comida con primeros planos apetitosos, texturas y colores vibrantes." },
            { value: "tech", label: "Tecnología futurista", color: "#0984E3", promptInstruction: "Presentar innovaciones tech con visuales high-tech, interfaces y estética moderna." },
            { value: "fitness", label: "Fitness motivador", color: "#E84393", promptInstruction: "Crear energía fitness con movimientos dinámicos, motivación y transformación." },
            { value: "beauty", label: "Belleza refinada", color: "#FD79A8", promptInstruction: "Destacar la belleza con iluminación suave, texturas de piel y estética premium." },
            { value: "music_video", label: "Videoclip musical", color: "#A29BFE", promptInstruction: "Componer un videoclip con ritmo musical, transiciones sincronizadas y estética artística." }
        ],
        generatorMusicLabel: "Ambiente musical",
        generatorMusicDescription: "Elige la banda sonora ideal para potenciar la emoción del video.",
        generatorMusicOptions: [
            { value: "none", label: "Sin música (solo prompt)" },
            { value: "cinematic", label: "Épico cinematográfico", color: "#5D3FD3", promptInstruction: "Partitura orquestal con percusiones potentes y crescendos dramáticos." },
            { value: "synthwave", label: "Synthwave futurista", color: "#A855F7", promptInstruction: "Sintetizadores retro, líneas de bajo marcadas y pulso electrónico ochentero." },
            { value: "lofi", label: "Lo-fi relajado", color: "#64DFDF", promptInstruction: "Beats suaves, ruido de vinilo y ambiente chill para un mood tranquilo." },
            { value: "trap", label: "Trap enérgico", color: "#F72585", promptInstruction: "808 contundentes, hi-hats veloces y drops que suben la adrenalina." },
            { value: "acoustic", label: "Acústico cálido", color: "#F4A261", promptInstruction: "Guitarra íntima, piano ligero y percusión discreta con un toque humano." },
            { value: "orchestral", label: "Orquestal emotivo", color: "#E9C46A", promptInstruction: "Cuerdas expresivas, piano emotivo y crescendos inspiradores." },
            { value: "rock", label: "Rock dinámico", color: "#E63946", promptInstruction: "Guitarras distorsionadas, batería potente y riffs impactantes." },
            { value: "house", label: "House bailable", color: "#3A0CA3", promptInstruction: "Ritmo 4/4, sintetizadores brillantes y build-ups para ambiente de club." },
            { value: "afrobeat", label: "Afrobeat vibrante", color: "#FFBE0B", promptInstruction: "Percusiones orgánicas, metales festivos y groove afro contagioso." },
            { value: "pop", label: "Pop motivador", color: "#FF6F91", promptInstruction: "Melodía pegadiza, palmas rítmicas y subida eufórica estilo mainstream." },
            { value: "ambient", label: "Ambient atmosférico", color: "#00BBF9", promptInstruction: "Capas etéreas, pads envolventes y ritmo minimalista para sumergir." },
            { value: "drill", label: "Drill moderno", color: "#7209B7", promptInstruction: "Subgraves intensos, síncopas urbanas y tensión contemporánea." },
            { value: "jazz", label: "Jazz sofisticado", color: "#D4A574", promptInstruction: "Integrar armonías jazz, saxofón suave y ritmo swing elegante." },
            { value: "reggaeton", label: "Reggaeton pegadizo", color: "#FF6B9D", promptInstruction: "Usar beats reggaeton, dembow y energía latina festiva." },
            { value: "country", label: "Country auténtico", color: "#C9A961", promptInstruction: "Agregar guitarras country, armónica y ambiente road trip americano." },
            { value: "reggae", label: "Reggae relajante", color: "#2ECC71", promptInstruction: "Integrar un groove reggae, bajo redondo y ambiente islas tropicales." },
            { value: "classical", label: "Clásico elegante", color: "#E8D5B7", promptInstruction: "Usar composiciones clásicas, orquesta sinfónica y emociones atemporales." },
            { value: "edm", label: "EDM enérgico", color: "#9B59B6", promptInstruction: "Crear una subida EDM, drop potente y energía festival electro." },
            { value: "hiphop", label: "Hip-hop urbano", color: "#34495E", promptInstruction: "Integrar beats hip-hop, flow rítmico y ambiente street auténtico." },
            { value: "indie", label: "Indie alternativo", color: "#E67E22", promptInstruction: "Usar guitarras indie, melodías melancólicas y atmósfera alternativa." },
            { value: "techno", label: "Techno industrial", color: "#1ABC9C", promptInstruction: "Crear un ritmo techno repetitivo, bajos profundos y ambiente club underground." },
            { value: "folk", label: "Folk acústico", color: "#95A5A6", promptInstruction: "Integrar instrumentos folk, banjo y narración poética." }
        ],
        enhancingPromptMessage: "Optimizando el prompt con ChatGPT...",
        promptPlaceholder: "ej: Un golden retriever de DJ en una fiesta espacial futurista...",
        uploadImageLabel: "Subir una Imagen (Opcional)",
        aspectRatioLabel: "Formato",
        qualityLabel: "Calidad",
        thinkingModeLabel: "Modo de Reflexión",
        thinkingModeDescription: "Usar IA para generar un guion primero.",
        generateScriptButton: "Generar Guion",
        generateVideoButton: "Generar Video",
        tokens: "Tokens",
        outputTitle: "Tu Obra Maestra te Espera",
        outputSubtitle: "El video generado aparecerá aquí.",
        watermarkWarning: "Marca de agua incluida — Actualiza a Pro para eliminarla",
        upgradeToPro: "Actualizar a Pro",
        downloadVideo: "Descargar Video",
        downloadWorking: "Descargando...",
        downloadPreparing: "Preparando la descarga…",
        downloadLoadingWatermark: "Descargando…",
        downloadCompositing: "Descargando…",
        downloadFinalizing: "Finalizando…",
        downloadError: "No se pudo descargar el video. Inténtalo de nuevo.",
        // Errors
        errorPromptOrImage: "Por favor, proporciona un prompt o una imagen.",
        errorTokensThinking: "No hay suficientes tokens para el Modo de Reflexión.",
        errorScriptGeneration: "Falló la generación del guion.",
        errorTokensVideo: "No hay suficientes tokens para generar un video.",
        errorRetrieveVideo: "No se pudo recuperar el video generado.",
        errorInvalidApiKey: "La clave de API no es válida. Por favor, selecciona una clave válida.",
        errorUnknown: "Ocurrió un error desconocido durante la generación del video.",
        // Other
        loadingCreative: "Activando circuitos creativos...",
        generatedScriptIdea: "Idea de guion generada",
        loadingMessages: [
            "Calentando las cámaras...",
            "Lluvia de ideas virales...",
            "Dirigiendo la escena...",
            "Añadiendo efectos especiales...",
            "Aplicando los toques finales...",
            "Renderizando el corte final...",
            "Subiendo a la nube...",
            "Esto está tardando un poco más de lo habitual, pero el resultado valdrá la pena...",
        ],
        
        // Contact Section
        contactTitle: "Contáctanos",
        contactSubtitle: "¿Necesitas ayuda o quieres colaborar? Envíanos un mensaje.",
        contactFormName: "Nombre",
        contactFormEmail: "Email",
        contactFormMessage: "Mensaje",
        contactFormSubmit: "Enviar Mensaje",
        contactSubmitting: "Enviando...",
        contactSuccess: "¡Mensaje enviado con éxito!",

        // Footer
        footerDescription: "Transforma tus ideas en videos virales y monetizables con Viralis Studio.",
        footerLinks: {
            Recursos: ["Centro de Ayuda", "Documentación de API", "Comunidad"],
            Legal: ["Términos de Servicio", "Política de Privacidad"]
        },
        footerCopyright: "© 2025 Viralis Studio. Todos los derechos reservados.",
    },
};
/**
 * Seeds English content into the local Payload instance.
 *
 * Run with:  npm run payload -- run scripts/seed.ts
 *
 * Idempotent: collections upsert by their unique key, globals are overwritten.
 * Everything is written as `_status: 'published'` so the website build fetch
 * (which filters `where[_status][equals]=published`) picks it up.
 *
 * Scope = the "clean field lift" content (per the Stage 3 plan mapping table):
 *   seoPages, faqs, webinars, blogCategories + the 3 globals.
 * The prose-conversion content (article bodies, legal bodies, marketingItems,
 * pages) is seeded within website PRs WS-3 / WS-6 / WS-7 where each slice is
 * verified against the prerendered output.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const TRAINERS = '100+' // PLATFORM_METRICS.TRAINERS, resolved for the interpolated strings

// --- helper: a minimal Lexical rich-text value wrapping plain paragraphs ------
const rt = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, text, version: 1 }],
    })),
  },
})

// --- SEO pages (SEOPageHead.tsx SEO_PAGES, 43 entries) ------------------------
type SeoSeed = { key: string; title: string; description: string; keywords: string; canonicalPath: string }
const stripOrigin = (u: string) => u.replace('https://trainzilla.in', '') || '/'

const SEO_PAGES: SeoSeed[] = [
  { key: 'agent', title: 'The AI Coaching Agent - Agentic Fitness Coaching OS | TrainZilla', description: 'Meet the coaching agent that actually does the work. Ask it and it builds and edits plans, swaps exercises, reschedules sessions, tracks habits, and messages your clients — every change preview-and-confirm gated, across web, iOS, Android and your clients’ app. The agentic fitness coaching OS.', keywords: 'AI coaching agent, agentic fitness coaching OS, AI personal trainer agent, AI fitness coaching software, AI workout plan agent, automated coaching software, AI agent for personal trainers, fitness coaching operating system, MCP fitness agent', canonicalPath: '/agent' },
  { key: 'home', title: 'TrainZilla — The Agentic Fitness Coaching OS | Personal Trainer Software', description: `The agentic fitness coaching OS. An AI agent builds and edits workout & nutrition plans, reschedules sessions, and messages your clients — every change you approve — across web, iOS and Android. Trusted by ${TRAINERS} coaches. Start free today!`, keywords: 'agentic fitness coaching OS, AI coaching agent, AI personal trainer agent, AI fitness coaching software, personal trainer software India, fitness coach app India, online fitness trainer platform, personal trainer software, gym management software, fitness management platform, trainer app, fitness software, client management fitness, online personal training', canonicalPath: '/' },
  { key: 'features', title: 'Features - AI Coaching Agent & Fitness Coaching OS | TrainZilla', description: 'One AI agent operates your whole coaching OS: build and edit workout & diet plans, swap exercises, reschedule sessions, track habits, and message clients — you approve every change. Plus client management, nutrition, scheduling, and business analytics.', keywords: 'workout plan app for trainers, client progress tracking fitness app, personal trainer scheduling software, fitness transformation tracking app, workout plan creator, fitness goal tracking, nutrition plan software, exercise library app, fitness assessment tools, workout scheduling app, fitness analytics dashboard, client management fitness, fitness scheduling software, personal trainer client management', canonicalPath: '/solutions' },
  { key: 'solutions', title: 'Solutions - Personal Trainer Software & Gym Management | TrainZilla', description: 'Comprehensive solutions for fitness professionals. Workout plan creator, client management, nutrition tracking, progress monitoring, UPI payment processing, and business analytics. Everything you need to grow your fitness business in India.', keywords: 'workout plan app for trainers, client progress tracking fitness app, personal trainer scheduling software, fitness transformation tracking app, workout plan creator, fitness goal tracking, nutrition plan software, exercise library app, fitness assessment tools, workout scheduling app, fitness analytics dashboard, client management fitness', canonicalPath: '/solutions' },
  { key: 'pricing', title: 'Pricing - Launch & Grow Your Coaching Business | TrainZilla', description: 'Choose how you want to launch with Trainzilla. Start free, upgrade to Coach Pro, or get set up for you. The AI agent is metered fairly — you pay for actions, not seats, charged only on success, with an allowance built into every plan. No hidden fees. Cancel anytime.', keywords: 'free personal trainer software India, fitness coach pricing, personal trainer subscription plans, assisted launch fitness software, gym management software pricing, free coach profile, online fitness trainer platform, fitness software pricing', canonicalPath: '/pricing' },
  { key: 'workoutPlans', title: 'Workout Plan Creator - Build Custom Exercise Programs | TrainZilla', description: 'Create personalized workout plans for your clients. Access 1000+ exercises with video guides, drag-and-drop planning, progress tracking, and automatic scheduling. Perfect for personal trainers and gym owners worldwide.', keywords: 'workout planning software, workout plan creator, exercise library app, workout scheduling app, workout app for trainers, organize workout plans, workout delivery platform, workout planning app for trainers', canonicalPath: '/workout-plans' },
  { key: 'dietPlans', title: 'Diet Plan Builder - Nutrition Software for Trainers | TrainZilla', description: 'Build comprehensive nutrition plans for clients worldwide. Extensive food database, calorie tracking, macro calculation, meal planning, and dietary preferences. Ideal for nutritionists and fitness coaches globally.', keywords: 'nutrition plan software, nutrition tracking app, nutrition coaching software, fitness coach software, nutrition planning, diet plan creator, meal planning software', canonicalPath: '/diet-plans' },
  { key: 'blog', title: 'Fitness Business Blog - Tips for Personal Trainers | TrainZilla', description: 'Expert advice for fitness professionals worldwide. Business growth strategies, client retention tips, workout planning guides, nutrition advice, and digital marketing for gyms and personal trainers.', keywords: 'how to manage fitness clients online, how to grow fitness coaching business online, how to get more clients as personal trainer India, how to start online personal training business, Razorpay fitness subscription, WhatsApp fitness client management, fitness business growth tools, digital marketing fitness, business growth strategies, fitness professional platform, fitness entrepreneur tools, training session management, fitness business management', canonicalPath: '/blog' },
  { key: 'help', title: 'Help Center - Support for Personal Trainers | TrainZilla', description: 'Complete support center for TrainZilla users. Getting started guides, tutorials, FAQs, troubleshooting, and expert support for personal trainers, gym owners, and fitness professionals in India.', keywords: 'fitness software support, personal trainer software help, gym management tutorials, fitness app guide, trainer software training, fitness platform support', canonicalPath: '/help-center' },
  { key: 'help-center', title: 'Help Center - Support for Personal Trainers | TrainZilla', description: 'Complete support center for TrainZilla users. Getting started guides, tutorials, FAQs, troubleshooting, and expert support for personal trainers, gym owners, and fitness professionals in India.', keywords: 'fitness software support, personal trainer software help, gym management tutorials, fitness app guide, trainer software training, fitness platform support', canonicalPath: '/help-center' },
  { key: 'register', title: `Start Free Trial - Join ${TRAINERS} Coaches | TrainZilla`, description: `Join ${TRAINERS} early adopter fitness coaches worldwide. Start your free trial today — no credit card required. Build your fitness business with the world’s leading trainer software platform.`, keywords: 'personal trainer software free trial, gym management software signup, fitness app registration, trainer platform join, fitness business software trial', canonicalPath: '/register' },
  { key: 'login', title: 'Login - Access Your Fitness Business Dashboard | TrainZilla', description: 'Access your TrainZilla trainer dashboard. Manage clients, create workout plans, track progress, and grow your fitness business. Secure login for fitness professionals worldwide.', keywords: 'trainer login, fitness software access, gym management login, personal trainer dashboard access, fitness platform signin', canonicalPath: '/login' },
  { key: 'training', title: 'Training & Webinars - Fitness Business Education | TrainZilla', description: 'Free training and webinars for fitness professionals globally. Learn business growth strategies, client management, digital marketing, and advanced fitness coaching techniques from industry experts.', keywords: 'fitness business training, personal training education, gym management webinars, fitness coaching certification, trainer business courses', canonicalPath: '/training' },
  { key: 'webinars', title: 'Free Webinars - Learn from Fitness Experts | TrainZilla', description: 'Join live webinars by fitness industry experts. Learn business strategies, client retention, nutrition planning, and technology integration. Free for all fitness professionals.', keywords: 'fitness webinars, personal trainer education, gym business training, fitness coaching webinars, trainer development programs', canonicalPath: '/webinars' },
  { key: 'contact', title: 'Contact TrainZilla - Global Fitness Professional Support', description: 'Get in touch with TrainZilla. We’re here to help fitness professionals succeed worldwide. Contact us for demos, support, partnerships, or any questions about our fitness software platform.', keywords: 'TrainZilla support, fitness software contact, personal trainer software help, gym management support, fitness platform contact', canonicalPath: '/contact' },
  { key: 'about', title: 'About TrainZilla - India’s Fitness Coach Platform', description: 'Learn about TrainZilla’s mission to empower fitness professionals across India. Our story, team, and commitment to helping personal trainers and gym owners succeed with innovative technology.', keywords: 'TrainZilla about, fitness platform India, personal trainer software company, gym management solutions, fitness technology India', canonicalPath: '/about-us' },
  { key: 'about-us', title: 'About TrainZilla - India’s Fitness Coach Platform', description: 'Learn about TrainZilla’s mission to empower fitness professionals across India. Our story, team, and commitment to helping personal trainers and gym owners succeed with innovative technology.', keywords: 'TrainZilla about, fitness platform India, personal trainer software company, gym management solutions, fitness technology India', canonicalPath: '/about-us' },
  { key: 'client-app', title: 'Free Fitness App - Find Personal Trainers & Track Workouts | TrainZilla', description: 'The #1 free fitness app for finding certified personal trainers globally. Track workouts, follow nutrition plans, monitor progress with analytics, book sessions, and achieve your fitness goals. Available free on iOS and Android.', keywords: 'fitness app free download, best personal trainer app, workout tracking app, nutrition tracking app, fitness marketplace app, find personal trainers online, gym workout app, diet plan app, fitness progress tracking app, online personal training app', canonicalPath: '/client-app' },
  { key: 'ai-coach', title: 'AI Fitness Coach App - Personalised Workout & Diet Plans | TrainZilla', description: 'Get your own AI personal trainer inside the free TrainZilla app. Personalised workout plans, tailored nutrition, daily habit tracking, and weekly AI adjustments — plans start from ₹499/month. No human coach required.', keywords: 'AI fitness coach, AI personal trainer app, AI workout plan generator, AI diet plan app, cheap alternative to personal trainer, AI fitness coach India, virtual AI trainer, automated workout plan app, AI nutrition coach, affordable personal training app', canonicalPath: '/ai-coach' },
  { key: 'successStories', title: 'Success Stories - Trainer Testimonials | TrainZilla', description: 'Real success stories from fitness professionals using TrainZilla worldwide. See how personal trainers and gym owners grew their business, increased revenue, and improved client satisfaction.', keywords: 'trainer success stories, fitness business growth testimonials, personal trainer reviews, gym management success cases, fitness software testimonials', canonicalPath: '/success-stories' },
  { key: 'gettingStarted', title: 'Getting Started Guide - Setup Your Fitness Business | TrainZilla', description: 'Complete getting started guide for new TrainZilla users. Setup your account, add clients, create workout plans, and launch your fitness business quickly.', keywords: 'TrainZilla setup guide, personal trainer software tutorial, gym management getting started, fitness platform onboarding', canonicalPath: '/help/getting-started' },
  { key: 'clientManagement', title: 'Client Management Guide - Organize Your Fitness Clients | TrainZilla', description: 'Learn how to manage clients effectively with TrainZilla. Add profiles, track progress, schedule sessions, handle payments, and maintain detailed client records.', keywords: 'client management fitness, personal trainer client management, fitness client retention software, manage fitness clients online', canonicalPath: '/help/client-management' },
  { key: 'workoutPlanning', title: 'Workout Planning Guide - Create Exercise Programs | TrainZilla', description: 'Master workout planning with TrainZilla’s tools. Create custom programs, use exercise library, track progress, and deliver engaging workout experiences to clients.', keywords: 'workout planning software, exercise library app, workout plan creator, organize workout plans', canonicalPath: '/help/workout-planning' },
  { key: 'progressTracking', title: 'Progress Tracking Guide - Monitor Client Results | TrainZilla', description: 'Track client progress effectively with TrainZilla’s monitoring tools. Record measurements, track goals, analyze trends, and demonstrate value to clients.', keywords: 'fitness progress tracking, track client progress fitness, fitness goal tracking, fitness assessment tools', canonicalPath: '/help/progress-tracking' },
  { key: 'paymentsBilling', title: 'Payments & Billing Guide - Manage Fitness Business Finances | TrainZilla', description: 'Handle payments and billing seamlessly. Setup pricing, process payments, manage subscriptions, and track revenue with TrainZilla’s financial tools.', keywords: 'fitness payment management, gym billing software, trainer payment processing, fitness business financial management', canonicalPath: '/help/payments-billing' },
  { key: 'mobileApp', title: 'Mobile App Guide - Fitness Training on Mobile | TrainZilla', description: 'Use TrainZilla mobile app to manage your fitness business on the go. Access client data, create workouts, track progress, and stay connected with clients anywhere.', keywords: 'fitness trainer mobile app, gym management mobile, personal trainer app, mobile fitness platform', canonicalPath: '/help/mobile-app' },
  { key: 'faq', title: 'FAQ - Frequently Asked Questions | TrainZilla', description: 'Find answers to common questions about TrainZilla fitness software. Get help with account setup, features, pricing, technical issues, and more.', keywords: 'TrainZilla FAQ, fitness software questions, personal trainer software help, gym management support', canonicalPath: '/help/faq' },
  { key: 'troubleshooting', title: 'Troubleshooting Guide - Fix Common Issues | TrainZilla', description: 'Resolve common issues with TrainZilla fitness software. Step-by-step solutions for technical problems, account issues, and feature troubleshooting.', keywords: 'TrainZilla troubleshooting, fitness software issues, technical support, problem solving guide', canonicalPath: '/help/troubleshooting' },
  { key: 'support', title: 'Support Center - Get Help from TrainZilla Team | TrainZilla', description: 'Get direct support from TrainZilla team. Contact our experts for technical help, feature requests, business consultation, and personalized assistance.', keywords: 'TrainZilla support, fitness software help, personal trainer support, technical assistance', canonicalPath: '/help/support' },
  { key: 'privacyPolicy', title: 'Privacy Policy - Data Protection | TrainZilla', description: 'TrainZilla’s privacy policy. Learn how we protect your data, handle client information, and comply with global privacy regulations including GDPR.', keywords: 'TrainZilla privacy policy, data protection fitness software, privacy compliance, GDPR fitness app', canonicalPath: '/privacy-policy' },
  { key: 'termsOfService', title: 'Terms of Service - TrainZilla Usage Agreement', description: 'Terms of service for TrainZilla fitness platform. Usage guidelines, user responsibilities, and service terms for fitness professionals worldwide.', keywords: 'TrainZilla terms of service, fitness software agreement, usage terms', canonicalPath: '/terms-of-service' },
  { key: 'refundPolicy', title: 'Refund Policy - Money Back Guarantee | TrainZilla', description: 'TrainZilla’s refund policy. Understand our money-back guarantee, cancellation terms, and refund process for subscriptions.', keywords: 'TrainZilla refund policy, money back guarantee, cancellation policy', canonicalPath: '/refund-policy' },
  { key: 'gstPolicy', title: 'GST Policy - Billing & Tax Compliance | TrainZilla', description: 'GST and billing information for TrainZilla subscriptions in India. Understand GST invoicing, tax compliance, and billing details for fitness businesses.', keywords: 'TrainZilla GST policy, GST fitness software, billing information India, fitness software invoicing GST', canonicalPath: '/gst-policy' },
  { key: 'aiFitnessRevolution', title: 'AI Fitness Revolution - Future of Personal Training | TrainZilla Blog', description: 'Explore how AI is transforming personal training globally. Learn about intelligent workout planning, automated progress tracking, and AI-powered fitness coaching.', keywords: 'AI fitness revolution, artificial intelligence personal training, AI workout planning, smart fitness technology', canonicalPath: '/blog/ai-fitness-revolution' },
  { key: 'businessGrowthTier2', title: 'Building a Sustainable Fitness Business in Tier-2 Cities | TrainZilla Blog', description: 'Proven strategies for growing a fitness business in India’s tier-2 cities. Client acquisition, pricing strategies, retention tactics, and digital marketing tips.', keywords: 'fitness business growth India, personal trainer business tips, tier 2 cities fitness, gym growth strategies India', canonicalPath: '/blog/business-growth-tier2-cities' },
  { key: 'digitalMarketingFitness', title: 'Digital Marketing for Fitness Professionals | TrainZilla Blog', description: 'Complete guide to digital marketing for fitness professionals. Social media strategies, content marketing, client acquisition, and online presence building.', keywords: 'digital marketing fitness, fitness social media marketing, personal trainer marketing, gym digital marketing', canonicalPath: '/blog/digital-marketing-fitness' },
  { key: 'festivalSeasonFitness', title: 'Managing Clients During Festival Seasons | TrainZilla Blog', description: 'Help Indian fitness clients stay on track during festival seasons. Nutrition tips, workout adjustments, motivation strategies, and festive celebration guidance.', keywords: 'festival season fitness India, Diwali fitness tips, festive season workout, Indian festival nutrition', canonicalPath: '/blog/festival-season-client-management' },
  { key: 'monsoonFitness', title: 'Monsoon Fitness: Keeping Clients Active During Rainy Season | TrainZilla Blog', description: 'Complete guide to keeping fitness clients motivated during India’s monsoon season. Indoor workouts, nutrition tips, motivation strategies, and rain-season training.', keywords: 'monsoon fitness India, rainy season workout, indoor fitness India, monsoon training tips', canonicalPath: '/blog/monsoon-fitness-training' },
  { key: 'nutritionVegetarian', title: 'Nutrition Planning for Indian Vegetarian Clients | TrainZilla Blog', description: 'Complete vegetarian nutrition guide for Indian fitness coaches and their clients. Protein sources, meal planning, supplements, and vegetarian diet optimisation for fitness goals.', keywords: 'vegetarian nutrition India, Indian fitness diet, vegetarian protein sources fitness, plant based India', canonicalPath: '/blog/vegetarian-nutrition-planning' },
  { key: 'upiPaymentsGuide', title: 'UPI and Digital Payments Guide for Fitness Trainers | TrainZilla Blog', description: 'Complete guide to accepting UPI and digital payments in your fitness business. Setup, best practices, and Razorpay integration for personal trainers in India.', keywords: 'UPI payments fitness India, Razorpay fitness trainer, digital payments gym India, online payment fitness business', canonicalPath: '/blog/upi-digital-payments-guide' },
  { key: 'app-privacy-policy', title: 'App Privacy Policy - TrainZilla Client App | Data Protection & Security', description: 'Privacy policy for TrainZilla Client mobile app. Learn how we protect your fitness data, camera permissions, image security, and personal information. GDPR compliant fitness app.', keywords: 'TrainZilla app privacy, fitness app privacy policy, camera permission policy, workout app data security, fitness data protection, mobile app privacy', canonicalPath: '/app-privacy-policy' },
  { key: 'marketplace', title: 'TrainZilla Marketplace — Find Verified Fitness Coaches in India', description: 'Browse the TrainZilla Marketplace at t.trainzilla.in to discover certified personal trainers. Coaches get a free online profile automatically. Clients find, compare, and subscribe to the perfect coach in minutes.', keywords: 'fitness coach marketplace India, find personal trainer India, personal trainer profile page, fitness coach marketplace, discover fitness coaches, online fitness trainer platform, trainzilla marketplace, fitness coach directory India', canonicalPath: '/marketplace' },
  { key: 'ai-integration', title: 'AI Agent Integration — Talk to Your Coaching Business | TrainZilla', description: 'Connect your TrainZilla Coach App to Claude or any AI agent in 2 minutes. Get your API key, add one line to your AI settings, and start managing clients, generating plans, and reviewing compliance — all in plain English. No technical skills needed.', keywords: 'AI fitness coaching assistant, Claude coaching app, AI personal trainer tool, fitness AI automation, AI workout plan generator, AI coaching assistant, TrainZilla AI integration, fitness coach AI tools, MCP fitness app, AI agent coaching', canonicalPath: '/solutions/ai-agent' },
]

// --- Blog categories (BlogCategoryPage.tsx categoryConfig, 4 real keys) -------
const BLOG_CATEGORIES = [
  { slug: 'getting-started', name: 'Getting Started', description: 'Onboarding guides and first steps for fitness coaches new to TrainZilla.' },
  { slug: 'client-management', name: 'Client Management', description: 'Retention, communication, scheduling and progress-tracking playbooks.' },
  { slug: 'scheduling-booking', name: 'Scheduling & Booking', description: 'Session scheduling, calendar workflows and booking best practices.' },
  { slug: 'analytics-reports', name: 'Analytics & Reports', description: 'Using business analytics and client reports to grow your practice.' },
]

// --- FAQs (help/FAQPage.tsx faqData, 20 entries) -----------------------------
const CAT = {
  'Getting Started': 'getting-started',
  'Client Management': 'account',
  'Payments & Billing': 'billing',
  'Mobile App': 'features',
  'Technical Support': 'technical',
  'Video Training': 'features',
} as const
const FAQS: { category: keyof typeof CAT; question: string; answer: string; popular: boolean }[] = [
  { category: 'Getting Started', question: 'How do I create my trainer profile on TrainZilla?', answer: 'Creating your trainer profile is simple: 1) Sign up with your email and phone number, 2) Verify your account via SMS/email, 3) Complete your professional details including certifications, 4) Add your specializations and experience, 5) Set your pricing and availability. Our AI will help optimize your profile for better client matching.', popular: true },
  { category: 'Getting Started', question: 'What certifications do I need to use TrainZilla?', answer: 'While TrainZilla welcomes trainers of all levels, we recommend having at least one recognized fitness certification (ACE, NASM, ACSM, K11, etc.). You can also join with relevant experience and work towards certification while using our platform. We provide resources to help you obtain recognized certifications.', popular: false },
  { category: 'Getting Started', question: 'How does the AI workout generator work?', answer: 'Our AI analyzes multiple factors including client goals, fitness level, available equipment, time constraints, injuries, and preferences. It then generates personalized workout plans drawing from our database of thousands of exercises. The AI learns from client feedback and progress to continuously improve recommendations.', popular: true },
  { category: 'Client Management', question: 'How do I add a new client to my dashboard?', answer: 'To add a new client: 1) Go to Client Management in your dashboard, 2) Click "Add New Client", 3) Enter their basic information and goals, 4) Complete the fitness assessment questionnaire, 5) Set their subscription plan and payment method. You can also invite clients to join via email or WhatsApp.', popular: true },
  { category: 'Client Management', question: 'Can I manage family members or couples together?', answer: 'Yes! TrainZilla supports family and couple accounts. You can create linked profiles that share certain information while maintaining individual workout plans and progress tracking. This is popular for families wanting to train together while respecting individual goals.', popular: false },
  { category: 'Client Management', question: 'How do I track client progress effectively?', answer: 'TrainZilla offers comprehensive progress tracking: take regular measurements and photos, log workout performances, track goal achievements, use our AI analytics for insights, and generate automated progress reports. Clients can also self-report through the mobile app.', popular: true },
  { category: 'Client Management', question: 'What if a client cancels or no-shows frequently?', answer: 'Our platform includes attendance tracking and automated reminder systems. You can set cancellation policies, require advance notice, and track patterns. For frequent no-shows, the system can suggest scheduling adjustments or flag clients who might need different support approaches.', popular: false },
  { category: 'Payments & Billing', question: 'How do I set up UPI payments for Indian clients?', answer: 'UPI integration is built into TrainZilla: 1) Complete your bank account verification, 2) Set up your UPI ID in payment settings, 3) Configure your pricing plans, 4) Enable automatic payment reminders. Clients can pay instantly via any UPI app like GPay, PhonePe, or Paytm.', popular: true },
  { category: 'Payments & Billing', question: 'How does GST billing work for fitness services?', answer: 'TrainZilla automatically handles GST compliance: if your annual income exceeds ₹20 lakhs, GST is automatically calculated and added to invoices. We generate GST-compliant invoices, maintain records for filing returns, and provide monthly GST reports. Consult with a CA for specific tax advice.', popular: true },
  { category: 'Payments & Billing', question: 'Can I offer EMI or installment plans to clients?', answer: 'Yes! TrainZilla supports flexible payment options including EMIs for long-term plans. You can set up 3, 6, or 12-month installment plans. The system automatically handles recurring payments and sends reminders. This makes fitness services more accessible to clients.', popular: false },
  { category: 'Payments & Billing', question: "What happens if a client's payment fails?", answer: 'Our system automatically retries failed payments after 24 hours, sends payment reminder notifications to clients, provides alternative payment methods, and notifies you of any issues. You can also manually process payments or adjust due dates as needed.', popular: false },
  { category: 'Mobile App', question: 'Is there a mobile app for clients?', answer: 'Yes! The TrainZilla client app allows clients to view workout plans, track progress, communicate with trainers, make payments, and access nutrition guidance. It syncs with the trainer dashboard in real-time and works offline in areas with poor connectivity.', popular: true },
  { category: 'Mobile App', question: 'Can I use TrainZilla offline during sessions?', answer: 'The mobile app includes offline functionality for essential features like viewing workout plans, logging exercises, and taking progress photos. Data syncs automatically when internet connection is restored. This is especially useful for outdoor sessions or areas with poor connectivity.', popular: false },
  { category: 'Mobile App', question: 'How do I help clients download and set up the app?', answer: 'When you add a client, they automatically receive setup instructions via SMS and email. The onboarding process is guided with step-by-step instructions in Hindi and English. You can also share quick setup videos and provide in-person assistance during the first session.', popular: false },
  { category: 'Technical Support', question: 'What if I forget my password?', answer: 'Use the "Forgot Password" link on the login page. You’ll receive a reset link via SMS and email. For additional security, you may need to verify your identity with your registered phone number. Contact support if you don’t receive the reset link within 5 minutes.', popular: false },
  { category: 'Technical Support', question: 'Why is my dashboard loading slowly?', answer: 'Slow loading can be due to internet connectivity, browser cache, or high traffic. Try clearing your browser cache, checking your internet connection, using a different browser, or accessing during off-peak hours. Contact support if issues persist.', popular: false },
  { category: 'Technical Support', question: 'Can I export my client data?', answer: 'Yes! You can export client data including contact information, progress reports, workout histories, and payment records. Go to Settings > Data Export and select the information you need. Data is provided in Excel format for your records.', popular: false },
  { category: 'Video Training', question: 'How do I conduct video training sessions?', answer: 'TrainZilla includes integrated video calling: schedule sessions in your calendar, start calls directly from the dashboard, share your screen for exercise demonstrations, and record sessions for client review. The system works on mobile and desktop with good internet connectivity.', popular: true },
  { category: 'Video Training', question: 'What equipment do I need for online training?', answer: 'For professional online training you need: a stable internet connection (minimum 2 Mbps), a device with camera and microphone (smartphone, tablet, or laptop), good lighting for demonstrations, and a clear background. A tripod or device stand is recommended for stable video.', popular: false },
]

// --- Webinars (webinarData.ts, 6 entries) ------------------------------------
const arr = (xs: string[]) => xs.map((value) => ({ value }))
const WEBINARS = [
  {
    slug: 'ai-fitness-coaching',
    title: 'AI-Powered Fitness Coaching for Indian Trainers',
    subtitle: 'Master the Future of Personal Training with Artificial Intelligence',
    description: 'Learn how to leverage AI tools to create personalized workout plans, nutrition guides, and business strategies specifically for the Indian fitness market.',
    longDescription: rt(["This comprehensive webinar will teach you how to integrate AI technology into your fitness coaching practice. From automated workout generation to smart nutrition planning for Indian dietary preferences, you’ll discover practical AI tools that can help you scale your business and provide better results for your clients. We’ll cover real-world applications, cost-effective AI solutions, and how to maintain the personal touch that Indian clients value."]),
    instructor: { name: 'Dr. Priya Sharma', title: 'AI Fitness Technology Expert & Certified Nutritionist', bio: 'Dr. Priya Sharma is a leading expert in fitness technology with over 12 years of experience in the Indian wellness industry. She has helped over 500 trainers integrate technology into their practice.', image: '/images/instructors/priya-sharma.jpg', credentials: arr(['Ph.D. in Sports Science', 'ACSM Certified', 'Google AI Certified', 'Nutrition & Dietetics Expert']) },
    schedule: { date: 'March 15, 2026', time: '19:00', duration: '2 hours', timezone: 'IST' },
    topics: arr(['Introduction to AI in Fitness Industry', 'AI Workout Plan Generation for Indian Bodies', 'Smart Nutrition Planning for Vegetarian Clients', 'Automated Progress Tracking Systems', 'AI-Powered Business Analytics', 'Cost-Effective AI Tools for Small Businesses', 'Maintaining Personal Connection with Technology', 'Case Studies from Successful Indian Trainers']),
    benefits: arr(['Create personalized workout plans 10x faster', 'Increase client retention by 40%', 'Reduce planning time from hours to minutes', 'Scale your business to serve more clients', 'Provide data-driven results to clients', 'Stay ahead of competition with cutting-edge tools']),
    targetAudience: arr(['Personal trainers looking to scale their business', 'Gym owners wanting to modernize their services', 'Fitness entrepreneurs seeking competitive advantage', 'Nutrition coaches serving Indian clientele']),
    price: { amount: 2999, currency: 'INR', originalPrice: 4999 },
    category: 'Technology & Innovation', level: 'Intermediate', language: arr(['Hindi', 'English']),
    maxParticipants: 100, currentRegistrations: 67,
    features: arr(['Live interactive session', 'AI tools demonstration', 'Q&A with expert', 'Practical exercises', 'Resource downloads', 'Follow-up support']),
    prerequisites: arr(['Basic computer skills', 'Active fitness practice', 'Willingness to learn new technology']),
    certificateProvided: true, recordingAvailable: true,
    materialsIncluded: arr(['AI Tools Checklist', 'Workout Template Library', 'Nutrition Planning Guide', 'Business Automation Roadmap', 'Video Tutorials']),
    tags: arr(['AI', 'Technology', 'Business Growth', 'Automation', 'Trending']),
  },
  {
    slug: 'monsoon-fitness-strategies',
    title: 'Monsoon Fitness Strategies for Indian Clients',
    subtitle: 'Keep Your Clients Active and Motivated During Rainy Season',
    description: 'Discover proven strategies to maintain client engagement, motivation, and results during India’s challenging monsoon months.',
    longDescription: rt(['The monsoon season presents unique challenges for fitness professionals in India. This webinar provides practical solutions for maintaining client engagement when outdoor activities are limited, humidity affects performance, and motivation typically drops. Learn seasonal workout modifications, indoor alternatives, mental health support strategies, and how to turn monsoon challenges into business opportunities.']),
    instructor: { name: 'Rajesh Kumar', title: 'Elite Fitness Coach & Monsoon Training Specialist', bio: 'Rajesh Kumar has been training clients through 15 monsoon seasons in Mumbai. His innovative indoor training methods have helped hundreds of clients maintain their fitness goals despite weather challenges.', image: '/images/instructors/rajesh-kumar.jpg', credentials: arr(['NASM Master Trainer', 'Functional Movement Specialist', 'Mental Health First Aid Certified', '15+ Years Experience']) },
    schedule: { date: 'March 22, 2026', time: '18:30', duration: '90 minutes', timezone: 'IST' },
    topics: arr(['Understanding Monsoon Psychology & Motivation', 'Indoor Workout Adaptations', 'Humidity Management Techniques', 'Monsoon Nutrition Guidelines', 'Client Communication Strategies', 'Equipment-Free Training Methods', 'Mental Health Support During Monsoons', 'Turning Challenges into Opportunities']),
    benefits: arr(['Maintain 90% client retention during monsoons', 'Increase indoor session bookings', 'Develop weather-independent business model', 'Create monsoon-specific service packages', 'Improve client satisfaction scores', 'Build reputation as year-round specialist']),
    targetAudience: arr(['Personal trainers in monsoon-affected regions', 'Gym owners preparing for seasonal challenges', 'Outdoor fitness instructors needing alternatives', 'Corporate wellness coordinators']),
    price: { amount: 1999, currency: 'INR', originalPrice: 2999 },
    category: 'Seasonal Training', level: 'Beginner', language: arr(['Hindi', 'English']),
    maxParticipants: 150, currentRegistrations: 89,
    features: arr(['Live demonstration of indoor workouts', 'Monsoon meal planning session', 'Client motivation scripts', 'Weather tracking tools', 'Community support group access']),
    prerequisites: arr(['Basic fitness training knowledge', 'Experience with Indian weather patterns']),
    certificateProvided: true, recordingAvailable: true,
    materialsIncluded: arr(['Monsoon Workout Library', 'Client Communication Templates', 'Nutrition Guide for Humid Weather', 'Motivation Toolkit', 'Business Continuity Plan']),
    tags: arr(['Monsoon', 'Indoor Training', 'Client Retention', 'Seasonal', 'Weather']),
  },
  {
    slug: 'vegetarian-sports-nutrition',
    title: 'Vegetarian Sports Nutrition for Indian Athletes',
    subtitle: 'Complete Plant-Based Nutrition Guide for Performance & Recovery',
    description: 'Master the art of plant-based nutrition planning for Indian vegetarian athletes and fitness enthusiasts.',
    longDescription: rt(['With 70% of Indians following vegetarian diets, this specialized webinar addresses the unique nutritional needs of vegetarian athletes and fitness enthusiasts. Learn evidence-based strategies for protein optimization, micronutrient balance, performance enhancement, and recovery using traditional Indian foods combined with modern sports nutrition science.']),
    instructor: { name: 'Dr. Meera Patel', title: 'Sports Nutritionist & Plant-Based Performance Expert', bio: 'Dr. Meera Patel has revolutionized vegetarian sports nutrition in India, working with Olympic athletes and professional sports teams. Her plant-based protocols have helped athletes achieve peak performance.', image: '/images/instructors/meera-patel.jpg', credentials: arr(['Ph.D. in Sports Nutrition', 'IOA Certified Sports Nutritionist', 'Plant-Based Nutrition Certificate', 'Published Researcher']) },
    schedule: { date: 'April 1, 2026', time: '19:30', duration: '2.5 hours', timezone: 'IST' },
    topics: arr(['Vegetarian Protein Sources & Combinations', 'Micronutrient Optimization for Athletes', 'Traditional Indian Foods for Performance', 'Pre & Post Workout Nutrition', 'Supplement Strategies for Vegetarians', 'Meal Timing for Different Sports', 'Common Deficiencies & Solutions', 'Practical Meal Planning & Prep']),
    benefits: arr(['Increase client performance by 25%', 'Eliminate nutritional deficiencies', 'Create culturally appropriate meal plans', 'Build expertise in growing niche market', 'Charge premium for specialized knowledge', 'Help clients achieve body composition goals']),
    targetAudience: arr(['Personal trainers working with vegetarian clients', 'Nutritionists seeking sports specialization', 'Fitness coaches in vegetarian-majority regions', 'Athletes looking to optimize plant-based nutrition']),
    price: { amount: 3499, currency: 'INR', originalPrice: 4999 },
    category: 'Nutrition & Diet', level: 'Advanced', language: arr(['Hindi', 'English']),
    maxParticipants: 75, currentRegistrations: 45,
    features: arr(['Live meal planning demonstration', 'Supplement protocol creation', 'Traditional recipe modifications', 'Performance tracking methods', 'Expert Q&A session']),
    prerequisites: arr(['Basic nutrition knowledge', 'Understanding of vegetarian diets', 'Client training experience']),
    certificateProvided: true, recordingAvailable: true,
    materialsIncluded: arr(['Vegetarian Athlete Meal Plans', 'Protein Combination Guide', 'Supplement Protocol Templates', 'Traditional Recipe Database', 'Performance Tracking Sheets']),
    tags: arr(['Vegetarian', 'Sports Nutrition', 'Performance', 'Plant-Based', 'Indian Diet']),
  },
  {
    slug: 'digital-marketing-fitness',
    title: 'Digital Marketing Mastery for Indian Fitness Professionals',
    subtitle: 'Build Your Online Presence & Attract More Clients',
    description: 'Learn proven digital marketing strategies specifically designed for the Indian fitness market to grow your client base and increase revenue.',
    longDescription: rt(['In today’s digital age, having great fitness skills isn’t enough. This comprehensive webinar teaches fitness professionals how to leverage digital marketing to build their brand, attract ideal clients, and create multiple income streams. We’ll cover social media strategies that work in India, content creation on a budget, client acquisition funnels, and how to stand out in a crowded market.']),
    instructor: { name: 'Arjun Singh', title: 'Digital Marketing Expert & Fitness Business Consultant', bio: 'Arjun Singh has helped over 300 fitness professionals in India build successful online businesses. His marketing strategies have generated over ₹50 crores in revenue for fitness professionals.', image: '/images/instructors/arjun-singh.jpg', credentials: arr(['Google Ads Certified', 'Facebook Marketing Expert', 'Content Marketing Specialist', 'Business Growth Consultant']) },
    schedule: { date: 'April 8, 2026', time: '20:00', duration: '2 hours', timezone: 'IST' },
    topics: arr(['Building Your Fitness Brand Online', 'Social Media Strategies for Indian Market', 'Content Creation on Zero Budget', 'Lead Generation & Client Funnels', 'WhatsApp Marketing for Fitness', 'Google My Business Optimization', 'Influencer Partnerships & Collaborations', 'Measuring ROI & Scaling Successfully']),
    benefits: arr(['Increase client inquiries by 300%', 'Build engaged social media following', 'Create automated lead generation', 'Develop multiple revenue streams', 'Establish authority in your niche', 'Reduce client acquisition costs']),
    targetAudience: arr(['Personal trainers wanting to grow online', 'Gym owners seeking digital presence', 'Fitness influencers looking to monetize', 'New trainers building client base']),
    price: { amount: 2499, currency: 'INR', originalPrice: 3999 },
    category: 'Business & Marketing', level: 'Beginner', language: arr(['Hindi', 'English']),
    maxParticipants: 200, currentRegistrations: 156,
    features: arr(['Live social media audit', 'Content calendar creation', 'Marketing automation setup', 'Case study analysis', 'Networking opportunities']),
    prerequisites: arr(['Basic smartphone/computer skills', 'Active on at least one social platform', 'Desire to grow fitness business']),
    certificateProvided: true, recordingAvailable: true,
    materialsIncluded: arr(['Digital Marketing Toolkit', 'Content Calendar Templates', 'Lead Magnet Examples', 'Social Media Post Templates', 'ROI Tracking Spreadsheets']),
    tags: arr(['Digital Marketing', 'Social Media', 'Business Growth', 'Online Presence', 'Client Acquisition']),
  },
  {
    slug: 'home-fitness-business',
    title: 'Starting Your Home-Based Fitness Business',
    subtitle: 'Launch a Profitable Fitness Business from Your Home',
    description: 'Complete blueprint for starting and scaling a successful home-based fitness business in India with minimal investment.',
    longDescription: rt(['Discover how to turn your passion for fitness into a profitable home-based business. This webinar covers everything from legal requirements and equipment setup to client acquisition and service delivery. Perfect for trainers who want the flexibility of working from home while building a sustainable income.']),
    instructor: { name: 'Neha Gupta', title: 'Home Fitness Business Expert & Entrepreneur', bio: 'Neha Gupta built a ₹10 lakh annual home fitness business in just 2 years. She now mentors other trainers to replicate her success with proven systems and strategies.', image: '/images/instructors/neha-gupta.jpg', credentials: arr(['Certified Personal Trainer', 'Business Management Graduate', 'Home Fitness Specialist', 'Entrepreneurship Mentor']) },
    schedule: { date: 'April 15, 2026', time: '18:00', duration: '2 hours', timezone: 'IST' },
    topics: arr(['Legal Requirements & Business Setup', 'Space Optimization & Equipment Selection', 'Service Packages & Pricing Strategies', 'Client Acquisition for Home Business', 'Virtual Training Implementation', 'Time Management & Scheduling', 'Safety & Insurance Considerations', 'Scaling Your Home Business']),
    benefits: arr(['Start business with minimal investment', 'Work flexible hours from home', 'Build recurring monthly income', 'Serve clients in your neighborhood', 'Avoid commute and rental costs', 'Create work-life balance']),
    targetAudience: arr(['New fitness professionals', 'Stay-at-home parents with fitness background', 'Trainers looking for location independence', 'Side hustle seekers']),
    price: { amount: 1799, currency: 'INR', originalPrice: 2499 },
    category: 'Business Setup', level: 'Beginner', language: arr(['Hindi', 'English']),
    maxParticipants: 120, currentRegistrations: 78,
    features: arr(['Business plan template', 'Legal checklist review', 'Equipment buying guide', 'Pricing calculator', 'Marketing templates']),
    prerequisites: arr(['Basic fitness certification', 'Dedication to start business', 'Available space at home']),
    certificateProvided: true, recordingAvailable: true,
    materialsIncluded: arr(['Business Setup Checklist', 'Legal Documentation Templates', 'Equipment Recommendations', 'Service Package Templates', 'Marketing Materials']),
    tags: arr(['Home Business', 'Entrepreneurship', 'Low Investment', 'Flexible Work', 'Startup']),
  },
  {
    slug: 'senior-fitness-specialization',
    title: 'Senior Fitness Specialization for Indian Trainers',
    subtitle: 'Become an Expert in Training India’s Growing Senior Population',
    description: 'Learn specialized techniques for training seniors safely and effectively, tapping into India’s fastest-growing fitness demographic.',
    longDescription: rt(['With India’s rapidly aging population, senior fitness is becoming a lucrative and meaningful specialization. This webinar teaches evidence-based training methods for older adults, addressing common health conditions, cultural considerations, and business opportunities in the senior fitness market.']),
    instructor: { name: 'Dr. Suresh Reddy', title: 'Geriatric Exercise Physiologist & Senior Fitness Expert', bio: 'Dr. Suresh Reddy has 20 years of experience in senior fitness and rehabilitation. He has trained thousands of seniors and mentored hundreds of trainers in age-appropriate exercise programming.', image: '/images/instructors/suresh-reddy.jpg', credentials: arr(['Ph.D. in Exercise Physiology', 'Geriatric Exercise Specialist', 'Rehabilitation Certified', 'Medical Exercise Expert']) },
    schedule: { date: 'April 22, 2026', time: '17:30', duration: '2.5 hours', timezone: 'IST' },
    topics: arr(['Aging Process & Exercise Adaptations', 'Common Health Conditions in Seniors', 'Safe Exercise Progressions', 'Fall Prevention Strategies', 'Culturally Appropriate Activities', 'Family Involvement & Communication', 'Business Model for Senior Fitness', 'Insurance & Safety Protocols']),
    benefits: arr(['Access underserved market segment', 'Command premium pricing for specialization', 'Make meaningful impact on quality of life', 'Build referral network with healthcare providers', 'Create recession-proof business model', 'Establish expertise in growing field']),
    targetAudience: arr(['Personal trainers seeking specialization', 'Healthcare professionals entering fitness', 'Gym owners targeting senior market', 'Physical therapy assistants']),
    price: { amount: 3999, currency: 'INR', originalPrice: 5499 },
    category: 'Specialized Training', level: 'Advanced', language: arr(['Hindi', 'English']),
    maxParticipants: 60, currentRegistrations: 32,
    features: arr(['Case study analysis', 'Exercise modification demos', 'Medical terminology guide', 'Family communication scripts', 'Business planning session']),
    prerequisites: arr(['Current fitness certification', 'Basic anatomy knowledge', 'Patience and empathy for seniors']),
    certificateProvided: true, recordingAvailable: true,
    materialsIncluded: arr(['Senior Exercise Library', 'Medical Condition Guidelines', 'Assessment Tools', 'Business Development Kit', 'Emergency Protocols']),
    tags: arr(['Senior Fitness', 'Specialized Training', 'Healthcare', 'Aging Population', 'Premium Service']),
  },
]

// ---------------------------------------------------------------------------
// Top-level await — `payload run` exits when module evaluation finishes, so the
// work must not be deferred into a floating promise.
const payload = await getPayload({ config })
const summary: Record<string, number> = {}

const upsert = async (collection: any, where: any, data: any) => {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data, depth: 0 })
    return 'updated'
  }
  await payload.create({ collection, data, depth: 0 })
  return 'created'
}

{

  // SEO pages
  for (const p of SEO_PAGES) {
    await upsert('seoPages', { key: { equals: p.key } }, {
      key: p.key,
      title: p.title,
      description: p.description,
      keywords: p.keywords,
      canonicalPath: stripOrigin(p.canonicalPath),
      inUse: true,
      _status: 'published',
    })
  }
  summary.seoPages = SEO_PAGES.length

  // Blog categories
  for (const c of BLOG_CATEGORIES) {
    await upsert('blogCategories', { slug: { equals: c.slug } }, { ...c, _status: 'published' })
  }
  summary.blogCategories = BLOG_CATEGORIES.length

  // FAQs
  let order = 0
  for (const f of FAQS) {
    order += 10
    await upsert('faqs', { question: { equals: f.question } }, {
      question: f.question,
      answer: rt([f.answer]),
      category: CAT[f.category],
      order,
      featuredOnPages: f.popular ? ['faq', 'home'] : ['faq'],
      _status: 'published',
    })
  }
  summary.faqs = FAQS.length

  // Webinars
  for (const w of WEBINARS) {
    await upsert('webinars', { slug: { equals: w.slug } }, { ...w, _status: 'published' })
  }
  summary.webinars = WEBINARS.length

  // Globals
  await payload.updateGlobal({
    slug: 'platformMetrics',
    data: {
      trainers: '100+', countries: '3+', clients: '500+', workouts: '2,500+',
      rating: '4.8★', cities: '10+', downloads: '500+', hoursSaved: '10+ hrs',
      _status: 'published',
    },
  })
  summary.platformMetrics = 1

  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      siteName: 'TrainZilla',
      orgDescription: "India's leading personal trainer software and fitness business management platform",
      logoUrl: 'https://trainzilla.in/og-image.png',
      ogImageDefault: 'https://trainzilla.in/og-image.png',
      social: [
        { platform: 'x', url: 'https://x.com/trainzilla_in' },
        { platform: 'facebook', url: 'https://www.facebook.com/people/Trainzillain/61578776257338/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/company/trainzilla' },
        { platform: 'instagram', url: 'https://www.instagram.com/trainzilla.in' },
        { platform: 'youtube', url: 'https://www.youtube.com/@trainzilla_in' },
      ],
      contact: {
        phone: '+91-84596-91471', email: 'support@trainzilla.in',
        addressLocality: 'Pune', addressRegion: 'Maharashtra', addressCountry: 'IN',
      },
      foundingDate: '2024',
      _status: 'published',
    },
  })
  summary.siteSettings = 1

  await payload.updateGlobal({
    slug: 'structuredData',
    data: {
      softwareApplication: {
        name: 'TrainZilla', softwareVersion: '2.0', datePublished: '2024-01-01',
        applicationCategory: 'BusinessApplication',
        operatingSystem: arr(['Web', 'iOS', 'Android']),
        offers: [
          { name: 'Free Plan', price: '0', priceCurrency: 'INR', description: 'Free plan for individual personal trainers' },
          { name: 'Professional Plan', price: '999', priceCurrency: 'INR', description: 'Professional plan with advanced features' },
        ],
        featureList: arr(['Client Management System', 'Workout Plan Creator', 'Nutrition Planning', 'Progress Tracking', 'Business Analytics', 'UPI Payment Management', 'Schedule Management', 'Mobile App Access']),
      },
      website: { searchUrlTemplate: 'https://trainzilla.in/search?q={search_term_string}' },
      _status: 'published',
    },
  })
  summary.structuredData = 1

  // eslint-disable-next-line no-console
  console.log('Seed complete:', summary)
}

process.exit(0)

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'od';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.leaderboard': 'Leaderboard',
    'nav.ai_tutor': 'AI Tutor',
    'nav.logout': 'Logout',
    
    // Hero Section
    'hero.title': 'Welcome to',
    'hero.brand': 'Gyaan Arena',
    'hero.description': 'Transform your learning journey with AI-powered education, gamified experiences, and personalized study paths. Our engaging platform makes learning interactive and incredibly helpful!',
    'hero.get_started': 'Get Started Free',
    'hero.watch_demo': 'Watch Demo',
    
    // Features
    'features.title': 'Why Choose Gyaan Arena?',
    'features.subtitle': 'Experience the future of education with our cutting-edge platform designed to make learning engaging, effective, and enjoyable.',
    'features.ai_learning': 'AI-Powered Learning',
    'features.ai_description': 'Personalized study plans and intelligent recommendations',
    'features.gamified': 'Gamified Experience',
    'features.gamified_description': 'Earn points, unlock achievements, and compete with friends',
    'features.adaptive': 'Adaptive Testing',
    'features.adaptive_description': 'Smart quizzes that adapt to your learning progress',
    'features.offline': 'Offline Available',
    'features.offline_description': 'Access your learning materials anytime, anywhere without internet',
    
    // CTA Section
    'cta.title': 'Ready to Transform Your Learning?',
    'cta.description': 'Experience our gamified platform designed to make learning engaging, interactive, and incredibly helpful for every student\'s success.',
    'cta.start_learning': 'Start Learning Today',
    'cta.have_account': 'Already have an account?',
    
    // Auth Pages
    'auth.welcome_back': 'Welcome Back!',
    'auth.sign_in_description': 'Sign in to continue your learning journey',
    'auth.sign_in': 'Sign In',
    'auth.sign_in_cta': 'Enter your credentials to access your account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.remember_me': 'Remember me',
    'auth.forgot_password': 'Forgot password?',
    'auth.no_account': 'Don\'t have an account?',
    'auth.sign_up_here': 'Sign up here',
    'auth.back_to_home': '← Back to Home',
    'auth.username': 'Username',
    
    'auth.join_brand': 'Join Gyaan Arena',
    'auth.create_account_description': 'Create your account and start learning today',
    'auth.create_account': 'Create Account',
    'auth.create_account_cta': 'Fill in your details to get started',
    'auth.full_name': 'Full Name',
    'auth.role': 'I am a',
    'auth.role_placeholder': 'Select your role',
    'auth.student': 'Student',
    'auth.teacher': 'Teacher/Educator',
    'auth.confirm_password': 'Confirm Password',
    'auth.agree_terms': 'I agree to the',
    'auth.terms_service': 'Terms of Service',
    'auth.privacy_policy': 'Privacy Policy',
    'auth.have_account': 'Already have an account?',
    'auth.sign_in_here': 'Sign in here',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.leaderboard': 'लीडरबोर्ड',
    'nav.ai_tutor': 'AI शिक्षक',
    'nav.logout': 'लॉगआउट',
    
    // Hero Section
    'hero.title': 'आपका स्वागत है',
    'hero.brand': 'ज्ञान अरेना',
    'hero.description': 'AI-संचालित शिक्षा, गेमिफाइड अनुभवों और व्यक्तिगत अध्ययन पथों के साथ अपनी सीखने की यात्रा को बदलें। हमारा आकर्षक प्लेटफॉर्म सीखने को इंटरैक्टिव और अविश्वसनीय रूप से सहायक बनाता है!',
    'hero.get_started': 'मुफ्त में शुरू करें',
    'hero.watch_demo': 'डेमो देखें',
    
    // Features
    'features.title': 'ज्ञान अरीना क्यों चुनें?',
    'features.subtitle': 'हमारे अत्याधुनिक प्लेटफॉर्म के साथ शिक्षा के भविष्य का अनुभव करें जो सीखने को आकर्षक, प्रभावी और आनंददायक बनाने के लिए डिज़ाइन किया गया है।',
    'features.ai_learning': 'AI-संचालित शिक्षा',
    'features.ai_description': 'व्यक्तिगत अध्ययन योजनाएं और बुद्धिमान सिफारिशें',
    'features.gamified': 'गेमिफाइड अनुभव',
    'features.gamified_description': 'अंक अर्जित करें, उपलब्धियां अनलॉक करें, और दोस्तों के साथ प्रतिस्पर्धा करें',
    'features.adaptive': 'अनुकूली परीक्षण',
    'features.adaptive_description': 'स्मार्ट क्विज़ जो आपकी सीखने की प्रगति के अनुकूल होते हैं',
    'features.offline': 'ऑफलाइन उपलब्ध',
    'features.offline_description': 'बिना इंटरनेट के कभी भी, कहीं भी अपनी शिक्षण सामग्री तक पहुंचें',
    
    // CTA Section
    'cta.title': 'क्या आप अपनी शिक्षा को बदलने के लिए तैयार हैं?',
    'cta.description': 'हमारे गेमिफाइड प्लेटफॉर्म का अनुभव करें जो हर छात्र की सफलता के लिए सीखने को आकर्षक, इंटरैक्टिव और अविश्वसनीय रूप से सहायक बनाने के लिए डिज़ाइन किया गया है।',
    'cta.start_learning': 'आज ही सीखना शुरू करें',
    'cta.have_account': 'पहले से खाता है?',
    
    // Auth Pages
    'auth.welcome_back': 'वापस आपका स्वागत है!',
    'auth.sign_in_description': 'अपनी सीखने की यात्रा जारी रखने के लिए साइन इन करें',
    'auth.sign_in': 'साइन इन',
    'auth.sign_in_cta': 'अपने खाते तक पहुंचने के लिए अपनी जानकारी दर्ज करें',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.remember_me': 'मुझे याद रखें',
    'auth.forgot_password': 'पासवर्ड भूल गए?',
    'auth.no_account': 'खाता नहीं है?',
    'auth.sign_up_here': 'यहाँ साइन अप करें',
    'auth.back_to_home': '← होम पर वापस',
    'auth.username': 'उपयोगकर्ता नाम',
    
    'auth.join_brand': 'ज्ञान अरेना में शामिल हों',
    'auth.create_account_description': 'अपना खाता बनाएं और आज ही सीखना शुरू करें',
    'auth.create_account': 'खाता बनाएं',
    'auth.create_account_cta': 'शुरू करने के लिए अपनी जानकारी भरें',
    'auth.full_name': 'पूरा नाम',
    'auth.role': 'मैं हूँ',
    'auth.role_placeholder': 'अपनी भूमिका चुनें',
    'auth.student': 'छात्र',
    'auth.teacher': 'शिक्षक/शिक्षाविद',
    'auth.confirm_password': 'पासवर्ड की पुष्टि करें',
    'auth.agree_terms': 'मैं सहमत हूँ',
    'auth.terms_service': 'सेवा की शर्तें',
    'auth.privacy_policy': 'गोपनीयता नीति',
    'auth.have_account': 'पहले से खाता है?',
    'auth.sign_in_here': 'यहाँ साइन इन करें',
  },
  mr: {
    // Navigation
    'nav.home': 'मुख्यपृष्ठ',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.leaderboard': 'लीडरबोर्ड',
    'nav.ai_tutor': 'AI शिक्षक',
    'nav.logout': 'लॉगआउट',
    
    // Hero Section
    'hero.title': 'आपले स्वागत आहे',
    'hero.brand': 'ज्ञान अरेना',
    'hero.description': 'AI-चालित शिक्षण, गेमिफाइड अनुभव आणि वैयक्तिक अभ्यास मार्गांसह आपला शिकण्याचा प्रवास बदला. आमचे आकर्षक प्लॅटफॉर्म शिकणे इंटरैक्टिव्ह आणि आश्चर्यकारकपणे उपयुक्त बनवते!',
    'hero.get_started': 'विनामूल्य सुरुवात करा',
    'hero.watch_demo': 'डेमो पहा',
    
    // Features
    'features.title': 'ज्ञान अरीना का निवडायचे?',
    'features.subtitle': 'आमच्या अत्याधुनिक प्लॅटफॉर्मसह शिक्षणाच्या भविष्याचा अनुभव घ्या जे शिकणे आकर्षक, प्रभावी आणि आनंददायक बनवण्यासाठी डिझाइन केलेले आहे.',
    'features.ai_learning': 'AI-चालित शिक्षण',
    'features.ai_description': 'वैयक्तिक अभ्यास योजना आणि बुद्धिमान शिफारसी',
    'features.gamified': 'गेमिफाइड अनुभव',
    'features.gamified_description': 'गुण मिळवा, यश अनलॉक करा आणि मित्रांशी स्पर्धा करा',
    'features.adaptive': 'अनुकूली चाचणी',
    'features.adaptive_description': 'स्मार्ट क्विझ जे आपल्या शिकण्याच्या प्रगतीशी जुळतात',
    'features.offline': 'ऑफलाइन उपलब्ध',
    'features.offline_description': 'इंटरनेटशिवाय कधीही, कुठेही आपल्या शिकण्याच्या सामग्रीमध्ये प्रवेश करा',
    
    // CTA Section
    'cta.title': 'आपले शिक्षण बदलण्यासाठी तयार आहात?',
    'cta.description': 'आमच्या गेमिफाइड प्लॅटफॉर्मचा अनुभव घ्या जे प्रत्येक विद्यार्थ्याच्या यशासाठी शिकणे आकर्षक, इंटरैक्टिव्ह आणि आश्चर्यकारकपणे उपयुक्त बनवण्यासाठी डिझाइन केलेले आहे.',
    'cta.start_learning': 'आज शिकणे सुरू करा',
    'cta.have_account': 'आधीच खाते आहे?',
    
    // Auth Pages
    'auth.welcome_back': 'परत आपले स्वागत आहे!',
    'auth.sign_in_description': 'आपला शिकण्याचा प्रवास सुरू ठेवण्यासाठी साइन इन करा',
    'auth.sign_in': 'साइन इन',
    'auth.sign_in_cta': 'आपल्या खात्यात प्रवेश करण्यासाठी आपली माहिती प्रविष्ट करा',
    'auth.email': 'ईमेल पत्ता',
    'auth.password': 'पासवर्ड',
    'auth.remember_me': 'मला लक्षात ठेवा',
    'auth.forgot_password': 'पासवर्ड विसरलात?',
    'auth.no_account': 'खाते नाही?',
    'auth.sign_up_here': 'येथे साइन अप करा',
    'auth.back_to_home': '← होमवर परत',
    'auth.username': 'वापरकर्ता नाव',
    
    'auth.join_brand': 'ज्ञान अरेना मध्ये सामील व्हा',
    'auth.create_account_description': 'आपले खाते तयार करा आणि आज शिकणे सुरू करा',
    'auth.create_account': 'खाते तयार करा',
    'auth.create_account_cta': 'सुरुवात करण्यासाठी आपली माहिती भरा',
    'auth.full_name': 'पूर्ण नाव',
    'auth.role': 'मी आहे',
    'auth.role_placeholder': 'आपली भूमिका निवडा',
    'auth.student': 'विद्यार्थी',
    'auth.teacher': 'शिक्षक/शैक्षणिक',
    'auth.confirm_password': 'पासवर्डची पुष्टी करा',
    'auth.agree_terms': 'मी सहमत आहे',
    'auth.terms_service': 'सेवा अटी',
    'auth.privacy_policy': 'गोपनीयता धोरण',
    'auth.have_account': 'आधीच खाते आहे?',
    'auth.sign_in_here': 'येथे साइन इन करा',
  },
  od: {
    // Navigation
    'nav.home': 'ଘର',
    'nav.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'nav.leaderboard': 'ଲିଡରବୋର୍ଡ',
    'nav.ai_tutor': 'AI ଶିକ୍ଷକ',
    'nav.logout': 'ଲଗଆଉଟ',
    
    // Hero Section
    'hero.title': 'ଆପଣଙ୍କୁ ସ୍ୱାଗତ',
    'hero.brand': 'ଗ୍ୟାନ ଆରେନା',
    'hero.description': 'AI-ଚାଳିତ ଶିକ୍ଷା, ଗେମିଫାଇଡ୍ ଅଭିଜ୍ଞତା ଏବଂ ବ୍ୟକ୍ତିଗତ ଅଧ୍ୟୟନ ପଥ ସହିତ ଆପଣଙ୍କର ଶିକ୍ଷଣ ଯାତ୍ରାକୁ ପରିବର୍ତ୍ତନ କରନ୍ତୁ। ଆମର ଆକର୍ଷଣୀୟ ପ୍ଲାଟଫର୍ମ ଶିକ୍ଷଣକୁ ଇଣ୍ଟରାକ୍ଟିଭ୍ ଏବଂ ଅବିଶ୍ୱସନୀୟ ଭାବରେ ସହାୟକ କରିଥାଏ!',
    'hero.get_started': 'ମାଗଣାରେ ଆରମ୍ଭ କରନ୍ତୁ',
    'hero.watch_demo': 'ଡେମୋ ଦେଖନ୍ତୁ',
    
    // Features
    'features.title': 'ଗ୍ୟାନ ଆରେନା କାହିଁକି ବାଛିବେ?',
    'features.subtitle': 'ଆମର ଅତ୍ୟାଧୁନିକ ପ୍ଲାଟଫର୍ମ ସହିତ ଶିକ୍ଷାର ଭବିଷ୍ୟତର ଅଭିଜ୍ଞତା ନିଅନ୍ତୁ ଯାହା ଶିକ୍ଷଣକୁ ଆକର୍ଷଣୀୟ, ପ୍ରଭାବଶାଳୀ ଏବଂ ଆନନ୍ଦଦାୟକ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି।',
    'features.ai_learning': 'AI-ଚାଳିତ ଶିକ୍ଷଣ',
    'features.ai_description': 'ବ୍ୟକ୍ତିଗତ ଅଧ୍ୟୟନ ଯୋଜନା ଏବଂ ବୁଦ୍ଧିମାନ ସୁପାରିଶ',
    'features.gamified': 'ଗେମିଫାଇଡ୍ ଅଭିଜ୍ଞତା',
    'features.gamified_description': 'ପଏଣ୍ଟ ଅର୍ଜନ କରନ୍ତୁ, ସଫଳତା ଅନଲକ୍ କରନ୍ତୁ ଏବଂ ବନ୍ଧୁମାନଙ୍କ ସହିତ ପ୍ରତିଯୋଗିତା କରନ୍ତୁ',
    'features.adaptive': 'ଅନୁକୂଳ ପରୀକ୍ଷା',
    'features.adaptive_description': 'ସ୍ମାର୍ଟ କୁଇଜ୍ ଯାହା ଆପଣଙ୍କର ଶିକ୍ଷଣ ପ୍ରଗତି ସହିତ ଖାପ ଖାଏ',
    'features.offline': 'ଅଫଲାଇନ୍ ଉପଲବ୍ଧ',
    'features.offline_description': 'ଇଣ୍ଟରନେଟ୍ ବିନା ଯେକୌଣସି ସମୟରେ, ଯେକୌଣସି ସ୍ଥାନରେ ଆପଣଙ୍କର ଶିକ୍ଷଣ ସାମଗ୍ରୀ ପ୍ରବେଶ କରନ୍ତୁ',
    
    // CTA Section  
    'cta.title': 'ଆପଣଙ୍କର ଶିକ୍ଷଣକୁ ପରିବର୍ତ୍ତନ କରିବାକୁ ପ୍ରସ୍ତୁତ?',
    'cta.description': 'ଆମର ଗେମିଫାଇଡ୍ ପ୍ଲାଟଫର୍ମର ଅଭିଜ୍ଞତା ନିଅନ୍ତୁ ଯାହା ପ୍ରତ୍ୟେକ ଛାତ୍ରଙ୍କ ସଫଳତା ପାଇଁ ଶିକ୍ଷଣକୁ ଆକର୍ଷଣୀୟ, ଇଣ୍ଟରାକ୍ଟିଭ୍ ଏବଂ ଅବିଶ୍ୱସନୀୟ ଭାବରେ ସହାୟକ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି।',
    'cta.start_learning': 'ଆଜି ଶିକ୍ଷଣ ଆରମ୍ଭ କରନ୍ତୁ',
    'cta.have_account': 'ପୂର୍ବରୁ ଖାତା ଅଛି?',
    
    // Auth Pages
    'auth.welcome_back': 'ପୁନର୍ବାର ସ୍ୱାଗତ!',
    'auth.sign_in_description': 'ଆପଣଙ୍କ ଶିକ୍ଷଣ ଯାତ୍ରା ଜାରି ରଖିବା ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    'auth.sign_in': 'ସାଇନ୍ ଇନ୍',
    'auth.sign_in_cta': 'ଆପଣଙ୍କ ଖାତାରେ ପ୍ରବେଶ କରିବା ପାଇଁ ଆପଣଙ୍କର ବିବରଣୀ ପ୍ରବିଷ୍ଟ କରନ୍ତୁ',
    'auth.email': 'ଇମେଲ୍ ଠିକଣା',
    'auth.password': 'ପାସୱାର୍ଡ',
    'auth.remember_me': 'ମୋତେ ମନେରଖନ୍ତୁ',
    'auth.forgot_password': 'ପାସୱାର୍ଡ ଭୁଲିଗଲେ?',
    'auth.no_account': 'ଖାତା ନାହିଁ?',
    'auth.sign_up_here': 'ଏଠାରେ ସାଇନ୍ ଅପ୍ କରନ୍ତୁ',
    'auth.back_to_home': '← ହୋମକୁ ଫେରନ୍ତୁ',
    'auth.username': 'ଉପଯୋଗକର୍ତ୍ତାନାମ',
    
    'auth.join_brand': 'ଗ୍ୟାନ ଆରେନାରେ ଯୋଗ ଦିଅନ୍ତୁ',
    'auth.create_account_description': 'ଆପଣଙ୍କର ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ ଏବଂ ଆଜି ଶିକ୍ଷଣ ଆରମ୍ଭ କରନ୍ତୁ',
    'auth.create_account': 'ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ',
    'auth.create_account_cta': 'ଆରମ୍ଭ କରିବା ପାଇଁ ଆପଣଙ୍କର ବିବରଣୀ ପୂରଣ କରନ୍ତୁ',
    'auth.full_name': 'ପୂର୍ଣ୍ଣ ନାମ',
    'auth.role': 'ମୁଁ ଜଣେ',
    'auth.role_placeholder': 'ଆପଣଙ୍କର ଭୂମିକା ବାଛନ୍ତୁ',
    'auth.student': 'ଛାତ୍ର',
    'auth.teacher': 'ଶିକ୍ଷକ/ଶିକ୍ଷାବିତ୍',
    'auth.confirm_password': 'ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ',
    'auth.agree_terms': 'ମୁଁ ସହମତ',
    'auth.terms_service': 'ସେବା ସର୍ତ୍ତାବଳୀ',
    'auth.privacy_policy': 'ଗୋପନୀୟତା ନୀତି',
    'auth.have_account': 'ପୂର୍ବରୁ ଖାତା ଅଛି?',
    'auth.sign_in_here': 'ଏଠାରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
  },
};

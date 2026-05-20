/* ==========================================================================
   WORLD SPACE ALLIANCE (國際太空聯盟) - INTERACTION & LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialization ---
  initNavigation();
  initStarrySky();
  initLanguageSelector();
  initScrollReveals();
  initApplicationForm();
});

/* ==========================================================================
   1. NAVIGATION & LAYOUT LOGIC
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight nav link based on scroll position
    updateActiveNavLink();
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when a link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = mobileMenuBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Scroll active detection helper
  function updateActiveNavLink() {
    let scrollPos = window.scrollY + 120;
    document.querySelectorAll('section').forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. STARRY SKY CANVAS BACKGROUND
   ========================================================================== */
function initStarrySky() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const starCount = 150;
  
  // Fit canvas to viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }
  
  window.addEventListener('resize', resizeCanvas);
  
  // Track mouse for subtle parallax movement
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouse.targetY = (e.clientY - window.innerHeight / 2) * 0.05;
  });
  
  class Star {
    constructor() {
      this.reset(true);
    }
    
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : 0;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedY = Math.random() * 0.15 + 0.05; // very slow drift down
      this.speedX = (Math.random() - 0.5) * 0.05; // tiny sideways drift
      this.alpha = Math.random() * 0.5 + 0.3;
      this.twinkleSpeed = Math.random() * 0.01 + 0.005;
      this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
    }
    
    update() {
      // Drift
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Twinkle
      this.alpha += this.twinkleSpeed * this.twinkleDirection;
      if (this.alpha >= 1 || this.alpha <= 0.2) {
        this.twinkleDirection *= -1;
      }
      
      // Reset if out of bounds
      if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
        this.reset();
      }
    }
    
    draw() {
      // Apply mouse parallax interpolation
      const renderX = this.x + mouse.x * (this.size * 0.5);
      const renderY = this.y + mouse.y * (this.size * 0.5);
      
      ctx.beginPath();
      ctx.arc(renderX, renderY, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.shadowBlur = this.size > 1.2 ? 6 : 0;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for next draw
    }
  }
  
  function initStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
  }
  
  function animate() {
    // Smooth lerp mouse coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  resizeCanvas();
  animate();
}

/* ==========================================================================
   3. MULTILINGUAL (I18N) TRANSLATION ENGINE
   ========================================================================== */
let currentLanguage = 'en';

const i18n = {
  en: {
    badge_concept: "BEYOND BORDERS • GLOBAL SPACE INITIATIVE",
    hero_title_1: "Democratizing the",
    hero_title_2: "Cosmos for All",
    hero_tagline: "The World Space Alliance (WSA) is a global grassroots collective opening the pathways of space exploration to candidates from every nation, background, and walk of life. Space belongs to humanity, not just superpowers.",
    btn_apply: "Join Candidate Pool",
    btn_mission: "Explore Mission",
    
    nav_home: "Home",
    nav_mission: "Mission",
    nav_pathway: "Pathway",
    nav_portal: "Candidate Portal",
    
    sec_mission_badge: "CORE PILLARS",
    sec_mission_title: "Our Guiding Coordinates",
    sec_mission_desc: "We stand on the principle that the stars belong to everyone. Here is how we are mapping the journey to democratized spaceflight.",
    
    pill_access_title: "Equal Opportunity Access",
    pill_access_desc: "Eliminating nationalistic, financial, and geopolitical hurdles. If you qualify physically, mentally, and technically, you have a flight pathway.",
    
    pill_collab_title: "Open-Border Cooperation",
    pill_collab_desc: "Leveraging decentralized international partnerships to pool training resources, simulators, and space launches without territorial gatekeeping.",
    
    pill_tech_title: "Open Source Aerospace",
    pill_tech_desc: "Developing shared, open-source training curricula, safety parameters, and architectural frameworks to lower launch costs for all of humanity.",
    
    sec_path_badge: "TRAINING & MISSION TIMELINE",
    sec_path_title: "The Astronaut Journey",
    sec_path_desc: "Our decentralized framework transforms qualified citizen candidates into mission-ready spacefarers through a structured five-step path.",
    
    path_1_step: "PHASE 01",
    path_1_title: "Registration & Skill Profiling",
    path_1_desc: "Create your cosmic profile, log your scientific/technical expertise, and complete initial online cognitive assessments.",
    
    path_2_step: "PHASE 02",
    path_2_title: "Regional Physical Conditioning",
    path_2_desc: "Undergo localized physical screening, endurance training, and scuba-based zero-gravity simulation modules with regional partner facilities.",
    
    path_3_step: "PHASE 03",
    path_3_title: "Analogue Missions & Simulation",
    path_3_desc: "Participate in multi-week isolation simulations at analogue Martian bases, learning team dynamics, resource conservation, and extravehicular operations.",
    
    path_4_step: "PHASE 04",
    path_4_title: "Suborbital Test Flights",
    path_4_desc: "Graduate to suborbital flights and microgravity flight profiles, solidifying rocket integration, G-force tolerance, and instrument management.",
    
    path_5_step: "PHASE 05",
    path_5_title: "Orbital Deployment & Beyond",
    path_5_desc: "Assign to joint scientific research crews on collaborative space stations, deploying global civilian science projects into Earth's orbit.",
    
    sec_form_badge: "ASTRONAUT REGISTRATION",
    sec_form_title: "Apply to the Alliance",
    sec_form_desc: "The path to orbit begins with a single step. Register below to join the global database of future explorers and get notified when training centers open in your region.",
    
    form_legend: "Astronaut Candidate Profile",
    form_label_first: "First Name",
    form_label_last: "Last Name",
    form_label_email: "Email Address",
    form_label_nation: "Nationality",
    form_label_specialty: "Primary Area of Expertise",
    spec_option_eng: "Engineering / Systems",
    spec_option_sci: "Biological & Physical Sciences",
    spec_option_med: "Medical / Life Support",
    spec_option_pilot: "Aviation / Robotics",
    spec_option_comm: "Communications / Humanities",
    spec_option_other: "Other Supporting Skills",
    form_label_experience: "Describe your motivation & background",
    form_label_consent: "I consent to global cooperative training standards and share the vision of borderless exploration.",
    form_btn_submit: "Launch My Application",
    
    placeholder_first: "e.g., Neil",
    placeholder_last: "e.g., Armstrong",
    placeholder_email: "you@example.com",
    placeholder_nation: "e.g., Taiwan, Canada, Kenya",
    placeholder_experience: "Tell us about your background, why you want to go to space, and how you can support a diverse team...",
    
    modal_title: "Application Logged to Orbit",
    modal_desc: "Thank you for registering with the World Space Alliance. Your profile has been added to our global database. Together, we will reach the stars.",
    modal_close: "Return to Earth",
    
    footer_tagline: "Unifying humanity beyond borders, opening space exploration to every citizen of Earth.",
    footer_col_links: "Explore",
    footer_col_contact: "Contact & Status",
    footer_contact_text: "For partnerships and inquiries, contact us at: info@worldspacealliance.org",
    footer_disclaimer: "Status Notice: The World Space Alliance (WSA / 國際太空聯盟) is currently a grassroots NGO concept project and is not yet registered as a formal entity in any jurisdiction. All training plans and pathways represent futuristic design concepts.",
    footer_copy: "© 2026 World Space Alliance. All Rights Reserved."
  },
  
  zh: {
    badge_concept: "超越國界 • 全球航天倡議",
    hero_title_1: "普及宇宙探索",
    hero_title_2: "人人皆可觸及",
    hero_tagline: "國際太空聯盟 (WSA) 是一個全球性的民間聯合組織，旨在向來自不同國家、背景和生活階層的候選人敞開太空探索的大門。太空屬於全人類，而不僅僅是少數超級大國的專利。",
    btn_apply: "加入候選人庫",
    btn_mission: "探索聯盟使命",
    
    nav_home: "首頁",
    nav_mission: "核心使命",
    nav_pathway: "航天員通道",
    nav_portal: "候選人通道",
    
    sec_mission_badge: "核心支柱",
    sec_mission_title: "引領我們的核心價值",
    sec_mission_desc: "我們堅信星空屬於每一個人。以下是我們為普及太空飛行所規劃的執行方向。",
    
    pill_access_title: "平等機會的太空之路",
    pill_access_desc: "消除民族主義、財務門檻和地緣政治障礙。只要您的身體、心理和技術指標合格，就擁有飛向太空的權利。",
    
    pill_collab_title: "無邊界的國際合作",
    pill_collab_desc: "利用去中心化的國際合作夥伴關係，整合全球培訓資源、模擬器和發射機會，擯棄地域性的門檻限制。",
    
    pill_tech_title: "開源航天與教育",
    pill_tech_desc: "開發共享的開源訓練課程、安全指標和架構框架，以降低發射與培訓成本，造福全人類。",
    
    sec_path_badge: "培訓與任務時間線",
    sec_path_title: "航天員培育旅程",
    sec_path_desc: "我們的去中心化框架透過系統化的五個階段，將合格的平民候選人培養為做好執行任務準備的太空人。",
    
    path_1_step: "第一階段",
    path_1_title: "註冊與技能建檔",
    path_1_desc: "創建您的航天檔案，登錄您的科學或技術專長，並完成初步的線上認知能力評估。",
    
    path_2_step: "第二階段",
    path_2_title: "區域體能與環境適應",
    path_2_desc: "在區域合作設施中接受在地的物理篩選、耐力訓練以及基於水下模擬的失重訓練課程。",
    
    path_3_step: "第三階段",
    path_3_title: "模擬太空任務",
    path_3_desc: "在模擬火星基地進行為期數週的隔離飛行模擬，學習團隊協作、資源守恆和艙外操作。",
    
    path_4_step: "第四階段",
    path_4_title: "亞軌道測試飛行",
    path_4_desc: "晉級至亞軌道飛行和失重體驗，鞏固與火箭系統的整合度、抗超重能力及儀器操作能力。",
    
    path_5_step: "第五階段",
    path_5_title: "軌道部署與更遠探索",
    path_5_desc: "被指派至合作太空站的科研團隊中，將全球性的民間科學項目部署至地球軌道。",
    
    sec_form_badge: "航天員註冊",
    sec_form_title: "申請加入聯盟",
    sec_form_desc: "通往軌道之路始於足下。填寫下方表單以加入全球未來探索者數據庫，當您所在的區域開啟訓練中心時，您將第一時間獲得通知。",
    
    form_legend: "航天候選人檔案",
    form_label_first: "名字 (First Name)",
    form_label_last: "姓氏 (Last Name)",
    form_label_email: "電子郵件",
    form_label_nation: "國籍",
    form_label_specialty: "主要專業領域",
    spec_option_eng: "工程 / 系統",
    spec_option_sci: "生物與物理科學",
    spec_option_med: "醫療 / 生命支持",
    spec_option_pilot: "航空 / 機器人",
    spec_option_comm: "通訊 / 人文社科",
    spec_option_other: "其他輔助技能",
    form_label_experience: "請描述您的動機與背景",
    form_label_consent: "我同意全球合作訓練標準，並認同無國界太空探索的願景。",
    form_btn_submit: "發射我的申請",
    
    placeholder_first: "例如: 偉",
    placeholder_last: "例如: 張",
    placeholder_email: "you@example.com",
    placeholder_nation: "例如: 台灣、加拿大、肯亞",
    placeholder_experience: "請分享您的背景、為什麼想去太空，以及您如何能夠支持一個多元化的團隊...",
    
    modal_title: "申請已發射至軌道",
    modal_desc: "感謝您向國際太空聯盟註冊。您的候選人檔案已成功錄入全球數據庫。讓我們攜手同行，共赴星海。",
    modal_close: "返回地球",
    
    footer_tagline: "團結人類於國界之外，向地球上的每一位公民敞開太空探索的大門。",
    footer_col_links: "探索板塊",
    footer_col_contact: "聯繫與申明",
    footer_contact_text: "合作洽談與諮詢，請聯繫: info@worldspacealliance.org",
    footer_disclaimer: "狀態公告：國際太空聯盟 (WSA / 國際太空聯盟) 目前是一個非政府組織 (NGO) 的概念性倡議，尚未在任何司法管轄區正式註冊為法律實體。所有培訓計劃和路徑均代表未來學設計構想。",
    footer_copy: "© 2026 國際太空聯盟。保留所有權利。"
  }
};

function initLanguageSelector() {
  const langBtn = document.getElementById('lang-btn');
  if (!langBtn) return;

  langBtn.addEventListener('click', () => {
    // Toggle language state
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    
    // Update button text
    langBtn.innerHTML = `🌐 ${currentLanguage === 'en' ? '繁中' : 'EN'}`;
    
    // Apply translations
    translatePage();
    
    // Save preference
    localStorage.setItem('wsa_lang', currentLanguage);
  });

  // Check saved preference
  const savedLang = localStorage.getItem('wsa_lang');
  if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
    currentLanguage = savedLang;
    langBtn.innerHTML = `🌐 ${currentLanguage === 'en' ? '繁中' : 'EN'}`;
    translatePage();
  }
}

function translatePage() {
  const dictionary = i18n[currentLanguage];
  
  // Translate innerHTML/text
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (dictionary[key]) {
      element.innerHTML = dictionary[key];
    }
  });
  
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (dictionary[key]) {
      element.setAttribute('placeholder', dictionary[key]);
    }
  });
  
  // Adjust font styling slightly for Chinese to look more polished
  if (currentLanguage === 'zh') {
    document.body.style.letterSpacing = '0.5px';
  } else {
    document.body.style.letterSpacing = 'normal';
  }
}

/* ==========================================================================
   4. SCROLL REVEALS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after revealing to prevent repeated animations on scroll
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/* ==========================================================================
   5. ASTRONAUT APPLICATION FORM VALIDATION
   ========================================================================== */
function initApplicationForm() {
  const form = document.getElementById('candidate-form');
  const modal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');
  
  if (!form || !modal || !modalClose) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        if (!input.checked) {
          isValid = false;
          input.closest('.checkbox-group').style.outline = '1px solid rgba(255, 0, 122, 0.4)';
          input.closest('.checkbox-group').style.borderRadius = '4px';
          input.closest('.checkbox-group').style.padding = '0.2rem';
        } else {
          input.closest('.checkbox-group').style.outline = 'none';
          input.closest('.checkbox-group').style.padding = '0';
        }
      } else {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--accent-magenta)';
        } else {
          input.style.borderColor = 'var(--glass-border)';
        }
      }
    });
    
    if (isValid) {
      // Simulate form submission to orbit
      const submitBtn = form.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;
      
      // Loading animation
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 50 50" style="animation: spin 1s infinite linear; margin-right: 8px;">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200" stroke-dashoffset="0" style="stroke-linecap: round;"></circle>
        </svg>
        ${currentLanguage === 'en' ? 'Synchronizing with Satellite...' : '與衛星同步中...'}
      `;
      
      // Inject spin animation style temporarily if not present
      if (!document.getElementById('spin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spin-keyframes';
        style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }
      
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show success modal
        modal.classList.add('active');
        form.reset();
      }, 2000);
    }
  });
  
  // Close modal
  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  // Close modal clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/**
 * Aswin Raj R - Portfolio Interactive Engine
 * Handles GSAP animations, canvas starfield, 3D tilt, code editor, modals, and counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroAnimation();
  initStarCanvas();
  initCursorGlow();
  initNavigation();
  initCodeEditorTabs();
  initHeroAnimations();
  initCard3DTilt();
  initStatsCounter();
  initSkillsFilter();
  initProjectModals();
  initContactActions();
  initMascot();
});

/* --------------------------------------------------------------------------
   1. CINEMATIC DEVELOPER CHARACTER & ROPE INTRO SCENE
   -------------------------------------------------------------------------- */
let introCompleted = false;

function initIntroAnimation() {
  const introScene = document.getElementById('intro-scene');
  const portfolioWrapper = document.getElementById('portfolio-wrapper');
  const skipBtn = document.getElementById('skip-intro-btn');
  const replayBtn = document.getElementById('replay-intro-btn');

  if (!introScene) {
    triggerEntranceAnimations();
    return;
  }

  // Prevent scroll during intro
  document.body.style.overflow = 'hidden';

  // Check prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishIntro();
    return;
  }

  // Function to finalize and clean up intro
  function finishIntro() {
    if (introCompleted) return;
    introCompleted = true;

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf([
        '#dev-character',
        '#curtain-left',
        '#curtain-right',
        '#rope-system',
        '#rope-line',
        '#rope-handle',
        '#rope-sparks',
        '#intro-speech',
        '#intro-light-burst',
        '#char-arm-left',
        '#char-arm-right',
        '#char-leg-left',
        '#char-leg-right',
        '#char-head',
        '#character-shadow'
      ]);
      gsap.to(introScene, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          introScene.style.display = 'none';
          introScene.classList.add('intro-finished');
          document.body.style.overflow = '';
          if (portfolioWrapper) {
            portfolioWrapper.classList.remove('intro-active');
            portfolioWrapper.style.opacity = '1';
            portfolioWrapper.style.filter = 'none';
            portfolioWrapper.style.transform = 'none';
            portfolioWrapper.style.pointerEvents = 'auto';
          }
          triggerEntranceAnimations();
        }
      });
    } else {
      introScene.style.display = 'none';
      introScene.classList.add('intro-finished');
      document.body.style.overflow = '';
      if (portfolioWrapper) {
        portfolioWrapper.classList.remove('intro-active');
        portfolioWrapper.style.opacity = '1';
        portfolioWrapper.style.filter = 'none';
        portfolioWrapper.style.transform = 'none';
        portfolioWrapper.style.pointerEvents = 'auto';
      }
      triggerEntranceAnimations();
    }
  }

  // Skip button & Escape key listeners
  if (skipBtn) {
    skipBtn.addEventListener('click', finishIntro);
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !introCompleted) {
      finishIntro();
    }
  });

  // Replay intro button in nav
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      replayIntroAnimation();
    });
  }

  // Run the cinematic timeline
  runIntroTimeline(introScene, portfolioWrapper, finishIntro);
}

function runIntroTimeline(introScene, portfolioWrapper, onFinish) {
  // Wait if GSAP is still loading
  if (typeof gsap === 'undefined') {
    let checkAttempts = 0;
    const interval = setInterval(() => {
      checkAttempts++;
      if (typeof gsap !== 'undefined') {
        clearInterval(interval);
        runIntroTimeline(introScene, portfolioWrapper, onFinish);
      } else if (checkAttempts > 15) {
        clearInterval(interval);
        onFinish();
      }
    }, 80);
    return;
  }

  introCompleted = false;
  introScene.style.display = 'flex';
  introScene.classList.remove('intro-finished');
  introScene.style.opacity = '1';
  introScene.style.pointerEvents = 'auto';
  document.body.style.overflow = 'hidden';

  if (portfolioWrapper) {
    portfolioWrapper.classList.add('intro-active');
    portfolioWrapper.style.opacity = '0';
    portfolioWrapper.style.filter = 'blur(16px)';
    portfolioWrapper.style.transform = 'scale(0.96)';
    portfolioWrapper.style.pointerEvents = 'none';
  }

  // Step 0: Initial States (Dark Screen, hidden offscreen rope and character)
  gsap.set('#curtain-left', { xPercent: 0 });
  gsap.set('#curtain-right', { xPercent: 0 });
  gsap.set('#intro-light-burst', { scale: 0.1, opacity: 0 });
  gsap.set('#rope-system', { y: -650, rotation: 0 });
  gsap.set('#rope-line', { scaleY: 1 });
  gsap.set('#rope-handle', { y: 0, boxShadow: '0 0 25px #06b6d4, 0 0 50px rgba(168, 85, 247, 0.5), inset 0 0 12px #38bdf8' });
  gsap.set('#rope-sparks', { opacity: 0, scale: 0.5 });
  
  gsap.set('#dev-character', { x: -340, y: 0, scaleX: 1, scaleY: 1, rotation: 0 });
  gsap.set('#character-shadow', { scale: 1, opacity: 0.8 });
  gsap.set('#intro-speech', { scale: 0, opacity: 0 });
  
  gsap.set('#char-arm-left', { rotation: 0 });
  gsap.set('#char-arm-right', { rotation: 0 });
  gsap.set('#char-leg-left', { rotation: 0 });
  gsap.set('#char-leg-right', { rotation: 0 });
  gsap.set('#char-head', { rotation: 0 });
  gsap.set(['#char-eye-l', '#char-eye-r'], { y: 0 });

  const masterTl = gsap.timeline({
    delay: 0.35,
    onComplete: () => {
      onFinish();
    }
  });

  // Step 1: BOY/DEVELOPER CHARACTER WALKS INTO SCREEN (0.35s to 2.35s)
  masterTl.to('#dev-character', {
    x: 0,
    duration: 2.0,
    ease: 'power2.out'
  }, 'walk');

  // Realistic walking cycle with swinging legs, arms, and bobbing backpack
  const steps = 5;
  for (let i = 0; i < steps; i++) {
    const stepTime = `walk+=${i * 0.38}`;
    masterTl.to('#char-leg-left', { rotation: 24, duration: 0.19, yoyo: true, repeat: 1, ease: 'sine.inOut' }, stepTime)
            .to('#char-leg-right', { rotation: -24, duration: 0.19, yoyo: true, repeat: 1, ease: 'sine.inOut' }, stepTime)
            .to('#char-arm-left', { rotation: -22, duration: 0.19, yoyo: true, repeat: 1, ease: 'sine.inOut' }, stepTime)
            .to('#char-arm-right', { rotation: 22, duration: 0.19, yoyo: true, repeat: 1, ease: 'sine.inOut' }, stepTime)
            .to('#char-backpack', { y: -4, duration: 0.19, yoyo: true, repeat: 1, ease: 'sine.inOut' }, stepTime)
            .to('#dev-character', { y: -3, duration: 0.19, yoyo: true, repeat: 1, ease: 'sine.inOut' }, stepTime);
  }

  // Step 2: CHARACTER STOPS & settles into neutral stance (2.35s - 2.65s)
  masterTl.to(['#char-leg-left', '#char-leg-right', '#char-arm-left', '#char-arm-right', '#dev-character'], {
    rotation: 0,
    y: 0,
    duration: 0.3,
    ease: 'power2.out'
  }, 'stop');

  // Step 3: CHARACTER LOOKS AT USER & Step 4: WAVES HIS HAND (2.65s - 3.75s)
  masterTl.to('#char-arm-right', {
    rotation: -140,
    duration: 0.4,
    ease: 'back.out(1.7)'
  }, 'wave')
  // Step 5: SPEECH BUBBLE APPEARS: "Hi! 👋"
  .to('#intro-speech', {
    scale: 1,
    opacity: 1,
    duration: 0.35,
    ease: 'back.out(2)'
  }, 'wave+=0.1')
  // Wave hand side to side 5 times
  .to('#char-arm-right', {
    rotation: -162,
    duration: 0.14,
    yoyo: true,
    repeat: 5,
    ease: 'sine.inOut'
  }, 'wave+=0.3');

  // Step 6: CHARACTER LOOKS UP (3.75s - 4.35s)
  masterTl.to('#intro-speech', {
    scale: 0,
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in'
  }, 'lookUp')
  .to('#char-arm-right', {
    rotation: 0,
    duration: 0.3,
    ease: 'power2.out'
  }, 'lookUp')
  .to('#char-head', {
    rotation: -22,
    duration: 0.35,
    ease: 'power2.out'
  }, 'lookUp+=0.1')
  .to(['#char-eye-l', '#char-eye-r'], {
    y: -2.5,
    duration: 0.3,
    ease: 'power2.out'
  }, 'lookUp+=0.1');

  // Step 7: GLOWING ROPE DESCENDS FROM ABOVE (4.1s - 5.0s)
  masterTl.to('#rope-system', {
    y: 0,
    duration: 0.9,
    ease: 'bounce.out'
  }, 'ropeDescend')
  .to('#rope-system', {
    rotation: 3,
    duration: 0.25,
    yoyo: true,
    repeat: 2,
    ease: 'sine.inOut'
  }, 'ropeDescend+=0.3');

  // Step 8: CHARACTER CROUCHES in anticipation of jump (4.8s - 5.2s)
  masterTl.to('#dev-character', {
    y: 18,
    scaleY: 0.88,
    scaleX: 1.08,
    duration: 0.35,
    ease: 'power2.in'
  }, 'crouch')
  .to(['#char-arm-left', '#char-arm-right'], {
    rotation: 20,
    duration: 0.35,
    ease: 'power2.in'
  }, 'crouch')
  .to('#character-shadow', {
    scaleX: 1.2,
    scaleY: 0.9,
    opacity: 0.9,
    duration: 0.35
  }, 'crouch');

  // Step 9: CHARACTER JUMPS toward glowing rope handle (5.2s - 5.9s)
  masterTl.to('#dev-character', {
    y: -195,
    x: 52,
    scaleY: 1.06,
    scaleX: 0.95,
    duration: 0.65,
    ease: 'power2.out'
  }, 'jump')
  .to(['#char-arm-left', '#char-arm-right'], {
    rotation: -175,
    duration: 0.35,
    ease: 'power2.out'
  }, 'jump')
  .to(['#char-leg-left', '#char-leg-right'], {
    rotation: 14,
    duration: 0.4,
    ease: 'power2.out'
  }, 'jump')
  .to('#character-shadow', {
    scale: 0.35,
    opacity: 0.25,
    duration: 0.65,
    ease: 'power2.out'
  }, 'jump');

  // Step 10: CHARACTER CATCHES ROPE & handle sparks (5.9s - 6.1s)
  masterTl.to('#rope-handle', {
    boxShadow: '0 0 45px #06b6d4, 0 0 85px #a855f7, inset 0 0 20px #ffffff',
    duration: 0.15
  }, 'catch')
  .to('#rope-sparks', {
    opacity: 1,
    scale: 1.4,
    duration: 0.15
  }, 'catch')
  .to('#rope-sparks', {
    opacity: 0,
    scale: 2.2,
    duration: 0.3
  }, 'catch+=0.15');

  // Step 11: CHARACTER PULLS ROPE DOWN with body weight (6.1s - 6.6s)
  masterTl.to('#dev-character', {
    y: -65,
    rotation: -6,
    duration: 0.45,
    ease: 'power2.in'
  }, 'pull')
  .to('#rope-line', {
    scaleY: 1.5,
    duration: 0.45,
    ease: 'power2.in'
  }, 'pull')
  .to('#rope-handle', {
    y: 110,
    duration: 0.45,
    ease: 'power2.in'
  }, 'pull')
  .to('#intro-stage', {
    x: 5,
    duration: 0.06,
    yoyo: true,
    repeat: 4,
    ease: 'none'
  }, 'pull+=0.15');

  // Step 12: DARK CURTAINS OPEN dramatically (6.4s - 7.7s)
  masterTl.to('#curtain-left', {
    xPercent: -100,
    duration: 1.35,
    ease: 'power4.inOut'
  }, 'curtains')
  .to('#curtain-right', {
    xPercent: 100,
    duration: 1.35,
    ease: 'power4.inOut'
  }, 'curtains')
  // Step 13: LARGE PURPLE/BLUE LIGHT BURST (6.5s - 7.4s)
  .to('#intro-light-burst', {
    scale: 4.5,
    opacity: 1,
    duration: 0.55,
    ease: 'power2.out'
  }, 'curtains+=0.1')
  .to('#intro-light-burst', {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in'
  }, 'curtains+=0.55');

  // Step 14: COMPLETE PORTFOLIO HOMEPAGE IS REVEALED (6.7s - 7.7s)
  if (portfolioWrapper) {
    masterTl.to(portfolioWrapper, {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 1.0,
      ease: 'power3.out'
    }, 'curtains+=0.3');
  }

  // Step 15: INTRO DISAPPEARS & Step 16: NORMAL WEBSITE BECOMES INTERACTIVE
  masterTl.to(introScene, {
    opacity: 0,
    duration: 0.45,
    ease: 'power2.inOut'
  }, 'curtains+=0.85');
}

function replayIntroAnimation() {
  introCompleted = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const introScene = document.getElementById('intro-scene');
  const portfolioWrapper = document.getElementById('portfolio-wrapper');
  
  if (!introScene) return;

  function finishIntro() {
    if (introCompleted) return;
    introCompleted = true;
    introScene.style.display = 'none';
    introScene.classList.add('intro-finished');
    document.body.style.overflow = '';
    if (portfolioWrapper) {
      portfolioWrapper.classList.remove('intro-active');
      portfolioWrapper.style.opacity = '1';
      portfolioWrapper.style.filter = 'none';
      portfolioWrapper.style.transform = 'none';
      portfolioWrapper.style.pointerEvents = 'auto';
    }
    triggerEntranceAnimations();
  }

  runIntroTimeline(introScene, portfolioWrapper, finishIntro);
}

/* --------------------------------------------------------------------------
   2. COSMIC STARFIELD CANVAS
   -------------------------------------------------------------------------- */
function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const stars = [];
  const STAR_COUNT = window.innerWidth < 768 ? 45 : 95;

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#a855f7' : '#ffffff')
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.x += star.speedX + (mouseX - width / 2) * 0.00004;
      star.y += star.speedY + (mouseY - height / 2) * 0.00004;
      star.alpha += star.pulseSpeed;

      if (star.alpha > 0.95 || star.alpha < 0.2) {
        star.pulseSpeed = -star.pulseSpeed;
      }

      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.shadowBlur = 8;
      ctx.shadowColor = star.color;
      ctx.fill();
    });

    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/* --------------------------------------------------------------------------
   3. CURSOR GLOW (DESKTOP)
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.innerWidth < 1024) return;

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function updateGlow() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(updateGlow);
  }

  updateGlow();
}

/* --------------------------------------------------------------------------
   4. NAVIGATION & SCROLL SPY
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }

  // Active section scroll spy
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Auto-hide scroll indicator when scrolling
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
      if (window.scrollY > 80) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '0.85';
        scrollIndicator.style.pointerEvents = 'auto';
      }
    }
  });

  // Dynamic Scroll Depth Progress Bar
  const progressBar = document.getElementById('scroll-progress-bar');
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    const progress = Math.min(100, Math.max(0, (currentScroll / scrollTotal) * 100));
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();
}

/* --------------------------------------------------------------------------
   5. CODE EDITOR TAB SWITCHER & TYPING
   -------------------------------------------------------------------------- */
const CODE_SNIPPETS = {
  'developer.ts': `
<span class="code-keyword">const</span> <span class="code-var">developer</span> = {
  <span class="code-fn">name</span>: <span class="code-str">"Aswin Raj R"</span>,
  <span class="code-fn">role</span>: <span class="code-str">"Junior Software Developer"</span>,
  <span class="code-fn">stack</span>: [<span class="code-str">"Python"</span>, <span class="code-str">"Django"</span>, <span class="code-str">"MongoDB"</span>],
  <span class="code-fn">mindset</span>: <span class="code-str">"Problem Solver & Builder"</span>
};

<span class="code-keyword">function</span> <span class="code-fn">executePipeline</span>() {
  <span class="code-fn">build</span>(); <span class="code-comment">// architect modular code</span>
  <span class="code-fn">test</span>();  <span class="code-comment">// verify functionality</span>
  <span class="code-fn">debug</span>(); <span class="code-comment">// root cause isolation</span>
  <span class="code-fn">deploy</span>();<span class="code-comment">// ship to production 🚀</span>
}`,

  'workflow.py': `
<span class="code-keyword">class</span> <span class="code-var">EngineerJourney</span>:
    <span class="code-keyword">def</span> <span class="code-fn">__init__</span>(self):
        self.education = <span class="code-str">"Diploma in Computer Engg"</span>
        self.college = <span class="code-str">"Model Polytechnic College"</span>
        self.experience = <span class="code-str">"GrapesGenix Tech Solutions"</span>

    <span class="code-keyword">def</span> <span class="code-fn">solve_challenge</span>(self, issue):
        diagnostic = self.inspect_logs(issue)
        patch = self.refactor(diagnostic)
        <span class="code-keyword">return</span> patch.verified_success()`,

  'status.sh': `
<span class="code-comment"># CI/CD Workflow Pipeline</span>
$ echo <span class="code-str">"Connecting to cloud runtime..."</span>
$ git status --short
$ pytest tests/ --verbose
$ python manage.py check --deploy
<span class="code-var">> Build Status:</span> <span class="code-str">ALL CHECKS PASSED [200 OK]</span>
<span class="code-fn">> Ready for deployment to Koyeb & Render...</span>`
};

function initCodeEditorTabs() {
  const tabs = document.querySelectorAll('.screen-tab');
  const codeArea = document.getElementById('code-display');
  if (!codeArea) return;

  codeArea.innerHTML = CODE_SNIPPETS['developer.ts'];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filename = tab.getAttribute('data-tab');
      if (CODE_SNIPPETS[filename]) {
        codeArea.innerHTML = CODE_SNIPPETS[filename];
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. GSAP ENTRANCE & SCROLLTRIGGER
   -------------------------------------------------------------------------- */
function triggerEntranceAnimations() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.site-nav', { y: -30, opacity: 0, duration: 0.8 })
    .from('.status-badge', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-kicker', { opacity: 0, duration: 0.4 }, '-=0.3')
    .from('.hero-title', { y: 25, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.hero-role', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.hero-description', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-actions', { y: 15, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('.hero-socials', { opacity: 0, duration: 0.5 }, '-=0.3')
    .from('.workspace-laptop', { scale: 0.85, opacity: 0, duration: 1 }, '-=0.9')
    .from('.floating-tech-card', { scale: 0.5, opacity: 0, stagger: 0.08, duration: 0.7 }, '-=0.7')
    .from('.floating-code-panel, .floating-rocket, .floating-coffee, .floating-notebook, .mascot-companion', {
      scale: 0.7,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7
    }, '-=0.6');
}

function initHeroAnimations() {
  // Laptop mouse parallax
  const heroVisual = document.querySelector('.hero-visual-wrapper');
  const laptop = document.querySelector('.workspace-laptop');
  if (!heroVisual || !laptop || window.innerWidth < 1024) return;

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    laptop.style.transform = `rotateY(${x * 20 - 14}deg) rotateX(${-y * 20 + 10}deg) translateZ(15px)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    laptop.style.transform = `rotateY(-14deg) rotateX(10deg) translateZ(10px)`;
  });
}

/* --------------------------------------------------------------------------
   7. 3D TILT ON CARDS
   -------------------------------------------------------------------------- */
function initCard3DTilt() {
  if (window.innerWidth < 1024) return;

  const tiltCards = document.querySelectorAll('.project-card, .skill-card, .hackathon-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   8. STATS COUNTERS (Intersection Observer)
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target') || '0', 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 30));
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                counter.textContent = `${target}${suffix}`;
                clearInterval(interval);
              } else {
                counter.textContent = `${current}${suffix}`;
              }
            }, 35);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) observer.observe(statsStrip);
}

/* --------------------------------------------------------------------------
   9. SKILLS FILTER TABS
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. INTERACTIVE PROJECT DETAILS MODAL
   -------------------------------------------------------------------------- */
const PROJECT_DETAILS = {
  1: {
    title: 'Telegram AutoFilter Bot',
    kicker: 'AUTOMATION & BOT INFRASTRUCTURE',
    badge: 'Python · Telegram Bot · MongoDB',
    description: 'An automated Telegram bot designed to make file searching and access easier through filtering and search functionality.',
    architecture: 'Built using asynchronous Python wrappers for Telegram Bot API coupled with MongoDB collection indexing for low-latency query results.',
    features: [
      'Automated filename indexing and keyword regex filtering',
      'Scalable MongoDB database caching query results',
      'Inline search keyboard buttons with rapid pagination',
      'Admin control commands for channel & group management'
    ],
    tech: ['Python', 'Pyrogram/Telethon', 'MongoDB', 'AsyncIO'],
    repo: 'https://github.com/aswiiz/aswiiz'
  },
  2: {
    title: 'Student Attendance Management System',
    kicker: 'INSTITUTIONAL WEB APPLICATION',
    badge: 'Python · Django · HTML · CSS',
    description: 'A web-based attendance management system designed to digitally record, manage and organize student attendance efficiently.',
    architecture: 'Engineered on Django MVT architecture with role-based access for faculty and administrators, relational tracking of attendance dates, and batch CSV export.',
    features: [
      'Student database management & department categorization',
      'Daily attendance recording with instant visual status indicators',
      'Monthly attendance percentage calculators and shortfall alerts',
      'Organized data reporting and exportable class summaries'
    ],
    tech: ['Django', 'Python', 'HTML5', 'CSS3', 'SQLite/PostgreSQL'],
    repo: 'https://github.com/aswiiz/aswiiz'
  },
  3: {
    title: 'Healthcare Hub',
    kicker: 'DIGITAL HEALTH PLATFORM',
    badge: 'Django · MongoDB · HTML · CSS',
    description: 'A healthcare-focused digital platform designed to bring healthcare-related services and information into one accessible web application.',
    architecture: 'Integrates patient consultation appointment bookings, medical directory lookup, and digital record views into a single unified responsive portal.',
    features: [
      'Centralized healthcare information and doctor availability directory',
      'User-friendly digital healthcare workflow for appointment requests',
      'Digital record storage for prescriptions and patient test logs',
      'Practical web-based responsive solution accessible across devices'
    ],
    tech: ['Django', 'MongoDB', 'JavaScript', 'HTML5', 'CSS3'],
    repo: 'https://github.com/aswiiz/aswiiz'
  },
  4: {
    title: 'Web Applications & Experiments',
    kicker: 'FULL-STACK LAB & EXPLORATION',
    badge: 'Python · Django · JavaScript · MongoDB',
    description: 'A collection of web development projects and experiments created while learning backend development, frontend development, databases, deployment, testing, and debugging.',
    architecture: 'Serves as an ongoing technical sandbox testing REST APIs, asynchronous database queries, responsive UI prototypes, and CI/CD deploy configs.',
    features: [
      'Modular backend API experiments with Django and Python',
      'Responsive frontend interfaces with micro-interactions',
      'Database schema experimentation with MongoDB NoSQL document design',
      'Hands-on deployment, debugging, and continuous improvement tests'
    ],
    tech: ['Python', 'Django', 'JavaScript ES6+', 'MongoDB', 'Git'],
    repo: 'https://github.com/aswiiz/aswiiz'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal) return;

  function openModal(projectId) {
    const data = PROJECT_DETAILS[projectId];
    if (!data) return;

    document.getElementById('modal-kicker').textContent = data.kicker;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-badge').textContent = data.badge;
    document.getElementById('modal-desc').textContent = data.description;
    document.getElementById('modal-arch').textContent = data.architecture;

    const featList = document.getElementById('modal-features');
    featList.innerHTML = '';
    data.features.forEach((feat) => {
      const li = document.createElement('li');
      li.style.cssText = 'margin-bottom: 0.4rem; color: #cbd5e1; font-size: 0.9rem;';
      li.innerHTML = `<span style="color: #06b6d4; margin-right: 0.5rem;">✦</span>${feat}`;
      featList.appendChild(li);
    });

    const techWrap = document.getElementById('modal-tech');
    techWrap.innerHTML = '';
    data.tech.forEach((t) => {
      const tag = document.createElement('span');
      tag.className = 'project-tag';
      tag.textContent = t;
      techWrap.appendChild(tag);
    });

    const repoBtn = document.getElementById('modal-repo-link');
    if (repoBtn) repoBtn.href = data.repo;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project-id');
      openModal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   11. CONTACT & CLIPBOARD ACTIONS
   -------------------------------------------------------------------------- */
function initContactActions() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  const contactForm = document.getElementById('contact-form');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('rajraswin51@gmail.com').then(() => {
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'COPIED!';
        copyEmailBtn.style.color = '#34d399';
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
          copyEmailBtn.style.color = '';
        }, 2000);
      });
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('8848263704').then(() => {
        const originalText = copyPhoneBtn.textContent;
        copyPhoneBtn.textContent = 'COPIED!';
        copyPhoneBtn.style.color = '#34d399';
        setTimeout(() => {
          copyPhoneBtn.textContent = originalText;
          copyPhoneBtn.style.color = '';
        }, 2000);
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      const mailtoLink = `mailto:rajraswin51@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoLink;
    });
  }
}

/* --------------------------------------------------------------------------
   12. INTERACTIVE CYBERNETIC CHARACTERS & MASCOTS
   -------------------------------------------------------------------------- */
function initMascot() {
  // 1. Hero Mascot "Byte"
  const byteMascot = document.querySelector('.mascot-companion');
  if (byteMascot) {
    byteMascot.addEventListener('click', () => {
      byteMascot.style.transform = 'translateY(-15px) scale(1.18)';
      const eyes = byteMascot.querySelectorAll('.mascot-eye');
      eyes.forEach((eye) => {
        eye.style.background = '#a855f7';
        eye.style.boxShadow = '0 0 14px #a855f7';
      });

      setTimeout(() => {
        byteMascot.style.transform = '';
        eyes.forEach((eye) => {
          eye.style.background = 'var(--neon-cyan)';
          eye.style.boxShadow = '0 0 6px var(--neon-cyan)';
        });
      }, 650);
    });
  }

  // 2. Scout Drone (Projects Section)
  const scout = document.querySelector('[data-character="scout"]');
  if (scout) {
    scout.addEventListener('click', () => {
      scout.style.transform = 'translateY(-12px) rotate(360deg) scale(1.15)';
      scout.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      const lens = scout.querySelector('.scout-lens-core');
      if (lens) lens.style.fill = '#f43f5e';

      setTimeout(() => {
        scout.style.transform = '';
        scout.style.transition = '';
        if (lens) lens.style.fill = '#06b6d4';
      }, 750);
    });
  }

  // 3. Logic Bot (About Section)
  const logic = document.querySelector('[data-character="logic"]');
  if (logic) {
    logic.addEventListener('click', () => {
      logic.style.transform = 'scale(1.2) translateY(-8px)';
      const eyeText = logic.querySelector('.logic-eyes text');
      if (eyeText) eyeText.textContent = '^ _ ^';

      setTimeout(() => {
        logic.style.transform = '';
        if (eyeText) eyeText.textContent = '✦ ✦';
      }, 800);
    });
  }

  // 4. Spark Core (Skills Section)
  const spark = document.querySelector('[data-character="spark"]');
  if (spark) {
    spark.addEventListener('click', () => {
      spark.style.transform = 'scale(1.25) rotate(180deg)';
      spark.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      const plasma = spark.querySelector('.plasma-pulse');
      if (plasma) {
        plasma.style.fill = '#a855f7';
        plasma.style.filter = 'drop-shadow(0 0 15px #a855f7)';
      }

      setTimeout(() => {
        spark.style.transform = '';
        spark.style.transition = '';
        if (plasma) {
          plasma.style.fill = '#38bdf8';
          plasma.style.filter = '';
        }
      }, 700);
    });
  }

  // 5. Astro Cosmonaut (Deployment Section)
  const astro = document.querySelector('[data-character="astro"]');
  if (astro) {
    astro.addEventListener('click', () => {
      astro.style.transform = 'translateY(-22px) rotate(15deg) scale(1.2)';
      astro.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      const flames = astro.querySelectorAll('.astro-jetpack-flame');
      flames.forEach((flame) => {
        flame.style.transform = 'scaleY(2) scaleX(1.4)';
        flame.style.fill = '#06b6d4';
      });

      setTimeout(() => {
        astro.style.transform = '';
        astro.style.transition = '';
        flames.forEach((flame) => {
          flame.style.transform = '';
          flame.style.fill = '#f59e0b';
        });
      }, 800);
    });
  }

  // 6. Echo Messenger (Contact Section)
  const echo = document.querySelector('[data-character="echo"]');
  if (echo) {
    echo.addEventListener('click', () => {
      echo.style.transform = 'translateY(-14px) scale(1.2)';
      const heart = echo.querySelector('.echo-heart');
      if (heart) {
        heart.style.fill = '#38bdf8';
        heart.style.transform = 'scale(1.3)';
        heart.style.transformOrigin = 'center';
      }

      setTimeout(() => {
        echo.style.transform = '';
        if (heart) {
          heart.style.fill = '#f43f5e';
          heart.style.transform = '';
        }
      }, 700);
    });
  }
}

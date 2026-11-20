import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import CTASection from './components/Landing/CTASection';
import Footer from './components/Landing/Footer';
import ShowcasePage from './components/Landing/ShowcasePage';
import ProjectDetailPage from './components/Landing/ProjectDetailPage';
import MoreGalleryPage from './components/Landing/MoreGalleryPage';
import EverythingCreatePage from './components/Landing/EverythingCreatePage';
import WaterfallSectionPage, { isWaterfallSectionId } from './components/Landing/WaterfallSectionPage';
import { showcaseMediaBySlug, showcases } from './content/showcases';
import { siteConfig } from './content/siteConfig';

const clickEmojis = siteConfig.clickEffect.emojis;
const clickBlessings = siteConfig.clickEffect.messages;

type EmojiBurst = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  size: number;
};

type BlessingBurst = {
  id: number;
  text: string;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
};

function getRouteState() {
  if (typeof window === 'undefined') {
    return {
      page: null,
      showcaseSlug: null,
      projectId: null,
      sectionId: null,
      caseId: null,
    };
  }

  if (window.location.hash === '#more-gallery') {
    return {
      page: 'more-gallery',
      showcaseSlug: null,
      projectId: null,
      sectionId: null,
      caseId: null,
    };
  }

  if (window.location.hash === '#everything-create') {
    return {
      page: 'everything-create',
      showcaseSlug: null,
      projectId: null,
      sectionId: null,
      caseId: null,
    };
  }

  const sectionCaseMatch = window.location.hash.match(/^#showcase\/([^/]+)\/section\/([^/]+)\/case\/([^/]+)$/);

  if (sectionCaseMatch) {
    return {
      page: null,
      showcaseSlug: sectionCaseMatch[1] ?? null,
      projectId: null,
      sectionId: sectionCaseMatch[2] ?? null,
      caseId: sectionCaseMatch[3] ?? null,
    };
  }

  const sectionMatch = window.location.hash.match(/^#showcase\/([^/]+)\/section\/([^/]+)$/);

  if (sectionMatch) {
    return {
      page: null,
      showcaseSlug: sectionMatch[1] ?? null,
      projectId: null,
      sectionId: sectionMatch[2] ?? null,
      caseId: null,
    };
  }

  const projectMatch = window.location.hash.match(/^#showcase\/([^/]+)\/project\/([^/]+)$/);

  if (projectMatch) {
    return {
      page: null,
      showcaseSlug: projectMatch[1] ?? null,
      projectId: projectMatch[2] ?? null,
      sectionId: null,
      caseId: null,
    };
  }

  const showcaseMatch = window.location.hash.match(/^#showcase\/([^/]+)$/);

  return {
    page: null,
    showcaseSlug: showcaseMatch?.[1] ?? null,
    projectId: null,
    sectionId: null,
    caseId: null,
  };
}

function App() {
  const [routeState, setRouteState] = useState(getRouteState());
  const [emojiBursts, setEmojiBursts] = useState<EmojiBurst[]>([]);
  const [blessingBursts, setBlessingBursts] = useState<BlessingBurst[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      setRouteState(getRouteState());
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = siteConfig.site.language;
    document.title = siteConfig.site.title;

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.appendChild(description);
    }
    description.content = siteConfig.site.description;

    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) {
      icon.href = siteConfig.brand.icon;
    }

    const appleTouchIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (appleTouchIcon) {
      appleTouchIcon.href = siteConfig.brand.icon;
    }
  }, []);

  useEffect(() => {
    if (!routeState.showcaseSlug && routeState.page !== 'more-gallery') {
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [routeState.caseId, routeState.page, routeState.projectId, routeState.sectionId, routeState.showcaseSlug]);

  useEffect(() => {
    if (!emojiBursts.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setEmojiBursts((current) => current.slice(6));
    }, 900);

    return () => window.clearTimeout(timer);
  }, [emojiBursts]);

  useEffect(() => {
    if (!blessingBursts.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setBlessingBursts((current) => current.slice(1));
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [blessingBursts]);

  const activeShowcase = showcases.find((item) => item.slug === routeState.showcaseSlug) ?? null;
  const activeProject = activeShowcase && routeState.projectId
    ? (showcaseMediaBySlug[activeShowcase.slug] ?? []).find((item) => item.id === routeState.projectId) ?? null
    : null;
  const activeWaterfallSection = activeShowcase && isWaterfallSectionId(routeState.sectionId)
    ? routeState.sectionId
    : null;
  const activeStandalonePage = routeState.page;

  const handleBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!siteConfig.clickEffect.enabled || activeStandalonePage) {
      return;
    }

    const target = event.target as HTMLElement;
    const interactiveTarget = target.closest(
      'a, button, input, textarea, select, label, summary, video, img, [role="button"]',
    );

    if (interactiveTarget) {
      return;
    }

    const chosenEmojis = [...clickEmojis]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    const leadEmoji = chosenEmojis[0] ?? '✨';
    const blessing = clickBlessings[Math.floor(Math.random() * clickBlessings.length)] ?? '欢迎光临';

    const nextBursts = chosenEmojis.map((emoji, index) => ({
      id: Date.now() + index + Math.random(),
      emoji,
      x: event.clientX,
      y: event.clientY,
      dx: (Math.random() - 0.5) * 140,
      dy: -40 - Math.random() * 110,
      rotate: (Math.random() - 0.5) * 90,
      size: 18 + Math.random() * 14,
    }));

    const nextBlessing = {
      id: Date.now() + Math.random(),
      text: blessing,
      emoji: leadEmoji,
      x: event.clientX,
      y: event.clientY,
      dx: (Math.random() - 0.5) * 28,
      dy: -78 - Math.random() * 44,
      rotate: (Math.random() - 0.5) * 10,
    };

    setEmojiBursts((current) => [...current, ...nextBursts].slice(-30));
    setBlessingBursts((current) => [...current, nextBlessing].slice(-8));
  };

  return (
    <div onClick={handleBackgroundClick}>
      <Navbar />
      {activeStandalonePage === 'everything-create' ? (
        <EverythingCreatePage />
      ) : activeStandalonePage === 'more-gallery' ? (
        <MoreGalleryPage />
      ) : activeShowcase && activeWaterfallSection ? (
        <WaterfallSectionPage showcase={activeShowcase} sectionId={activeWaterfallSection} caseId={routeState.caseId} />
      ) : activeShowcase && activeProject ? (
        <ProjectDetailPage showcase={activeShowcase} project={activeProject} />
      ) : activeShowcase ? (
        <ShowcasePage showcase={activeShowcase} />
      ) : (
        <>
          <Hero />
          <div className="min-h-screen bg-surface-950">
            <Features />
            <CTASection />
            <Footer />
          </div>
        </>
      )}
      <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
        {blessingBursts.map((burst) => (
          <span
            key={burst.id}
            className="blessing-burst"
            style={{
              left: burst.x,
              top: burst.y,
              '--blessing-dx': `${burst.dx}px`,
              '--blessing-dy': `${burst.dy}px`,
              '--blessing-rotate': `${burst.rotate}deg`,
            } as CSSProperties}
          >
            <span>{burst.emoji}</span>
            <span>{burst.text}</span>
          </span>
        ))}
        {emojiBursts.map((burst) => (
          <span
            key={burst.id}
            className="emoji-burst"
            style={{
              left: burst.x,
              top: burst.y,
              '--emoji-dx': `${burst.dx}px`,
              '--emoji-dy': `${burst.dy}px`,
              '--emoji-rotate': `${burst.rotate}deg`,
              '--emoji-size': `${burst.size}px`,
            } as CSSProperties}
          >
            {burst.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;

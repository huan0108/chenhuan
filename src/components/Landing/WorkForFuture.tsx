import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { homeConfig } from '../../content/homeConfig';
import CardWallSection from './CardWallSection';

const workFutureConfig = homeConfig.workFuture;
const CARD_IMAGES = workFutureConfig.slidingCards;

const SHOWCASE_LAYOUTS = [
  'left-[3vw] top-[9.5vw] aspect-[3/4] w-[10.925vw]',
  'bottom-[6.2vw] left-[16vw] aspect-[16/9] w-[25.3vw]',
  'right-[21vw] top-[4.5vw] aspect-[3/4] w-[17.25vw]',
  'bottom-[9vw] right-[4vw] aspect-[3/4] w-[13.8vw]',
];

const SHOWCASE_FLOATS = workFutureConfig.showcase.floatingImages.map((src, index) => ({
  src,
  className: SHOWCASE_LAYOUTS[index] ?? '',
}));

const headingLineVariants = {
  rest: { x: 0, y: 0, rotate: 0, scale: 1 },
  hover: (index: number) => {
    const layouts = [
      { x: 18, y: -8, rotate: -1.2, scale: 1.02 },
      { x: -22, y: 6, rotate: 0.8, scale: 0.995 },
      { x: 14, y: 14, rotate: -0.6, scale: 1.01 },
    ];
    return layouts[index] ?? layouts[0];
  },
};

const headingWordVariants = {
  rest: { x: 0, y: 0, rotate: 0, scale: 1 },
  hover: (index: number) => {
    const layouts = [
      { x: -12, y: -8, rotate: -2.2, scale: 1.02 },
      { x: 16, y: 8, rotate: 1.4, scale: 0.985 },
      { x: -8, y: 12, rotate: -1.2, scale: 1.01 },
      { x: 14, y: -10, rotate: 2, scale: 1.03 },
      { x: -16, y: 6, rotate: -1.6, scale: 0.99 },
    ];
    return layouts[index] ?? layouts[0];
  },
};

function SlidingCard({ images, delay = 0 }: { images: readonly string[]; delay?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [images.length, delay]);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="lazy"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  );
}

function AccentLetters({
  word,
  accents,
}: {
  word: string;
  accents: readonly { index: number; color: string }[];
}) {
  return (
    <>
      {word.split('').map((letter, index) => {
        const color = accents.find((accent) => accent.index === index)?.color;
        return (
          <span key={`${word}-${index}`} style={color ? { color } : undefined}>
            {letter}
          </span>
        );
      })}
    </>
  );
}

function WorkFutureShowcase({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      className="relative left-1/2 mb-52 hidden h-[56.25vw] w-screen -translate-x-1/2 -translate-y-[244px] overflow-hidden md:block"
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {SHOWCASE_FLOATS.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute z-10 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.35)] ${item.className}`}
          initial={{ opacity: 0, y: 26, scale: 0.94 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          whileHover={{
            y: -12,
            scale: 1.08,
            rotateX: item.className.includes('top') ? 8 : -8,
            rotateY: item.className.includes('left') ? -10 : 10,
            filter: 'brightness(1.1)',
          }}
          transition={{
            opacity: { duration: 0.72, delay: 0.12 + index * 0.08, ease: [0.22, 1, 0.36, 1] },
            y: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            scale: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            rotateX: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            rotateY: { type: 'spring', stiffness: 420, damping: 24, mass: 0.65 },
            filter: { duration: 0.16, ease: 'easeOut' },
          }}
          style={{ transformPerspective: 900, transformStyle: 'preserve-3d' }}
        >
          <img
            src={item.src}
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
            loading="lazy"
          />
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <motion.div
          className="pointer-events-auto relative cursor-default"
          initial="rest"
          whileHover="hover"
        >
          <motion.h3
            className="text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
            <span className="block">
              <motion.span
                className="inline-block origin-left"
                variants={headingLineVariants}
                custom={0}
                transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
              >
                <motion.span
                  className="inline-block"
                  variants={headingWordVariants}
                  custom={0}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                >
                  <AccentLetters
                    word={workFutureConfig.showcase.line1.text}
                    accents={workFutureConfig.showcase.line1.accents}
                  />
                </motion.span>
              </motion.span>
            </span>

            <span className="mt-2 block">
              <motion.span
                className="inline-flex origin-center items-center justify-center gap-[0.18em] lg:gap-[0.22em]"
                variants={headingLineVariants}
                custom={1}
                transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.02 }}
              >
                <motion.span
                  className="inline-block"
                  variants={headingWordVariants}
                  custom={1}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                >
                  <AccentLetters
                    word={workFutureConfig.showcase.line2Start.text}
                    accents={workFutureConfig.showcase.line2Start.accents}
                  />
                </motion.span>
                <motion.a
                  href="#everything-create"
                  className="inline-flex min-w-[3.25em] cursor-pointer items-center justify-center rounded-full bg-[#9CFF3F] px-[0.42em] py-[0.12em] align-middle text-[0.46em] leading-none tracking-[-0.04em] text-black transition-colors duration-200 hover:bg-[#b8ff6a]"
                  variants={headingWordVariants}
                  custom={2}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  {workFutureConfig.showcase.buttonLabel}
                </motion.a>
                <motion.span
                  className="inline-block"
                  variants={headingWordVariants}
                  custom={3}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.03 }}
                >
                  <AccentLetters
                    word={workFutureConfig.showcase.line2End.text}
                    accents={workFutureConfig.showcase.line2End.accents}
                  />
                </motion.span>
              </motion.span>
            </span>

            <span className="mt-2 block">
              <motion.span
                className="inline-block origin-left"
                variants={headingLineVariants}
                custom={2}
                transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.04 }}
              >
                <motion.span
                  className="inline-block"
                  variants={headingWordVariants}
                  custom={4}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.04 }}
                >
                  <AccentLetters
                    word={workFutureConfig.showcase.line3.text}
                    accents={workFutureConfig.showcase.line3.accents}
                  />
                </motion.span>
              </motion.span>
            </span>
          </motion.h3>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function WorkForFuture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative w-full bg-black py-[250px]"
    >
      <WorkFutureShowcase isInView={isInView} />

      <div
        className="relative z-[1] mb-[520px]"
        style={{ marginTop: 'clamp(-300px, calc(218px - 45vh), -160px)' }}
      >
        <CardWallSection />
      </div>

      <div className="flex pb-16 lg:pb-24" style={{ transform: 'translateY(-200px)', marginBottom: '-200px' }}>

        {/* Left — text block with hover effect */}
        <div className="flex flex-1 items-center px-5 sm:px-6 lg:px-8 xl:px-10">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative cursor-default"
              initial="rest"
              whileHover="hover"
            >
              <h2 className="text-[1.95rem] font-medium uppercase leading-[0.9] tracking-[-0.08em] text-[#F2F0E8] sm:text-[2.5rem] lg:text-[4.6rem] xl:text-[5.8rem]">
                <span className="mb-4 block leading-[0.9] lg:mb-6">
                  <motion.span
                    className="inline-block origin-left"
                    variants={headingLineVariants}
                    custom={0}
                    transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
                  >
                    <motion.span
                      className="inline-block"
                      variants={headingWordVariants}
                      custom={0}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                    >
                      {workFutureConfig.heading.eyebrowFirst}
                    </motion.span>
                    <span className="inline-block w-[0.18em] lg:w-[0.22em]" aria-hidden="true" />
                    <motion.span
                      className="inline-block"
                      variants={headingWordVariants}
                      custom={1}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                    >
                      <AccentLetters
                        word={workFutureConfig.heading.eyebrowSecond.text}
                        accents={workFutureConfig.heading.eyebrowSecond.accents}
                      />
                    </motion.span>
                  </motion.span>
                </span>

                {/* Line 1: WORK */}
                <span className="block">
                  <motion.span
                    className="inline-block origin-left"
                    variants={headingLineVariants}
                    custom={0}
                    transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }}
                  >
                    <motion.span
                      className="inline-block"
                      variants={headingWordVariants}
                      custom={0}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                    >
                      {workFutureConfig.heading.line1}
                    </motion.span>
                  </motion.span>
                </span>

                {/* Line 2: A FUTURE */}
                <span className="mt-2 block">
                  <motion.span
                    className="inline-flex origin-left items-baseline gap-[0.22em] lg:gap-[0.28em]"
                    variants={headingLineVariants}
                    custom={1}
                    transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.9, delay: 0.02 }}
                  >
                    <motion.span
                      className="inline-block"
                      variants={headingWordVariants}
                      custom={1}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8 }}
                    >
                      {workFutureConfig.heading.line2Prefix}
                    </motion.span>
                    <motion.span
                      className="inline-block"
                      variants={headingWordVariants}
                      custom={2}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.8, delay: 0.02 }}
                    >
                      <AccentLetters
                        word={workFutureConfig.heading.line2.text}
                        accents={workFutureConfig.heading.line2.accents}
                      />
                    </motion.span>
                  </motion.span>
                </span>
              </h2>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — 3 cards */}
        <div className="flex w-[42%] max-w-[420px] shrink-0 flex-col justify-center gap-4 py-12 pr-8 md:pr-12 lg:pr-16">
          {CARD_IMAGES.map((imgs, i) => (
            <motion.div
              key={i}
              className="w-full overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.1 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <SlidingCard images={imgs} delay={i * 400} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

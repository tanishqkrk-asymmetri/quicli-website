"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { TextReveal } from "@/components/ui/text-reveal";
import SplitText from "@/components/SplitText";
import ScrollReveal from "./ScrollReveal";
import Reveal from "./TextReveal";
import {
  Hand,
  MessageSquare,
  UserPlus,
  ClipboardList,
  Stethoscope,
  ShoppingCart,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MARQUEE_SPEED = 0.1; // pixels per millisecond (smooth scroll)

// Animation variants for fade-up effect
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeUpTransition = {
  duration: 0.6,
};

const flowSteps = [
  {
    title: "Send us a 'Hi'.",
    description:
      "Scan the QR code, open Quicli on WhatsApp, and start a new consultation from the secure web-view.",
    icon: MessageSquare,
  },
  {
    title: "Create a profile.",
    description:
      "Add personal and medical details once. You can also create multiple profiles on the same WhatsApp number.",
    icon: UserPlus,
  },
  {
    title: "Symptoms analysis.",
    description:
      "Answer a few symptom questions. Quicli prepares a structured report for the doctor.",
    icon: ClipboardList,
  },
  {
    title: "Doctor review.",
    description:
      "A doctor is auto-assigned, reviews the report, and sends your prescription in the same WhatsApp chat.",
    icon: Stethoscope,
  },
  {
    title: "Buy meds and tests.",
    description:
      "Doctor-prescribed medicines and lab tests are auto-carted so you can complete the next step in one click.",
    icon: ShoppingCart,
  },
];

const featureCards = [
  {
    title: "WhatsApp first",
    copy: "No new app, no learning curve. You get medical advice where you already chat.",
  },
  {
    title: "Fast consultations",
    copy: "A structured report reaches the doctor quickly, and most users receive a response within minutes.",
  },
  {
    title: "Affordable pricing",
    copy: "Consultations start at INR 99 with Quicli Pass, designed to keep care budget-friendly.",
  },
  {
    title: "Medicines auto-carted",
    copy: "After prescription, we prepare doctor-recommended medicines and tests instantly.",
  },
  {
    title: "No forced video calls",
    copy: "Video is used only when clinically needed or legally required. Most cases are handled via chat.",
  },
  {
    title: "Doctor auto-assign",
    copy: "You do not browse doctors or wait for slots. Quicli routes your report to an available doctor.",
  },
  {
    title: "Continuity and follow-ups",
    copy: "Past consultation context and follow-up reminders help doctors and patients stay aligned.",
  },
];

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I had a bad cough but could not take time out for a video call. I simply messaged Quicli during work and got my prescription in minutes.",
    name: "Karan Singh, 27",
    role: "Software Engineer, Bangalore",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team1-h_mljcvvuu.jpg",
  },
  {
    quote:
      "I was unsure about online care, but Quicli felt simple and reliable. A real doctor reviewed my symptoms and sent a clear prescription quickly.",
    name: "Tsering Lepcha, 20",
    role: "College Student, Gangtok",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team2-h_mlklaxak.jpg",
  },
  {
    quote:
      "Most apps force video calls. Quicli let me type symptoms on WhatsApp and I got prescription, medicines, and tests lined up in one flow.",
    name: "Vikram Rathi, 64",
    role: "Army Veteran, Lucknow",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team4-h_mlkk7g25.jpg",
  },
  {
    quote:
      "For my son’s fever, I did not need appointments or call scheduling. I shared symptoms and completed consultation and medicine order quickly.",
    name: "Geeta Sharma, 39",
    role: "Home Maker, Jaipur",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team4-h_mlkkuj7b.jpg",
  },
];

const team = [
  {
    name: "Himmat Singh",
    role: "CEO",
    bio: "Built and led startups, and now drives Quicli vision, growth, and execution.",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team1-h_mlksgw19.jpg",
  },
  {
    name: "Nandagopal",
    role: "CTO",
    bio: "Leads technology and product systems across Quicli with deep execution focus.",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team2-h_mlksts01.jpg",
  },
  {
    name: "Kushal Motwani",
    role: "CMO",
    bio: "Doctor and clinical pathway lead for evidence-based consultation quality.",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team3-h_mljlskvm.jpg",
  },
];

const faqs = [
  {
    q: "Is Quicli safe, reliable, and by real doctors?",
    a: "Yes. Consultations are reviewed by registered doctors, prescriptions are issued when medically appropriate, and information is handled confidentially.",
  },
  {
    q: "Is this the same as other consultation apps?",
    a: "Not exactly. You do not book a call or wait for slots. You share symptoms on WhatsApp and receive doctor guidance quickly.",
  },
  {
    q: "Are all consultations via video call?",
    a: "No. Most consultations are completed through chat. Video is used only when clinically or legally required.",
  },
  {
    q: "What if my condition is serious?",
    a: "If symptoms indicate risk, doctors guide you to hospital or specialist care immediately.",
  },
  {
    q: "What conditions can Quicli help with?",
    a: "Common conditions like fever, cough, skin issues, infections, stomach issues, and more. Emergency or examination-heavy cases are clearly flagged.",
  },
  {
    q: "How fast is the prescription turnaround?",
    a: "Most consultations are completed in around 9 minutes.",
  },
];

function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      if (!pausedRef.current && track.offsetWidth > 0) {
        const halfWidth = track.offsetWidth / 2;
        offsetRef.current -= MARQUEE_SPEED * delta;
        if (offsetRef.current <= -halfWidth) {
          offsetRef.current = 0;
        }
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    pausedRef.current = false;
  }, []);

  return (
    <div
      className="flex gap-6 pl-6"
      ref={trackRef}
      style={{ width: "max-content" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {[...testimonials, ...testimonials].map((item, idx) => (
        <article
          className="testimonial-card flex min-w-[280px] max-w-[340px] md:min-w-[340px] md:max-w-[380px] shrink-0 flex-col rounded-2xl border border-[#e8e4f4] bg-white p-5 md:p-6 shadow-sm transition-shadow hover:shadow-md"
          key={`${item.name}-${idx}`}
        >
          <motion.p
            className="mb-3 text-xl tracking-wide text-[#ca9236]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            ★★★★★
          </motion.p>
          <motion.p
            className="mb-5 flex-1 text-[15px] leading-relaxed text-[#2d3553]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            &ldquo;{item.quote}&rdquo;
          </motion.p>
          <motion.div
            className="profile flex items-center gap-4 border-t border-[#e8e4f4] pt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            <Image
              src={item.image}
              alt={item.name}
              width={48}
              height={48}
              className="avatar h-12 w-12 rounded-full object-cover ring-2 ring-[#7641e3]/20"
            />
            <div className="min-w-0">
              <strong className="block truncate text-sm font-semibold text-[#111322]">
                {item.name}
              </strong>
              <span className="block truncate text-xs text-[#4d546f]">
                {item.role}
              </span>
            </div>
          </motion.div>
        </article>
      ))}
    </div>
  );
}

export function QuicliLanding() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = stepRefs.current.findIndex(
            (ref) => ref === entry.target,
          );
          if (index !== -1) {
            setActiveStepIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Observe all step elements
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="main-shell ">
      <header className="fixed bg-theme top-0 w-full flex justify-between items-center p-3 px-4 md:px-8 text-white z-9999">
        <motion.a
          href="#home"
          className="text-xl md:text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Quicli
        </motion.a>
        {/* Desktop nav */}
        <motion.div
          className="hidden md:flex space-x-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button className="text-white" variant={"link"}>
            <a href="#intro">Intro</a>
          </Button>
          <Button className="text-white" variant={"link"}>
            <a href="#flow">How it works</a>
          </Button>
          <Button className="text-white" variant={"link"}>
            <a href="#features">Features</a>
          </Button>
          <Button className="text-white" variant={"link"}>
            <a href="#pricing">Pricing</a>
          </Button>
          <Button className="text-white" variant={"link"}>
            <a href="#faq">FAQ</a>
          </Button>
        </motion.div>
        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </header>
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[52px] bg-theme z-9998 flex flex-col items-center justify-center gap-6 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {[
              { href: "#intro", label: "Intro" },
              { href: "#flow", label: "How it works" },
              { href: "#features", label: "Features" },
              { href: "#pricing", label: "Pricing" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white text-2xl font-semibold hover:text-white/80 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <section className="min-h-screen bg-theme text-white px-4 md:px-8 pt-20 md:pt-30 flex flex-col justify-center items-between w-full">
        <div className="">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="flex flex-col"
          >
            <SplitText
              text="Don't Guess,"
              className="text-5xl md:text-9xl font-bold h-full leading-tight md:leading-36"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
            />
            <SplitText
              text="Ask Quicli."
              className="text-5xl md:text-9xl font-bold h-full leading-tight md:leading-36"
              delay={100}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
            />

            <div className="flex justify-start md:justify-end w-full mt-6 md:mt-0">
              <motion.p
                className="text-left max-w-md text-sm md:text-base"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                Symptom-related searches can create confusion and anxiety.
                Quicli converts your WhatsApp message into a doctor-led
                diagnosis and treatment path.
              </motion.p>
            </div>
            <motion.div
              className="actions flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 mt-4 md:mt-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              <Button variant={"secondary"} className="p-4 md:p-6">
                <a
                  className="flex items-center gap-3"
                  href="https://wa.me/919632842928"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/whatsapp.png" className="w-6" alt="" />
                  Start on WhatsApp
                </a>
              </Button>
              <Button variant={"secondary"} className="p-4 md:p-6">
                <a className="" href="#flow">
                  See the flow
                </a>
              </Button>
            </motion.div>
          </motion.div>
          {/* <article className="">
            <h2>Why Quicli</h2>
            <p>
              Symptom-related internet searches often increase anxiety
              (cyberchondria). Quicli replaces uncertainty with a doctor-led,
              structured consultation flow on WhatsApp.
            </p>
            <ul>
              <li>Real doctor review</li>
              <li>Fast turnaround</li>
              <li>Prescription and next steps in one place</li>
            </ul>
          </article> */}
        </div>
      </section>

      <section className="min-h-screen px-4 md:px-8 py-10 md:py-16" id="intro">
        <motion.div
          className="text-xl mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          transition={fadeUpTransition}
        >
          Quicli isn't just a doctor consultation platform
        </motion.div>
        <Reveal></Reveal>
      </section>

      <section className="section alt sec3-flow px-4 md:px-0" id="flow">
        <div className="/container">
          <div className="flow-grid">
            <ol className="flex flex-col md:flex-row gap-8 md:gap-16">
              {/* Sticky icon - hidden on mobile */}
              <div className="flow-images flow-images-left reveal hidden md:flex flex-col gap-36 w-1/3">
                <div className="sticky top-1/2 -translate-y-1/2 flex justify-center items-center">
                  <div
                    key={activeStepIndex}
                    style={{
                      animation:
                        "smoothIconTransition 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                  >
                    {(() => {
                      const ActiveIcon = flowSteps[activeStepIndex].icon;
                      return <ActiveIcon color="#6a38d7" size={200} />;
                    })()}
                  </div>
                </div>
              </div>

              <div className="border-l-4 md:border-l-6 border-black/50 pl-6 md:pl-20">
                {flowSteps.map((step, index) => (
                  <li
                    key={step.title}
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    className="flow-item reveal min-h-[50vh] md:min-h-screen max-w-xl flex justify-center items-center gap-4 md:gap-8 relative"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {/* Step number - inline on mobile, absolute on desktop */}
                    <motion.div
                      className="text-4xl md:text-8xl p-2 px-4 md:p-6 md:px-10 font-bold md:absolute md:-left-36 bg-white shrink-0"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUpVariants}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="space-y-3 md:space-y-6">
                      <motion.h3
                        className="text-2xl md:text-5xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUpVariants}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p
                        className="text-base md:text-2xl text-black/50"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUpVariants}
                      >
                        {step.description}
                      </motion.p>
                    </div>
                  </li>
                ))}
              </div>
            </ol>
          </div>
        </div>
      </section>

      <section
        className="section doctor sec4-doctor bg-brand/50 text-white p-6 md:p-36"
        id="doctors"
      >
        <div className="">
          <div className="doctor-frame flex justify-center">
            <div className="doctor-grid flex flex-col md:flex-row bg-theme rounded-xl p-6 md:p-12 max-w-4xl">
              <div className="reveal space-y-8 md:space-y-16">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  Doctors can focus on decisions, not repetitive intake.
                </motion.h2>
                <div className="space-y-3">
                  <motion.p
                    className="text-sm md:text-base"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                  >
                    Quicli analyzes symptom reports and prepares a structured
                    clinical summary. Doctors spend less time on back-and-forth
                    and more time on the likely diagnosis and treatment.
                  </motion.p>
                  <motion.p
                    className="text-sm md:text-base"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                  >
                    Medicines and lab guidance are supported by a medical
                    backend so many consultations can close in 3 to 5 minutes.
                  </motion.p>
                </div>
              </div>
              <div className="reveal mt-6 md:mt-0">
                <Image
                  src="https://r.mobirisesite.com/2305096/assets/images/team4-h_mljbzwt3.jpg"
                  alt="Doctor using Quicli"
                  width={620}
                  height={620}
                  className="cover-image h-full w-full object-cover rounded-lg md:rounded-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section sec5-features" id="features">
        <div className="/container py-10 md:py-16 flex justify-center items-center w-full">
          <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-16 gap-4 md:gap-9">
            <article className="feature-card reveal relative min-h-[200px] md:min-h-[280px] overflow-hidden rounded-3xl p-6 md:p-8 text-black">
              <motion.h3
                className="mt-2 max-w-[85%] text-3xl md:text-5xl font-bold leading-tight"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                What makes Quicli special
              </motion.h3>
              <motion.p
                className="mt-4 max-w-[95%] text-sm md:text-base leading-relaxed text-black"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                Quicli combines speed, affordability, and simplicity so
                healthcare is truly hassle-free.
              </motion.p>
            </article>
            {featureCards.map((feature, idx) => (
              <article
                className="feature-card reveal relative min-h-[200px] md:min-h-[280px] overflow-hidden rounded-3xl bg-[#7641e3] p-6 md:p-8 text-white"
                key={feature.title}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <motion.span
                  className="text-right w-full flex justify-end text-5xl md:text-7xl font-bold leading-none text-white"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  {idx + 1}
                </motion.span>
                <motion.h3
                  className="mt-2 max-w-[85%] text-2xl md:text-4xl font-bold leading-tight"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  className="mt-3 md:mt-4 max-w-[95%] text-sm md:text-base leading-relaxed text-white/90"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  {feature.copy}
                </motion.p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section pricing sec6-pricing bg-theme min-h-screen"
        id="pricing"
      >
        <div className="/container px-4 md:px-8">
          <div className="w-full flex justify-center items-center flex-col py-10 md:py-16">
            <motion.h2
              className="section-title text-3xl md:text-6xl text-white font-bold mb-4 md:mb-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Doctor consultation, now affordable.
            </motion.h2>
            <motion.p
              className="section-copy text-lg md:text-3xl font-semibold text-white text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Quicli keeps tele-consultation accessible with transparent plans.
            </motion.p>
          </div>
          <div className="pricing-grid mt-4 md:mt-8 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            <article className="price-card reveal rounded-2xl bg-[#5A3297] p-6 md:p-8 text-white">
              <motion.h3
                className="text-2xl font-bold md:text-4xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                Quicli Pass.
              </motion.h3>
              <motion.p
                className="mt-3 md:mt-4 leading-7 md:leading-10 text-white/90 text-lg md:text-3xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                Quicli Pass lets you consult a doctor at just{" "}
                <span className="font-semibold">₹99</span> all year round after
                a one-time purchase. Buy once, save on every consultation.
              </motion.p>
              <hr className="my-4 md:my-6 border-white/30" />
              <motion.div
                className="flex items-center justify-between"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                <span className="text-sm text-white/80">
                  Price / Consultation
                </span>
                <span className="text-2xl font-bold md:text-4xl">₹99</span>
              </motion.div>
            </article>
            <article className="price-card reveal rounded-2xl bg-[#5A3297] p-6 md:p-8 text-white">
              <motion.h3
                className="text-2xl font-bold md:text-4xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                Regular.
              </motion.h3>
              <motion.p
                className="mt-3 md:mt-4 leading-7 md:leading-10 text-white/90 text-lg md:text-3xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                At <span className="font-semibold">₹199</span> / Consultation,
                Quicli remains one of the most affordable in India. Medical
                advice at a price that&apos;s still lower than most clinic &
                apps.
              </motion.p>
              <hr className="my-4 md:my-6 border-white/30" />
              <motion.div
                className="flex items-center justify-between"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                <span className="text-sm text-white/80">
                  Price / Consultation
                </span>
                <span className="text-2xl font-bold md:text-4xl">₹199</span>
              </motion.div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="section visual-break sec7-bg min-h-[50vh] md:min-h-screen bg-[url(https://r.mobirisesite.com/2305096/assets/images/photo-1706894075115-f140b4049-h_mlgcaogk.jpg)] bg-cover bg-center md:bg-fixed"
        id="section-7"
      >
        {/* <Image
          src="https://r.mobirisesite.com/2305096/assets/images/photo-1706894075115-f140b4049-h_mlgcaogk.jpg"
          alt="Section background visual"
          width={1920}
          height={900}
        /> */}
      </section>

      <section
        className="section alt sec8-testimonials overflow-hidden bg-linear-to-b from-[#f7f5ff] to-[#edf1fb] py-10 md:py-16 px-4 md:px-8"
        id="testimonials"
      >
        <div className="/container mb-10">
          <motion.h2
            className="section-title text-[#7641e3]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            What our users say
          </motion.h2>
          <motion.p
            className="section-copy mt-2 max-w-2xl text-[#4d546f]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            Real stories from people who found care on Quicli.
          </motion.p>
        </div>
        <div className="testimonial-marquee-wrapper relative w-full overflow-hidden">
          <TestimonialMarquee testimonials={testimonials} />
        </div>
      </section>

      <section
        className="section cta sec9-try bg-brand text-white p-6 md:p-16"
        id="try"
      >
        <div className="/container cta-grid flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="reveal">
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-4 md:mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Try Quicli on WhatsApp now.
            </motion.h2>
            {/* <p>Send us a hi and start a consultation with a licensed doctor.</p> */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              <Button variant={"secondary"} className="p-4 md:p-6">
                <a
                  className="flex items-center gap-3"
                  href="https://wa.me/919632842928"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/whatsapp.png" className="w-6" alt="" />
                  Send us a Hi on WhtasApp
                </a>
              </Button>
            </motion.div>
          </div>
          <Image
            src="https://r.mobirisesite.com/2305096/assets/images/features1-h_mlgks1bk.jpg"
            alt="Try Quicli section visual"
            width={720}
            height={520}
            className="cover-image try-image reveal w-full md:w-128"
          />
        </div>
      </section>

      <section
        className="section alt sec10-team bg-linear-to-b from-[#f7f5ff] to-white py-12 md:py-20"
        id="team"
      >
        <div className="/container">
          <motion.h2
            className="section-title mb-4 text-center text-theme text-2xl md:text-4xl font-bold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            The Team
          </motion.h2>
          <motion.p
            className="section-copy mx-auto mb-8 md:mb-12 max-w-2xl text-center text-[#4d546f] text-base md:text-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            Meet the people building the future of healthcare.
          </motion.p>
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 px-4 md:px-16">
            {team.map((member, idx) => {
              const isActive = activeTeamMember === idx;
              return (
                <article
                  className="group reveal relative aspect-[9/12] cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl"
                  key={member.name}
                  style={{ animationDelay: `${idx * 80}ms` }}
                  onClick={() => setActiveTeamMember(isActive ? null : idx)}
                >
                  {/* Image - visible by default, hidden on hover (desktop) or tap (mobile) */}
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={480}
                    height={480}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 md:group-hover:opacity-0 ${isActive ? "opacity-0" : ""}`}
                  />
                  {/* Info overlay - revealed on hover (desktop) or tap (mobile) */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center bg-brand p-8 text-center text-white transition-all duration-500 md:opacity-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  >
                    <motion.p
                      className="mb-3 text-sm font-bold uppercase tracking-widest text-[#e8e4f4]"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={fadeUpVariants}
                    >
                      {member.role}
                    </motion.p>
                    <motion.h3
                      className="mb-4 text-2xl md:text-3xl font-bold"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={fadeUpVariants}
                    >
                      {member.name}
                    </motion.h3>
                    <motion.p
                      className="text-sm md:text-base leading-relaxed text-white/90"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={fadeUpVariants}
                    >
                      {member.bio}
                    </motion.p>
                  </div>
                  {/* Tap hint - mobile only */}
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:hidden">
                      <p className="text-white text-sm font-semibold">
                        {member.name}
                      </p>
                      <p className="text-white/70 text-xs">Tap to read more</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="section sec11-faq bg-linear-to-b from-white to-[#f7f5ff] py-12 md:py-20 flex flex-col md:flex-row justify-center gap-6 md:gap-16 px-4 md:px-0"
        id="faq"
      >
        <div>
          <motion.h2
            className="section-title mb-3 text-[#111322] text-2xl md:text-4xl font-bold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="section-copy mb-6 md:mb-12 text-sm md:text-base text-[#4d546f]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            Quick answers to common questions about Quicli.
          </motion.p>
        </div>
        <div className="/container max-w-3xl">
          <div className="faq-list grid gap-4">
            {faqs.map((faq, idx) => (
              <motion.details
                key={faq.q}
                className="faq-item group rounded-2xl border border-[#e8e4f4] bg-white p-4 md:p-6 transition-all duration-200 hover:border-[#7641e3]/40 [&[open]]:border-[#7641e3]/50"
                open={idx === 0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                <summary className="list-none cursor-pointer font-semibold text-[#111322] text-base md:text-lg leading-snug marker:contents [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4 pr-6">
                    <span>{faq.q}</span>
                    <span className="shrink-0 text-[#7641e3] transition-transform duration-200 group-open:rotate-180">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </span>
                </summary>
                <p className="mt-4 border-t border-[#e8e4f4] pt-4 text-base leading-relaxed text-[#4d546f]">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section contact sec12-contact bg-theme py-12 md:py-20 text-[#e8e4f4] px-4 md:px-8"
        id="contact"
      >
        <div className="/container max-w-2xl px-4 md:px-8">
          <motion.h2
            className="mb-10 text-4xl font-bold tracking-tight md:text-6xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            Get in touch!
          </motion.h2>
          <div className="space-y-6 text-lg md:text-2xl font-semibold">
            <motion.p
              className="leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              L : Koramangala, Bangalore.
            </motion.p>
            <motion.p
              className="leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              M : +91 9886439401
            </motion.p>
            <motion.p
              className="leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              E : admin@quicli.ai
            </motion.p>
          </div>
        </div>
      </section>

      <footer
        className="footer section sec13-footer bg-[#331C5E] py-10 md:py-16 text-white px-4 md:px-8"
        id="footer"
      >
        <div className="/container flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="space-y-6">
            <Image
              src="https://r.mobirisesite.com/2305096/assets/images/logo-h_mlhtbvih.png"
              alt="Quicli Logo"
              width={320}
              height={96}
              className="h-16 w-auto object-contain md:h-20 lg:h-24"
            />
            <motion.p
              className="max-w-md text-xl leading-relaxed text-[#e8e4f4] md:text-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              © 2026 Quicli Healthtech Pvt. Ltd. All rights reserved.
            </motion.p>
          </div>
          <nav
            className="footer-links flex flex-col gap-4 md:gap-6"
            aria-label="Footer navigation"
          >
            <motion.a
              href="#home"
              className="text-xl text-white/90 transition-colors hover:text-white md:text-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Home
            </motion.a>
            <motion.a
              href="#features"
              className="text-xl text-white/90 transition-colors hover:text-white md:text-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Products
            </motion.a>
            <motion.a
              href="#contact"
              className="text-xl text-white/90 transition-colors hover:text-white md:text-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Contact
            </motion.a>
          </nav>
        </div>
      </footer>
    </main>
  );
}

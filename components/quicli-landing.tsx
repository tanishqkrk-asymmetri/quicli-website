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
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useScroll,
} from "framer-motion";

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
      "Scan this QR code to open Quicli on your WhatsApp and send us a 'Hi'. This will enable a chatbot with a 'New Consultation' button, which will open a secure web-view within WhatsApp.",
    icon: MessageSquare,
  },
  {
    title: "Create a profile.",
    description:
      "After the web-view has opened, create a profile by providing personal & medical information. You can create multiple profiles linked to your WhatsApp number.",
    icon: UserPlus,
  },
  {
    title: "Symptoms analysis.",
    description:
      "Select a profile for the consultation and answer a few multiple-choice symptoms-related questions. Once the symptoms flow is completed, a report will be prepared.",
    icon: ClipboardList,
  },
  {
    title: "Confirm the doctor.",
    description:
      "After the report is prepared, a doctor will be auto-assigned. The doctor, after reviewing the report, will send the prescription on the same WhatsApp chat.",
    icon: Stethoscope,
  },
  {
    title: "Buy meds & tests.",
    description:
      "Once the prescription is received, we auto-cart the doctor-prescribed medicines and lab tests so that you can buy them with one click right from WhatsApp.",
    icon: ShoppingCart,
  },
];

const featureCards = [
  {
    title: "WhatsApp first",
    copy: "WhatsApp, because it's already on your phone; it's no new app, no learning curve. It makes getting medical advice as simple as sending a message, in your native language.",
  },
  {
    title: "Fastest consults",
    copy: "Our robust system instantly prepares a structured symptoms report. A qualified doctor reviews it and sends you prescription within 10 minutes.",
  },
  {
    title: "Most affordable",
    copy: "At just ₹99, Quicli offers the most affordable doctor consultation. By optimizing backend tech and using an efficient doctor model, we keep costs low and pass the savings directly to you.",
  },
  {
    title: "Medicines auto-carted",
    copy: "Quicli auto-carts prescribed medicines and lab tests after your consultation so that you don't have to search or forget.",
  },
  {
    title: "No forced video-calls",
    copy: "Quicli doesn't force a video call. A video call to the patient will be made only if it is mandated by law or if the doctor wants to know more about the symptom.",
  },
  {
    title: "Doctor auto-assigned",
    copy: "Quicli automatically assigns the right available doctor. No browsing, no waiting for an appointment. Your report is then instantly shared for review.",
  },
  {
    title: "Continuity & follow-ups",
    copy: "Quicli remembers your previous symptoms and shares your past consultation details with the doctor every time. With timely WhatsApp follow-up reminders, we check in on you to ensure you are doing fine.",
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
      "I had a bad cough but couldn't take time out for a video call. I simply messaged Quicli on WhatsApp during work and received my prescription within minutes. Quick, simple, and done.",
    name: "Karan Singh, 27",
    role: "Software Engineer, Bangalore",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team1-h_mljcvvuu.jpg",
  },
  {
    quote:
      "I wasn't sure if online medical help would feel reliable, but Quicli surprised me. A real doctor reviewed my symptoms and sent a prescription quickly, it felt simple and trustworthy.",
    name: "Tsering Lepcha, 20",
    role: "College Student, Gangtok",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team2-h_mlklaxak.jpg",
  },
  {
    quote:
      "Video calls always felt confusing and unnecessary to me, and most apps make them mandatory. With Quicli, I just typed my symptoms on WhatsApp and got my prescription - even medicines and lab tests were automatically selected to be bought. So simple.",
    name: "Vikram Rathi, 64",
    role: "Army Veteran, Lucknow",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team4-h_mlkk7g25.jpg",
  },
  {
    quote:
      "When my son had a fever, I didn't want to deal with appointments or video calls. With Quicli, I shared his symptoms on WhatsApp, received the doctor's prescription quickly, and ordered the medicines within minutes. It was such a relief.",
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
    bio: "Having a founder's instinct, built and led multiple startups, driving vision, teams, and execution. Known for building systems. Now responsible for vision, growth, & execution of Quicli.",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team1-h_mlksgw19.jpg",
  },
  {
    name: "Nanda Kishore",
    role: "CTO",
    bio: "Entrepreneur, expert in handling and developing tech projects, and leading tech team at Quicli. Deep tech + real execution: a postgrad in computer applications (MIT, Manipal).",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team2-h_mlksts01.jpg",
  },
  {
    name: "Kushal Motwani",
    role: "CMO",
    bio: "A medical doctor & currently pursuing MD in Community Medicine (PSM). Leading evidence-based medical pathways that simplify clinical decision-making & preventive care for doctors at Quicli.",
    image:
      "https://r.mobirisesite.com/2305096/assets/images/team3-h_mljlskvm.jpg",
  },
];

const faqs = [
  {
    q: "Is Quicli safe, reliable & by real doctors?",
    a: "Yes. All consultations are reviewed by a registered doctor. Prescriptions are issued only when medically appropriate, just like an offline visit, and your information remains confidential. Always.",
  },
  {
    q: "Is it the same as other consultation apps?",
    a: "Not really. You don't book a call or wait for a video slot. You share your symptoms on WhatsApp, a licensed doctor reviews them, and you receive a proper medical response, usually within minutes.",
  },
  {
    q: "Are all the consultations via video-call?",
    a: "No. Most consultations are completed via chat. Video is used only when clinically or regulatory required.",
  },
  {
    q: "What if my condition is serious?",
    a: "If your symptoms are serious, our doctors will immediately advise you to visit a hospital or specialist at the earliest, for proper care.",
  },
  {
    q: "What conditions can Quicli help with?",
    a: "Common issues like cold, fever, infections, skin problems, stomach issues, mental health concerns, and more. If something requires physical examination or emergency care, Quicli clearly tells you that.",
  },
  {
    q: "How quickly will I get my prescription?",
    a: "We complete most consultations and provide you with a prescription within 9 minutes.",
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
            className="mb-3 text-xl md:text-2xl tracking-wide text-[#ca9236]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            ★★★★★
          </motion.p>
          <motion.p
            className="mb-5 flex-1 text-base md:text-lg leading-relaxed text-[#2d3553]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            &ldquo;{item.quote}&rdquo;
          </motion.p>
          <motion.div
            className="profile flex items-center gap-4 border-t border-[#e8e4f4] pt-4 hidden"
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
              <strong className="block truncate text-base md:text-lg font-semibold text-[#111322]">
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

  const iconsRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: iconsRef,
    offset: ["start end", "end start"],
  });

  const right = useTransform(scrollYProgress, [0, 0.6], ["-400px", "0px"]);
  const left = useTransform(scrollYProgress, [0, 0.6], ["400px", "0px"]);
  const center = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="main-shell">
      <header className="fixed bg-theme top-0 w-full flex justify-between items-center p-3 px-4 md:px-8 text-[#ded6ff] z-9999">
        <motion.a
          href="#home"
          className="text-xl md:text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            className="w-12"
            src="https://r.mobirisesite.com/2305096/assets/images/features1-h_mlgks1bk.jpg"
            alt=""
          />
        </motion.a>
        {/* Desktop nav */}
        <motion.div
          className="hidden md:flex space-x-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button className="text-[#ded6ff]" variant={"link"}>
            <a href="#intro">Intro</a>
          </Button>
          <Button className="text-[#ded6ff]" variant={"link"}>
            <a href="#flow">How it works</a>
          </Button>
          <Button className="text-[#ded6ff]" variant={"link"}>
            <a href="#features">Features</a>
          </Button>
          <Button className="text-[#ded6ff]" variant={"link"}>
            <a href="#pricing">Pricing</a>
          </Button>
          <Button className="text-[#ded6ff]" variant={"link"}>
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
                className="text-[#ded6ff] text-xl md:text-2xl font-semibold hover:text-[#ded6ff]/80 transition-colors"
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
              className="text-7xl md:text-9xl font-bold h-full leading-tight"
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
              className="text-7xl md:text-9xl font-bold h-full leading-tight"
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
                className="text-left max-w-md text-base md:text-lg text-[#ded6ff] font-semibold"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                Symptom-related searches are scary. One online search and
                suddenly you’re more anxious, confused, and worried. They even
                have a word for it, ‘Cyberchondria’.
              </motion.p>
            </div>
            <motion.div
              className="actions flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 mt-4 md:mt-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              {/* <Button variant={"secondary"} className="p-4 md:p-6">
                <a
                  className="flex items-center gap-3"
                  href="https://wa.me/919632842928"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/whatsapp.png" className="w-6" alt="" />
                  Start on WhatsApp
                </a>
              </Button> */}
              <Button
                variant={"secondary"}
                className="p-4 md:p-6 cursor-pointer "
              >
                <a className="flex items-center gap-3" href="#flow">
                  <p>See the flow</p> <ChevronDown></ChevronDown>
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
          className="text-xl md:text-2xl mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          transition={fadeUpTransition}
        >
          Quicli isn’t just a doctor consultation platform.
        </motion.div>
        <Reveal></Reveal>
      </section>

      <section
        className="section alt sec3-flow px-4 md:px-0 pt-36 bg-[#f6f6f6]"
        id="flow"
      >
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
                      return activeStepIndex === 0 ? (
                        <img
                          className="w-84"
                          src="https://r.mobirisesite.com/2305096/assets/images/photo-1758519289022-5f9dea0d8-h_mlkjxo1z.jpg"
                          alt=""
                        />
                      ) : (
                        <ActiveIcon color="#6a38d7" size={200} />
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="border-l-4 md:border-l-6 border-black/10 pl-6 md:pl-20">
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
                      className="text-3xl md:text-6xl p-2 px-4 md:p-6 md:px-10 font-bold md:absolute md:-left-36 bg-[#f6f6f6] shrink-0"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUpVariants}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="space-y-3 md:space-y-6">
                      <motion.h3
                        className="text-xl md:text-5xl font-semibold"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUpVariants}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p
                        className="text-base md:text-lg text-black/50"
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
          <div className="flex justify-center items-center">
            <Button variant={"default"} className="p-4 md:p-6">
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
          </div>
        </div>
      </section>
      <section
        ref={iconsRef}
        className="min-h-[50vh] bg-[#f6f6f6] flex items-center justify-center relative overflow-x-hidden"
      >
        <motion.img
          style={{
            x: right,
          }}
          className="w-36 z-999 bg-[#f6f6f6] px-3"
          src="https://r.mobirisesite.com/2305096/assets/images/features1-h_mlgks1bk.jpg"
          alt=""
        />
        <motion.img
          style={{
            x: left,
          }}
          className="w-36 z-999 bg-[#f6f6f6] px-3"
          src="/whatsapp.png"
          alt=""
        />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-36 text-center font-bold">
          Consultaions at the ease of a message
        </motion.div>
      </section>
      <section
        className="section doctor sec4-doctor bg-brand/50 text-[#ded6ff] p-6 md:p-36"
        id="doctors"
      >
        <div className="">
          <div className="doctor-frame flex justify-center">
            <div className="doctor-grid flex flex-col md:flex-row bg-theme rounded-xl p-6 md:p-12 md:max-w-7xl  md:pb-0 max-w-full ">
              <div className="reveal space-y-8 md:space-y-16 md:w-1/2  pb-6 text-[#ded6ff]">
                <motion.h2
                  className="text-3xl md:text-6xl font-bold"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  Here to help Doctors.
                </motion.h2>
                <div className="space-y-3">
                  <motion.p
                    className="text-base md:text-lg"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                  >
                    Quicli’s intelligent algorithm carefully analyzes a
                    patient’s symptom report and prepares a structured clinical
                    summary, helping doctors skip routine back-and-forth
                    questions and focus directly on the likely cause, saving
                    time & effort.
                  </motion.p>
                  <motion.p
                    className="text-base md:text-lg"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                  >
                    {" "}
                    It then matches the possible diagnosis with our extensive
                    medical backend, including Medicines and Lab test guidance,
                    enabling doctors to complete most consultations in just 3 -
                    5 mins.
                  </motion.p>
                </div>
              </div>
              <div className="reveal mt-6 md:mt-0 md:w-1/2">
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
          <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 px-4 md:px-16 gap-4 md:gap-9 max-w-7xl">
            <article className="feature-card reveal relative min-h-[200px] md:min-h-[280px] overflow-hidden rounded-3xl p-6 md:p-8 text-black ">
              <motion.h3
                className="mt-2 max-w-[85%] text-3xl md:text-6xl font-bold leading-tight"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                What makes Quicli special
              </motion.h3>
              <motion.p
                className="mt-4 max-w-[95%] text-base md:text-lg leading-relaxed text-black"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                Quicli combines speed, affordability, and simplicity. Healthcare
                is finally hassle-free.
              </motion.p>
            </article>
            {featureCards.map((feature, idx) => (
              <article
                className="feature-card reveal relative min-h-[200px] md:min-h-[280px] overflow-hidden rounded-3xl bg-[#7641e3] p-6 md:p-5 text-[#ded6ff] aspect-square flex flex-col justify-between pb-6"
                key={feature.title}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <motion.span
                  className="text-right w-full flex justify-end text-5xl md:text-9xl font-bold leading-none text-[#ded6ff]"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  {idx + 1}
                </motion.span>
                <div>
                  <motion.h3
                    className="mt-2 max-w-[85%] text-xl md:text-6xl font-bold leading-tight"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="mt-3 md:mt-4 max-w-[95%] text-base md:text-lg leading-relaxed text-[#ded6ff]/90"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                  >
                    {feature.copy}
                  </motion.p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section pricing sec6-pricing bg-theme min-h-screen pb-16"
        id="pricing"
      >
        <div className="/container px-4 md:px-8 flex justify-center items-center flex-col">
          <div className="w-full flex justify-center items-center flex-col py-10 md:py-16">
            <motion.h2
              className="section-title text-3xl md:text-6xl text-[#ded6ff] font-bold mb-4 md:mb-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Doctor's Consultation now affordable for everyone. ₹99 /
              consultation.
            </motion.h2>
            <motion.p
              className="section-copy text-xl md:text-2xl font-semibold text-[#ded6ff] text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              Quicli keeps tele-consultation accessible with transparent plans.
            </motion.p>
          </div>
          <div className="pricing-grid mt-4 md:mt-8 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3 max-w-8xl">
            <article className="price-card reveal rounded-2xl bg-[#492989] p-6 md:p-8 text-[#ded6ff] aspect-square flex flex-col justify-between">
              <div>
                <motion.h3
                  className="text-xl md:text-2xl font-bold"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  QUICLI START
                </motion.h3>
                <motion.p
                  className="mt-3 md:mt-4 leading-7 text-[#ded6ff]/90 text-base md:text-lg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  Get your first 2 consultations at just{" "}
                  <strong>₹49 each</strong>. Start your care journey with a
                  special introductory offer designed to make access easy and
                  stress-free.
                </motion.p>
                <hr className="my-4 md:my-6 border-white/30" />
              </div>
              <motion.div
                className="flex items-center justify-between"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                <span className="text-base md:text-lg text-[#ded6ff]/80">
                  Price / Consultation
                </span>
                <span className="text-3xl md:text-6xl font-bold">₹49</span>
              </motion.div>
            </article>

            <article className="price-card reveal rounded-2xl bg-[#492989] p-6 md:p-8 text-[#ded6ff] flex flex-col justify-between">
              <div>
                <motion.h3
                  className="text-xl md:text-2xl font-bold"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  STANDARD
                </motion.h3>
                <motion.p
                  className="mt-3 md:mt-4 leading-7 text-[#ded6ff]/90 text-base md:text-lg"
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
              </div>
              <motion.div
                className="flex items-center justify-between"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                <span className="text-base md:text-lg text-[#ded6ff]/80">
                  Price / Consultation
                </span>
                <span className="text-3xl md:text-6xl font-bold">₹199</span>
              </motion.div>
            </article>
            <article className="price-card reveal rounded-2xl bg-[#492989] p-6 md:p-8 text-[#ded6ff] aspect-square flex flex-col justify-between">
              <div>
                <motion.h3
                  className="text-xl md:text-2xl font-bold"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  QUICLI PASS
                </motion.h3>
                <motion.p
                  className="mt-3 md:mt-4 leading-7 text-[#ded6ff]/90 text-base md:text-lg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUpVariants}
                >
                  Quicli Pass lets you consult a doctor at just{" "}
                  <span className="font-semibold">₹99</span> all year round
                  after a one-time purchase. Buy once, save on every
                  consultation.
                </motion.p>
                <hr className="my-4 md:my-6 border-white/30" />
              </div>
              <motion.div
                className="flex items-center justify-between"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariants}
              >
                <span className="text-base md:text-lg text-[#ded6ff]/80">
                  Price / Consultation
                </span>
                <span className="text-3xl md:text-6xl font-bold">₹99</span>
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
            className="section-title text-[#7641e3] text-3xl md:text-6xl font-bold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            What our users say
          </motion.h2>
          <motion.p
            className="section-copy mt-2 max-w-2xl text-base md:text-lg"
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
        className="section cta sec9-try bg-theme text-[#ded6ff] p-6 md:p-16"
        id="try"
      >
        <div className="/container cta-grid flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="reveal">
            <motion.h2
              className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 "
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
            className="section-title mb-4 text-center text-theme text-3xl md:text-6xl font-bold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            The Team
          </motion.h2>
          <motion.p
            className="section-copy mx-auto mb-8 md:mb-12 max-w-2xl text-center text-[#4d546f] text-xl md:text-2xl"
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
                    className={`absolute inset-0 h-full w-full object-cover  duration-300 md:group-hover:-translate-x-full z-999    ${isActive ? "opacity-0" : ""}`}
                  />
                  {/* Info overlay - revealed on hover (desktop) or tap (mobile) */}
                  <div
                    className={`absolute inset-0 h-full flex flex-col items-center justify-center bg-theme p-8 text-center  transition-all duration-500 md:opacity-100 text-[#ded6ff]   ${isActive ? "opacity-100 translate-y-0" : "opacity-0 "}`}
                  >
                    <motion.p
                      className="mb-3 text-base md:text-lg font-bold uppercase tracking-widest text-[#e8e4f4]"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={fadeUpVariants}
                    >
                      {member.role}
                    </motion.p>
                    <motion.h3
                      className="mb-4 text-3xl md:text-6xl font-bold"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={fadeUpVariants}
                    >
                      {member.name}
                    </motion.h3>
                    <motion.p
                      className="text-xl md:text-2xl leading-relaxed text-[#ded6ff]"
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
                      <p className="text-[#ded6ff] text-xl md:text-2xl font-semibold">
                        {member.name}
                      </p>
                      <p className="text-[#ded6ff]/70 text-base md:text-lg">
                        Tap to read more
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="section sec11-faq bg-linear-to-b from-white to-[#f7f5ff] py-12 md:py-20 flex flex-col md:flex-row justify-center gap-6 md:gap-16 px-4 md:px-18 "
        id="faq"
      >
        <div>
          <motion.h2
            className="section-title mb-3 text-[#111322] text-3xl md:text-6xl font-bold "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="section-copy mb-6 md:mb-12 text-base md:text-lg text-[#4d546f]"
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
                <summary className="list-none cursor-pointer font-semibold text-[#111322] text-xl md:text-2xl leading-snug marker:contents [&::-webkit-details-marker]:hidden">
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
                <p className="mt-4 border-t border-[#e8e4f4] pt-4 text-base md:text-lg leading-relaxed text-[#4d546f]">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section contact sec12-contact bg-theme py-12 md:py-20 text-[#ded6ff] px-4 md:px-8"
        id="contact"
      >
        <div className="/container max-w-4xl px-4 md:px-8">
          <motion.h2
            className="mb-10 text-4xl font-bold tracking-tight md:text-8xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            Get in touch!
          </motion.h2>
          <div className="space-y-6 text-xl md:text-2xl font-semibold">
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
        className="footer section sec13-footer bg-[#331C5E] py-10 md:py-16 text-[#ded6ff] px-4 md:px-8"
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
              className="max-w-md text-base md:text-lg leading-relaxed text-[#e8e4f4]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              © 2026 Quicli Healthtech Pvt. Ltd. All rights reserved.
            </motion.p>
          </div>
        </div>
      </footer>

      {/* Corner: click to open WhatsApp (hover preview on desktop only) */}
      <div className="fixed bottom-4 right-4 z-[9997] group/corner">
        <a
          href="https://wa.me/919632842928"
          target="_blank"
          rel="noopener noreferrer"
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/30 bg-theme/90 px-3 py-1.5 text-xs text-[#ded6ff]/90 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:border-white/50 hover:text-[#ded6ff]"
        >
          <img src="/whatsapp.png" className="h-4 w-4" alt="" />
          <span className="opacity-90">Consult on WhatsApp</span>
        </a>
        <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 overflow-hidden rounded-xl border border-white/20 bg-theme/95 shadow-2xl opacity-0 translate-y-2 scale-95 transition-all duration-300 ease-out group-hover/corner:pointer-events-auto group-hover/corner:opacity-100 group-hover/corner:translate-y-0 group-hover/corner:scale-100 hidden md:block">
          <Image
            src={
              "https://r.mobirisesite.com/2305096/assets/images/photo-1758519289022-5f9dea0d8-h_mlkjxo1z.jpg"
            }
            alt="Preview"
            width={192}
            height={256}
            className="w-full object-cover"
          />
        </div>
      </div>
    </main>
  );
}

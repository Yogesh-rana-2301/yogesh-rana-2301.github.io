"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { Mail, Linkedin, Github, X, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { DATA } from "@/data/resume";
import Link from "next/link";
import { useForm, ValidationError } from "@formspree/react";

interface ContactOrbitingProps {
  delay?: number;
}

/* ─── Formspree contact form modal ─────────────────────────────────────── */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [state, handleSubmit] = useForm("mrenoavw");

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal card */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md bg-background border rounded-2xl shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {state.succeeded ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <CheckCircle className="size-14 text-green-500" />
              <h3 className="text-xl font-semibold">Message sent!</h3>
              <p className="text-muted-foreground text-sm">
                Thanks for reaching out — I'll get back to you soon.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </motion.div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-5">
                <h3 className="text-xl font-semibold">Get in touch</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Send me a message and I'll reply as soon as I can.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="Ratan Tata"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Your email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground transition-colors"
                  />
                  <ValidationError
                    field="email"
                    prefix="Email"
                    errors={state.errors}
                    className="text-xs text-red-500 flex items-center gap-1"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Hi Yogesh, I wanted to reach out about..."
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground transition-colors resize-none"
                  />
                  <ValidationError
                    field="message"
                    prefix="Message"
                    errors={state.errors}
                    className="text-xs text-red-500 flex items-center gap-1"
                  />
                </div>

                {/* Global error */}
                {state.errors && Object.keys(state.errors).length > 0 && !state.succeeded && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state.submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  {state.submitting ? "Sending…" : "Send message"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────── */
export const ContactOrbiting = ({ delay = 0 }: ContactOrbitingProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isModalOpen, setModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const orbitingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, delay: delay + 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <>
      <motion.section
        ref={ref}
        id="contact"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Get in Touch.
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Want to chat? Send me a{" "}
              <button
                onClick={() => setModalOpen(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                message
              </button>{" "}
              or connect on{" "}
              <Link
                href={DATA.contact.social.LinkedIn.url}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </Link>{" "}
              and I&apos;ll respond whenever I can.
            </p>
          </div>

          {/* Orbiting Circles */}
          <motion.div
            variants={orbitingVariants}
            className="relative h-[500px] w-full flex items-center justify-center"
          >
            {/* Inner orbit */}
            <OrbitingCircles radius={80} duration={30}></OrbitingCircles>

            {/* Outer orbit */}
            <OrbitingCircles radius={140} reverse duration={20}>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-md">
                <Linkedin className="size-6 text-blue-700" />
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-md">
                <Mail className="size-6 text-blue-600" />
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-md">
                <Github className="size-6 text-gray-700 dark:text-gray-300" />
              </div>
            </OrbitingCircles>

            {/* Center buttons */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-4">
                {/* Mail icon → opens form modal (no mailto href) */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform duration-200"
                  title="Send a message"
                  aria-label="Open contact form"
                >
                  <Mail className="size-6 text-foreground" />
                </button>

                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform duration-200"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="size-6 text-foreground" />
                </Link>

                <Link
                  href={DATA.contact.social.GitHub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform duration-200"
                  title="View GitHub"
                >
                  <Github className="size-6 text-foreground" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact form modal — rendered outside the section so it overlays everything */}
      {isModalOpen && <ContactModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

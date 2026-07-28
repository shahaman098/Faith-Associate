"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { HomeBlocks } from "@/lib/cms/types";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";

type Destination = {
  label: string;
  href: string;
};

type Topic = {
  label: string;
  destinations: Destination[];
};

type Step = "topic" | "refine" | "email";

const topics: Topic[] = [
  {
    label: "Mosque Governance",
    destinations: [
      { label: "Mosque services & governance", href: "/services/mosque-services" },
      {
        label: "Policies & procedures",
        href: "/services/mosque-policy-and-procedure-development",
      },
      { label: "Election management", href: "/services/mosque-election-management" },
    ],
  },
  {
    label: "Madrassah Support",
    destinations: [{ label: "Madrassah support", href: "/services/madrassah-support" }],
  },
  {
    label: "Leadership Training",
    destinations: [
      { label: "Faith Associates Academy", href: "/projects/faith-associates-academy" },
    ],
  },
  {
    label: "Safeguarding",
    destinations: [
      { label: "Safeguarding services", href: "/services/safeguarding" },
      { label: "Online & offline safety", href: "/services/safety" },
    ],
  },
  {
    label: "Imam Services",
    destinations: [{ label: "Imam services", href: "/services/imam-services" }],
  },
  {
    label: "Security & Safety",
    destinations: [
      {
        label: "Security risk assessment",
        href: "/services/mosque-security-risk-assessment",
      },
      { label: "Safety support", href: "/services/safety" },
      { label: "Mosque Security programme", href: "/projects/mosque-security" },
    ],
  },
  {
    label: "Strategic Projects",
    destinations: [
      { label: "Strategic services", href: "/services/strategic-services" },
      { label: "All projects", href: "/projects" },
    ],
  },
  {
    label: "International Work",
    destinations: [{ label: "International work", href: "/international" }],
  },
  {
    label: "Publications",
    destinations: [{ label: "Publications", href: "/publications" }],
  },
  {
    label: "Events & Networks",
    destinations: [
      { label: "Events", href: "/events" },
      { label: "Mosque Expo", href: "/projects/mosque-expo" },
      {
        label: "Beacon Mosque Awards",
        href: "/projects/british-beacon-mosque-awards",
      },
    ],
  },
];

const pillClassName =
  "inline-flex cursor-pointer border border-[var(--line)] bg-white px-4 py-2.5 text-left text-[0.9rem] font-medium text-[var(--ink)] transition duration-300 hover:border-[var(--blue)] hover:text-[var(--blue)]";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-5 shrink-0 text-[#8a9098] transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="m3.5 6 4.5 4.5L12.5 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

type OptionPopupProps = {
  open: boolean;
  title: string;
  options: { label: string; value: string }[];
  selectedValue?: string | null;
  onClose: () => void;
  onSelect: (value: string) => void;
};

function OptionPopup({
  open,
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
}: OptionPopupProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:hidden">
      <button
        type="button"
        aria-label="Close options"
        className="absolute inset-0 bg-[var(--navy)]/45 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex max-h-[78vh] w-full flex-col rounded-t-[0.5rem] bg-white outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">
              Choose an option
            </p>
            <h4 id={titleId} className="type-title mt-1.5 text-lg text-black">
              {title}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition duration-300 hover:border-[var(--blue)] hover:text-[var(--blue)]"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-2 py-2">
          {options.map((option) => {
            const selected = option.value === selectedValue;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[0.98rem] font-medium transition duration-300 ${
                  selected
                    ? "bg-[var(--soft)] text-[var(--blue)]"
                    : "text-[var(--ink)] hover:bg-[var(--soft)]"
                }`}
              >
                <span>{option.label}</span>
                {selected ? (
                  <span className="type-meta text-[var(--blue)]">
                    Selected
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function buildDestinationUrl(href: string, email: string, topic: string) {
  const url = new URL(href, "https://faithassociates.co.uk");
  url.searchParams.set("email", email);
  url.searchParams.set("interest", topic);
  return `${url.pathname}${url.search}`;
}

export function GuidedSupportSection({ content }: { content?: HomeBlocks["guidedSupport"] }) {
  const data = content ?? {
    image: "/assets/real/guided-support-training.jpg",
    title: "We champion the bold to achieve the extraordinary.",
    body: "Answer two questions and put our thinking to work on your challenges.",
    topics,
  };
  const activeTopics = data.topics;
  const router = useRouter();
  const emailInputId = useId();
  const [step, setStep] = useState<Step>("topic");
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [topicOpen, setTopicOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);

  const goToEmailStep = (topic: Topic, href: string) => {
    setActiveTopic(topic);
    setPendingHref(href);
    setEmailError(null);
    setStep("email");
  };

  const selectTopic = (topic: Topic) => {
    if (topic.destinations.length === 1) {
      goToEmailStep(topic, topic.destinations[0].href);
      return;
    }

    setActiveTopic(topic);
    setPendingHref(null);
    setStep("refine");
  };

  const handleTopicSelectFromPopup = (label: string) => {
    const topic = activeTopics.find((item) => item.label === label);
    if (!topic) return;

    setTopicOpen(false);
    selectTopic(topic);
  };

  const handleDestinationSelect = (href: string) => {
    if (!activeTopic) return;
    setDestinationOpen(false);
    goToEmailStep(activeTopic, href);
  };

  const handleBack = () => {
    setEmailError(null);

    if (step === "email") {
      if (activeTopic && activeTopic.destinations.length > 1) {
        setPendingHref(null);
        setStep("refine");
        return;
      }
      setActiveTopic(null);
      setPendingHref(null);
      setStep("topic");
      return;
    }

    setStep("topic");
    setActiveTopic(null);
    setPendingHref(null);
    setDestinationOpen(false);
  };

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError("Enter a valid email address to continue.");
      return;
    }

    if (!pendingHref || !activeTopic) {
      setEmailError("Choose a topic before continuing.");
      return;
    }

    setEmailError(null);
    router.push(buildDestinationUrl(pendingHref, trimmed, activeTopic.label));
  };

  const topicOptions = activeTopics.map((topic) => ({
    label: topic.label,
    value: topic.label,
  }));

  const destinationOptions =
    activeTopic?.destinations.map((destination) => ({
      label: destination.label,
      value: destination.href,
    })) ?? [];

  const questionNumber = step === "topic" ? 1 : 2;
  const questionTitle =
    step === "topic"
      ? "1. What do you need help with?"
      : step === "refine"
        ? "2. Which best describes your need?"
        : "2. What's the best email to reach you?";

  return (
    <section className="bg-[var(--soft)] py-12 lg:py-20">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16 xl:px-8">
        <div className="media-frame relative aspect-[16/10] w-full overflow-hidden sm:aspect-[5/3] lg:aspect-auto lg:h-[520px] lg:max-w-[460px]">
          <EditableImage
            src={data.image}
            alt="Faith Associates trainer delivering a community workshop"
            path="guidedSupport.image"
            fill
            sizes="(max-width: 1024px) 100vw, 460px"
            quality={90}
            className="object-cover object-[62%_center]"
            priority
          />
        </div>

        <div className="min-w-0 max-w-[720px] pt-0 text-center md:pt-0 md:text-left lg:pt-1">
          <p className="type-eyebrow mb-3 text-[var(--blue)] md:hidden">
            Find the right service
          </p>
          <h2 className="type-display mx-auto max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.65rem)] text-[var(--ink)] md:mx-0">
            <EditableText value={data.title} path="guidedSupport.title" />
          </h2>
          <p className="type-body mx-auto mt-4 max-w-[32rem] text-[0.98rem] text-[var(--muted)] md:mx-0 lg:mt-5 lg:text-[1.05rem]">
            <EditableText value={data.body} path="guidedSupport.body" multiline />
          </p>

          <div className="mt-6 pt-2 lg:mt-10 lg:pt-4">
            <div className="flex flex-col items-center gap-y-1 md:flex-row md:flex-wrap md:items-baseline md:gap-x-3">
              <h3 className="type-title text-[clamp(1.05rem,1.7vw,1.35rem)] text-[var(--ink)]">
                {questionTitle}
              </h3>
              <span className="type-meta text-[var(--muted)]">
                Question {questionNumber} of 2
              </span>
            </div>

            {activeTopic && step !== "topic" ? (
              <p className="mt-3 text-sm text-[var(--muted)]">
                Selected:{" "}
                <span className="font-semibold text-black">{activeTopic.label}</span>
              </p>
            ) : null}

            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="mx-auto mt-5 max-w-md space-y-4 md:mx-0 lg:mt-6">
                <div>
                  <label htmlFor={emailInputId} className="sr-only">
                    Email address
                  </label>
                  <input
                    id={emailInputId}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="name@organisation.org"
                    className="h-12 w-full border border-[var(--line)] bg-white px-4 text-center text-[0.98rem] text-[var(--ink)] outline-none transition duration-300 placeholder:text-[var(--muted)] focus:border-[var(--blue)] md:text-left"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? `${emailInputId}-error` : undefined}
                  />
                  {emailError ? (
                    <p id={`${emailInputId}-error`} className="mt-2 text-sm text-[var(--red)]">
                      {emailError}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      We’ll use this to follow up with the right support.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Continue
                </button>
              </form>
            ) : (
              <>
                {/* Mobile: compact select + popup */}
                <div className="mx-auto mt-4 max-w-md space-y-3 md:hidden">
                  <button
                    type="button"
                    onClick={() => setTopicOpen(true)}
                    className="flex w-full items-center justify-between gap-3 border border-[var(--line)] bg-white px-4 py-3.5 text-left transition duration-300 hover:border-[var(--blue)]"
                    aria-haspopup="dialog"
                    aria-expanded={topicOpen}
                  >
                    <span className={activeTopic ? "font-semibold text-black" : "text-[var(--muted)]"}>
                      {activeTopic?.label ?? "Select a topic"}
                    </span>
                    <ChevronIcon open={topicOpen} />
                  </button>

                  {step === "refine" && activeTopic ? (
                    <button
                      type="button"
                      onClick={() => setDestinationOpen(true)}
                      className="flex w-full items-center justify-between gap-3 border border-[var(--line)] bg-white px-4 py-3.5 text-left transition duration-300 hover:border-[var(--blue)]"
                      aria-haspopup="dialog"
                      aria-expanded={destinationOpen}
                    >
                      <span className="text-[var(--muted)]">Choose the best match</span>
                      <ChevronIcon open={destinationOpen} />
                    </button>
                  ) : null}
                </div>

                {/* Desktop: pill options */}
                <div className="mt-6 hidden max-w-[680px] flex-wrap gap-x-3.5 gap-y-4 md:flex">
                  {step === "topic"
                    ? activeTopics.map((topic) => (
                        <button
                          key={topic.label}
                          type="button"
                          onClick={() => selectTopic(topic)}
                          className={pillClassName}
                        >
                          {topic.label}
                        </button>
                      ))
                    : (activeTopic?.destinations ?? []).map((destination) => (
                        <button
                          key={destination.href}
                          type="button"
                          onClick={() => handleDestinationSelect(destination.href)}
                          className={pillClassName}
                        >
                          {destination.label}
                        </button>
                      ))}
                </div>
              </>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start lg:mt-7">
              {step !== "topic" ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex cursor-pointer text-[0.95rem] font-medium text-[var(--muted)] underline underline-offset-4 transition duration-300 hover:text-[var(--blue)]"
                >
                  Back
                </button>
              ) : null}
              <Link
                href="/services"
                className="inline-flex text-[0.95rem] font-medium text-[var(--muted)] underline underline-offset-4 transition duration-300 hover:text-[var(--blue)]"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>

      <OptionPopup
        open={topicOpen}
        title="What do you need help with?"
        options={topicOptions}
        selectedValue={activeTopic?.label}
        onClose={() => setTopicOpen(false)}
        onSelect={handleTopicSelectFromPopup}
      />

      <OptionPopup
        open={destinationOpen}
        title={activeTopic ? `${activeTopic.label}: choose a route` : "Choose a route"}
        options={destinationOptions}
        onClose={() => setDestinationOpen(false)}
        onSelect={handleDestinationSelect}
      />
    </section>
  );
}

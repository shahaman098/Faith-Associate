"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsData } from "@/lib/cms/types";
import { EditableText } from "./cms/EditableText";
import { useEdit } from "./cms/EditProvider";
import { ArrowIcon } from "./icons";

const defaultFooterGroups: SiteSettingsData["footer"]["groups"] = [
  {
    title: "Services",
    links: [
      ["All services", "/services"],
      ["Mosque services", "/services/mosque-services"],
      ["Safeguarding", "/services/safeguarding"],
      ["Safety", "/services/safety"],
      ["Strategic services", "/services/strategic-services"],
    ],
  },
  {
    title: "Explore",
    links: [
      ["About us", "/about"],
      ["Projects", "/projects"],
      ["Publications", "/publications"],
      ["International", "/international"],
    ],
  },
  {
    title: "News & events",
    links: [
      ["Latest news", "/news"],
      ["Events", "/events"],
    ],
  },
];

export function SiteFooter({ settings }: { settings?: SiteSettingsData | null }) {
  const { settings: liveSettings } = useEdit();
  const footer = liveSettings?.footer ?? settings?.footer;
  const blurb =
    footer?.blurb ??
    "Building standards, resilience and leadership across faith institutions and communities worldwide.";
  const copyright = footer?.copyright ?? "© 2026 Faith Associates";
  const email = footer?.email ?? "info@faithassociates.co.uk";
  const phone = footer?.phone ?? "+44 (0) 1494 416202";
  const phoneTel = phone.replace(/[^\d+]/g, "") || "+441494416202";
  const groups = footer?.groups?.length ? footer.groups : defaultFooterGroups;
  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="section-shell py-7 sm:py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.72fr_0.66fr_0.66fr_1fr] lg:items-start lg:gap-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Link href="/" aria-label="Faith Associates home" className="inline-flex">
              <Image
                src="/assets/faith-associates-logo.png"
                alt="Faith Associates"
                width={160}
                height={88}
                className="h-10 w-auto object-contain sm:h-14 lg:h-16"
              />
            </Link>
            <p className="mt-3 max-w-[24rem] text-sm leading-7 text-white/70 sm:mt-4 sm:text-[15px]">
              <EditableText value={blurb} path="footer.blurb" scope="settings" as="span" multiline />
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 sm:mt-5 sm:gap-x-5 sm:text-xs lg:justify-start">
              <a
                href="https://www.linkedin.com/company/faith-associates/"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[var(--blue-light)]"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/FaithAssociates1/"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[var(--blue-light)]"
              >
                Facebook
              </a>
              <a
                href="https://x.com/faithassociates"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[var(--blue-light)]"
              >
                X
              </a>
            </div>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-2 gap-4 border-t border-white/10 pt-5 text-center sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:contents lg:border-0 lg:pt-0 lg:text-left">
            {groups.map((group) => (
              <div key={group.title} className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--blue-light)] sm:text-xs">
                  {group.title}
                </p>
                <div className="mt-2 grid gap-1 sm:mt-3 sm:gap-2">
                  {group.links.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="py-1 text-sm leading-6 text-white/72 transition duration-300 hover:text-white sm:text-[15px]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-5 text-center lg:border-l lg:border-t-0 lg:border-white/10 lg:pl-8 lg:pt-0 lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--blue-light)] sm:text-xs">
              Start a conversation
            </p>
            <p className="mx-auto mt-2 hidden max-w-sm text-sm leading-7 text-white/60 sm:mt-3 sm:block lg:mx-0">
              Tell us what your institution or partnership needs. We will help identify the right next
              step.
            </p>
            <Link
              href="/contact"
              className="btn-primary mt-4 w-full sm:mt-6 sm:w-auto"
            >
              Contact the team <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[var(--navy-deep)]">
        <div className="section-shell flex flex-col items-center gap-2 py-4 text-center text-[11px] leading-5 text-white/50 sm:flex-row sm:justify-between sm:gap-3 sm:py-5 sm:text-left sm:text-xs">
          <EditableText value={copyright} path="footer.copyright" scope="settings" as="p" />
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-end sm:gap-x-4">
            <Link href="/privacy" className="transition hover:text-[var(--blue-light)]">
              Privacy
            </Link>
            <a href={`mailto:${email}`} className="transition hover:text-[var(--blue-light)]">
              <EditableText value={email} path="footer.email" scope="settings" as="span" />
            </a>
            <a href={`tel:${phoneTel}`} className="transition hover:text-[var(--blue-light)]">
              <EditableText value={phone} path="footer.phone" scope="settings" as="span" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

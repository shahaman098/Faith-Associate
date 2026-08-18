"use client";

import { useEffect, useRef, useState } from "react";
import { InternationalMap, type InternationalRegion } from "./InternationalMap";
import { EditableText } from "./cms/EditableText";

export const internationalRegions: InternationalRegion[] = [
  {
    id: "africa",
    name: "Africa",
    body: "Partnership with the United Nations Development Programme and local organisations to develop faith institutions, empower leaders and support peacebuilding.",
    countries: [
      "Algeria",
      "Angola",
      "Benin",
      "Botswana",
      "Burkina Faso",
      "Burundi",
      "Cameroon",
      "Central African Rep.",
      "Chad",
      "Congo",
      "Côte d'Ivoire",
      "Dem. Rep. Congo",
      "Djibouti",
      "Egypt",
      "Eq. Guinea",
      "Eritrea",
      "eSwatini",
      "Ethiopia",
      "Gabon",
      "Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Kenya",
      "Lesotho",
      "Liberia",
      "Libya",
      "Madagascar",
      "Malawi",
      "Mali",
      "Mauritania",
      "Morocco",
      "Mozambique",
      "Namibia",
      "Niger",
      "Nigeria",
      "Rwanda",
      "Senegal",
      "Sierra Leone",
      "Somalia",
      "South Africa",
      "South Sudan",
      "Sudan",
      "Tanzania",
      "Togo",
      "Tunisia",
      "Uganda",
      "W. Sahara",
      "Zambia",
      "Zimbabwe",
    ],
  },
  {
    id: "europe",
    name: "Europe",
    body: "More than a decade of work in security, governance and sport with European institutions, city partners and community networks.",
    countries: [
      "Albania",
      "Austria",
      "Belgium",
      "Bosnia and Herz.",
      "Bulgaria",
      "Croatia",
      "Czechia",
      "Estonia",
      "France",
      "Germany",
      "Greece",
      "Hungary",
      "Ireland",
      "Italy",
      "Kosovo",
      "Latvia",
      "Lithuania",
      "Luxembourg",
      "Moldova",
      "Montenegro",
      "Netherlands",
      "Macedonia",
      "Poland",
      "Portugal",
      "Romania",
      "Serbia",
      "Slovakia",
      "Slovenia",
      "Spain",
      "Switzerland",
      "Ukraine",
      "United Kingdom",
    ],
  },
  {
    id: "nordic",
    name: "Nordic states",
    body: "Government, city and Nordic Safe Cities partnerships centred on inclusion, empowerment, protective security and the MEET network.",
    countries: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
  },
  {
    id: "middle-east",
    name: "Middle East",
    body: "Leadership and dialogue work linked to Imams Online and the Forum for Peace, supported through regional partnerships.",
    countries: [
      "Bahrain",
      "Iran",
      "Iraq",
      "Israel",
      "Jordan",
      "Kuwait",
      "Lebanon",
      "Oman",
      "Palestine",
      "Qatar",
      "Saudi Arabia",
      "Syria",
      "Turkey",
      "United Arab Emirates",
      "Yemen",
    ],
  },
  {
    id: "north-america",
    name: "North America",
    body: "Conferences, retreats and sector engagement sharing learning on mosque and imam development from policy to grassroots delivery.",
    countries: ["Canada", "United States of America"],
  },
  {
    id: "australasia",
    name: "Australia & New Zealand",
    body: "Protective-security and institution-development exchange following Christchurch, alongside wider international learning through UNOCT.",
    countries: ["Australia", "New Zealand"],
  },
];

export function InternationalPresenceSection({ regions = internationalRegions }: { regions?: InternationalRegion[] }) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>("europe");
  const regionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!selectedRegionId) return;
    const node = regionRefs.current[selectedRegionId];
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [selectedRegionId]);

  return (
    <>
      <section className="border-b border-[var(--line)] bg-white py-14 lg:py-20">
        <div className="section-shell">
          <div className="mb-8 max-w-3xl lg:mb-10">
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value="Where we work" path="mapEyebrow" />
            </p>
            <h2 className="type-display mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              <EditableText value="An interactive view of our international presence." path="mapTitle" />
            </h2>
            <p className="type-body mt-4 text-[var(--muted)] lg:text-[1.05rem]">
              <EditableText
                value="Select a highlighted country or region to explore partnerships across Africa, Europe, the Nordic states, the Middle East, North America and Australasia."
                path="mapBody"
                multiline
              />
            </p>
          </div>

          <InternationalMap
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
          />
        </div>
      </section>

      <section id="regions" className="border-b border-[var(--line)] py-14 lg:py-20">
        <div className="section-shell">
          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {regions.map((region, index) => {
              const selected = region.id === selectedRegionId;
              return (
                <article
                  key={region.id}
                  id={region.id}
                  ref={(node) => {
                    regionRefs.current[region.id] = node;
                  }}
                  className={`border-b border-[var(--line)] px-0 py-8 transition duration-200 md:px-7 md:first:pl-0 lg:border-r lg:[&:nth-child(3n)]:border-r-0 ${
                    selected ? "bg-[var(--soft)]" : "bg-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRegionId(region.id)}
                    className="w-full cursor-pointer text-left"
                  >
                    <p className="type-meta text-[var(--blue)]">0{index + 1}</p>
                    <h2 className="type-title mt-5 text-2xl text-[var(--ink)]">
                      <EditableText value={region.name} path={`regions.${index}.name`} />
                    </h2>
                    <p className="type-body mt-4 text-sm text-[var(--muted)]">
                      <EditableText value={region.body} path={`regions.${index}.body`} multiline />
                    </p>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

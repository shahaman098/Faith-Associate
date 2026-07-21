"use client";

import { geoNaturalEarth1, geoPath } from "d3-geo";
import { useEffect, useId, useMemo, useState } from "react";
import { feature } from "topojson-client";

export type InternationalRegion = {
  id: string;
  name: string;
  body: string;
  countries: string[];
};

type MapCountry = {
  name: string;
  regionId: string | null;
  d: string;
};

const MAP_WIDTH = 980;
const MAP_HEIGHT = 480;

const COLORS = {
  ocean: "#ffffff",
  land: "#e4e9ef",
  landStroke: "#c8d0da",
  active: "#9ec5e0",
  activeStroke: "#6fa3c7",
  hover: "#0060b0",
  hoverStroke: "#004a8c",
  selected: "#3d86c4",
  selectedStroke: "#0060b0",
};

function countryToRegionId(
  countryName: string,
  regions: InternationalRegion[],
): string | null {
  for (const region of regions) {
    if (region.countries.includes(countryName)) return region.id;
  }
  return null;
}

export function InternationalMap({
  regions,
  selectedRegionId,
  onSelectRegion,
}: {
  regions: InternationalRegion[];
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
}) {
  const tooltipId = useId();
  const [paths, setPaths] = useState<MapCountry[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const activeCountrySet = useMemo(() => {
    return new Set(regions.flatMap((region) => region.countries));
  }, [regions]);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch("/geo/countries-110m.json");
        if (!response.ok) throw new Error("Failed to load map data");

        const topology = await response.json();
        const countries = feature(topology, topology.objects.countries) as unknown as {
          type: "FeatureCollection";
          features: Array<{
            properties: { name: string };
            geometry: unknown;
          }>;
        };

        const projection = geoNaturalEarth1().fitExtent(
          [
            [8, 8],
            [MAP_WIDTH - 8, MAP_HEIGHT - 8],
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          countries as any,
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const path = geoPath(projection as any);

        const nextPaths = countries.features
          .map((geo) => {
            const name = geo.properties.name;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d = path(geo as any);
            if (!d) return null;
            return {
              name,
              regionId: countryToRegionId(name, regions),
              d,
            };
          })
          .filter((item): item is MapCountry => Boolean(item));

        if (!cancelled) {
          setPaths(nextPaths);
          setLoadError(false);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, [regions]);

  const hoveredRegion = regions.find((region) => region.id === hoveredRegionId) ?? null;
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? null;
  const detailRegion = hoveredRegion ?? selectedRegion;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.7fr)] lg:items-start lg:gap-12">
      <div className="relative overflow-hidden border border-[var(--line)] bg-white">
        {loadError ? (
          <div className="flex min-h-[280px] items-center justify-center px-6 py-16 text-center text-sm text-[var(--muted)] sm:min-h-[360px]">
            Map data could not be loaded. Use the region list to explore our international work.
          </div>
        ) : paths.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center px-6 py-16 text-sm text-[var(--muted)] sm:min-h-[360px]">
            Loading map…
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-labelledby={tooltipId}
            className="h-auto w-full"
          >
            <title id={tooltipId}>Interactive map of Faith Associates international presence</title>
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={COLORS.ocean} />
            {paths.map((country) => {
              const isPresence = activeCountrySet.has(country.name);
              const isRegionHovered =
                Boolean(country.regionId) && country.regionId === hoveredRegionId;
              const isRegionSelected =
                Boolean(country.regionId) && country.regionId === selectedRegionId;
              const isCountryHovered = country.name === hoveredCountry;

              let fill = COLORS.land;
              let stroke = COLORS.landStroke;

              if (isPresence) {
                fill = COLORS.active;
                stroke = COLORS.activeStroke;
              }
              if (isRegionSelected) {
                fill = COLORS.selected;
                stroke = COLORS.selectedStroke;
              }
              if (isRegionHovered || isCountryHovered) {
                fill = COLORS.hover;
                stroke = COLORS.hoverStroke;
              }

              return (
                <path
                  key={country.name}
                  d={country.d}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={0.6}
                  vectorEffect="non-scaling-stroke"
                  className={
                    country.regionId
                      ? "cursor-pointer transition-[fill,stroke] duration-200"
                      : "cursor-default"
                  }
                  onMouseEnter={() => {
                    setHoveredCountry(country.name);
                    setHoveredRegionId(country.regionId);
                  }}
                  onMouseLeave={() => {
                    setHoveredCountry(null);
                    setHoveredRegionId(null);
                  }}
                  onFocus={() => {
                    setHoveredCountry(country.name);
                    setHoveredRegionId(country.regionId);
                  }}
                  onBlur={() => {
                    setHoveredCountry(null);
                    setHoveredRegionId(null);
                  }}
                  onClick={() => {
                    if (country.regionId) onSelectRegion(country.regionId);
                  }}
                  tabIndex={country.regionId ? 0 : undefined}
                  role={country.regionId ? "button" : undefined}
                  aria-label={
                    country.regionId
                      ? `${country.name}, ${regions.find((region) => region.id === country.regionId)?.name ?? "region"}`
                      : country.name
                  }
                  onKeyDown={(event) => {
                    if (!country.regionId) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectRegion(country.regionId);
                    }
                  }}
                />
              );
            })}
          </svg>
        )}
      </div>

      <aside className="border border-[var(--line)] bg-[var(--soft)] p-6 sm:p-8">
        <p className="type-eyebrow text-[var(--blue)]">Presence</p>
        <h3 className="type-title mt-3 text-[1.35rem] text-[var(--ink)] sm:text-[1.5rem]">
          {detailRegion?.name ?? "Explore our regions"}
        </h3>
        <p className="type-body mt-3 text-sm text-[var(--muted)] sm:text-[0.95rem]">
          {detailRegion?.body ??
            "Hover or select a highlighted country to explore Faith Associates work across five continents."}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {regions.map((region) => {
            const active = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectRegion(region.id)}
                onMouseEnter={() => setHoveredRegionId(region.id)}
                onMouseLeave={() => setHoveredRegionId(null)}
                className={`border px-3 py-2 text-left text-[0.8rem] font-medium transition duration-200 ${
                  active
                    ? "border-[var(--blue)] bg-[var(--blue)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
                }`}
              >
                {region.name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-5 text-[11px] text-[var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 bg-[#9ec5e0]" aria-hidden="true" />
            Active presence
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 bg-[#e4e9ef]" aria-hidden="true" />
            Other countries
          </span>
        </div>
      </aside>
    </div>
  );
}

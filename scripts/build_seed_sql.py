#!/usr/bin/env python3
import json
import pathlib

root = pathlib.Path("/Users/efi/Documents/Faith Associates/Faith-Associate")
seed = json.loads(pathlib.Path("/tmp/fa-cms-seed.json").read_text())
parts: list[str] = []


def esc(value: str) -> str:
    return value.replace("'", "''")


settings = esc(json.dumps(seed["settings"], ensure_ascii=False))
parts.append(
    f"""INSERT INTO public.site_settings (id, data, draft_data, updated_at)
VALUES ('default', '{settings}'::jsonb, NULL, now())
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, draft_data = NULL, updated_at = now();"""
)

parts.append("DELETE FROM public.pages;")
page_rows = []
for p in seed["pages"]:
    blocks = esc(json.dumps(p["blocks"], ensure_ascii=False))
    title = esc(p.get("title") or "")
    path = esc(p["path"])
    page_rows.append(f"('{path}', '{title}', '{blocks}'::jsonb, 'published')")

for i in range(0, len(page_rows), 5):
    vals = ",\n".join(page_rows[i : i + 5])
    parts.append(f"INSERT INTO public.pages (path, title, blocks, status) VALUES\n{vals};")

parts.append("DELETE FROM public.entries;")
entry_rows = []
for e in seed["entries"]:
    data = esc(json.dumps(e["data"], ensure_ascii=False))
    typ = esc(e["type"])
    slug = esc(e["slug"])
    so = int(e["sort_order"])
    entry_rows.append(f"('{typ}', '{slug}', '{data}'::jsonb, {so}, 'published')")

for i in range(0, len(entry_rows), 8):
    vals = ",\n".join(entry_rows[i : i + 8])
    parts.append(
        f"INSERT INTO public.entries (type, slug, data, sort_order, status) VALUES\n{vals};"
    )

out = root / "scripts" / "seed-sql"
out.mkdir(parents=True, exist_ok=True)
for old in out.glob("*.sql"):
    old.unlink()
for idx, part in enumerate(parts):
    (out / f"{idx:03d}.sql").write_text(part)

print(f"wrote {len(parts)} sql parts to {out}")

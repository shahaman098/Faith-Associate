import { getPage, getSiteSettings } from "./queries";

export async function loadCmsPage(path: string) {
  // Public pages should serve published content only so they can stay cacheable.
  const preferDraft = false;
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPage(path),
  ]);

  return {
    session: null,
    settings,
    page,
    isEditor: false,
    preferDraft,
  };
}

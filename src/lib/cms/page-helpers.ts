import { getEditorSession } from "./actions";
import { getPage, getSiteSettings } from "./queries";

export async function loadCmsPage(path: string) {
  const session = await getEditorSession();
  const preferDraft = Boolean(session);
  const [settings, page] = await Promise.all([
    getSiteSettings({ preferDraft }),
    getPage(path, { preferDraft }),
  ]);

  return {
    session,
    settings,
    page,
    isEditor: Boolean(session),
    preferDraft,
  };
}

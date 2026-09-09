// Flyers Studio is a separately deployed application (Render: FlyersMinds-Studio).
// Flyers Minds only links out to it — override with REACT_APP_STUDIO_URL at build
// time if you need to point at a preview deploy or a local Studio on :3001.
export const STUDIO_URL = process.env.REACT_APP_STUDIO_URL || 'https://studio.flyersminds.com';

// Studio's SSO entry point: it verifies the short-lived token and sets its session
// cookie. See app/studio/entry/route.ts in the FlyersMinds-Studio repo.
export function buildStudioEntryUrl(token) {
  const entryUrl = new URL('/studio/entry', STUDIO_URL);
  entryUrl.searchParams.set('token', token);
  return entryUrl.toString();
}

import { announcePageLoaded } from 'grommet/utils/Announcer';

const DEFAULT_TITLE = 'Drone CI';

export function getJobKey(env) {
  let jobKey = '';
  Object.keys(env).forEach(key => jobKey += `${key}=${env[key]}`);
  return jobKey;
}

export function pageLoaded(title) {
  if (document) {
    if (title && typeof title === 'string') {
      title = `${title} | ${DEFAULT_TITLE}`;
    } else {
      title = DEFAULT_TITLE;
    }
    announcePageLoaded(title);
    document.title = title;
  }
}

export default { getJobKey, pageLoaded };

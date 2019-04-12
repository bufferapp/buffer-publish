export const getBaseURL = () => {
  return window.location.hostname === 'publish.local.buffer.com' ? 'local.buffer.com' : 'buffer.com';
};

export const openPreviewPage = (url) => {
  window.open(url, '_blank');
};

export const isValidURL = (str) => {
  const a = document.createElement('a');
  a.href = str;
  return (a.host && a.host !== window.location.host);
};
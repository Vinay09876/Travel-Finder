export const getAnonymousUserId = (): string => {
  if (typeof window === 'undefined') return '';
  let anonId = localStorage.getItem('travelFinder_anon_userId');
  if (!anonId) {
    anonId = crypto.randomUUID();
    localStorage.setItem('travelFinder_anon_userId', anonId);
  }
  return anonId;
};

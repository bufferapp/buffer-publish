function isADifferentProfile(profile, prevProps) {
  return profile.id !== prevProps.profileId;
}

export const shouldGoToProfile = (profile, prevProps) => {
  return (
    profile &&
    (isADifferentProfile(profile, prevProps) || prevProps.profileId === null)
  );
};

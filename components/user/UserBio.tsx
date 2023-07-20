"use client";

export default function UserBio({
  profileUserId,
  profileUserBio,
  affirmation,
  className,
}: {
  profileUserId: string;
  profileUserBio: string;
  affirmation: string;
  className?: string;
}) {
  let bio = profileUserBio;

  if (!bio) {
    let stored = sessionStorage.getItem(profileUserId + "_affirmation");
    if (stored) {
      bio = stored;
    } else {
      sessionStorage.setItem(profileUserId + "_affirmation", affirmation);
      bio = affirmation;
    }
  }

  return <p className={className}>{bio}</p>;
}

interface RatingProps {
  resourceId: string;
  userId: string;
  totalRating: string;
  userRating: boolean | null;
}

export default function Rating({
  resourceId,
  userId,
  totalRating,
  userRating,
}: RatingProps) {
  return <div>{totalRating}</div>;
}

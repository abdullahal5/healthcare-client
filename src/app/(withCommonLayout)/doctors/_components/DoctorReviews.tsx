"use client";
import { StarRating } from "@/app/(withDashboardLayout)/dashboard/patient/appointments/_components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Review } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";

const DoctorReviews = ({
  reviews,
  averageRating,
}: {
  reviews: Review[];
  averageRating: number;
}) => {
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === rating).length;
    return {
      rating,
      count,
      percentage: reviews.length
        ? Math.round((count / reviews.length) * 100)
        : 0,
    };
  });

  const stopWords = ["the", "is", "and", "a", "was", "very", "with", "really"];
  const wordCounts: Record<string, number> = {};

  reviews.forEach((review) => {
    review.comment
      .toLowerCase()
      .split(/\W+/)
      .forEach((word) => {
        if (word && !stopWords.includes(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
  });

  const sortedKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Patient Reviews</span>
          <div className="flex items-center gap-2">
            <div className="flex">
              <StarRating value={averageRating} />
            </div>
            {/* <span className="font-bold text-lg">{averageRating}</span> */}
            <span className="text-gray-500">({reviews?.length} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold">Rating Breakdown</h4>
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center ">
                  <span className="text-gray-700 w-6">{rating}</span>
                  {/* <StarRating value={1} /> */}
                </div>
                <Progress
                  value={percentage}
                  className="flex-1 h-2.5 bg-gray-200 progress-fill"
                />
                <div className="flex items-center gap-2 w-20">
                  <span className="text-sm font-medium text-gray-700">
                    {percentage}%
                  </span>
                  <span className="text-xs text-gray-400">({count})</span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Most Mentioned</h4>
            <div className="flex flex-wrap gap-2">
              {sortedKeywords &&
                sortedKeywords.map((word, index) => (
                  <Badge key={index} variant="secondary">
                    {word}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Individual Reviews */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Recent Reviews
          </h4>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-neutral-300 rounded-lg p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    {review.patient.profilePhoto ? (
                      <AvatarImage
                        src={review.patient.profilePhoto}
                        alt={review.patient.name}
                        className="object-cover border rounded-full border-neutral-300"
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {review.patient.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">
                      {review.patient.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        <StarRating value={review.rating} />
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-3 pl-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorReviews;

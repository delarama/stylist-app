import { Star, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";

interface RateReviewProps {
  stylistName: string;
  stylistAvatar: string;
  onSubmit: (rating: number, review: string) => void;
  onSkip: () => void;
}

export function RateReview({ stylistName, stylistAvatar, onSubmit, onSkip }: RateReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, review);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <Card className="w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl rounded-b-none sm:rounded-b-2xl border-0 sm:border max-h-[90vh] overflow-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl">Rate Your Experience</h2>
            <Button variant="ghost" size="icon" onClick={onSkip} className="sm:hidden">
              <X className="size-5" />
            </Button>
          </div>

          {/* Stylist Info */}
          <div className="flex flex-col items-center text-center mb-8">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-4">
              <AvatarImage src={stylistAvatar} alt={stylistName} />
              <AvatarFallback>{stylistName[0]}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg sm:text-xl mb-2">{stylistName}</h3>
            <p className="text-sm text-muted-foreground">
              How was your experience with {stylistName.split(' ')[0]}?
            </p>
          </div>

          {/* Rating Stars */}
          <div className="mb-8">
            <Label className="mb-4 block text-center">Tap to rate</Label>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform active:scale-90 sm:hover:scale-110"
                >
                  <Star
                    className={`size-10 sm:size-12 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-4 text-sm text-muted-foreground">
                {rating === 5 && "Amazing! 🌟"}
                {rating === 4 && "Great experience! 😊"}
                {rating === 3 && "Good 👍"}
                {rating === 2 && "Could be better 😐"}
                {rating === 1 && "Not satisfied 😞"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <Label htmlFor="review" className="mb-2 block">
              Share more details (optional)
            </Label>
            <Textarea
              id="review"
              placeholder="Tell others about your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px] sm:min-h-[140px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {review.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1 h-12 sm:h-11"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 h-12 sm:h-11"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

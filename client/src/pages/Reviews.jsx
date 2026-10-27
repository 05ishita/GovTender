import { useEffect, useState } from "react";
import { Loader2, MessageSquare, Star, Send } from "lucide-react";
import api from "../services/api";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [collaborations, setCollaborations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reviewsResponse, eligibleResponse] = await Promise.all([
        api.get("/reviews/me"),
        api.get("/reviews/eligible"),
      ]);

      setReviews(reviewsResponse.data.reviews || []);
      setAverage(reviewsResponse.data.averageRating || 0);
      setCollaborations(eligibleResponse.data.collaborations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load reviews and review opportunities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!selected || !comment.trim()) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await api.post("/reviews", {
        revieweeId: selected.reviewee._id,
        tenderId: selected.tender._id,
        rating,
        comment: comment.trim(),
      });

      setSuccess(`Review submitted for ${selected.reviewee.name}.`);
      setSelected(null);
      setComment("");
      setRating(5);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit the review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={35} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Reputation
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Reviews & Ratings</h1>
        <p className="mt-2 text-sm text-slate-500">
          See feedback and review collaborators after selected tender work.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">Average Rating</p>
          <div className="mt-2 flex items-center gap-2">
            <Star className="fill-yellow-400 text-yellow-400" />
            <span className="text-3xl font-bold">{average || "0.0"}</span>
            <span className="text-sm text-slate-400">/ 5</span>
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6 md:col-span-2">
          <p className="text-sm text-slate-500">Total Reviews</p>
          <p className="mt-2 text-3xl font-bold">{reviews.length}</p>
        </div>
      </div>

      {collaborations.some((item) => !item.alreadyReviewed) && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Star size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Review a collaborator</h2>
              <p className="mt-1 text-sm text-slate-500">
                Share feedback for a contractor or bid writer from a selected tender.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {collaborations.filter((item) => !item.alreadyReviewed).map((item) => (
              <button
                key={`${item.tender._id}-${item.reviewee._id}`}
                type="button"
                onClick={() => setSelected(item)}
                className={`rounded-2xl border p-5 text-left transition hover:border-blue-300 hover:bg-blue-50/40 ${
                  selected?.tender._id === item.tender._id &&
                  selected?.reviewee._id === item.reviewee._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {item.reviewee.role === "writer" ? "Bid Writer" : "Contractor"}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{item.reviewee.name}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{item.tender.title}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {selected && (
        <form onSubmit={submitReview} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Write your review</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selected.reviewee.name} Â· {selected.tender.title}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
              Cancel
            </button>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-700">Rating</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                >
                  <Star size={25} className={value <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={5}
            required
            placeholder="Share useful feedback about the collaboration..."
            className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <MessageSquare className="mx-auto text-slate-300" size={45} />
          <h2 className="mt-4 font-bold">No reviews yet</h2>
          <p className="mt-2 text-sm text-slate-500">Reviews will appear here after completed collaborations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold">{review.reviewer?.name || "User"}</h3>
                  <p className="text-xs text-slate-500">{review.tender?.title || "Tender"}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;

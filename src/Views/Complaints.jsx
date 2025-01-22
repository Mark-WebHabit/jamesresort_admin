import { useContext, useState, useEffect } from "react";
import { ref, push } from "firebase/database";
import { ResortContext } from "../DataContext";
import { getMonthDateYear } from "../utilities/date";
import { db } from "../../firebase";
import Rating from "react-rating-stars-component";

function Complaints() {
  const { reviews } = useContext(ResortContext);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [comment, setComment] = useState("");

  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    // Initialize the review list from context
    setReviewList(reviews || []);
  }, [reviews]);

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 200) {
      setComment(e.target.value);
    }
  };

  const handleConfirm = () => {
    if (!reviewName.trim()) {
      alert("Review Name cannot be empty.");
      return;
    }
    if (reviewRating <= 0) {
      alert("Review Rating cannot be empty.");
      return;
    }
    if (!comment.trim()) {
      alert("Review Description cannot be empty.");
      return;
    }

    const data = {
      name: reviewName,
      rating: reviewRating,
      comment,
      date: new Date().toISOString(),
    };

    const reviewsRef = ref(db, "reviews");
    push(reviewsRef, data)
      .then((snapshot) => {
        const newReviewWithId = { id: snapshot.key, ...data };
        setReviewList([...reviewList, newReviewWithId]);
        console.log("Review added successfully!");
        handleCancel();
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });
  };

  const handleCancel = () => {
    setReviewName("");
    setReviewRating(0);
    setComment("");
  };

  return (
    <div className="flex flex-col flex-1 bg-black bg-opacity-80 rounded-md overflow-hidden p-4">
      <p className="text-4xl text-white font-bold m-4 ">Leave a Review</p>

      {/* Form for new reviews */}
      <div className="flex items-center gap-8">
        <label className="flex-1 flex flex-col">
          <span className="text-white font-bold text-lg">Review Name</span>
          <input
            type="text"
            className="py-2 px-4 rounded-md"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
            maxLength={40}
          />
        </label>
        <label className="flex-1 flex flex-col ">
          <span className="text-white font-bold text-lg">Review Rating</span>
          <Rating
            count={5}
            value={reviewRating}
            onChange={(value) => setReviewRating(value)}
            size={24}
            activeColor="#ffd700"
          />
        </label>
      </div>

      <div className="flex items-center gap-8 mt-4">
        <label className="flex-1 flex flex-col">
          <span className="text-white font-bold text-lg">Comment</span>
          <input
            type="text"
            maxLength={100}
            className="text-sm text-black py-2 px-4"
            value={comment}
            onChange={handleDescriptionChange}
          />
          <span className="text-sm text-gray-400">
            {comment.length}/100 characters
          </span>
        </label>
      </div>

      <div className="buttons flex items-center justify-center gap-10">
        <button
          className="px-10 py-4 bg-red-800 rounded-md text-white font-bold"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="px-10 py-4 bg-green-800 rounded-md text-white font-bold"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>

      {/* Reviews Table */}
      <div className="flex-1 bg-white rounded-md overflow-auto mt-8 table-complaints p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date Created</th>
              <th className="px-4 py-2" colSpan="2">
                Comment
              </th>
              <th className="px-4 py-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {reviewList?.length > 0 &&
              reviewList.map((item) => (
                <tr key={item.id} className="bg-gray-100">
                  <td className="border px-4 py-2 max-w-[100px] break-words">
                    {item.name}
                  </td>
                  <td className="border px-4 py-2">
                    {getMonthDateYear(item.date)}
                  </td>
                  <td
                    className="border px-4 py-2 max-w-[200px] overflow-hidden break-words"
                    colSpan="2"
                  >
                    {item.comment}
                  </td>
                  <td className="border px-4 py-2 max-w-[100px] break-words">
                    <Rating
                      count={5}
                      value={item.rating}
                      size={24}
                      edit={false}
                      activeColor="#ffd700"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Complaints;

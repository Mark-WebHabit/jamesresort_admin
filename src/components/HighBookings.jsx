import { useContext, useEffect, useState } from "react";
import { ResortContext } from "../DataContext";
import DateCard from "./DateCard";

function HighBookings() {
  const { reservations } = useContext(ResortContext);
  const [highBookings, setHighBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reservations || reservations.length <= 0) return setLoading(false);

    const currentDate = new Date();
    const oneDayLess = new Date(currentDate);
    oneDayLess.setDate(currentDate.getDate() - 1); // Subtract one day from the current date

    const groupByMonthYear = reservations.reduce((acc, item) => {
      const itemDate = new Date(item.monthYear);
      // Create a new date object to compare only the date parts
      const itemDateOnly = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate()
      );
      const oneDayLessOnly = new Date(
        oneDayLess.getFullYear(),
        oneDayLess.getMonth(),
        oneDayLess.getDate()
      );

      if (itemDateOnly > oneDayLessOnly) {
        if (!acc[item.monthYear]) {
          acc[item.monthYear] = [];
        }

        acc[item.monthYear].push(item);
      }

      return acc;
    }, {});

    // Convert the grouped object to an array of entries, sort by monthYear in descending order, then convert back to an object
    const sortedGroupByMonthYear = Object.fromEntries(
      Object.entries(groupByMonthYear).sort(([a], [b]) => {
        return new Date(a) - new Date(b);
      })
    );

    setHighBookings(sortedGroupByMonthYear);
    setLoading(false);
  }, [reservations]);

  return (
    <div className="flex-1  overflow-scroll hide-scrollbar flex content-start gap-4 flex-wrap">
      {highBookings.length <= 0 && reservations?.length <= 0 && !loading && (
        <p className="text-4xl w-full text-center mt-8">
          No Highbookings yet...
        </p>
      )}
      {loading && (
        <p className="text-4xl w-full text-center mt-8">Loading...</p>
      )}

      {highBookings &&
        Object.keys(highBookings).map(
          (book) =>
            highBookings[book]?.length >= 5 && (
              <DateCard key={book} item={highBookings[book]} />
            )
        )}
    </div>
  );
}

export default HighBookings;

import { useContext, useEffect, useState } from "react";
import { ResortContext } from "../DataContext";
import { formatDateTime } from "../utilities/date";

function Transactions() {
  const { reservations, rooms } = useContext(ResortContext);
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!reservations || reservations.length <= 0) return setTransactions([]);

    const filtered = reservations.filter(
      (trans) => trans.status === "checked out"
    );

    const filteredTransactions = filtered.filter((transaction) =>
      transaction.client.toLowerCase().includes(search.toLowerCase())
    );

    setTransactions(filteredTransactions);
  }, [reservations, search]);

  return (
    <div className="p-4 max-h-full overflow-scroll hide-scrollbar">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md w-full max-w-md"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border border-gray-300">Name</th>
              <th className="py-2 px-4 border border-gray-300">Contact</th>
              <th className="py-2 px-4 border border-gray-300">Entrance Fee</th>
              <th className="py-2 px-4 border border-gray-300">
                Amenities Fee
              </th>
              <th className="py-2 px-4 border border-gray-300">Room Fee</th>
              <th className="py-2 px-4 border border-gray-300">Check-in</th>
              <th className="py-2 px-4 border border-gray-300">Check-out</th>
              <th className="py-2 px-4 border border-gray-300">
                Company (Guests)
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border border-gray-300">
                  {transaction.client}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {transaction.clientContact}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {transaction.guestFee}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {Object.values(transaction.amenitiesFee).reduce(
                    (a, b) => a + b,
                    0
                  )}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {rooms.find((rm) => rm.id == transaction.room)?.price}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {formatDateTime(transaction.startingDate)}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {formatDateTime(transaction.endingDate)}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {transaction.numberOfGuest}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;

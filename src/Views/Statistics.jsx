import { useContext, useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";
import { ResortContext } from "../DataContext";
import { getMonthYear, months } from "../utilities/date";
import { countAndSumAddAmenities, countByProperty } from "../utilities/extras";

function Statistics() {
  const { reservations, rooms } = useContext(ResortContext);
  const [date, setDate] = useState(new Date());
  const [totalBooking, setTotalBooking] = useState([]);
  const [ammenities, setAmmenities] = useState({
    totalBeds: 0,
    totalComforters: 0,
    totalPillows: 0,
  });
  const [totalClient, setTotalClient] = useState(null);

  useEffect(() => {
    if (!reservations || reservations?.length <= 0) return;

    const reserves = reservations.filter((data) => {
      const dt = getMonthYear(data.startingDate);
      const selected = getMonthYear(date);
      const bookStartDate = `${months[dt.month]} ${dt.year}`;
      const stateDate = `${months[selected.month]} ${selected.year}`;

      if (
        bookStartDate.trim().toLowerCase() == stateDate.trim().toLowerCase()
      ) {
        return data;
      }
    });

    setAmmenities(countAndSumAddAmenities(reserves));

    setTotalClient(countByProperty(reserves, "clientContact"));

    setTotalBooking(reserves);
  }, [date, reservations]);

  const handleDateChange = (event) => {
    setDate(new Date(event.target.value));
  };

  const exportPdf = () => {
    const input = document.getElementById("statistics");

    // Scroll to the bottom to ensure all content is rendered
    input.scrollIntoView(false);

    setTimeout(() => {
      html2canvas(input, { scale: 2, scrollY: -window.scrollY }).then(
        (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: [canvas.width, canvas.height],
          });

          // Adjust height to fit all content
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("statistics.pdf");
        }
      );
    }, 1500); // Increase the timeout to 1500ms or adjust as needed
  };

  // Dummy data
  const totalBookingData = {
    labels: ["Walkin", "Online"],
    datasets: [
      {
        label: "Total Booking",
        data: [
          totalBooking.filter((tb) => tb?.mode == "walkin")?.length,
          totalBooking.length -
            totalBooking.filter((tb) => tb?.mode == "walkin")?.length,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const amenitiesData = {
    labels: ["Beds", "Pillows", "Comforter"],
    datasets: [
      {
        label: "Amenities",
        data: [
          ammenities.totalBeds,
          ammenities.totalPillows,
          ammenities.totalComforters,
        ],
        backgroundColor: [
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const roomBookingData = {
    labels: rooms.map((room) => room.name),
    datasets: [
      {
        label: "Room Booking Frequency",
        data: rooms.map((rm) => {
          return totalBooking.filter((bk) => {
            return bk.room == rm.id;
          }).length;
        }),
        backgroundColor: [
          "rgba(255, 159, 64, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${value} (${percentage}%)`;
        },
        color: "#000",
        font: {
          weight: "bold",
          size: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return ` ${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return ` ${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="statistics flex-1 overflow-scroll flex flex-col bg-white p-8">
      <button onClick={exportPdf} className="my-4">
        Export as PDF
      </button>
      <label className="border-2 border-black w-fit p-4 rounded-md mb-2">
        <input
          type="month"
          value={date.toISOString().substring(0, 7)}
          onChange={handleDateChange}
        />
      </label>

      <div className="flex-1 flex flex-col px-4" id="statistics">
        <div className="flex gap-4 flex-1">
          <div className="w-[25%] h-fit">
            <h2>Total Booking (Pie Chart)</h2>
            <Pie
              data={totalBookingData}
              options={pieOptions}
              plugins={[ChartDataLabels]}
            />
          </div>

          <div className="w-[25%] h-fit">
            <h2>Amenities (Pie Chart)</h2>
            <Pie
              data={amenitiesData}
              options={pieOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
        <div className="flex gap-4 flex-1 mt-4">
          <div className="w-[40%] h-fit">
            <h2>Room - Books (Bar Chart)</h2>
            <Bar data={roomBookingData} options={barOptions} />
          </div>
          <h2 className="font-bold">
            {" "}
            Total Clients:{" "}
            <span className="text-5xl ml-4">
              {totalClient ? Object.keys(totalClient).length : 0}
            </span>{" "}
          </h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Statistics;

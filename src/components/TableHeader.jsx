function TableHeader() {
  return (
    <>
      <p className="col-span-1 flex justify-center items-center border p-4 bg-slate-400 font-bold rounded shadow">
        ROOM
      </p>
      <p className="col-span-1 flex justify-center items-center border p-4 bg-slate-400 font-bold rounded shadow">
        BOOKING STATUS
      </p>
      <p className="col-span-1 flex justify-center items-center border p-4 bg-slate-400 font-bold rounded shadow">
        CHECKIN
      </p>
      <p className="col-span-1 flex justify-center items-center border p-4 bg-slate-400 font-bold rounded shadow">
        CHECKOUT
      </p>
      <p className="col-span-1 flex justify-center items-center border p-4 bg-slate-400 font-bold rounded shadow">
        ACTION
      </p>
    </>
  );
}

export default TableHeader;

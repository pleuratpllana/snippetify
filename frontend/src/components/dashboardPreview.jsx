// DashboardPreview.jsx

function DashboardPreview() {
  return (
    <div className="absolute inset-0 p-8 text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Hi, Johnny Andrade</h1>
      <div className="space-y-6">
        <div className="text-2xl flex items-center space-x-2">
          <span className="font-bold">Sales</span>
          <span className="text-lg"> $35,647.00</span>
        </div>
        <div className="text-2xl flex items-center space-x-2">
          <span className="font-bold">Total Income</span>
          <span className="text-lg"> $12,924.00</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;

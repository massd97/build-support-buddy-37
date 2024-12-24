const CompanyLegend = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`bg-white p-2 rounded-lg shadow-md ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-4 border-green-500"></div>
          <span className="text-sm">OHD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-4 border-purple-500"></div>
          <span className="text-sm">Meldia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-4 border-yellow-500"></div>
          <span className="text-sm">HawkOne</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyLegend;
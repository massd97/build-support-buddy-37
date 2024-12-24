const SiteTypeLegend = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`bg-white p-2 rounded-lg shadow-md ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm">客土</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm">残土</span>
        </div>
      </div>
    </div>
  );
};

export default SiteTypeLegend;
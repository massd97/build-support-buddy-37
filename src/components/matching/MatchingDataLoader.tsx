interface MatchingDataLoaderProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

const MatchingDataLoader = ({ loading, error, children }: MatchingDataLoaderProps) => {
  if (loading) {
    return <div className="p-4 text-center">データ取得中...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return <>{children}</>;
};

export default MatchingDataLoader;
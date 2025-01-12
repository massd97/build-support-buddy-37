interface SiteDataLoaderProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

const SiteDataLoader = ({ loading, error, children }: SiteDataLoaderProps) => {
  if (loading) {
    return <div>データ取得中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <>{children}</>;
};

export default SiteDataLoader;
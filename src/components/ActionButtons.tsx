import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  setShowSiteModal: (show: boolean) => void;
  setShowSitesList: (show: boolean) => void;
  setShowTransactionFeed: (show: boolean) => void;
}

const ActionButtons = ({
  setShowSiteModal,
  setShowSitesList,
  setShowTransactionFeed,
}: ActionButtonsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={() => setShowSiteModal(true)}
          className="flex-1 h-16 text-sm"
        >
          現場新規登録
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => setShowSitesList(true)}
          className="flex-1 h-16 text-sm"
        >
          現場一覧
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => setShowTransactionFeed(true)}
          className="flex-1 h-16 text-sm"
        >
          取引一覧
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
/**
 * ActionButtons Component
 * 
 * This component contains the main action buttons for site and transaction registration,
 * as well as the dropdown menu for accessing lists. It's responsive and provides
 * easy access to the main functionalities of the application.
 */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, List } from "lucide-react";

interface ActionButtonsProps {
  setShowSiteModal: (show: boolean) => void;
  setShowTransactionModal: (show: boolean) => void;
  setShowSitesList: (show: boolean) => void;
  setShowTransactionFeed: (show: boolean) => void;
}

const ActionButtons = ({
  setShowSiteModal,
  setShowTransactionModal,
  setShowSitesList,
  setShowTransactionFeed,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      {/* Registration buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Button onClick={() => setShowSiteModal(true)} className="text-lg">
          現場新規登録
        </Button>
        <Button onClick={() => setShowTransactionModal(true)} className="text-lg">
          取引新規登録
        </Button>
      </div>

      {/* Lists dropdown - centers on small screens */}
      <div className="w-full sm:w-auto flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <List className="h-4 w-4" />
              一覧表示
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowSitesList(true)}>
              使用可能現場一覧
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowTransactionFeed(true)}>
              トランザクションフィード
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ActionButtons;
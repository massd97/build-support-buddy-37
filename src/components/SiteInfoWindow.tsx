import { Site } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import TransactionRegistrationModal from "./TransactionRegistrationModal";

interface SiteInfoWindowProps {
  site: Site;
}

const SiteInfoWindow = ({ site }: SiteInfoWindowProps) => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  return (
    <>
      <div className="p-2 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-lg">{site.name}</h3>
          <Badge variant={site.siteType === "残土" ? "destructive" : "default"}>
            {site.siteType}
          </Badge>
        </div>
        <p><span className="font-semibold">住所:</span> {site.address}</p>
        <p><span className="font-semibold">担当者:</span> {site.contactPerson}</p>
        <p><span className="font-semibold">連絡先:</span> {site.phone}</p>
        <p><span className="font-semibold">担当会社:</span> {site.company}</p>
        <Button 
          className="w-full mt-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowTransactionModal(true);
          }}
        >
          取引を申請
        </Button>
      </div>

      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </>
  );
};

export default SiteInfoWindow;
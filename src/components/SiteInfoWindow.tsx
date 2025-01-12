import { Site } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import TransactionRegistrationModal from "./TransactionRegistrationModal";

interface SiteInfoWindowProps {
  site: Site;
}

const formatDate = (isoDate: string): string => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
};

const SiteInfoWindow = ({ site }: SiteInfoWindowProps) => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  console.log(`SiteInfoWindow: ${site.siteName}`);
  return (
    <>
      <div className="p-2 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-lg">{site.siteName}</h3>
          <Badge variant={site.siteType === "残土" ? "destructive" : "default"}>
            {site.siteType}
          </Badge>
        </div>
        <p><span className="font-semibold">住所: </span> {site.address}</p>
        <p><span className="font-semibold">現場担当者: </span> {site.contactPerson}</p>
        <p><span className="font-semibold">連絡先: </span> {site.email}</p>
        {site.siteType === "残土" ? (
          <>
            <p><span className="font-semibold">土量: </span> {site.soilVolume} m³</p>
            <p>
              <span className="font-semibold">残土の状態:</span>
              {site.Image ?  (
                <a
                  href={site.Image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  画像を見る
                </a>
              ) : (
                "画像のリンクは登録されていません"
              )}
            </p>
          </>
        ) : (
          <p><span className="font-semibold">必要土量: </span> {site.requiredSoilVolume} m³</p>
        )}
        <p><span className="font-semibold">土質: </span> {site.soilType}</p>
        <p><span className="font-semibold">施工会社: </span> {site.company}</p>
        <p><span className="font-semibold">現場開始日: </span>{formatDate(site.startDate)}</p>
        <p><span className="font-semibold">現場終了日: </span>{formatDate(site.endDate)}</p>
        <p><span className="font-semibold">従前の用途: </span> {site.previousUse}</p>
        <p><span className="font-semibold">侵入可能最大ダンプサイズ（t）: </span> {site.dumpSize}</p>
        <p><span className="font-semibold">小型トラック: </span> {site.smallTransport}</p>

        {site.siteType === "残土" && (
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
        )}
      </div>

      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
        siteData={{
          ID: site.ID,
          soilType: site.siteType,
          siteName: site.siteName,
          address: site.address,
          contactPerson: site.contactPerson,
          soilVolume: Number(site.soilVolume), // Convert string to number
          email: site.email,
        }}
      />
    </>
  );
};

export default SiteInfoWindow;
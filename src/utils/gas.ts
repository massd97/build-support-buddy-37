import { toast } from "sonner";

export interface FetchSitesResponse {
  success: boolean;
  message?: string;
  sites: any[];
}

export const fetchSitesFromGAS =  async (ids: string[] = []) => {
  return new Promise<FetchSitesResponse>((resolve, reject) => {
    const decodeBase64 = (base64: string): string => {
      const binaryString = atob(base64);
      const binaryData = Uint8Array.from(binaryString, char => char.charCodeAt(0));
      return new TextDecoder("utf-8").decode(binaryData);
    };

    google.script.run
      .withSuccessHandler((compressedResponse: string) => {
        const decodeString = decodeBase64(compressedResponse);
        const response = JSON.parse(decodeString) as FetchSitesResponse;
        console.log("Parsed response from GAS:", response);
        
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || "Failed to fetch sites"));
        }
      })
      .withFailureHandler((err) => {
        console.error("Error fetching sites:", err);
        toast.error("サイトの取得中にエラーが発生しました");
        reject(err);
      })
      .fetchSites();
  });
};

export const searchSitesByAddressGAS = (address: string) => {
  return new Promise<FetchSitesResponse>((resolve, reject) => {
    google.script.run
      .withSuccessHandler((response: FetchSitesResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || "Failed to search sites"));
        }
      })
      .withFailureHandler((err) => {
        console.error("Error searching sites:", err);
        toast.error("サイトの検索中にエラーが発生しました");
        reject(err);
      })
      .searchSitesByAddress(address);
  });
};
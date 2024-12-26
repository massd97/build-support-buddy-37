declare namespace google {
  namespace script {
    namespace run {
      interface WithHandlers<T> {
        withSuccessHandler: (callback: (response: T) => void) => WithFailureHandler<T>;
        withFailureHandler: (callback: (error: any) => void) => {
          fetchSites: () => void;
          searchSitesByAddress: (address: string) => void;
          registerSite: (site: any) => void;
          updateSite: (site: any) => void;
        };
      }

      interface WithFailureHandler<T> {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchSites: () => void;
          searchSitesByAddress: (address: string) => void;
          registerSite: (site: any) => void;
          updateSite: (site: any) => void;
        };
      }

      function withSuccessHandler<T>(callback: (response: T) => void): WithFailureHandler<T>;
      function withFailureHandler(callback: (error: any) => void): {
        fetchSites: () => void;
        searchSitesByAddress: (address: string) => void;
        registerSite: (site: any) => void;
        updateSite: (site: any) => void;
      };
    }
  }
}
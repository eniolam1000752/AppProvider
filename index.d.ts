import { IframeHTMLAttributes } from "react";
import { RefObject } from "react";

declare module "app-provider" {
  let initAppData: Record<string, any>;

  interface IAppProviderProps {
    children: React.ReactChild;
    baseUrl?: string | null;
    noPersist?: boolean;
    clearCache?: boolean;
    initData: typeof initAppData;
    onLoaded?: (args0: Record<string, any>) => void;
  }

  interface IFetchContainerProps<T, G> {
    children?: ((resp: Record<string, any>) => React.ReactChild) | null;
    url?: string;
    payload?: T;
    method?: string;
    headers?: G;
    id?: string;
    saveAs?: string;
    errorComponent?: (arg: any) => React.ReactChild | null;
    retryComponent?: React.ReactChild | null;
    loadingComponent?: React.ReactChild | null;
    defaultComponent?: React.ReactChild | null;
    fire: boolean;
    noLoading?: boolean | null;
    noCache?: boolean | null;
    noRetry?: boolean | null;
    successCallback?: (args: Record<string, any>) => void;
    errorCallback?: (args: Record<string, any> | string) => void;
    completCallback?: () => void;
    fetchFunction?: (
      args: IFetchFunctionArgument<
        Record<string, any>,
        Record<string, any> | string
      >
    ) => void;
    fetchFunctions?: Array<
      (
        args: IFetchFunctionArgument<
          Record<string, any>,
          Record<string, any> | string
        >
      ) => void
    >;
    noDefault?: boolean | null;
  }

  interface IFetchFunctionArgument<T, K> {
    onSuccess: (args: T) => void;
    onError: (args: K) => void;
  }
  interface IContextParam {
    getSaveAs: (args: string) => Record<string, any>;
    saveAs: (saveAs: string, data: Record<string, any>) => void;
    dispatch: React.DispatchWithoutAction;
  }

  let AppProvider: React.FC<IAppProviderProps>;
  let FetchContainer: React.FC<IFetchContainerProps<
    Record<string, any>,
    Record<string, any>
  >>;
  let FetchConsumer: React.Consumer<typeof initAppData & IContextParam>;
  let AppContext: React.Context<typeof initAppData & IContextParam>;
}

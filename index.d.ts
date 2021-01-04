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
    retryComponent?: React.ReactChild | null;
    loadingComponent?: React.ReactChild | null;
    defaultComponent?: React.ReactChild | null;
    fire: boolean;
    noLoading?: boolean | null;
    noCache?: boolean | null;
    noRetry?: boolean | null;
    errorComponent?: (arg: any) => React.ReactChild | null;
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
    getSaveAs: (args: string) => any;
    saveAs: (
      saveAs: string | Record<string, any>,
      data?: Record<string, any> | boolean | string | number | null
    ) => Promise<void>;
    dispatch: React.Dispatch<Record<string, any>>;
  }

  const AppProvider: React.FC<IAppProviderProps>;
  const FetchContainer: React.FC<
    IFetchContainerProps<Record<string, any>, Record<string, any>>
  >;
  const FetchConsumer: React.Consumer<typeof initAppData & IContextParam>;
  const AppContext: React.Context<typeof initAppData & IContextParam>;
  const getSaveAs: (
    saveAs: string
  ) => Promise<Record<string, any> | boolean | string | number | null>;

  const setSaveAs: (
    saveAs: string | Record<string, any>,
    data?: Record<string, any> | boolean | string | number | null
  ) => Promise<void>;
}

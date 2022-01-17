import React, { Fragment, useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import IconMC from "react-native-vector-icons/MaterialCommunityIcons.js";
import AsyncStorage from "@react-native-community/async-storage";

import { useController } from "./hook";

const AppContext = React.createContext({
  getSaveAs: () => {},
  saveAs: () => {},
  dispatch: () => {},
});

const { Provider, Consumer } = AppContext;
const FetchConsumer = Consumer;

let isMounteds = {};
let isActives = {};
let initAppData = {};

const getSaveAs = async (saveAs) => {
  try {
    const outputData = await AsyncStorage.getItem("saveAsList");
    return JSON.parse(outputData || "{}")[saveAs];
  } catch (exp) {
    throw new Error(exp);
  }
};

const setSaveAs = async (saveAs, data) => {
  try {
    const outputData = await AsyncStorage.getItem("saveAsList");
    let saveAsList = JSON.parse(outputData || "{}");
    if (typeof saveAs === "object") {
      saveAsList = { ...saveAsList, ...saveAs };
    } else {
      saveAsList[saveAs] = data;
    }
    await AsyncStorage.setItem("saveAsList", JSON.stringify(saveAsList));
  } catch (exp) {
    throw new Error(exp);
  }
};

const AppProvider = ({
  children,
  baseUrl,
  noPersist,
  clearCache,
  initData,
  onLoaded,
}) => {
  initAppData = initData;
  const { state, dispatch } = useController(initAppData);

  const getSaveAs = (saveAs) => {
    const jsonData = JSON.parse(state.saveAsList);
    return jsonData ? jsonData[saveAs] : {};
  };

  const saveAs = async (saveAs, data) => {
    try {
      const resp = await AsyncStorage.getItem("saveAsList");

      let saveAsList = JSON.parse(resp || "{}");
      if (typeof saveAs === "object") {
        saveAsList = { ...saveAsList, ...saveAs };
      } else {
        saveAsList[saveAs] = data;
      }
      const stringedSaveAsList = JSON.stringify(saveAsList);

      await AsyncStorage.setItem("saveAsList", stringedSaveAsList);
      await dispatch({ saveAsList: stringedSaveAsList });
    } catch (exp) {
      throw new Error(exp);
    }

    // .then(() => )
    // .catch(() => console.log("data not saved (._.)"));

    // .then((resp) => {
    //   const saveAsList = JSON.parse(resp || "{}");
    //   saveAsList[saveAs] = data;
    //   const stringedSaveAsList = JSON.stringify(saveAsList);

    //   AsyncStorage.setItem("saveAsList", stringedSaveAsList)
    //     .then(() => dispatch({ saveAsList: stringedSaveAsList }))
    //     .catch(() => console.log("data not saved (._.)"));
    // })
    // .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (clearCache) {
      dispatch({ __shouldRender__: true });

      AsyncStorage.removeItem("saveAsList")
        .then(() => console.log("data has been successfully removed"))
        .catch(() => console.log("unable to remove data"));
    } else {
      setTimeout(() => {
        console.log("getting data item from async store");
        AsyncStorage.getItem("saveAsList")
          .then((resp) => {
            console.log("gotten async data (._.)", JSON.parse(resp || "{}"));
            dispatch({
              baseUrl: (baseUrl || "").trim(),
              shouldPersist: !noPersist, // ? false : true,
              saveAsList: resp || "{}",
              __shouldRender__: true,
            });
            async () => onLoaded(JSON.parse(resp || "{}"));
          })
          .catch((err) => {
            console.log("ERROR GETTING DATA FROM STORAGE: ", err);
            dispatch({
              __shouldRender__: true,
              saveAsList: "{}",
            });
          });
      }, 1000);
    }
  }, [baseUrl, clearCache, noPersist]);

  return (
    <Provider value={{ ...state, getSaveAs, saveAs, dispatch }}>
      <Fragment>{state.__shouldRender__ ? children : null}</Fragment>
    </Provider>
  );
};

const Loading = ({}) => (
  <View>
    <Text>loading ...</Text>
  </View>
);

const Error = ({}) => (
  <View>
    <Text>error in response</Text>
  </View>
);

const RespNotJson = ({}) => (
  <View>
    <Text>Response not json</Text>
  </View>
);

const NotFired = ({}) => (
  <View>
    <Text>not fired waiting...</Text>
  </View>
);

const FetchContainer = ({
  children,
  url,
  payload,
  method,
  headers,
  id,
  saveAs,
  errorComponent,
  retryComponent,
  loadingComponent,
  defaultComponent,
  fire,
  noLoading,
  noCache,
  noRetry,
  successCallback,
  errorCallback,
  completCallback,
  fetchFunction,
  fetchFunctions,
  noDefault,
}) => {
  const { dispatch, mounters, saveAsList, baseUrl, shouldPersist } = useContext(
    AppContext
  );
  const [isFired, setIsFired] = useState(fire);
  const [isLoading, setIsLoading] = useState(true);
  const [isInternalLoad, setIsInternalLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [response, setResponse] = useState(null);
  const [cache, setCache] = useState(null);
  const [isRespJson, setIsRespJson] = useState(true);
  const [genId] = useState(
    `container-${Math.random().toString().slice(2, 16)}`
  );
  const [error, setError] = useState();

  useEffect(() => {
    isMounteds = Object.assign(isMounteds, { [genId]: true });
    return () => {
      delete isMounteds[genId];
    };
  }, [genId]);

  useEffect(() => {
    console.log("fired for fetch request", fire);
    if (fire) {
      setIsLoading(true);
      setIsInternalLoading(false);
    }
    setIsFired(fire);
    console.log("checking is fired: ", fire);
    console.log("mounteds : ", isMounteds);
  }, [fire]);

  useEffect(() => {
    const cacheSaveAsList = JSON.parse(saveAsList);
    if (cacheSaveAsList) {
      setCache(cacheSaveAsList[saveAs]);
    }
    isActives[genId] = saveAs;
  }, [saveAsList, saveAs, genId]);

  useEffect(() => {
    let fetchContain = { isFetching: false, id };
    dispatch({
      fetchContainers: {
        [genId]: fetchContain,
      },
    });
  }, [dispatch, genId, id]);

  useEffect(() => {
    const onSuccess = (resp) => {
      if (isMounteds[genId] /* && saveAs === isActives[genId] */) {
        setIsFired(false);
        successCallback ? successCallback(resp) : null;
        completCallback ? completCallback(resp) : null;
        /* saveAs === isActives[genId] ? */ setResponse(resp); /* : null; */
        setIsLoading(false);
        setIsInternalLoading(false);
        setIsSuccess(true);
      }
      const saveAs = isActives[genId];
      if (saveAs) {
        const temp = JSON.parse(saveAsList);
        temp[saveAs] = resp;
        const TempSaveAsList = JSON.stringify(temp);
        dispatch({
          saveAsList: TempSaveAsList,
        });

        if (!noCache && shouldPersist) {
          AsyncStorage.setItem("saveAsList", TempSaveAsList)
            .then(() =>
              console.log(
                "%csuccessfully put data in async storage (-_-)",
                "green"
              )
            )
            .catch(() =>
              console.log("%cerror puting data in async store ", "red")
            );
        }
      }
    };
    const onError = (err) => {
      if (isMounteds[genId] /* && saveAs === isActives[genId] */) {
        setIsFired(false);
        errorCallback ? errorCallback(err) : null;
        completCallback ? completCallback(err) : null;
        setError(err);
        setIsSuccess(false);
        setIsLoading(false);
        setIsInternalLoading(false);
      }
    };

    if (isFired && !isInternalLoad) {
      setIsInternalLoading(true);
      if (fetchFunction || fetchFunctions) {
        if (fetchFunctions) {
          let response = {
            map(callback) {
              let output = [];
              Object.keys(this)
                .filter((item) => item !== "map")
                .forEach((item, index) => {
                  output.push(callback(this[item], index));
                });
              return output;
            },
          };
          let error = {
            map(callback) {
              let output = [];
              Object.keys(this)
                .filter((item) => item !== "map")
                .forEach((item, index) => {
                  output.push(callback(this[item], index));
                });
              return output;
            },
          };
          const reculsiveFetch = (counter) => {
            fetchFunctions[counter]({
              onSuccess(resp) {
                response[counter + ""] = resp;
                if (counter >= fetchFunctions.length - 1) {
                  onSuccess(response);
                } else {
                  reculsiveFetch(counter + 1);
                }
              },
              onError(err) {
                error[counter + ""] = err;
                if (counter >= fetchFunctions.length - 1) {
                  Object.keys(error).length === fetchFunctions.length
                    ? onError(error)
                    : onSuccess(response);
                } else {
                  reculsiveFetch(counter + 1);
                }
              },
            });
          };
          reculsiveFetch(0);
        } else {
          fetchFunction({
            onSuccess,
            onError,
          });
        }
      } else {
        const fetchContent =
          method.toLowerCase() === "get"
            ? {
                method: method ? method.toUpperCase() : "GET",
                headers: headers || {},
              }
            : {
                method: method ? method.toUpperCase() : "POST",
                headers: headers || {},
                body: JSON.stringify(payload),
              };

        fetch(baseUrl.length !== 0 ? `${baseUrl}/${url}` : url, fetchContent)
          .then((resp) => {
            setIsFired(false);
            return resp.json();
          })
          .then(onSuccess)
          .catch(onError);
      }
    }
  }, [
    isFired,
    url,
    method,
    headers,
    payload,
    isRespJson,
    successCallback,
    dispatch,
    errorCallback,
    baseUrl,
    saveAs,
    mounters,
    genId,
    completCallback,
    saveAsList,
    noCache,
    shouldPersist,
    fetchFunction,
    isLoading,
    isInternalLoad,
    fire,
  ]);

  return (
    <Fragment>
      {!cache || noCache ? (
        isLoading && isFired ? (
          !noLoading ? (
            loadingComponent || <Loading />
          ) : null
        ) : !isFired && isLoading ? (
          !noDefault ? (
            defaultComponent || <NotFired />
          ) : null
        ) : isRespJson ? (
          isSuccess ? (
            children(response)
          ) : errorComponent ? (
            <Fragment>
              {errorComponent(error)}
              {!noRetry && (
                <Refresher
                  onRefresh={() => {
                    setIsFired(true);
                    setIsInternalLoading(false);
                    setIsLoading(true);
                  }}
                />
              )}
            </Fragment>
          ) : (
            <Fragment>
              <Error />
              {!noRetry &&
                (retryComponent || (
                  <Refresher
                    onRefresh={() => {
                      setIsFired(true);
                      setIsInternalLoading(false);
                      setIsLoading(true);
                    }}
                  />
                ))}
            </Fragment>
          )
        ) : (
          <RespNotJson />
        )
      ) : (
        children(cache)
      )}
    </Fragment>
  );
};

FetchContainer.defaultProps = {
  url: "",
  payload: {},
  method: "",
  headers: {},
  id: "",
  saveAs: "",
  loadingComponent: null,
  fire: false,
  successCallback: () => {},
  errorCallback: () => {},
  completCallback: () => {},
};

function Refresher({ onRefresh }) {
  return (
    <View style={{ width: "100%", alignItems: "center", paddingBottom: 8 }}>
      <View
        style={{
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
      >
        <TouchableOpacity
          onPress={onRefresh}
          style={{
            width: 40,
            height: 40,
            borderRadius: 30,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View>
            <IconMC name="refresh" size={22} color="#222" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export {
  AppProvider,
  FetchContainer,
  FetchConsumer,
  AppContext,
  getSaveAs,
  setSaveAs,
};

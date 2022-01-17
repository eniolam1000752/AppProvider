import React from "react";

export const AppProviderWeb = ({
  children,
  baseUrl,
  noPersist,
  clearCache,
  initData,
  onLoaded,
}) => {
  initAppData = initData;
  const { state, dispatch } = useController(initAppData);

  // const getSaveAs = (saveAs) => {
  //   const jsonData = JSON.parse(state.saveAsList);
  //   return jsonData ? jsonData[saveAs] : {};
  // };

  // const saveAs = async (saveAs, data) => {
  //   try {
  //     const resp = await AsyncStorage.getItem("saveAsList");

  //     let saveAsList = JSON.parse(resp || "{}");
  //     if (typeof saveAs === "object") {
  //       saveAsList = { ...saveAsList, ...saveAs };
  //     } else {
  //       saveAsList[saveAs] = data;
  //     }
  //     const stringedSaveAsList = JSON.stringify(saveAsList);

  //     await AsyncStorage.setItem("saveAsList", stringedSaveAsList);
  //     await dispatch({ saveAsList: stringedSaveAsList });
  //   } catch (exp) {
  //     throw new Error(exp);
  //   }
  // };

  // useEffect(() => {
  //   if (clearCache) {
  //     dispatch({ __shouldRender__: true });

  //     AsyncStorage.removeItem("saveAsList")
  //       .then(() => console.log("data has been successfully removed"))
  //       .catch(() => console.log("unable to remove data"));
  //   } else {
  //     setTimeout(() => {
  //       console.log("getting data item from async store");
  //       AsyncStorage.getItem("saveAsList")
  //         .then((resp) => {
  //           console.log("gotten async data (._.)", JSON.parse(resp || "{}"));
  //           dispatch({
  //             baseUrl: (baseUrl || "").trim(),
  //             shouldPersist: !noPersist, // ? false : true,
  //             saveAsList: resp || "{}",
  //             __shouldRender__: true,
  //           });
  //           async () => onLoaded(JSON.parse(resp || "{}"));
  //         })
  //         .catch((err) => {
  //           console.log("ERROR GETTING DATA FROM STORAGE: ", err);
  //           dispatch({
  //             __shouldRender__: true,
  //             saveAsList: "{}",
  //           });
  //         });
  //     }, 1000);
  //   }
  // }, [baseUrl, clearCache, noPersist]);

  return <div></div>;
};

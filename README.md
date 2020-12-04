# App-provider
A global state management wrapper sitting on react's context api providing out of box Persistence, responsive ui that are data driven from remote sources and your favourite global state management provided by context api. As for now, it only available for react-native.

## Installation

	 npm i app-provider

## Usage

Features available includes;

 1. Global state management (wrapper around context api)
 2. Persistance ( powered by Async storage)
 3. Fetch action

#### Global state management
Just as context api provides the ***Provider/Consumer*** scenario, app-provider provides the ***AppProvider/FetchConsumer*** scenario.

example (as a provider)

```jsx
    import {AppProvier} from 'app-provider'

    const initAppData = {state1: 1} // this is the initValue just as the value provided to a Context.Provider
    
    <AppProvider  initData={initAppData}>
	<RootComponent />
    </AppProvider>
   ```

example (as a consumer)
```jsx
    import {FetchConsumerProvier} from 'app-provider'
    
    
    // dispatch is used to set and update global state values
    // component in which this is used whould be wrapped under 												
    <FetchConsumer>
	    {({state1, dispatch})  => (

	       //...component here

	    )
    </FetchConsumer
```

#### Persistence
Persistence is powered by AsyncStorage, getters/getSaveAs and setter/saveAs function have been provided to set and get value from async store. Getting or setting persisted values can only be done in custom hooks or react components.

example 

```jsx
    import React, {useContext} from 'react'
    import {AppContext} from 'app-provider'

    useCustomeHook(){
      const {getSaveAs, saveAs} = useContext(AppContext)
      
      // a function that would save a value 
       const saveMyValue = ()=>{
          saveAs('save_as_name', 'value')
       }
       
       // a function that would get a value from async storage
       const getMyValue = ()=>{
          const value = getSaveAs('save_as_name')
       }
    }
   ```

#### Fetch action
There are situations were there is a need to get data from a remote source and use this data to render UI elements, with FetchContainer, this process has been made easy, from getting data, catching data for later rending and rendering either a success message or an error message.

example

```jsx
    import React, {useContext, useState} from 'react'
    import {AppContext} from 'app-provider'

    const MyComonent = () => {
        const [fetchData, setFetchData] = useState(false); 
        const url = 'https://myendpoint.com/getData';
        
	    return (
	       <View>
	         <FetchContainer
	            url = {url}
		        fire={fetchData}
				saveAs="mydata"
				defaultComponent={<Text> i will show if request is not fired </Text>}
				loadingComponent={
					<Text> i would show when request has been fired and is processing </Text>
				}
				errorComponent={(err)  => (
					<Text  style={{alignSelf:  'center'}}>{err}</_Text>
				)}
				successCallback={(resp)  =>  {
				   // callback is fired when the operation is successful
				}}
				errorCallback = {(err)=>{
					// callback is fird when the operation failes
				}}>	
					{
						(resp)  => (
						       // compoennt to render based on the resp from API call made.
						)
					}
			  </FetchContainer>
			</View>
```

## Props
#### FetchContainer
- url **:** url to the path to be hit if not baseUrl is. provided on AppProvider then this is an absolute path else its just a path

- payload **:**  payload for the request

- method **:**  method for the request

- headers **:** header for the request

- saveAs **:** name to save the response of the request as this name can be used by getSaveAs to get the data that was retrieved

- errorComponent **:** component to be mounted if there was an error in the request

- retryComponent **:** component to be mounted if there was an error and noRetry was set to false

- loadingComponent **:** component to be mounted if request was still processing.

- defaultComponent **:** component to be mounted if request has not been fired yet

- fire **:** set to true or false to fire the request or not to respectively

- noLoading **:** set to true or false to disable or enable loading component respectively

- noCache **:** set to true or false to disable or enable caching of response from request made

- noRetry **:** set to true or false to disable or enable showing of the retry component

- successCallback **:** callback function to be called if API request is successful 

- errorCallback **:** callback function to be called if API request failes

- completCallback **:** callback function to be called if API request is completed

- fetchFunction: function if a custom fetch action has be created

- fetchFunctions: an array of functions if a custom API request client has been created

- noDefault: set to true or false to disable or enable showing default component defined




















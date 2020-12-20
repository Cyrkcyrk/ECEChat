import React from "react";

const AppContext = React.createContext({
	toggleLogged: () => {},
	logged : false,
});

export const AppProvider = AppContext.Provider

export default AppContext
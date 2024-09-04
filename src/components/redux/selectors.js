export const getContacts = state => state.contacts.items;
export const getFilter = state => state.filter.value;
export const getIsLoading = state => state.contacts.isLoading;
export const getError = state => state.contacts.error;
export const getIsLoggedIn = state => state.auth.isLoggedIn;
export const getEmail = state => state.auth.user?.email;

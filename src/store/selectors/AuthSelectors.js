export const isAuthenticated = (state) => {
    if (!!state?.auth?.auth?.admin?.id) return true;
    return false;
};

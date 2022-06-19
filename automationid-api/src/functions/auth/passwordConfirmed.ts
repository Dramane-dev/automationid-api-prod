export const passwordConfirmed = (password: string, confirmedPassword: string): boolean => {
    return password === confirmedPassword;
};

export const generateId = (key: string): string => {
    return `${key}${Date.now()}`;
};

export const mailRestriction = (mail: string): boolean => {
    let mailregex = /(?:[\w.]+)@(?:[foncia]+|[emeria]+).{2,}/g;
    return (mail.includes("foncia") || mail.includes("emeria")) && (mail.match(mailregex) || [])?.length > 0;
};

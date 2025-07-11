export const extractTokenFromHeader = (
    authorization: string
): string | undefined => {
    const [type, token] = authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
};

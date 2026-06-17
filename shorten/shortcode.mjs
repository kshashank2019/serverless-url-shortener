export function generateShortCode() {
    return (Math.random().toString(36) + "000000").substring(2, 8);
}
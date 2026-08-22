export function isClosedSale(closesAt: string) {
  const closesAtTime = new Date(closesAt).getTime();

  return Number.isFinite(closesAtTime) && closesAtTime <= Date.now();
}

/**
 * Converte um timestamp em milissegundos para o formato HH:MM:SS.
 * @param timestamp Timestamp em milissegundos
 * @returns string no formato HH:MM:SS
 */
export function timestampToHHMMSS(timestamp: number): string {
  const totalSeconds = Math.floor(timestamp / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

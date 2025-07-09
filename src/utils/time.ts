/**
 * Converte um timestamp em milissegundos para o formato HH:MM:SS.
 * Exibe sinal negativo se o valor for negativo.
 * @param timestamp Timestamp em milissegundos
 * @returns string no formato HH:MM:SS
 */
export function timestampToHHMMSS(timestamp: number): string {
  let isNegative = false;
  if (timestamp < 0) isNegative = true;
  const timeStampPos = Math.abs(timestamp);
  const totalSeconds = Math.floor(timeStampPos / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours === 0 && minutes === 0 && seconds === 0) isNegative = false;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${isNegative ? "-" : ""}${pad(hours)}:${pad(minutes)}:${pad(
    seconds
  )}`;
}

/**
 * Converte um timestamp em milissegundos para o formato DD/MM/AAAA.
 * @param timestamp Timestamp em milissegundos
 * @returns string no formato DD/MM/AAAA
 */
export function timestampToDDMMYYYY(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Converte uma string no formato DD/MM/AAAA para timestamp em milissegundos.
 * @param dateStr Data no formato DD/MM/AAAA
 * @returns Timestamp em milissegundos
 */
export function ddmmyyyyToTimestamp(dateStr: string): number {
  const [day, month, year] = dateStr.split("/").map(Number);
  // O mês no JS começa do zero!
  return new Date(year, month - 1, day).getTime();
}

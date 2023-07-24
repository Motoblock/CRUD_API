export const portToPicker = (currentPort: string, parallelCount: number) => {
  const portNew = +currentPort;
  return (portNew === 4000 + parallelCount ? 4001 : portNew + 1).toString();
};

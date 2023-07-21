export const portToPicker = (currentPort: string, parallelCount: number) => {
  const portNew = +currentPort;
  console.log('currentPort', currentPort);
  return (portNew + 1 === 4000 + parallelCount + 1 ? 4001 : portNew + 1).toString();
};

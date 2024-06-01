/**
 * Cambia la ruta /assets/avatar/......jpg por /public/avatar/....jpg
 * la ruta original en el sistema está en public/avatar
 * @param urlPath ruta de la imagen
 * @returns string nueva ruta de la imagen
 */
export const changeUrlImagePath = (urlPath: string): string => {
  return urlPath.replace('assets', 'public');
};

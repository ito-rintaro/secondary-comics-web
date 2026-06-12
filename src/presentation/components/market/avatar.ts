/** 出品者名から安定した色相を作る（デモ avatarHue 相当）。 */
export const avatarHue = (name: string): number => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

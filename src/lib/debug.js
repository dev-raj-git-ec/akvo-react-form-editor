const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const dummyName = () => {
  return [1, 2].reduce(
    (curr) => curr + char.charAt(Math.floor(Math.random() * char.length)),
    ''
  );
};

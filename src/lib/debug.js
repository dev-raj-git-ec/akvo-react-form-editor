export const dummyName = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '123456789';
  return [characters, numbers].reduce(
    (curr, char) => curr + char.charAt(Math.floor(Math.random() * char.length)),
    ''
  );
};

import * as words from './fake.json';

const titleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const getWords = () => {
  return words.default[Math.floor(Math.random() * words.default.length)];
};

export const dummyName = (len = 2) => {
  return Array.from('x'.repeat(len)).reduce(
    (curr) => curr + ' ' + getWords(),
    titleCase(getWords())
  );
};

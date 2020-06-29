import { Toonily } from '../libs/manga/toonily';

const defaultComic = 'never-too-late';
const defaultChapter = '12';
const toonily = new Toonily();

export const getComics = async () => {
  const comics = await toonily.getComics();

  return comics;
};

export const getChapters = async (event) => {
  let comic = defaultComic;

  if (typeof event === 'string') {
    comic = event;
  }

  const chapters = await toonily.getChapters(comic);

  return chapters;
};

export const getChapter = async (event) => {
  let comic = defaultComic;
  let chapter = defaultChapter;

  if (typeof event === 'string') {
    ([comic, chapter] = event.split(','));
  }

  const chapterImages = await toonily.getChapter(comic, chapter);

  return chapterImages;
};

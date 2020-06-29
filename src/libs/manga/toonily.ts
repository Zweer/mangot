import axios from 'axios';
import cheerio from 'cheerio';

import { WebsiteInterface } from './interfaces/website.interface';

export class Toonily implements WebsiteInterface {
  private static BASEURL = 'https://toonily.com';

  private static PATH_COMICS = 'webtoons/?m_orderby=alphabet'
  private static PATH_COMIC = 'webtoon/{COMIC}';
  private static PATH_CHAPTER = 'webtoon/{COMIC}/chapter-{CHAPTER}';

  private async request(uri) {
    const { data } = await axios.get(uri);

    return cheerio.load(data);
  }

  private static getComicsPath(): string {
    return `${Toonily.BASEURL}/${Toonily.PATH_COMICS}`;
  }

  private static getComicPath(comic: string): string {
    return `${Toonily.BASEURL}/${Toonily.PATH_COMIC}`
      .replace('{COMIC}', comic);
  }

  private static getChapterPath(comic: string, chapter: string): string {
    return `${Toonily.BASEURL}/${Toonily.PATH_CHAPTER}`
      .replace('{COMIC}', comic)
      .replace('{CHAPTER}', chapter);
  }

  async getComics(): Promise<any> {
    let uri: string = Toonily.getComicsPath();

    const comics = [];

    do {
      const $ = await this.request(uri);

      const mangas = $('.manga')
        .map((_index, element) => {
          const $element = $(element);
          const badges = $element.find('.manga-title-badges').map((_badgeIndex, badgeElement) => $(badgeElement).text()).get();
          const $title = $element.find('.post-title');
          const title = $title.text().trim();
          const href = $title.find('a').attr('href');
          const slug = href.split('/')[4];
          const score = parseFloat($element.find('.score').text());
          const $chapter = $element.find('.chapter-item:first-child');
          const lastChapterId = $chapter.find('.chapter').text().replace('Chapter', '').trim();
          const lastChapterDate = $chapter.find('.post-on').text().trim();

          return {
            title,
            badges,
            slug,
            score,
            lastChapterId,
            lastChapterDate,
          };
        })
        .get();

      comics.push(...mangas);

      const $next = $('[rel=next]');
      uri = $next.length !== 0 ? $next.attr('href') : null;
    } while (uri);

    return comics;
  }

  async getChapters(comic: string): Promise<[{ id: string, title: string, releasedAt: string }]> {
    const $ = await this.request(Toonily.getComicPath(comic));

    const chapters = $('.wp-manga-chapter')
      .map((_index, element) => {
        const $element = $(element);
        const id = $element.find('a').attr('href')
          .replace(Toonily.getChapterPath(comic, ''), '')
          .replace('/', '');

        return {
          id,
          title: $element.find('a').text().trim(),
          releasedAt: $element.find('span').text().trim(),
        }
      })
      .get();

    return chapters;
  }

  async getChapter(comic: string, chapter: string): Promise<string[]> {
    const $ = await this.request(Toonily.getChapterPath(comic, chapter));

    const images = $('.wp-manga-chapter-img')
      .map((_index, element) => {
        const $element = $(element);

        return $element.attr('data-src').trim();
      })
      .get();

    return images;
  }
}

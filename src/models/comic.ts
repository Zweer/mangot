import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

import { AbstractModel } from './abstract';

@table(process.env.DYNAMODB_TABLE_COMICS)
export class Comic extends AbstractModel {
  @hashKey()
  slug: string;

  @rangeKey()
  website: string;

  @attribute()
  title: string;

  @attribute()
  score: number;

  @attribute()
  badges: string[];

  @attribute()
  genres: string[];

  @attribute()
  type: string;

  @attribute()
  author: string;

  @attribute()
  artist: string;

  @attribute()
  summary: string;

  @attribute()
  status: string;

  @attribute()
  lastChapterId: string;

  @attribute()
  lastChapterDate: Date;
}

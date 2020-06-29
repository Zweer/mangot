import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

import { AbstractModel } from './abstract';

@table(process.env.DYNAMODB_TABLE_USERS)
export class User extends AbstractModel {
  @hashKey()
  id: string;

  @attribute()
  username: string;

  @attribute()
  firstName: string;

  @attribute()
  lastName: string;

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}

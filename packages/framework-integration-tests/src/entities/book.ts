import { Entity, Reduces } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { BookAdded } from '../events/book-added'

@Entity({
  authorizeReadEvents: 'all',
})
export class Book {
  public constructor(readonly id: UUID, readonly title: string) {}

  public getId(): UUID {
    return this.id
  }

  @Reduces(BookAdded)
  public static bookAdded(event: BookAdded, currentBook: Book): Book {
    return currentBook
  }
}
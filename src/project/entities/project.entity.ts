import { Todo } from '../../todo/entities/todo.entity';

export class Project {
  readonly id: number;
  readonly title: string;
  readonly todos: Todo[];
}

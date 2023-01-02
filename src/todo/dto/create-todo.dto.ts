export class CreateTodoDto {
  readonly title: string;
  readonly project_id: number;
  readonly parent_id: number;
  readonly user_id: number;
}

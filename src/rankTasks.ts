export type Task = {
  id: string;
  priority: number;
};

/**
 * タスクを優先度の降順に並べます。
 */
export function rankTasksByPriority(tasks: Task[]): Task[] {
  return tasks.sort((left, right) => right.priority - left.priority);
}

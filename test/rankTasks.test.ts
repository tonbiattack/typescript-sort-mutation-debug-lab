import assert from "node:assert/strict";
import test from "node:test";

import { rankTasksByPriority, type Task } from "../src/rankTasks.js";

test("第01章: rankTasksByPriorityは並び替え後も入力配列の順序を保持する", () => {
  const tasks: Task[] = [
    { id: "normal", priority: 2 },
    { id: "urgent", priority: 10 },
    { id: "low", priority: 1 }
  ];

  const ranked = rankTasksByPriority(tasks);

  assert.deepEqual(
    ranked.map((task) => task.id),
    ["urgent", "normal", "low"],
    "返り値は優先度の降順である"
  );
  assert.deepEqual(
    tasks.map((task) => task.id),
    ["normal", "urgent", "low"],
    "入力配列の順序は変わらない"
  );
  assert.notStrictEqual(ranked, tasks, "返り値は入力配列とは別の配列である");
});

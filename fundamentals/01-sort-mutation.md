# 第01章: sort()による入力配列の破壊的変更

## 目的

`Array.prototype.sort()`を入力配列へ直接適用すると、返り値だけでなく呼び出し元の配列順序も変わります。返り値の並び順と入力配列の最終状態を別々に確認し、入力を保持するランキング関数を実装します。

## Red: 最初のテスト

最初に、ランキングの返り値が優先度の降順であること、入力配列が元の順序のまま残ること、返り値が別配列であることをテストで固定します。

```ts
const ranked = rankTasksByPriority(tasks);

assert.deepEqual(
  ranked.map((task) => task.id),
  ["urgent", "normal", "low"]
);
assert.deepEqual(
  tasks.map((task) => task.id),
  ["normal", "urgent", "low"]
);
assert.notStrictEqual(ranked, tasks);
```

```bash
git checkout 4984179
npm install
npm run test:chapter-01
```

この状態では、返り値の検証は成功します。しかし`tasks`の順序が`urgent`, `normal`, `low`に変化するため、入力配列を保持するアサーションで失敗します。これは設定や型の失敗ではなく、実行後の最終状態の差分です。

## Green: 最小修正

完成実装は[`src/rankTasks.ts`](../src/rankTasks.ts)にあります。配列を複製してから`sort()`を実行します。

```ts
export function rankTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((left, right) => right.priority - left.priority);
}
```

```bash
git switch main
npm run test:chapter-01
npm test
```

この修正では、ランキング結果は変えずに、入力配列コンテナの順序と参照を保持します。

## 次に増やす振る舞い

次は、`reverse()`のように入力配列を変更する他のメソッドにも同じ観測を広げられます。また、配列要素である`Task`オブジェクトのプロパティを変更しない契約が必要な場合は、浅い複製では足りないケースを別章として追加します。

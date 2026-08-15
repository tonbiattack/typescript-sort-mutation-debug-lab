# sort()による入力配列の破壊的変更のデバッグ記録

## 対象の不具合

`rankTasksByPriority`はタスクを優先度の降順で返す関数です。期待する契約では、ランキング結果を返しても、呼び出し元が渡した`tasks`の順序と配列参照は保持されます。バグ状態では`sort()`を入力配列へ直接適用していたため、返り値は正しい順序である一方、`tasks`の最終状態もランキング順に変化しました。

| 項目 | 期待値 | バグ状態での実際値 |
| --- | --- | --- |
| ランキングの返り値 | `urgent`, `normal`, `low` | `urgent`, `normal`, `low` |
| 入力配列の最終状態 | `normal`, `urgent`, `low` | `urgent`, `normal`, `low` |
| 返り値と入力配列の参照 | 異なる | 同じ |

## 再現条件

バグを含むコミットは`4984179`です。

```bash
git checkout 4984179
npm install
npm run test:chapter-01
```

実行時の観測結果は次のとおりです。

```text
not ok 1 - 第01章: rankTasksByPriorityは並び替え後も入力配列の順序を保持する
  error: |-
    入力配列の順序は変わらない
    + actual - expected
      [
    +   'urgent',
        'normal',
    -   'urgent',
        'low'
      ]
```

## 調査

| 確認対象 | 観測結果 | 判断 |
| --- | --- | --- |
| 入力 | `normal`, `urgent`, `low`の3件のタスク | 再現前の入力順序は明確 |
| 境界出力 | 返り値は`urgent`, `normal`, `low` | 比較関数とランキング結果は正しい |
| 最終状態 | 呼び出し後の`tasks`が`urgent`, `normal`, `low` | 入力配列が変更されている |
| 参照 | バグ状態では`ranked === tasks` | 別配列は返されていない |
| 関連実装 | `return tasks.sort(...)` | `sort()`を入力配列へ直接適用している |
| 型検査 | `npm run typecheck`が成功 | 型不整合ではなく実行時の契約違反 |

## 原因

`Array.prototype.sort()`は配列をin placeで並べ替え、同じ配列への参照を返します。[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) この仕様に対して、関数の契約である「入力配列を保持する」をテストしていなかったことが原因です。

## 修正

修正コミットは`693efd1`です。`tasks`をスプレッド構文で複製してから`sort()`を実行するよう変更しました。

```ts
return [...tasks].sort((left, right) => right.priority - left.priority);
```

この修正は、ランキングの順序を変えずに、入力配列コンテナの順序と参照を保持します。

## 回帰確認

```bash
git switch main
npm run typecheck
npm run test:chapter-01
npm test
```

修正後は型検査、対象テスト、全テストが成功しました。回帰テストは、変更対象であるランキングの返り値と、保持対象である入力配列の順序・参照の両方を検証します。

## 設計上の制約

`[...tasks]`は浅い複製です。配列の順序は保持しますが、配列要素の`Task`オブジェクト自体を複製しません。要素のプロパティも変更しない契約が必要な場合は、別のテストと実装を追加します。

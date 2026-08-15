# TypeScript sort Mutation Debug Lab

TypeScriptで`Array.prototype.sort()`を入力配列へ直接適用した結果、ランキングの返り値は正しいのに呼び出し元の配列順序まで変わる不具合を再現・修正する最小プロジェクトです。

## このプロジェクトで固定する契約

`rankTasksByPriority`はタスクを優先度の降順で返します。ただし、呼び出し元が渡した配列の順序と配列参照は変更しません。

| 観測点 | 期待する結果 |
| --- | --- |
| 返り値 | 優先度の降順で並ぶ |
| 入力配列の順序 | 呼び出し前のまま残る |
| 返り値の参照 | 入力配列とは別の配列である |

## 必要環境

Node.js 22以降とnpmを使用します。テストはNode.js標準テストランナーで実行し、追加のテストフレームワークは使いません。

## 実行方法

```bash
npm install
npm run typecheck
npm test
```

特定の章だけを実行する場合は、次のコマンドを使います。

```bash
npm run test:chapter-01
```

## バグを再現する

バグ状態は`4984179`です。`sort()`を直接呼ぶため、テストの返り値検証は成功しますが、入力配列の順序を保持する検証が失敗します。

```bash
git checkout 4984179
npm install
npm run test:chapter-01
```

期待する失敗は、`tasks`の実際の順序が`urgent`, `normal`, `low`となり、期待した`normal`, `urgent`, `low`と一致しないことです。

## 修正後を確認する

修正は`693efd1`です。入力をスプレッド構文で複製してから`sort()`するため、同じ回帰テストが成功します。

```bash
git switch main
npm run typecheck
npm test
```

## 学習資料

| 文書 | 内容 |
| --- | --- |
| [第01章のガイド](fundamentals/01-sort-mutation.md) | RedからGreenまでの観測手順 |
| [デバッグ記録](docs/debugging-record.md) | 実行結果、原因、修正、制約 |
| [設計メモ](DESIGN.md) | TypeScript設定と学習範囲の判断 |
| [対応表](coverage-matrix.md) | 実装済み・未着手テーマの一覧 |

## 参考資料

`sort()`が配列自身を変更し、同じ配列への参照を返すことは[MDNの仕様説明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)を参照してください。

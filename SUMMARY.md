# 学習目次

このプロジェクトは、一つの実行時不具合をRed、Green、回帰確認の順に追う教材です。

| 章 | 題材 | ガイド | 実装 | テスト |
| --- | --- | --- | --- | --- |
| 第01章 | `sort()`による入力配列の破壊的変更 | [ガイド](fundamentals/01-sort-mutation.md) | [`src/rankTasks.ts`](src/rankTasks.ts) | [`test/rankTasks.test.ts`](test/rankTasks.test.ts) |

バグ状態は`4984179`、修正状態は`693efd1`です。まずバグ状態のテスト失敗を確認し、次に`main`で同じテストが成功することを確認します。

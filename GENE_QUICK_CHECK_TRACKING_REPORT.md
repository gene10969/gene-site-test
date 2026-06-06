# 30秒自律神経チェック 計測追加レポート

## 追加したGA4イベント

- `quick_check_entry_click`
  - index / 症状ページから「チェックを開始する」を押した数

- `quick_check_view`
  - check.html が表示された数

- `quick_check_start`
  - 1問目に回答してチェックを開始した数

- `quick_check_complete`
  - 15問すべて回答して結果画面まで到達した数
  - `check_id` / `top_category_1〜3` / `total_score` を送信

- `quick_check_line_click`
  - 結果画面からLINE予約ボタンを押した数

- `quick_check_exit_without_line`
  - 結果画面まで到達したが、LINE予約ボタンを押さずに離脱した可能性が高い数

- `quick_check_partial_exit`
  - チェック開始後、結果画面まで到達せずに離脱した可能性が高い数

- `quick_check_copy_result`
  - 結果をコピーした数

- `quick_check_retry`
  - もう一度チェックした数

## 見るべき指標

### 予約導線率

`quick_check_line_click ÷ quick_check_complete`

結果を見た人のうち、LINE予約へ進んだ割合です。

### 結果後離脱率

`quick_check_exit_without_line ÷ quick_check_complete`

結果は見たが、LINE予約へ進まなかった割合です。

### チェック完了率

`quick_check_complete ÷ quick_check_start`

チェックを始めた人のうち、最後まで回答した割合です。

## 注意点

LINEボタンのクリックまでは計測できますが、LINE内で実際に予約完了したかどうかはGA4だけでは判定できません。
実予約まで紐付けたい場合は、LINEメッセージに結果IDを送ってもらう運用、またはLINE公式側の管理と照合する形が必要です。

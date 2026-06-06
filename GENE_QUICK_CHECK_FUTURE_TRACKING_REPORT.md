# gene 30秒自律神経チェック 将来連携込み計測レポート

## 今回追加した計測

### すぐにGA4で確認できるイベント
- `quick_check_entry_click`：各ページからチェック導線を押した数
- `quick_check_view`：チェックページ閲覧
- `quick_check_start`：回答開始
- `quick_check_answer`：各質問への回答
- `quick_check_complete`：結果表示
- `quick_check_line_click`：結果画面からLINEクリック
- `quick_check_exit_without_line`：結果表示後、LINEに進まず離脱
- `quick_check_partial_exit`：途中離脱
- `quick_check_copy_result`：結果コピー
- `quick_check_retry`：再チェック

### 将来の連携用イベント名
以下は今後、LINE予約・来院管理・82項目問診アプリ側から呼び出せるように土台を用意しています。
- `quick_check_booking_confirmed`：予約確定
- `quick_check_visit_completed`：来院完了
- `detail_82_complete`：82項目詳細チェック完了
- `recheck_complete`：再測定完了

## 追加パラメータ
各イベントに以下の識別情報を付与します。
- `check_session_id`：チェック開始単位のID
- `check_id`：結果ID（例：GENE-260602-ABCD）
- `source_page`：どのページからチェックに入ったか
- `current_page`：現在ページ
- `funnel_stage`：現在の段階
- `total_score`：合計スコア
- `score_band`：low / middle / high
- `top_category_1`〜`top_category_3`：上位カテゴリ
- 各カテゴリスコア：sleep / fatigue / stress / nerve / digestive / breath / circulation / sensitivity / skin

## 見るべき主要指標

### チェック完了率
`quick_check_complete ÷ quick_check_start`

### LINE誘導率
`quick_check_line_click ÷ quick_check_complete`

### 結果後離脱率
`quick_check_exit_without_line ÷ quick_check_complete`

### ページ別チェック予約導線
`source_page` ごとに以下を比較。
- チェック開始
- 結果表示
- LINEクリック

### スコア別予約意欲
`score_band` ごとに `quick_check_line_click ÷ quick_check_complete` を比較。

## 将来的な使い方

LINE予約時に利用者が結果IDを送ってくれれば、GA4上の `check_id` と照合できます。

来院後、82項目チェックアプリ側で同じ `check_id` を保持できれば、以下の流れを追えます。

HP簡易チェック
↓
LINEクリック
↓
予約確定
↓
来院
↓
82項目詳細チェック
↓
再測定

## 注意
GA4だけでは、LINE内で実際に予約確定したかまでは自動取得できません。
実予約・来院・82項目完了まで完全に自動化するには、LINE側または管理アプリ側で `check_id` を保存する実装が必要です。

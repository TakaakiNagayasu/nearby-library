
# 本プロジェクトの操作方法
本プロジェクト「ニアバイ蔵書検索」は、検索したい書籍と検索対象とする図書館を選択することで、書籍ごとに貸出状況を検索し、一覧表示します。

1. 「書籍検索フォーム」から検索したい本について「書名」「著者」「出版社」「ISBN」へ条件指定し、「書籍候補検索」ボタンを押下してください。
2. 「書籍候補一覧」から、蔵書検索に使用したい書籍のチェックボックスを1つ以上オンにし、「書籍検索対象に追加」ボタンを押下してください。
3. 「図書館検索フォーム」からマップをクリックし、青マーカーを立ててください。その後、「マーカー周辺の図書館を検索」ボタンを押下してください。
4. 「図書館候補一覧」から、図書館検索に使用したい図書館のチェックボックスを1つ以上オンにし、「図書館検索対象に追加」ボタンを押下してください。
5. 「蔵書検索開始」ボタンを押下してください。順次貸出状況を出力します。

また、GitHubによるログインを行うことでブックマーク機能を利用できるようになり、検索後に検索条件を保存し、ブックマークから1クリックで検索できます。

# 本プロジェクトをローカル環境・リモート環境で実行するには

## 本プロジェクトのクローンを各自のローカル環境、もしくはリモート環境に作成
各自のローカル、もしくはリモート環境にて、プロジェクトをクローンしたいディレクトリ直下でターミナルを開き、
「git clone 【本プロジェクトのGitHubページから「<> code」を押下→CloneのURL】」を入力してください。

## 環境変数ファイルを作成する
本プロジェクト直下にある「.env.example」に従い、環境変数ファイルを作成してください。

## Supabase上のPostgreSQLにテーブルを作成する
プロジェクトをクローンしたディレクトリ直下でターミナルを開き、
ローカルの場合：「npx prisma migrate dev」を、リモートの場合「npx prisma migrate deploy」を入力してください。

## （リモートの場合のみ）環境変数をVercelに適用する
プロジェクトをクローンしたディレクトリ直下でターミナルを開き、
「cat .env | xargs -I {} vercel env add {} production」を入力し、環境変数を適用してください。

## （ローカルの場合のみ）ビルド・実行する
プロジェクトをクローンしたディレクトリ直下でターミナルを開き、
「npx next build」を入力し、ビルドしてください。
エラーがなければ、続けて「npm run dev」を入力し、実行してください。

## （リモートの場合のみ）デプロイする
プロジェクトをクローンしたディレクトリ直下でターミナルを開き、
「vercel --prod」を入力してください。

## ビルド・デプロイしたページにアクセス
作成した環境変数ファイル（ローカルの場合「.env.local」、リモートの場合「.env」）内の「NEXTAUTH_URL」に記述したURLにアクセスしてください。

# 使用APIについて
本プロジェクトは以下のAPIを使用しています。
* Google Books API
* Google Maps API
* 日本最大の図書館検索 カーリル 図書館 API
  https://calil.jp/doc/api.html
  ![日本最大の図書館検索サイト カーリル](https://calil.jp/public/img/download/calil_logocopy_bgblack.svg)
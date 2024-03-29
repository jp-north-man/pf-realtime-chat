# 紹介
これはリアルタイムのチャットアプリケーションです。
Next.js、Socket.IO、およびExpressを使用しています。ユーザーは個別のチャットルームに参加し、リアルタイムでメッセージを交換することができます。   

# 特徴
- リアルタイムのメッセージの送受信
- チャットルームの作成と参加
- メッセージの履歴の取得

# 使用技術
- Next.js
- Socket.IO
- Express
- axios
- Material-UI

# セットアップ
リポジトリをクローンします：
```bash
git clone https://github.com/jp-north-man/pf-realtime-chat
```
   
依存関係をインストールします：
```bash
npm install
```
   
clientとbackendを起動します：
```bash
npm run dev
```
   
ブラウザで http://localhost:3000 を開きます。   

![gif](https://github.com/jp-north-man/pf-realtime-chat/blob/main/media/demo.gif)

# 注意   
このアプリケーションはデモンストレーション用であり、本番環境での使用は推奨されません。特に、現在のバージョンでは認証やエラーハンドリングが完全には実装されていません。   

# 改善余地
- 使いやすいUI
- ユーザー認証の追加
- メッセージの永続的な保存（データベースの導入）
- エラーハンドリングの強化
- ユニットテストや統合テストの追加
# SoilSync プロジェクトへようこそ

## プロジェクト情報

**URL**: https://lovable.dev/projects/3ddb1bfb-c53e-4ba8-b7bb-c1d7d7e28e9e

## バックエンド設定手順

このプロジェクトはSupabaseをバックエンドとして使用しています。バックエンドの設定手順は以下の通りです：

1. Supabaseへの接続:
   - Lovableインターフェースの右上にあるSupabaseメニューをクリック
   - 接続プロセスに従って設定を完了

2. 必要なデータベーステーブル:
   ```sql
   -- サイトテーブル
   create table sites (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     address text not null,
     lat double precision not null,
     lng double precision not null,
     soil_amount numeric not null,
     soil_type text not null,
     site_type text not null,
     contact_person text not null,
     email text not null,
     company text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- 取引テーブル
   create table transactions (
     id uuid default gen_random_uuid() primary key,
     site_id uuid references sites(id) not null,
     status text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

3. 必要な環境変数:
   - VITE_SUPABASE_URL: SupabaseプロジェクトのURL
   - VITE_SUPABASE_ANON_KEY: Supabaseの匿名キー
   - VITE_GOOGLE_MAPS_API_KEY: Google Maps APIキー

4. 実装が必要なAPIエンドポイント:
   - GET /api/sites - サイト一覧の取得（フィルタリング機能付き）
   - POST /api/sites - 新規サイトの作成
   - GET /api/sites/:id - サイト詳細の取得
   - POST /api/transactions - 新規取引の作成
   - GET /api/transactions - 取引一覧の取得

## プロジェクトのデプロイ方法

[Lovable](https://lovable.dev/projects/3ddb1bfb-c53e-4ba8-b7bb-c1d7d7e28e9e)を開き、共有 -> 公開をクリックするだけです。

## カスタムドメインの使用について

現時点ではカスタムドメインをサポートしていません。独自のドメインでプロジェクトをデプロイしたい場合は、Netlifyの使用をお勧めします。詳細については、ドキュメントをご覧ください：[カスタムドメイン](https://docs.lovable.dev/tips-tricks/custom-domain/)

## 主な機能

- 🗺️ Google Mapsを使用した現場の視覚化
- 🔍 現場の検索・フィルタリング機能
- 📝 新規現場の登録
- 💼 取引管理システム
- 📊 マッチング機能
- 📱 レスポンシブデザイン

## 技術スタック

- React + TypeScript
- Tailwind CSS
- shadcn/ui コンポーネントライブラリ
- Supabase (バックエンド)
- Google Maps API
- Tanstack Query (データ取得)
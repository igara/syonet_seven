# syonet_seven

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3a6931a9b5604ca5b60aaafe7875c203)](https://www.codacy.com/app/igara/syonet_seven?utm_source=github.com&utm_medium=referral&utm_content=igara/syonet_seven&utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/03ee67318f7884556809/maintainability)](https://codeclimate.com/github/igara/syonet_seven/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/03ee67318f7884556809/test_coverage)](https://codeclimate.com/github/igara/syonet_seven/test_coverage)

## 環境構築

### 初回起動時

#### ローカルに必要な環境を構築

```
cd syonet_seven
# 環境設定
sh env.sh dev
# DB起動
docker-compose up -d
```

### API サーバー起動

```
cd syonet_seven/nodejs/api
npm install
```

```
cp serverless.example.yml serverless.yml
```

serverless.yml に下記の対応のを記載する

- certificateArn: AWS Certificate Manager よりワイルドカードなドメインの Certificate ARN を作成
- hostsZoneId: AWS Route53 で管理しているホストゾーン ID
- Resource RDS: Amazon Aurora Serverless として作成した ARN
- Resource Secrets Manager: Amazon Aurora Serverless として作成した RDS のリソースに対してのセキュリティの ARN

#### develop

```
npm run start
```

#### DB 接続

migration

```
# Entryの定義をDBに反映
npm run typeorm:migration:generate:development
npm run typeorm:migration:run:development

# migration export
npm run mysqldef:migration:export
npm run mysqldef:migration:import
```

#### Serverless デプロイ

```
# aws認証
aws configure

# カスタムドメイン作成
npm run create:domain

# DBマイグレーション
# npm run production typeorm:migration:run:production
管理画面作成して実施しようか検討中

# デプロイ
npm run deploy

# 削除
npm run close


# memo コンテナ起動
docker-compose up -d
docker-compose exec serverless-build bash
```

### Web サーバー起動

```
cd syonet_seven/nodejs/www
npm install
```

#### develop

```
npm run start
```

#### Serverless デプロイ

```
# aws認証
aws configure

# デプロイ
docker-compose up -d
docker-compose exec serverless-build bash
cd /syonet_seven/nodejs/www
npm install
npm run deploy

# 削除
npm run close
```

### SUPER SUPER BROS サーバー起動

client: https://github.com/igara/ssb

```
cd syonet_seven/nodejs/webpack/ssb
npm install
npx sls dynamodb install
```

```
cp serverless.example.yml serverless.yml
```

#### develop

```
npm run dynamodb
npm run start
```

#### Serverless デプロイ

```
# aws認証
aws configure

# カスタムドメイン作成
npm run create:domain

# デプロイ
npm run deploy

# 削除
npm run close
```

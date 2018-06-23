# syonet_seven

[![Build Status](https://travis-ci.org/igara/syonet_seven.svg?branch=master)](https://travis-ci.org/igara/syonet_seven)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3a6931a9b5604ca5b60aaafe7875c203)](https://www.codacy.com/app/igara/syonet_seven?utm_source=github.com&utm_medium=referral&utm_content=igara/syonet_seven&utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/03ee67318f7884556809/maintainability)](https://codeclimate.com/github/igara/syonet_seven/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/03ee67318f7884556809/test_coverage)](https://codeclimate.com/github/igara/syonet_seven/test_coverage) [![Greenkeeper badge](https://badges.greenkeeper.io/igara/syonet_seven.svg)](https://greenkeeper.io/)

## 環境構築

### 初回起動時

#### 普通に docker で起動する時

```
cd syonet_seven
# 環境設定
sh env.sh local
docker-compose up -d
# Webフロント開発サーバ起動
(cd nodejs/www && yarn local_front_start)
```

#### ホスト的な意味で VM を交わす時

```
cd syonet_seven
# 環境設定
sh env.sh local-vm
# vagrantfileにコメント記載している箇所を修正
vagrant up --provision
```

vagrant の OS に SSH する

```
cd syonet_seven
vagrant ssh
(cd /vagrant && docker-compose up --build -d)

# 静的ファイルのビルドを行う
(cd /vagrant && docker-compose exec www yarn build)

# 起動確認はこちら
(cd /vagrant && docker-compose logs -f)
# wwwがupになって入ればOK
(cd /vagrant && docker-compose ps)
# コンテナの中に入る
(cd /vagrant/ && docker-compose exec www sh)
```

こちらは local.syonet.work で入れる

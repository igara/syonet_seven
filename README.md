# syonet_seven

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3a6931a9b5604ca5b60aaafe7875c203)](https://www.codacy.com/app/igara/syonet_seven?utm_source=github.com&utm_medium=referral&utm_content=igara/syonet_seven&utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/03ee67318f7884556809/maintainability)](https://codeclimate.com/github/igara/syonet_seven/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/03ee67318f7884556809/test_coverage)](https://codeclimate.com/github/igara/syonet_seven/test_coverage)

## 環境構築

### 初回起動時

#### 普通に docker で起動する時

```
cd syonet_seven
# 環境設定
sh env.sh local
# オレオレ証明書
brew install mkcert
mkcert -install
(cd data/openssl && mkcert localhost 127.0.0.1)
docker-compose up -d
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

#### DB 接続

ホストから繋げたいとき

```
brew install mutagen-io/mutagen/mutagen

mutagen forward create --name syonet-seven-mysql tcp::3306 docker://syonet_seven_mysql_1:tcp::3306

mutagen sync terminate syonet-seven-mysql

```

migration

```
docker-compose exec www sh

# Entryの定義をDBに反映
npm run typeorm:migration:generate
npm run typeorm:migration:run

# migration export
npm run mysqldef:migration:export
npm run mysqldef:migration:import
```

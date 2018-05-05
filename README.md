# syonet_seven

[![Build Status](https://travis-ci.org/igara/syonet_seven.svg?branch=master)](https://travis-ci.org/igara/syonet_seven)

## 環境構築

### 初回起動時

#### 普通にdockerで起動する時

```
cd syonet_seven
# 環境設定
sh env.sh local
docker-compose up -d
# Webフロント開発サーバ起動
(cd nodejs/www && yarn local_front_start)
```

#### ホスト的な意味でVMを交わす時

```
cd syonet_seven
# 環境設定
sh env.sh local-vm
# vagrantfileにコメント記載している箇所を修正
vagrant up --provision
```

vagrantのOSにSSHする

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

こちらはlocal.syonet.workで入れる
# syonet_seven

## 環境構築

### 初回起動時

hostsの変更

```
# vagrantを使用せずにdockerのIPから設定する場合
XXX.XXX.XXX.XXX local.syonet.work
```

```
cd syonet_seven
# 環境設定
sh env.sh
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

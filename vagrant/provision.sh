echo "apt get のアップデートを行います"
sudo apt-get update -y

echo "Docker依存のライブラリをインストールします"
sudo apt-get install -y \
    linux-image-extra-$(uname -r) \
    linux-image-extra-virtual

# Install packages to allow apt to use a repository over HTTPS:
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

echo "Dockerのaptレポジトリを追加します"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

# dockerをインストール
sudo apt-get update -y
echo "Dockerをインストールします"
sudo apt-get install -y docker-ce
docker -v
echo "dockerユーザの追加を行います"
sudo groupadd docker
sudo usermod -g docker ubuntu
docker info

echo "docker-syncのインストールを行います"
# sudo apt-get install -y ruby-dev
# sudo gem install docker-sync

echo "docker-composeをインストールします"
sudo apt-get install -y docker-compose
docker-compose -v

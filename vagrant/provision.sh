echo "apt get のアップデートを行います"
sudo apt update -y
sudo apt upgrade -y

echo "Docker依存のライブラリをインストールします"
# Install packages to allow apt to use a repository over HTTPS:
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

echo "Dockerのaptレポジトリを追加します"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

# dockerをインストール
sudo apt update -y
echo "Dockerをインストールします"
sudo apt install -y docker-ce docker-ce-cli containerd.io
docker -v
echo "dockerユーザの追加を行います"
sudo groupadd docker
sudo usermod -aG docker $USER
docker info

echo "docker-syncのインストールを行います"
# sudo apt-get install -y ruby-dev
# sudo gem install docker-sync

echo "docker-composeをインストールします"
sudo curl -L https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose -v

echo "docker-syncをstartします"
# (cd /vagrant && docker-sync start)
echo "dockerを起動します"
(cd /vagrant && docker-compose up -d --build)

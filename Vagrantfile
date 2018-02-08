# -*- mode: ruby -*-
# vi: set ft=ruby :
def install_plugin(plugin)
	system "vagrant plugin install #{plugin}" unless Vagrant.has_plugin? plugin
end
install_plugin('vagrant-vbguest')
install_plugin('vagrant-hostsupdater')

Vagrant.configure("2") do |config|
	config.vm.box = "ubuntu/xenial64"
	config.vbguest.auto_update = true

	config.vm.provider "virtualbox" do |vb|
		vb.memory = 1024
	end

	config.vm.network :private_network, ip: "192.168.33.50"
	config.vm.network :forwarded_port, guest: 5555, host: 5555
	config.vm.hostname = "local.syonet.work"
	config.ssh.forward_agent = true
	config.hostsupdater.remove_on_suspend = true
	# sync project files
	config.vm.synced_folder "./", "/vagrant", :mount_options => ["dmode=777", "fmode=777"]
	# config.vm.provision :shell, :path => "./vagrant/provision.sh", :privileged => false
	# 起動二回目以降は上記をコメント化し下記を適応してください
	config.vm.provision :shell, :path => "./vagrant/start.sh", :privileged => false
end

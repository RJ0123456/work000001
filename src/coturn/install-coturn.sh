#! bash
sudo yum install git
sudo yum install gcc
sudo yum install openssl-devel
sudo yum install sqlite
sudo yum install sqlite-devel
sudo yum install libevent
sudo yum install libevent-devel

# download coturn code.
git clone https://github.com/coturn/coturn.git

./configure
make
sudo make install
#! bash
#================================================
yum install openssl-devel
yum install sqlite
yum install sqlite-devel
yum install libevent
yum install libevent-devel
yum install postgresql-devel
yum install postgresql-server
yum install mysql-devel
yum install mysql-server
yum install hiredis
yum install hiredis-devel
yum install gcc
yum install git

git clone https://github.com/coturn/coturn.git
cd coturn
./configure --prefix=/opt/turnserver
make
make install

# configure and start turnserver
# ================================================
# $bin/turnserver -n -a -f -v --mobility -m 10 --max-bps=100000 --min-port=50000 --max-port=65535 --user=lijunshan:lijunshan1234 --user=lijunshan2:lijunshan1234 -r demo

# ================================================
#
# $bin/turnserver -n -a -f -v --mobility -m 10 --max-bps=100000 --min-port=50000 --max-port=65535 --user=lijunshan:lijunshan1234 --user=lijunshan2:lijunshan1234 -r demo -L 192.168.1.200 -L 192.168.1.151 -L 192.168.1.92 -E 192.168.1.200 -E 192.168.1.151 -L 192.168.1.92
#
#
# $bin/turnserver -n -a -f -v --mobility -m 10 --max-bps=100000 --min-port=50000 --max-port=65535 --user=lijunshan:lijunshan1234 --user=lijunshan2:lijunshan1234 -r demo -L 192.168.1.197 -L 192.168.1.153 -L 192.168.1.180 -E 192.168.1.197 -E 192.168.1.153 -L 192.168.1.180 --cert=/root/certs/GW.pem --pkey=/root/certs/GW.key
#================================================
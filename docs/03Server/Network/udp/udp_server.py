#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import socket
import sys

host = '127.0.0.1'
port = 51831
if len(sys.argv) == 2:
    port = int(sys.argv[1])
elif len(sys.argv) == 3:
    host = sys.argv[1]
    port = int(sys.argv[2])
else:
    print('参数错误, [host port] or [port]')
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((host, port))
print("UDP bound on port {0}...".format(port))

while True:
    data, addr = s.recvfrom(1024)
    print("Receive from %s:%s" % addr)
    if data == b"exit":
        s.sendto(b"Good bye!\n", addr)
        continue
    s.sendto(b"Hello %s!\n" % data, addr)

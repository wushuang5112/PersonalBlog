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
    print('参数错误, [host port]')
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
addr = (host, port)

while True:
    data = input("Please input your name: ")
    if not data:
            continue
    s.sendto(data.encode(), addr)
    response, addr = s.recvfrom(1024)
    print(response.decode())
    if data == "exit":
        print("Session is over from the server %s:%s\n" % addr)
        break

s.close()

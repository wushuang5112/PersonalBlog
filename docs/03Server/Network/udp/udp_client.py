#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import socket
import sys

port = 51831
if len(sys.argv) >= 2:
    port = int(sys.argv[1])
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
addr = ("140.82.4.54", port)

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

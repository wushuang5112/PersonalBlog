#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import socket
import sys

port = 51831
print(len(sys.argv))
if len(sys.argv) >= 2:
    port = int(sys.argv[1])
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(("140.82.4.54", port))
print("UDP bound on port {0}...".format(port))

while True:
    data, addr = s.recvfrom(1024)
    print("Receive from %s:%s" % addr)
    if data == b"exit":
        s.sendto(b"Good bye!\n", addr)
        continue
    s.sendto(b"Hello %s!\n" % data, addr)

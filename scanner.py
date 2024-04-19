import socket
from utils import is_valid_ip

class PortScanner:
    def __init__(self, target, start_port, end_port, timeout=1, scan_type="tcp"):
        if not is_valid_ip(target):
            raise ValueError("Invalid IP address")
        self.target = target
        self.start_port = start_port
        self.end_port = end_port
        self.timeout = timeout
        self.scan_type = scan_type.lower()

    def scan(self):
        print(f"Scanning target {self.target}...")
        try:
            for port in range(self.start_port, self.end_port + 1):
                try:
                    if self.scan_type == "tcp":
                        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    elif self.scan_type == "udp":
                        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                    else:
                        print("Invalid scan type. Please choose 'tcp' or 'udp'.")
                        return

                    sock.settimeout(self.timeout)
                    result = sock.connect_ex((self.target, port))
                    if result == 0:
                        print(f"Port {port} is open")
                    sock.close()
                except KeyboardInterrupt:
                    print("\nScan stopped by user")
                    return
                except socket.gaierror:
                    print("Hostname could not be resolved")
                    return
                except socket.error:
                    print("Couldn't connect to server")
                    return
        except Exception as e:
            print(f"An error occurred: {str(e)}")

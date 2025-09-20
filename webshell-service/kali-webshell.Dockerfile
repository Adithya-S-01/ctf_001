# Kali Linux based CTF webshell terminal
FROM kalilinux/kali-rolling

# Update and install essential tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    vim \
    nano \
    netcat-traditional \
    nmap \
    python3 \
    python3-pip \
    nodejs \
    npm \
    sqlmap \
    gobuster \
    hashcat \
    john \
    binwalk \
    foremost \
    exiftool \
    steghide \
    strings \
    file \
    xxd \
    base64 \
    openssl \
    ssh \
    telnet \
    ftp \
    tcpdump \
    wireshark-common \
    aircrack-ng \
    hydra \
    nikto \
    dirb \
    enum4linux \
    smbclient \
    && rm -rf /var/lib/apt/lists/*

# Install additional Python tools
RUN pip3 install \
    requests \
    pycryptodome \
    scapy \
    beautifulsoup4 \
    selenium \
    pwntools

# Install wetty for web terminal
RUN npm install -g wetty

# Create a CTF user
RUN useradd -m -s /bin/bash ctfuser
RUN echo 'ctfuser:ctfpassword' | chpasswd

# Set up working directory
WORKDIR /home/ctfuser
RUN chown ctfuser:ctfuser /home/ctfuser

# Copy CTF tools and scripts
COPY --chown=ctfuser:ctfuser tools/ /home/ctfuser/tools/

# Expose wetty port
EXPOSE 8080

# Switch to ctfuser
USER ctfuser

# Start wetty
CMD ["wetty", "--host", "0.0.0.0", "--port", "8080"]
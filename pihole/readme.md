# Image SD Card using Raspberry Pi Imager

## Select

| OS                              |
|---------------------------------|
|Raspberry Pi OS Lite (64 Bit)    |

## Configure 

1. hostname: pihole
2. ssh: enabled
	1. login with public key
	2. authorized_keys: *Development/Homelab/SSH Key/ssh_public_key.pub*
3. configure username & password
	1. username: admin
	2. password: enter gibberish, password login will be disabled anyway
4. configure locale:
	1. region: europe/berlin
	2. keyboard layout: de
5. write to sd card

# Customize first run script

1. re-insert sd card, it was ejected automatically by the imager
2. Insert into `<sd card>:\firstrun.sh` before `rm -f /boot/firstrun.sh`:

```bash
cat >>/etc/dhcpcd.conf <<'DHCPEOF'
interface eth0
static ip_address=10.0.0.2/16
static routers=10.0.0.1
static domain_name_servers=1.1.1.1 8.8.8.8

DHCPEOF

usermod -L admin
```

# First boot

1. insert sd card into pi 
2. connect pi to power & ethernet
3. wait for first boot configuration to finish (it takes a few minutes)
4. ssh into the server
	- private key: *Development/Homelab/SSH Key/ssh_private_key.rsa*
5. disable autologin
	1. `sudo raspi-config`
	2. Select **1 System Options**
	3. Select **S5 Boot / Auto Login**
	4. Select **B1 Console**
	5. Select **&lt;Finish&gt;**
	6. Reboot (Select **&lt;Yes&gt;**)

!!! note
	At this point logging in is impossible except via ssh public key


# Pihole installation

1. ssh into `10.0.0.2:22` using the configured ssh key
1. enter root  shell: `sudo su`
1. run automated install `curl -sSL https://install.pi-hole.net | bash`
1. Confirm Prompts until Static IP Address Confirmation
1. Select **Yes Set static IP using current values**
1. Choose **Cloudflare (DNSSEC)** as Upstream DNS Provider
1. Confirm Prompts until Finished
1. Wait for install to finish

!!! Attention
	Write down the admin webpage login password

# DNS-Over-HTTPS

1. Follow the [pihole cloudflared guide](https://docs.pi-hole.net/guides/dns/cloudflared/)
	1. Architecture: arm64
	2. run on startup: manual route

# Configure pihole to use itself as DNS server

1. `sudo nano /etc/dhcpcd.conf`
2. change `static domain_name_servers` to `10.0.0.2`

# Configure via web administration

1. navigate to `http://10.0.0.2/admin`
2. login using the noted password
3. go to settings => teleporter and apply pihole.teleporter.tar.gz

# Change web administration password

1. `sudo pihole admin password <password>`

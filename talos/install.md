# Generate Talos Config

## Generate basic cluster config

```bash
talosctl gen config cluster https://master-talos.lan.mircogericke.com:6443 --output-dir ./talos/generated
```

## Apply Configuration Changes

### controlplane.yaml

```yaml
network:
  hostname: master-talos.lan.mircogericke.com
cluster:
  allowSchedulingOnControlPlanes: true
  network:
    dnsDomain: cluster.mircogericke.com
disks:
  - device: /dev/sdb
    partitions:
    - mountpoint: /var/mnt/fast
  - device: /dev/sdc
    partitions:
    - mountpoint: /var/mnt/slow
```

### worker.yaml

# Bootstrap controlplane node

1. Create VM
	1. General
		![](https://i.imgur.com/nWwvtkB.png)
	1. OS
		![](https://i.imgur.com/5kHgLST.png)
	1. Hard Disk
		![](https://i.imgur.com/McGvxl7.png)
	1. CPU
		![](https://i.imgur.com/9h9Bift.png)
	1. Memory
		![](https://i.imgur.com/4CqbfoY.png)

1. Add Storage Disks to VM
	1. Fast
		![](https://i.imgur.com/pYtzedd.png)
	1. Slow
		![](https://i.imgur.com/21Yvcvm.png)

1. Add VM MAC address to pihole static leases (without IP, hostname: master-talos), save
	1. Grab MAC
		![](https://i.imgur.com/nNqoDmy.png)
	1. Create static lease, then click Save
		![](https://i.imgur.com/TtKQOk0.png)


1. Start VM

1. Apply Controlplane Configuration
	```powershell
	talosctl apply-config --insecure --nodes master-talos.lan.mircogericke.com --file talos/generated/controlplane.yaml
	```

1. Wait for installer to finish running

1. Configure talosctl config
	```powershell
	$env:TALOSCONFIG="talos/generated/talosconfig"
	```

1. complete talosconfig
	```powershell
	talosctl config endpoint master-talos.lan.mircogericke.com
	talosctl config node master-talos.lan.mircogericke.com
	```

1. Boostrap etcd
	```powershell
	talosctl bootstrap
	```

1. Wait for cluster to become healthy
	```powershell
	talosctl health
	```
1. Generate kubeconfig for cluster
	```powershell
	talosctl kubeconfig .
	```

1. copy kubeconfig into %userprofile%/.kube/config

1. check kubectl functionality
	```powershell
	kubectl get nodes
	```

# Add worker node (repeatable)

1. create VM worker&lt;n&gt;-talos
1. Add VM MAC address to pihole static leases (without IP, hostname: worker&lt;n&gt;-talos), save
1. Start VM
1. Apply worker configuration
	```powershell
	talosctl apply-config --insecure --nodes worker<n>-talos.lan.mircogericke.com --file config/worker.yaml
	```

1. Wait for node to become ready in kubernetes
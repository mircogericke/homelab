Required command line utilities:


# Fluxcd Installation

## Generate Github Personal Access Token

Create a personal access token with the "repo" scope and unlimited durability in your github account.

## Define variables used during installation

```powershell
$env:GITHUB_TOKEN="<your-token>"
$env:GITHUB_USER="mircogericke"
```

## Install flux

```powershell
flux bootstrap github `
	--owner=$env:GITHUB_USER `
	--repository=homelab `
	--branch=prod `
	--path=./flux/clusters/production `
	--cluster-domain="cluster.mircogericke.com" `
	--personal
```

# Mozilla SOPS Installation

## create and obtain gpg keys

```
export KEY_NAME="cluster.mircogericke.com"
export KEY_COMMENT="sops secrets"

gpg --batch --full-generate-key <<EOF
%no-protection
Key-Type: 1
Key-Length: 4096
Subkey-Type: 1
Subkey-Length: 4096
Expire-Date: 0
Name-Comment: ${KEY_COMMENT}
Name-Real: ${KEY_NAME}
EOF

gpg --list-secret-keys "${KEY_NAME}"
```


export fingerprint under `sec   rsa4096 YYYY-MM-DD [SCEA]`:
```bash
export KEY_FP=<fingerprint>
gpg --export-secret-keys --armor "${KEY_FP}" > sops.asc
gpg --export -armor "${KEY_FP}" > sops.pub

kubectl create secret generic sops-gpg \
--namespace=flux-system \
--from-file=sops.asc
```

!!! Attention
	Store sops.asc in password manager

cleanup:
```bash
gpg --delete-secret-keys "${KEY_FP}"
rm -r sops.asc
```

## Configure decryption

add to infrastructure/apps kustomization specs in clusters/production (already present in repository)
```yaml
  decryption:
    provider: sops
    secretRef:
      name: sops-gpg
```

## (test) encrypt a secret

create file test.yaml
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: test-secret
stringData:
  username: admin
  password: admin
```

encrypt and check file contents:
```bash
sops -e -i test.yaml
```

# Automatic Image Update Setup



==================================


Components:
- Flux + Github
- local-path-storage (slow + fast)
- Mittwald secret generator
- cert-manager
- traefik ingress controller
- authentik sso

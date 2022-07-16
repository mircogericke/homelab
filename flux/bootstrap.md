Required command line utilities:
- kubectl
- flux
- gpg
- git


# Fluxcd Installation

## Generate Github Personal Access Token

Create a personal access token with the "repo" scope and unlimited durability in your github account.

## Define variables used during installation

```bash
export GITHUB_TOKEN=<your-token>
export GITHUB_USER=<your-username>
```

## Install flux

```bash
flux bootstrap github \
	--owner=$GITHUB_USER \
	--repository=homelab \
	--branch=prod \
	--path=./flux/clusters/production \
	--cluster-domain="cluster.mircogericke.com" \
	--personal
```

## Clone the repository

```bash
git clone https://github.com/mircogericke/homelab.git
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
```
export KEY_FP=<fingerprint>
gpg --export-secret-keys --armor "${KEY_FP}" > sops.asc

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

```bash
cd flux
flux create source git my-secrets \
--url=https://github.com/my-org/my-secrets \
--branch=main
```
---
date: '2025-08-11T10:00:48Z'
draft: false
title: 'CLOUD: Adios Free Tier '
tags: ["cloud"]
---

Desde Amazon me mandan el siguiente correo

![aviso](/img/aws_freetier/capa_gratuita.png)

Antes del vencimiento de la capa gratuita me gustaria aprovechar para hacer algunas pruebas de despliegue automatico, por ej: crear una instancia ec2 con docker/docker-compose usando Infraestructura como Código (IaC) en este caso Terraform.

---
## Preparando los archivos necesarios

Despues de investigar un poco para el despliegue voy a necesitar estos archivos

- main.tf
- output.tf
- provider.tf
- variables.tf
- user_data.sh

y un par de llaves SSH

```shell
# setup
mkdir ~/terra_setup && touch ~/terra_setup/{main.tf,output.tf,provider.tf,variables.tf,user_data.sh}

# llaves
ssh-keygen -t ed25519 -C terrakeys -f .ssh/terrakeys
```

esto se puede transformar facilmente en un alias (agregando esta linea a ~/.bashrc)

```shell
alias mkterra="mkdir ~/terra_setup && touch ~/terra_setup/{main.tf,output.tf,provider.tf,variables.tf,user_data.sh}"
```

---
## Creando los recursos
Primero necesitamos generar el archivo de configuracion de aws con las credenciales para que terraform pueda autenticarse y crear los recursos con los siguientes comandos

```shell
terraform init
terraform fmt	
terraform validate
terraform plan
terraform apply -auto-approve
```

Una vez termine de usar la instancia la elimine con este comando  

```shell
terraform destroy
```

y asi libere todos los recursos creados por este proyecto en mi cuenta de aws.

---
## aws-nuke
Encontre esta tool en github para destruir **todos** los recursos de una cuenta de AWS. 

[aws-nuke](https://github.com/ekristen/aws-nuke)

---
## Proyecto en github
Tengo en github este [proyecto](https://github.com/pgraffigna/terraform_cloud_deploy/tree/main) con todos los archivos que use en este post para referencia.

---
## Cierre
Con la instancia creada tengo una vm con ubuntu, docker, docker-compose y una ip publica para "jugar" todo en la nube. 

Ahora si, adios capa gratuita!!
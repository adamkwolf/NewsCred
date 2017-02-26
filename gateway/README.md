To run this container

```
 docker run -it -d --link newscred:newscred --link newscred-web -p 80:80 newscred-gateway
```
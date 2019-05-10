# CACHING (NGINX)

Import thư mục src vào VSCODE.

Mở file config của nginx:
```
sudo gedit /etc/nginx/sites-available/default
```

Sửa config:
```
proxy_cache_path /home/cpu11817/environments/flask-starter/cache
        levels=1:2 keys_zone=my_cache:10m max_size=2g inactive=2h
        use_temp_path=off;

server {
    location / {
        proxy_pass http://quoctk/;
        proxy_cache my_cache;
		proxy_ignore_headers X-Accel-Expires Expires Cache-Control Set-Cookie; 
		proxy_cache_valid any 60m;
		add_header X-GG-Cache-Status $upstream_cache_status;
    }
}
```
Khởi động nginx
```
sudo service nginx start
Hoặc
systemctl start nginx
```










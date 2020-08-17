# Listening test platform

An open source platform for browser based speech and audio subjective quality tests. Version: `0.1.0`

## Tornado python back-end

The back-end of this platform is based on Tornado (a python web server) and MongoDB.

### Dependencies and how to run

- python3.8 (pip dependencies)
- pip3 (if python doesn't contain pip)
    - tornado
    - pymongo

`pip install -r requirements.txt` to install all dependencies for the backend.

`python server.py` to run tornado server. If you wanna specify port `python server.py --port=8080`. Default host and port `localhost:8889`.

### Some configuration

`tornado.ini` is supervisor config file. After add it into `supervisord.conf`, the server should run automatically as along as supervisor configured properly (such as auto start of supervisord service).

### Naming styles

- Database (MongoDB) and React.js are using `camelCase naming` for everything.
- For python script, variables are wrote in the `snake_case naming` style, and `folder_name` are in this naming style.
- `api-urls` are following RESTful style, using hyphens to separate words.

## React frontend

### Dependencies

- Node.js
- Npm (if you node.js doesn't contain npm)
    - react
    - @material-ui/core
    - @material-ui/lab
    - formik
    - axios
    - mobx
    - ts-md5
    - uuidv4
    - typescript
    ...

`npm install` to install all dependencies of the front end

### To run the frontend `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### To build the frontend `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Server dependencies and tips of how to install them

- nginx
- supervisor
- python3.8
- python3-pip
    - tornado
    - pymongo
- mongodb

`nginx` is for server static pages(React.js), `supervisor` serve python3 backend to restart tornado.

To install them, just run `sudo apt-get install -y nginx supervisor && chmod +x install-mongodb.sh && sudo sh install-mongodb.sh`

There are lots of ways to install python3.8, and every linux has different python preinstalled. In our case, we got python3.5, so we need to upgrade it and remove the old one.

```bash
sudo apt-get update
sudo apt-get install -y python3.8
sudo apt remove python3.5 python3.5-minimal
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 1
wget https://bootstrap.pypa.io/get-pip.py
sudo python3 get-pip.py
```

### Serve frontend and backend on a server

Our server has limited space and performance, so we build on a local machine. If you wanna build on a server, you must install node.js and npm on your server to build frontend project.

1. Build the frontend and then transfer complied frontend files.

2. Transfer files into the server and make sure frontend and backend folders are matched to conf files.

A python automatic script can help use scp command and ssh to restart backend.

3. Create *.conf files for nginx and supervisor to meet your requirements, including domain name, path, certificates, application path, app name, logs etc.

4. Log into the server. Move conf files into conf.d folder of nginx and supervisor and install backend dependencies.

```
echo 'Move nginx conf files'
sudo mv /home/golistenadmin/golisten/golisten.nginx.conf /etc/nginx/conf.d/
sudo systemctl restart nginx

echo 'Edit supervisord.conf'
sudo mv /home/golistenadmin/golisten/golisten.supervisor.conf /etc/supervisor/conf.d/
sudo supervisorctl reload

echo 'Add pip packages'
pip3 install --upgrade pip
pip3 install tornado pymongo
```

5. Done.

### Example of conf files

#### golisten.supervisor.conf
```
[program:golisten]
command=sudo python3 /home/golistenadmin/golisten/server/server.py
directory=/home/golistenadmin/golisten/server
user=root
autorestart=true
redirect_stderr=true
stdout_logfile=/home/golistenadmin/golisten/golisten.log
loglevel=info
```

#### golisten.nginx.conf
```
server {
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;
    server_name  yourdomain.com;
    ssl on;
    ssl_certificate "/etc/nginx/conf.d/yourdomain.com_bundle.crt";
    ssl_certificate_key "/etc/nginx/conf.d/yourdomain.com.key";
    ...
    location ^~ /api/ {
        # rewrite  ^.+api/?(.*)$ /$1 break;
        include uwsgi_params;
        proxy_pass http://localhost:8889;
    }
    location /static2/ {
        include uwsgi_params;
        proxy_pass http://localhost:8889;
    }
    location / {
        root /home/ubuntu/golisten/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

For more settings, please check [nginx documentation](https://nginx.org/en/docs/) 

# React front-end

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts and how to run the frontend

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

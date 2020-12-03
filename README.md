# Listening test platform

An open source platform for browser based speech and audio subjective quality tests. Version: `0.1.0`
This repo gives you a fully functional end-to-end listening test platform which allows a user to create and share MUSHRA, ACR and A/B tests within minutes. Collected data can then be downloaded in CSV or JSON format. 

## Run with docker and docker compose or with aws

Make sure your system has `docker` and `docker-compose` installed and run it as root user (or you can add `sudo` manually).

```bash
wget https://github.com/QxLabIreland/listening-test/releases/download/v0.1.0-beta/listeningTest.tgz
tar -xvzf listeningTest.tgz
cd listeningTest
docker-compose up
```

When it finished, the app will be served on localhost:80. The default email and password for the admin user are `admin@yourdomain.com` `123456` (Use them in localhost:80/sign-in). The 443 port is reserved for nginx, the port of 8889 is for backend and the port 27017 is for MongoDB.

Check the release section to get the newest release

### Some description

There will be 3 containers; mongo database, backend and frontend. Each container exposes some ports which you can check them in `docker-compose.yml` file. For example, the frontend exposes 80 and 443 (you will need to config your ssl and listening on 443).

Without an SSL certificate, some functions **will not** work. As far as we are aware, these functions will be affected without HTTPS:
- Copy test url to clipboard (the view button is working, so you can click VIEW button and copy the url from a browser navigation bar)

In the backend container, there is no process management tool such as supervisor. It just uses python3 to run.

### Run with our AWS AMI and EC2

Launch an AWS EC2 instance, select community AMIs, and then search `ami-0e8863cb7176cf461`. The region of this AMIs is in `eu-west-1`. 

After the successful launch, you can use `cd ~/listeningTest && sudo docker-compose up` to bring the app online. Make sure inbound port 80 is open to the public in the AWS security group settings.

### Run with an AWS EC2

With an AWS EC2, get the instance first and then you will need to install [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/). Please make sure ports 80 and 443 of the EC2 instance are open for public access.

When everything is ready, you can run the command above (get release, extract compiled files and `docker-compose up`)

### pack_transfer.py for building and generate release zip file

You can also use `pack_transfer.py` to build and pack the newest version of the app. It will create `listeningTest.tgz` just like the released one.

To build the frontend, you will need `node.js` and `npm`. Run `npm install` to install packages in order to run `python3 pack_transfer.py`.

You may need to delete some transfer code to our server, before using it.

## Tornado python back-end

The back-end of this platform is using **Tornado** (a python web server) and **MongoDB**.

### Dependencies and how to run

- python3.8
- pip3 (some python installation doesn't have pip)
    - tornado
    - pymongo
- MongoDB

`pip install -r requirements.txt` to install all dependencies for the backend.

`python server.py` to run tornado server. If you wanna specify port `python server.py --port=8080`. Default host and port `localhost:8889`.

### Naming styles

- Database (MongoDB) and React.js are using `camelCase naming` for everything.
- For python script, variables are wrote in the `snake_case naming` style, and `folder_name` are in this naming style.
- `api-urls` are following RESTful style, using hyphens to separate words.

## React frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Dependencies

- Node.js
- Npm (some node.js installation may skip npm installation)
    - react
    - react-dom
    - react-router
    - react-router-dom
    - @material-ui/core
    - @material-ui/lab
    - axios
    - formik
    - mobx
    - mobx-react
    - mobx-utils
    - ts-md5
    - typescript
    - uuidv4  
    ...  
    more dependencies in package.json

In the project directory, you can run:

### To install dependency `npm install`

To install all npm dependencies (`node_modules` folder) of the frontend based on `package.json`, so you do not need to install each package by yourself.

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

With the steps of previous sections, you can run the app on your local machine. So, if you **do not need to deploy** this project on a server you can skip this section.

### Server dependencies, and introduction

- nginx
- supervisor
- python3.8
- python3-pip
    - tornado
    - pymongo
- mongodb

`nginx` is for server static pages(React.js), `supervisor` is to mange tornado server, such as logging and restarting.

To install them, just run `sudo apt-get install -y nginx supervisor && chmod +x install-mongodb.sh && sudo sh install-mongodb.sh`

There are lots of ways to install python3.8, and every linux distribution has a different version of python preinstalled. In our case, we use python3.5, so we need to upgrade it.

```bash
sudo apt-get update
sudo apt-get install -y python3.8
# In our case, we need to add alternatives to switch python3 version.
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.5 1
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 2
# Get and install pip
wget https://bootstrap.pypa.io/get-pip.py
sudo python3.8 get-pip.py
```

### Serve frontend and backend on a server

Our server has limited space and performance, so we build on a local machine. If you want to build on a server, you must install node.js and npm on your server to build frontend project.

1. Build the frontend and then transfer complied frontend files.

2. Transfer files into the server and make sure frontend and backend folders are matched to conf files.

A python automatic script can help use the scp command and ssh to restart the backend.

3. Create *.conf files for nginx and supervisor to meet your requirements, including domain name, path, certificates, application path, app name, logs etc.

4. Log into the server. Move conf files into conf.d folder of nginx and supervisor and install backend dependencies.

```bash
echo 'Move nginx conf files'
sudo mv /home/golistenadmin/golisten/golisten.nginx.conf /etc/nginx/conf.d/
sudo systemctl restart nginx

echo 'Edit supervisord.conf'
sudo mv /home/golistenadmin/golisten/golisten.supervisor.conf /etc/supervisor/conf.d/
sudo supervisorctl reload

echo 'Add packages'
sudo pip3 install --upgrade pip
sudo pip3 install tornado pymongo
```

5. Done.

### Example of conf files

Here are some examples of config files for a server. You need to do some modification to meet your requirements.

#### /usr/lib/systemd/system/supervisord.service

The purpose of supervisord.service is to make supervisor running after the a reboot of server. The location of supervisor problem maybe different, so you can use `type supervisord` to check the location and create `.service` file.

```conf
[Unit] 
Description=Supervisor daemon
[Service] 
Type=forking
ExecStart=/usr/local/bin/supervisord
ExecStop=/usr/local/bin/supervisorctl shutdown 
ExecReload=/usr/local/bin/supervisorctl reload 
KillMode=process 
Restart=on-failure 
RestartSec=42s
[Install] 
WantedBy=multi-user.target
```

#### golisten.supervisor.conf
```conf
[program:golisten]
command=sudo python3.8 /home/golistenadmin/golisten/server/server.py
directory=/home/golistenadmin/golisten/server
user=root
autorestart=true
redirect_stderr=true
stdout_logfile=/home/golistenadmin/golisten/golisten.log
loglevel=info
```

#### golisten.nginx.conf
```conf
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

## More about create-react-app project

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

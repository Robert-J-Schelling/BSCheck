# Black Scholes Calculator
## Screenshots

<img src="https://github.com/Robert-J-Schelling/BSCheck/blob/master/Screenshots/BSCalc_sample.gif" width="800" height="400" />

## Tech/Framworks Used

* Node.js
* Flask
* Docker
* React.js
* Nginx
* Gunicorn

## Installation
1. Using Command Prompt, navigate to folder containing docker-compose.yml file.

<img src="https://github.com/Robert-J-Schelling/BSCheck/blob/master/Screenshots/Installation_Step1.gif" width="800" height="400" />

2. Run the command "docker-compose build". (Running it the first time may take a while)

<img src="https://github.com/Robert-J-Schelling/BSCheck/blob/master/Screenshots/Installation_Step2.gif" width="800" height="400" />

3. Once everything finished loading, run the command "docker-compose up".

<img src="https://github.com/Robert-J-Schelling/BSCheck/blob/master/Screenshots/Installation_Step3.gif" width="800" height="400" />

4. If Docker asks for file sharing permission press "Share it".

<img src="https://github.com/Robert-J-Schelling/BSCheck/blob/master/Screenshots/Allow_Sharing.png" width="400" height="200" />

5. Open http://localhost:80 in a browser of your choice.

## In-depth Explanation

### Frontend Container:
#### Nginx:
The most important things to note can be derived from examining the [nginx.conf](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/sample-react/nginx.conf) file.

The first line indicates that our web server (Nginx) is going to listen to port 80 for incoming requests. 
```
  listen 80;
```

Location / indicates the default files that will be opened when a user sends a request to the web server. We chose index.html from the directory /usr/share/nginx/html. More on where this path is derived from later.
```
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
```

location /BSCalcu/impliedVol , location /BSCalcu/premium and location /BSCalcu/graphLines are the endpoints exposed by the backend in the api.py file. 
```
  location /BSCalcu/premium {
    proxy_pass http://backend:5000;
  }

  location /BSCalcu/impliedVol {
    proxy_pass http://backend:5000;
  }

  location /BSCalcu/graphLines {
    proxy_pass http://backend:5000;
  }
```

#### [Dockerfile](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/sample-react/Dockerfile):
The lines … are all the libraries needed for the application. 
```
RUN npm install 
.
.
.
RUN npm i @date-io/date-fns@1.x date-fns
```

RUN npm run build creates all the static files that are being served by the nginx. 
```
RUN npm run build
```

COPY … this command copies the build to /usr/share/nginx/html (this is where the path was derived from in the nginx.conf file)
```
COPY --from=build-stage /app/build/ /usr/share/nginx/html
```

#### [src](https://github.com/Robert-J-Schelling/BSCheck/tree/master/BScalc/sample-react/src) Folder:
The files within this folder are what will be displayed on the screen. All the visuals come from here. The App.js file is the main file of the program and implements the other components such as (Form.js, RiskGraph.js etc.).

#### Folder and File structure:
The basic file and folder structure of the project was created with the npx create-react-app my-app command.

### Backend:
#### Gunicorn:
The WSGI server makes it possible to run Python applications on a web server. For more concrete information [click here](https://www.fullstackpython.com/wsgi-servers.html)
The configuration can be found in [gunicorn-config.py](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/api/gunicorn-config.py)

#### [Dockerfile](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/docker/flask/Dockerfile):
```
RUN pip install -r requirements.txt
```


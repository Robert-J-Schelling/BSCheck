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

This line sets our web server to receive requests from port 80. 
```
  listen 80;
```

Location / is the default URL of the web server. And is the first thing that will be displayed when the user interacts with the server. The code inside the brackets specifies which files will be used for the default URL. The path to the file is /usr/share/nginx/html and the name of the file thatll be used is index.html.
```
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
```

These lines of code connect the frontend to the backend. Each location being a URL that the backend uses to return data.
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
</br>
</br>
</br>
#### [Dockerfile](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/sample-react/Dockerfile):
Every line npm install, installs a library needed for the application. 
```
RUN npm install 
.
.
.
RUN npm i @date-io/date-fns@1.x date-fns
```

This command turn development code in static files. The files created from this command are what will be sent to the user by nginx.
```
RUN npm run build
```

Here we copy the static files to /usr/share/nginx/html (this is where the path was derived from in the nginx.conf file)
```
COPY --from=build-stage /app/build/ /usr/share/nginx/html
```

#### [src](https://github.com/Robert-J-Schelling/BSCheck/tree/master/BScalc/sample-react/src) Folder:
The files within this folder are what will be displayed on the screen. All the visuals come from here. 

##### [App.js](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/sample-react/src/App.js)
App.js is the main file for the frontend. Here we implement all the other components (ex. Form.js, Riskgraph.js etc). 

##### [Form.js](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/sample-react/src/Form.js)
This component is in charge of everything related to the input the user can make. All the inputfields and their values are tracked here. When the user presses submit, the   values are passed to the backend. 

##### [infoDialog.js](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/sample-react/src/InfoDialog.js)]
This component is information box that pops up every time you reload the page. The window contains a brief explanation on how to use the   Black Scholes Calculator.

##### [Riskgraph.js](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/sample-react/src/Riskgraph.js)
Theis component generates the graph that shows you the profit/loss over time of your option.

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
[requirements.txt](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/api/requirements.txt)
[api.py](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/api/api.py)
[get_graphLines.py](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/api/get_graphLines.py)
[get_impliedVol.py](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/api/get_impliedVol.py)
[get_premium.py](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/api/get_premium.py)
[server_responses.py](https://github.com/Robert-J-Schelling/BSCheck/blob/master/BScalc/api/server_responses.py)

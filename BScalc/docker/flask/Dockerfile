FROM python:3

WORKDIR /app

RUN apt-get update 
RUN apt-get install -y python-pip
RUN apt-get install -y python-dev

COPY api/requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY api/* /app/


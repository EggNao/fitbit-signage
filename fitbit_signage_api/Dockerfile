FROM python:3.7
ENV PYTHONUNBUFFERED 1

# パッケージリストを更新し，インストール済みのパッケージを更新（-yはyes or noを聞かれないようにするため）
RUN apt update && apt upgrade -y
# mysqlのクライアントをインストール
RUN apt install -y default-mysql-client

RUN mkdir /src
COPY ./requirements.txt /src
WORKDIR /src

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
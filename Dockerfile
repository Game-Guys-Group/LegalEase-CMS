FROM nikolaik/python-nodejs:python3.12-nodejs22
WORKDIR /app
COPY . /app
RUN /app/dev.sh build_prod
CMD ["/app/dev.sh", "run_prod"]
EXPOSE 8000

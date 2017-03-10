default:

IMAGE_NAME = bertoldia/coop-o-matic:latest
INSTANCE_NAME = coop-o-matic_test

install-deps: package.json
	npm install && npm cache clean

run:
	npm start

build-image:
	docker build -t $(IMAGE_NAME) .

run-image:
	docker run -d --name $(INSTANCE_NAME) -p 8000:8000 $(IMAGE_NAME)

run-image-debug:
	docker run -it -p 8000:8000 $(IMAGE_NAME)

stop-image:
	docker stop $(INSTANCE_NAME) > /dev/null
	docker rm $(INSTANCE_NAME) > /dev/null

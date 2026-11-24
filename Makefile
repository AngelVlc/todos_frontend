build:
	docker build --target base -t todos_base .

lint:
	docker run -it --rm todos_base npm run lint

test:
	docker run -it --rm todos_base npm test

test-ci:
	docker run -it --rm --env CI=true todos_base npm test

build-release:
	docker build --target release -t todos_release \
	--build-arg BACKEND_URL=${BACKEND_URL} \
	--build-arg COMMIT_SHA=${COMMIT_SHA} \
	--build-arg BUILD_DATE=${BUILD_DATE} \
	--build-arg ALGOLIA_APP_ID=${ALGOLIA_APP_ID}
	.

console:
	docker run -it --rm todos_base sh

run-release:
	docker run -it --rm -p 5000:5000 todos_release

console-release:
	docker run -it --rm -p 5000:5000 todos_release sh

audit:
	docker run -it --rm --env CI=true todos_base npm audit --omit=dev

export ROOT_DIR=${PWD}

run:
	docker-compose --file docker-compose-prod.yml up -d logstash
	sleep 40
	docker-compose --file docker-compose-prod.yml up -d analytics-cli

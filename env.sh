#!/bin/sh

elif [ "$1" = "development" ]; then
	env="development"
elif [ "$1" = "production" ]; then
	env="production"
else
	env="development"
fi

echo "ENV:$env"

cp "env/$env.env" ".env.$env"

echo "Finished SetEnv"

#!/bin/sh
if [ "$NODE_ENV" != production ]
then
	echo "Installing bower modules for test suite..."

	echo "... Angular 1.2"
	(cd test/angular-1.2 && bower install)

	echo "... Angular 1.3"
	(cd test/angular-1.3 && bower install)

	echo "... Angular 1.4"
	(cd test/angular-1.4 && bower install)
fi

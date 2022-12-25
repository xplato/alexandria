# Sometimes the types don't like to build for some reason.
# You can run this script to flush everything, which seems to
# work most of the time.

rm -rf node_modules
rm yarn.lock

yarn install

yarn build

echo "Done with root!"

cd demo

rm -rf node_modules
rm yarn.lock

yarn install

echo "Done with demo!"
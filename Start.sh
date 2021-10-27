exec 3>&1 &>/dev/null
# Pull changes to local project from Github
git reset HEAD --hard
git pull

# Install and update npm packages
npm install

# Start the botte
node index.js >&3
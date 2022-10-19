FROM node:12.12.0-alpine

# set working directory
#WORKDIR /

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY . .
RUN npm install 


# add app
COPY . .

# start app
CMD ["npm", "start"]


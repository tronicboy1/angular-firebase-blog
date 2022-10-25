FROM node
WORKDIR /app

RUN apt-get update && apt-get install default-jre -y
RUN npm install -g firebase-tools

COPY .firebaserc firebase.json firestore.* storage.rules /app/
COPY ./dump /app/dump

EXPOSE 9099 8080 5000 4000

CMD [ "firebase", "emulators:start", "--import=./dump" ]

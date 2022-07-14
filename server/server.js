const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const path = require('path');
const mongoose = require('mongoose'); 

const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");

require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');
const { authCheckMiddleware } = require('./helpers/auth');
const cloudinary = require('cloudinary').v2;

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(async(success) => {
    console.log('db Connected');
    const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')));

    const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));

    let apolloServer = null;
    const httpServer = createServer(app);
    const startServer = async() => {
        const schema = makeExecutableSchema({ typeDefs, resolvers });
        //const httpServer = http.createServer(app);
        
        //apolloServer.installSubscriptionHandlers(httpServer);
        const wsServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if your ApolloServer serves at
        // a different path.
        path: '/graphql',
        });

        // Hand in the schema we just created and have the
        // WebSocketServer start listening.
        const serverCleanup = useServer({ schema }, wsServer);
        apolloServer = new ApolloServer({
            schema,
            csrfPrevention: true,
            plugins: [
                // Proper shutdown for the HTTP server.
                ApolloServerPluginDrainHttpServer({ httpServer }),
          
                // Proper shutdown for the WebSocket server.
                {
                  async serverWillStart() {
                    return {
                      async drainServer() {
                        await serverCleanup.dispose();
                      },
                    };
                  },
                },
            ],
            context: ({ req }) => ({ req }),
            formatError(err){
                if(!err.originalError){
                    return err;
                }
                let message = err.message || 'An error occured.';
                const code = err.originalError.code || 500;
                // if(message.includes('key: {') && message.includes('email')) {
                //     message = getSelectLang('server.EmailExisit', errAppLanguage);
                // }
                return { message: message, status: code};
            }
        });
        await apolloServer.start();
        apolloServer.applyMiddleware({ app, cors: true  });        
    }

    await startServer();

    app.use(cors());
    app.use(bodyParser.json({ limit: '5mb' }));    

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    app.post('/uploadImages', authCheckMiddleware, async(req, res) => {
        try {
            const file = req.body.image;
            const uploadResponse = await cloudinary.uploader.upload(
                file,
                {
                    //public_id: `${Date.now()}`,
                    upload_preset: 'lms-app',
                    folder: `graphql-app/images/`,
                    resource_type: 'auto'
                }
            );
            if(uploadResponse) {
                res.send({
                    url: uploadResponse.secure_url,
                    public_id: uploadResponse.public_id,
                })
            } else {
                res.send({
                    message: 'this file size is bigger than 100mb'
                });
            }
        } catch (error) {
            res.send({
                message: error.message
            });
        }
    });

    app.post('/removeImage', authCheckMiddleware, async(req, res) => {        
        try {
            const imageId = req.body.public_id;
            if (!imageId) {
                res.send({
                    success: true,
                });
                return;
            }
            let resourceType = 'video';
            if( imageId.includes('images/') ) {
                resourceType = 'image';
            } else if( imageId.includes('videos/') 
            || imageId.includes('audios/')) {
                resourceType = 'video';
            }
            const uploadResponse = await cloudinary.uploader.destroy(imageId, { 
                invalidate: true, 
                resource_type: resourceType 
            });
            if( uploadResponse ) {
                res.send({
                    success: true,
                })
            } else {
                res.send({
                    success: false,
                    message: 'error'
                })
            } 
        } catch(err) {
            res.send({
                success: false,
                message: err.message
            })
        } 
    });

    httpServer.listen(process.env.PORT, () => {
        console.log(`server is ready at http:/localhost:${process.env.PORT}`);
        
        console.log(`apolloServer is ready at http:/localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
        
        //console.log(`subscriptions is ready at http:/localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`);
    });
}).catch(error => {
    console.log('db error : ', error);
});
import express from 'express';

class Server {
    private app = express();
    private port = 3000;
    
    private middlewares(){
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json());
    }

    private start(){
        const cb = () => console.log(`App running at ${this.port}`);
        this.app.listen(this.port, cb);
    }

    public bootstrap(){
        this.middlewares();
        this.start();
    }
}

const server = new Server();

server.bootstrap();
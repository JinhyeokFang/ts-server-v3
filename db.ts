import mongoose from 'mongoose';

class DB {
    public initialize(name): void {
        mongoose.connect(`mongodb://localhost/${name}`, {
            useNewUrlParser: true
        })
    }
}

export default new DB();
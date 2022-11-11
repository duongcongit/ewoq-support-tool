import mongoose from 'mongoose';

async function connect() {

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connect OK");
    }
    catch(error) {
        console.log("Connect Fail");
    }

}

export default { connect };
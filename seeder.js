import connection from "./db.js"
import bcrypt from "bcrypt";

// import data
import recipes from './data/recipes.js';

// import models
import {UserModel} from './src/models/Users.js';
import {RecipeModel} from './src/models/Recipes.js';

connection();

const importData = async () => {
    try {

        // delete data if already exists
        await UserModel.deleteMany();
        await RecipeModel.deleteMany();

        const email = 'admin@gmail.com';
        const username = 'admin';
        const password = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            userType: 'admin',
            email,
            username,
            password: hashedPassword,
        })        

        const sampleReciepes = recipes.map(recipe => {
            return { ...recipe, userOwner: newUser }
        })
        await RecipeModel.insertMany(sampleReciepes)

        console.log('Data Imported')
        process.exit()
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}




importData()
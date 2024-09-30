import mongoose from "mongoose";
import FlareData from "../../../../models/flareData";
import { connectToDB } from "../../../../utils/database";

export const POST = async (request) => {
    const { userId, name, result, lcData } = await request.json();
    try {
        await connectToDB();
        const flareData = new FlareData({ user: new mongoose.Types.ObjectId("64a3d9b8f42b9b8aab1a4fbc"), name, result, lcData});

        await flareData.save();
        return new Response(JSON.stringify(flareData), { status: 201 })
    } catch (error) {
        console.log(error);
        return new Response("Failed to save flare data", { status: 500 });
    }
}
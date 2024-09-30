import FlareData from "../../../../../models/flareData";
import { connectToDB } from "../../../../../utils/database";

export const GET = async (request, {params}) => {
    try {
        await connectToDB();
        const uploadHistory = await FlareData.find({ user: params.id });

        if (!uploadHistory) {
            return new Response("Upload history not found", { status: 404 });
        }

        return new Response(JSON.stringify(uploadHistory), { status: 200 });
    } catch (error) {
        return new Response("Failed to get files uploaded by user", { status: 500 });
    }
}
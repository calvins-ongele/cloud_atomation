import { DukeController } from "@/engine/modules/duke/duke.controller";

export async function POST(req:Request) {
    return DukeController.initiate(req);
}
import { resolve } from "path";
import {promises as fs} from "fs";
import type { Tasks } from "./types";

export class TaskManager {
  private dataFile = resolve("./data.json");



  async loadTasks(): Promise<Tasks[]> {
    try {
        const data = await fs.readFile(this.dataFile,'utf-8');
        const tasks = JSON.parse(data);
        return tasks.map((task:any)=>({
            ...task,
            createdAt:new Date(task.createdAt),
            updatedAt:new Date(task.updatedAtAt)
        }))
 
    } catch (error) {
     // if the file doesnt exist, return an empty array !!!  (empty json file with no data)
     return [];
    }

  }



}

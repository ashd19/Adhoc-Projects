use std::{error::Error,fs::File, io::Write};
use serde::{Serialize,Deserialize};
use serde_json;

#[derive(Serialize,Deserialize,Debug)]
struct Data{
    name:String,
    version:String,
    description:String,
    author:String,
    license:String,
    id:i32,
    dependencies:Dependencies
}

#[derive(Serialize,Deserialize,Debug)]
struct Dependencies{
    express:String,
    lodash:String
}

#[derive(Serialize,Deserialize,Debug)]
struct WriteData{
    name:String,
    age:i32,
    roll_no:i32,
    skills:Vec<String>,
    goals:Goals
}

#[derive(Serialize,Deserialize,Debug)]
struct Goals{
    freelance:String,
    platforms:Vec<String>
}   


fn read_json_typed(raw_json:&str) -> Result< Data ,serde_json::Error> {
    // parse the json data into a rust value ( struct ) -> Data !
     serde_json::from_str(raw_json)
}

fn read_from_json(path:&str)->Result<(),Box<dyn Error>>{
     
    let read_file = std::fs::read_to_string(path)?;
    let parsed_file = read_json_typed(&read_file)?;
    

    println!("{:#?}",parsed_file);
    Ok(())
} 

fn write_to_json(path:&str,content:WriteData)->Result<(),Box<dyn Error>>{
    // Serialize the typed struct to pretty JSON and write to file
    let json = serde_json::to_string_pretty(&content)?;

    let mut file = File::create(path)?;
    file.write_all(json.as_bytes())?;
    file.flush()?;

    Ok(())
}



fn main(){

    if let Err(e) = read_from_json("./data.json"){
        eprintln!("{}",e);
    }
    // A JSON string we want to write as typed data
    let raw = r#"
    {
        "name":"ashton",
        "age": 20,
        "roll_no":28,
        "skills":[ "solana" , "ethereum", "backend"],
        "goals":{
            "freelance":"message",
            "platforms": ["superteam","bounties","hackathons"]

        } 

    }"#;

    // Parse into the typed struct, then write
    match serde_json::from_str::<WriteData>(raw) {
        Ok(content) => {
            if let Err(e) = write_to_json("./new_data.json", content) {
                eprintln!("failed to write json: {}", e);
            } else {
                println!("Wrote ./new_data.json");
            }
        }
        Err(e) => eprintln!("failed to parse write content: {}", e),
    }
    
}
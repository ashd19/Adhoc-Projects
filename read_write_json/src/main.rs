use std::{error::Error};
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

// fn write_to_json(path:&str,content:&str)->Result<(),Box<dyn Error>>{

                    

//     Ok(())
// }



fn main(){

    if let Err(e) = read_from_json("./data.json"){
        eprintln!("{}",e);
    }
    
}
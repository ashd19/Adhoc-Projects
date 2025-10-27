use std::error::Error;
use serde_json::{Value};

fn read_file_from(path:&str)->Result<(),Box<dyn Error>>{
    // Parse  the string  of data into serde_json::value
    let data: Value= serde_json::from_str(&std::fs::read_to_string(path)?)?;  
    println!("{:#?}",data);
    Ok(())
}
fn main() {
    if let Err(e) = read_file_from("./data.json"){
        eprintln!("{}",e);
    }
}

use std::{error::Error, io::Read};
use serde_json::{Value};
use std::io;

fn read_from_json(path:&str)->Result<(),Box<dyn Error>>{

    let  reader  : Value = serde_json::from_str(&std::fs::read_to_string(path)?)?;
    
    println!("{:#?}",reader);
    Ok(())
} 

fn write_to_json(path:&str,content:&str)->Result<(),Box<dyn Error>>{

                    

    Ok(())
}



fn main(){

    if let Err(e) = read_from_json("./data.json"){
        eprintln!("{}",e);
    }
    
    println!("Write name of the file \n ");
    let mut  file_name =  String::new();
    io::stdin().read_line(&mut file_name).expect("Error from read line");
    println!("Write content\n ");
    let mut  content  =  String::new();
    io::stdin().read_line(&mut content).expect("Error from read line");


    // if let Err(e) = write_to_json(){
    //     eprintln!("{}",e);
    // }
    
}
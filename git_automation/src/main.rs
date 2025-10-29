// use std::process::{Command , exit};
// use std::error::Error;
// use std::io;

// fn get_commit_message() -> Result<String, Box<dyn Error>> {

// //    add_commit_push()?;

//    let mut message = String::new();
//    println!("Enter commit message: ");
//    io::stdin().read_line(&mut message).expect("Failed to read_line for commit message");
//    println!("Commit message: {}", message.trim());
//    Ok(message)
// }

// fn add_commit_push() -> Result<(), Box<dyn Error>>{
//     // Recursively add files  to git repo 
//     let add = Command::new("git")
//     .arg("add")
//     .arg(".")
//     .output()
//     .expect("Failed at add command");
    
//     if add.status.success(){
//         println!("Files added successfully");
//     } else {
//         eprintln!("Failed to add files");
//     }


//     // 2. Commit 
    

//     let commit = Command::new("git")
//     .arg("commit")
//     .arg("-m")
//     .arg("{commit_message}")
//     .output()
//     .expect("Failed at commit command");

//     if commit.status.success(){
//         println!("Files committed successfully");
//     } else {
//         eprintln!("Failed to commit files");
//     }



//     Ok(())
// }

// fn git_automation() -> Result<(), Box<dyn Error>> {
//     get_commit_message();
//     Ok(())
// }

// fn main() {
//    if  let Err(e) =  git_automation(){
//         eprintln!("Application error: {}", e);
//         exit(1);    
//    }
// }

use std::process::{Command, exit};
use std::env;

fn main() {
    // Get commit message from command line argument
    let msg = env::args().nth(1).unwrap_or_else(|| {
        eprintln!("Usage: gitz \"your commit message\"");
        exit(1);
    });

    // 1. git add .
    let status = Command::new("git")
        .arg("add")
        .arg(".")
        .status()
        .expect("Failed to run git add");
    if !status.success() {
        eprintln!("git add failed");
        exit(1);
    }

    // 2. git commit -m "msg"
    let status = Command::new("git")
        .arg("commit")
        .arg("-m")
        .arg(&msg)
        .status()
        .expect("Failed to run git commit");
    if !status.success() {
        eprintln!("git commit failed");
        exit(1);
    }

    // 3. git push
    let status = Command::new("git")
        .arg("push")
        .status()
        .expect("Failed to run git push");
    if !status.success() {
        eprintln!("git push failed");
        exit(1);
    }

    println!("All git operations completed successfully.");
}
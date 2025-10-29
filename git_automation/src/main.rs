
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
        eprintln!("git add failed ");
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
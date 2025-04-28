use crate::parser::parse_script;
use std::fs;

mod parser;
mod disassembler;

fn main() -> anyhow::Result<()> {
    let script = String::from_utf8(fs::read("./assets/input.js").expect("failed to read the file"))?;
    let parsed = parse_script(script.as_str())?;

    let script2 = String::from_utf8(fs::read("./assets/input2.js").expect("failed to read the file"))?;
    let parsed2 = parse_script(script2.as_str())?;
    
    println!("Found {} opcodes", parsed.opcodes_signatures.len());
    println!("Found {} opcodes", parsed2.opcodes_signatures.len());

    for (_, signature) in parsed.opcodes_signatures {
        if !parsed2.opcodes_signatures.values().any(|k| signature.as_str() == k.as_str()) {
            println!("Missing signature {}", signature.as_str());
        }
    }

    Ok(())
}

import figlet from "figlet";

async function Banner() {
  const text = await figlet.text("Welcome user_name!");
  console.log(text);
}

Banner();

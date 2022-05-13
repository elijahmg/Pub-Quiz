import type { NextPage } from 'next'
import QRCode from "react-qr-code";
import { Text } from "@nextui-org/react";

const Home: NextPage = () => {
  const text = "Almost before we knew it, we had left the ground.";


  return (
    <div>
      <Text h1>{text}</Text>
      <QRCode value={text}/>
    </div>
  )
}

export default Home

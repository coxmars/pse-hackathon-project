import Head from 'next/head'
import Link from 'next/link';
import { useState } from 'react';
import { Stack, Text, Title, Grid, Input, Button, Group, Space } from '@mantine/core'
import axios, { AxiosRequestConfig } from 'axios';
import { useAccount } from 'wagmi';
import { notifications } from "@mantine/notifications";
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { executeTransaction } from '@/lib/executeTransaction';

export default function Home() {
  const [input0, setInput0] = useState("");
  const [input1, setInput1] = useState("");
  const { isConnected } = useAccount();
  
  const handleGenerateProofSendTransaction = async (e: any) => {
    e.preventDefault();
    
    // We will send an HTTP request with our inputs to our next.js backend to 
    // request a proof to be generated.
    const data = {
      input0,
      input1,
    }
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      }
    }

    // Send the HTTP request
    try {
      const res = await axios.post("/api/generate_proof", data, config);
      notifications.show({
        message: "Proof generated successfully! Submitting transaction...",
        color: "green",
      });

      // Split out the proof and public signals from the response data
      const { proof, publicSignals } = res.data;

      // Write the transaction
      const txResult = await executeTransaction(proof, publicSignals);
      const txHash = txResult.transactionHash;

      notifications.show({
        message: `Transaction succeeded! Tx Hash: ${txHash}`,
        color: "green",
        autoClose: false,
      });
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMsg = err?.response?.data?.error;
      notifications.show({
        message: `Error ${statusCode}: ${errorMsg}`,
        color: "red",
      });
    }
  }

  // Only allow submit if the user first connects their wallet
  const renderSubmitButton = () => {
    if (!isConnected) {
      return <ConnectWalletButton />
    }
    return (
      <Button type="submit">Generate Proof & Send Transaction</Button>
    )
  }

  return (
    <>
      <Head>
        <title>ZK Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack 
  justify="center" 
  align="center" 
  w="100vw" 
  h="100vh" 
  spacing={0} 
  style={{ backgroundColor: 'white' }}  // Cambia el fondo a blanco
>
<Stack align="center" spacing={0}>
  <Group w="96vw" h="10vh" position="apart" align="center">
    <Title order={3} sx={{ color: 'black' }}>
      ZK Calculator
    </Title>
    <ConnectWalletButton />
  </Group>
  <Grid align="center" justify="center" mih="80vh">
    <Grid.Col sm={8} md={6} lg={4}>
      <Text sx={{ color: 'black' }}>
        {"Enter two distinct numbers between 0 and 5, inclusive. These numbers must be different from each other. A Zero-Knowledge (ZK) proof will be generated locally in your browser, ensuring that only the proof is sent to the blockchain."}
      </Text>
      <Space h={20} />
      <form onSubmit={handleGenerateProofSendTransaction}>
        <Stack spacing="sm">
          <Input.Wrapper label="Input 0" sx={{ color: 'black' }}>
            <Input 
              placeholder="Number between 0 and 5" 
              value={input0} 
              onChange={(e) => setInput0(e.currentTarget.value)}
              sx={{ color: 'black' }}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Input 1" sx={{ color: 'black' }}>
            <Input 
              placeholder="Number between 0 and 5" 
              value={input1} 
              onChange={(e) => setInput1(e.currentTarget.value)}
              sx={{ color: 'black' }}
            />
          </Input.Wrapper>
          <Space h={10} />
          { renderSubmitButton() }
        </Stack>
      </form>
    </Grid.Col>
  </Grid>
</Stack>
</Stack>
    </>
  )
}

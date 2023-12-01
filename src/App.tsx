import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { Layout, Row, Col, Button, Spin, List, Checkbox, Input } from "antd";

import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.DEVNET);
export const moduleAddress = "0x6b275e8c7d4fc98e2c61542e5366b9ee62178d7d7d477a2590b113c987eab1a6";

function App() {
  const { account, connect, signAndSubmitTransaction } = useWallet();
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const handleConnectWallet = () => {
    connect('PetraWallet');
  };

  const handleIncrementCounter = async () => {
    if (!account) {
      // Handle case where user is not connected
      return;
    }

    try {
      setTransactionInProgress(true);
      const payload = {
        type: "entry_function_payload",
        function: `${moduleAddress}::counting::increment_counter`,
        type_arguments: [],
        arguments: [],
      };
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      fetchCounter();
    } catch (error) {
      console.error("Error incrementing counter:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
  
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::counting::increment_counter`,
      type_arguments: [],
      arguments: [],
    };
  
    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      // After successfully incrementing the counter, you can update other state if needed
      setAccountHasList(true);
    } catch (error: any) {
      // Handle errors appropriately
      console.error("Error incrementing counter:", error);
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };
  

  const fetchCounter = async () => {
    if (!account) return;
    try {
      const counterResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::counting::Counter`,
      );
      const counterValue = (counterResource as any).data.count;
      setCounter(counterValue);
    } catch (e: any) {
      console.error("Error fetching counter value:", e);
    }
  };

  useEffect(() => {
    if (account) {
      // Fetch initial
      fetchCounter();

      // Fetch every few secs
      const intervalId = setInterval(fetchCounter, 5000);

      // Cleanup
      return () => clearInterval(intervalId);
    }
  }, [account?.address]);

  return (
    <Layout>
      <Row align="middle">
        <Col span={10} offset={2}>
          <h1>Counter App</h1>
        </Col>
        <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
          <WalletSelector />
        </Col>
      </Row>
      <Spin spinning={transactionInProgress}>
        {!account ? (
          <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
            <Col span={8} offset={8}>
              <Button
                disabled={!account}
                block
                onClick={handleConnectWallet}
                type="primary"
                style={{ height: "40px", backgroundColor: "#3f67ff" }}
              >
                Connect Wallet
              </Button>
            </Col>
          </Row>
        ) : (
          <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
            <Col span={8} offset={8}>
              <Button
                block
                onClick={handleIncrementCounter}
                type="primary"
                style={{ height: "40px", backgroundColor: "#3f67ff" }}
              >
                Increment Counter
              </Button>
            </Col>
          </Row>
        )}
        <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
          <Col span={8} offset={8}>
            <div style={{ fontSize: "24px", textAlign: "center" }}>
              Counter Value: {counter}
            </div>
          </Col>
        </Row>
      </Spin>
    </Layout>
  );
}

export default App;

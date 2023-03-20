import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ethers, Wallet } from "ethers";

import { useState, useCallback, useEffect } from "react"
const ERC20ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

const Home: NextPage = () => {

  const [text, setText] = useState<string>("") 
  const [error, setError] = useState<any>() 
  const [balance, setBalance] = useState<number>(0)
  const [pending, setPending] = useState<boolean>(false)
  const [displayMessage, setDisplayMessage] = useState<boolean>(false)  
 
  const fetchBalance = useCallback(async() => {
    const provider = new ethers.JsonRpcProvider(
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    const signer = new Wallet(
      "95e35e053ae22de4390703d484c5a1a4e23d591b164b40d48bdcf87e4d300444",
      provider as any
    );
    const tokenContract = new ethers.Contract(
      "0x270203070650134837F3C33Fa7D97DC456eF624e",
      ERC20ABI,
      signer
    );
     const balance = await tokenContract?.balanceOf?.(signer.address);
     setBalance(Number(balance) / 10 ** 6)
  }, [])

  useEffect(() => {
    fetchBalance();
    const interval: NodeJS.Timer = setInterval(() => fetchBalance, 10000)
    return () => clearInterval(interval)
  }, [])

  const submit = useCallback(async(event: any) => {
    console.log(text)
    event.preventDefault();
    setDisplayMessage(false)
    setPending(true)
    const provider = new ethers.JsonRpcProvider(
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    const signer = new Wallet(
      "95e35e053ae22de4390703d484c5a1a4e23d591b164b40d48bdcf87e4d300444",
      provider as any
    );
    const tokenContract = new ethers.Contract(
      "0x270203070650134837F3C33Fa7D97DC456eF624e",
      ERC20ABI,
      signer
    );
    try {
        const txData = await tokenContract?.transfer?.(text, "3000000");
        await txData.wait(1);
        fetchBalance()
    } catch(error) {
        setError(error)
    }
    setPending(false);
    setDisplayMessage(true);
    setTimeout(() => {
        setError(false)
        setDisplayMessage(false)
    }, 3500)
  }, [text])

  return (
    <>
      <Head>
        <title>USDT Faucet</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.info}>{`faucet balance: ${balance}`}</div>
        <div className={styles.info}>Get 3 USDT</div>
        <form onSubmit={submit} className={"w-full mt-2"}>
          <label>
            address:
            <input
              type="text"
              value={text}
              placeholder={"enter address"}
              onChange={(e: any) => setText(e.target.value)}
            />
          </label>
          {/* <input type="submit" value="Submit" placeholder="" /> */}
          {pending && <div className={styles.info}>sending...</div>}
          {displayMessage && <div>{error ? error.message : "success"}</div>}
        </form>
        <div className={styles.info}>
          <div>
            USDT token address: 0x270203070650134837F3C33Fa7D97DC456eF624e
          </div>
          <div>
            you can copy this and add to your metamask via import tokens on the
            asssets page
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
